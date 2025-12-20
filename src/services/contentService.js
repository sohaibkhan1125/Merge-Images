import { supabase } from '../supabaseClient';

const TABLE_NAME = 'homepage_text_content';

/**
 * Helper function to specific delay
 * @param {number} ms 
 * @returns {Promise}
 */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Retry an operation with exponential backoff
 * @param {Function} operation - The async operation to retry
 * @param {number} retries - Number of retries (default 3)
 * @param {number} delay - Initial delay in ms (default 1000)
 * @returns {Promise<any>}
 */
const fetchWithRetry = async (operation, retries = 3, delay = 1000) => {
    // Check for offline status first (if running in browser)
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('No internet connection');
    }

    try {
        return await operation();
    } catch (error) {
        if (retries <= 0) throw error;

        console.warn(`Supabase operation failed. Retrying in ${delay}ms...`, error);
        await wait(delay);
        return fetchWithRetry(operation, retries - 1, delay * 2);
    }
};

/**
 * Fetch content from Supabase
 * @returns {Promise<string>} The content HTML string
 */
export const fetchContent = async () => {
    try {
        const result = await fetchWithRetry(async () => {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('content')
                .limit(1)
                .single();

            if (error) throw error;
            return data;
        });

        return result?.content || '';
    } catch (error) {
        console.error('Error fetching content from Supabase:', error);
        // Return empty string on final failure to not break UI
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
        await fetchWithRetry(async () => {
            // First, get the ID of the existing row (should be only one row)
            const { data: existingData, error: fetchError } = await supabase
                .from(TABLE_NAME)
                .select('id')
                .limit(1)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                // PGRST116 means no rows found, which is fine (we'll insert)
                throw fetchError;
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

            if (result.error) throw result.error;
            return result;
        });

        return true;
    } catch (error) {
        console.error('Error saving content to Supabase:', error);
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
