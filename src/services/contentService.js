import { supabase } from '../supabaseClient';

const TABLE_NAME = 'homepage_text_content';

/**
 * Fetch content from Supabase
 * @returns {Promise<string>} The content HTML string
 */
export const fetchContent = async () => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('content')
            .limit(1)
            .single();

        if (error) {
            console.error('Error fetching content from Supabase:', error);
            return '';
        }

        return data?.content || '';
    } catch (error) {
        console.error('Error in fetchContent:', error);
        return '';
    }
};

/**
 * Save content to Supabase
 * @param {string} content - The content HTML string to save
 * @returns {Promise<boolean>} Success status
 */
export const saveContent = async (content) => {
    try {
        // First, get the ID of the existing row (should be only one row)
        const { data: existingData, error: fetchError } = await supabase
            .from(TABLE_NAME)
            .select('id')
            .limit(1)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            // PGRST116 means no rows found
            console.error('Error fetching existing content:', fetchError);
            return false;
        }

        let result;
        if (existingData) {
            // Update existing row
            result = await supabase
                .from(TABLE_NAME)
                .update({
                    content,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existingData.id);
        } else {
            // Insert new row if none exists
            result = await supabase
                .from(TABLE_NAME)
                .insert({ content });
        }

        if (result.error) {
            console.error('Error saving content to Supabase:', result.error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in saveContent:', error);
        return false;
    }
};

/**
 * Subscribe to real-time content changes
 * @param {Function} callback - Function to call when content changes
 * @returns {Object} Subscription object with unsubscribe method
 */
export const subscribeToContentChanges = (callback) => {
    const subscription = supabase
        .channel('homepage_content_changes')
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: TABLE_NAME,
            },
            (payload) => {
                if (payload.new?.content !== undefined) {
                    callback(payload.new.content);
                }
            }
        )
        .subscribe();

    return {
        unsubscribe: () => {
            subscription.unsubscribe();
        },
    };
};
