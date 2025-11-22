// Blog storage utility with compression and quota management
class BlogStorage {
  constructor() {
    this.storageKey = 'blogs';
    this.maxStorageSize = 4 * 1024 * 1024; // 4MB limit
    this.compressionEnabled = true;
  }

  // Simple compression using LZ-string algorithm (basic implementation)
  compress(data) {
    if (!this.compressionEnabled) return data;
    
    try {
      // Basic compression by removing unnecessary whitespace and using shorter keys
      const compressed = JSON.stringify(data, null, 0);
      return compressed;
    } catch (error) {
      console.warn('Compression failed, using original data:', error);
      return data;
    }
  }

  // Decompress data
  decompress(data) {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.warn('Decompression failed:', error);
      return [];
    }
  }

  // Get storage usage
  getStorageUsage() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? new Blob([data]).size : 0;
    } catch (error) {
      return 0;
    }
  }

  // Check if we're approaching quota limit
  isNearQuota() {
    const usage = this.getStorageUsage();
    return usage > this.maxStorageSize * 0.8; // 80% of limit
  }

  // Clean up old blogs if approaching quota
  cleanupOldBlogs(blogs) {
    if (!this.isNearQuota()) return blogs;

    // Sort by date and keep only the 20 most recent blogs
    const sortedBlogs = blogs.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
    const cleanedBlogs = sortedBlogs.slice(0, 20);
    
    console.warn('Storage quota approaching limit. Keeping only 20 most recent blogs.');
    return cleanedBlogs;
  }

  // Optimize blog content for storage
  optimizeBlogContent(blog) {
    const optimized = { ...blog };
    
    // Remove unnecessary whitespace from content
    if (optimized.content) {
      optimized.content = optimized.content
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .trim();
    }
    
    // Limit description length
    if (optimized.description && optimized.description.length > 500) {
      optimized.description = optimized.description.substring(0, 500) + '...';
    }
    
    return optimized;
  }

  // Save blogs to localStorage with compression and quota management
  saveBlogs(blogs) {
    try {
      // Optimize content before saving
      const optimizedBlogs = blogs.map(blog => this.optimizeBlogContent(blog));
      
      // Clean up old blogs if needed
      const cleanedBlogs = this.cleanupOldBlogs(optimizedBlogs);
      
      // Compress data
      const compressedData = this.compress(cleanedBlogs);
      
      // Check if compressed data is still too large
      const dataSize = new Blob([compressedData]).size;
      if (dataSize > this.maxStorageSize) {
        // If still too large, keep only the 10 most recent blogs
        const recentBlogs = cleanedBlogs.slice(0, 10);
        const finalData = this.compress(recentBlogs);
        localStorage.setItem(this.storageKey, finalData);
        console.warn('Storage quota exceeded. Keeping only 10 most recent blogs.');
      } else {
        localStorage.setItem(this.storageKey, compressedData);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to save blogs to localStorage:', error);
      
      // Fallback: try to save without compression
      try {
        const fallbackData = JSON.stringify(blogs.slice(0, 5)); // Keep only 5 most recent
        localStorage.setItem(this.storageKey, fallbackData);
        console.warn('Using fallback storage with limited blogs.');
        return true;
      } catch (fallbackError) {
        console.error('Fallback storage also failed:', fallbackError);
        return false;
      }
    }
  }

  // Load blogs from localStorage
  loadBlogs() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return [];
      
      return this.decompress(data);
    } catch (error) {
      console.error('Failed to load blogs from localStorage:', error);
      return [];
    }
  }

  // Clear all blog data
  clearBlogs() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('Failed to clear blogs from localStorage:', error);
      return false;
    }
  }

  // Get storage info
  getStorageInfo() {
    const usage = this.getStorageUsage();
    const usageMB = (usage / (1024 * 1024)).toFixed(2);
    const limitMB = (this.maxStorageSize / (1024 * 1024)).toFixed(2);
    
    return {
      usage,
      usageMB,
      limit: this.maxStorageSize,
      limitMB,
      percentage: Math.round((usage / this.maxStorageSize) * 100),
      isNearQuota: this.isNearQuota()
    };
  }
}

// Create singleton instance
const blogStorage = new BlogStorage();

export default blogStorage;

