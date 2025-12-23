import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { db, storage } from '../firebase';

class BlogService {
  constructor() {
    this.collectionName = 'blogs';
  }

  // Generate slug from title
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  // Compress image to reduce file size
  async compressImage(file, maxSizeMB = 4.5) {
    try {
      const options = {
        maxSizeMB: maxSizeMB,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/jpeg',
        initialQuality: 0.8,
        alwaysKeepResolution: false
      };

      const compressedFile = await imageCompression(file, options);

      return compressedFile;
    } catch (error) {
      console.error('Error compressing image:', error);
      throw new Error('Failed to compress image. Please try a different image.');
    }
  }

  // Convert image to base64 for fallback storage
  async convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Upload thumbnail image to Firebase Storage with fallback
  async uploadThumbnail(file, blogId) {
    try {
      // Validate file
      if (!file || !(file instanceof File)) {
        throw new Error('Invalid file provided');
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
      }

      let fileToUpload = file;
      const maxSize = 5 * 1024 * 1024; // 5MB

      // Compress image if it's too large
      if (file.size > maxSize) {
        try {
          fileToUpload = await this.compressImage(file, 4.5); // Compress to 4.5MB to be safe

          // If still too large after compression, try more aggressive compression
          if (fileToUpload.size > maxSize) {
            fileToUpload = await this.compressImage(file, 3.0); // Try 3MB
          }

          // Final check - if still too large, throw user-friendly error
          if (fileToUpload.size > maxSize) {
            throw new Error('Thumbnail too large. Please upload an image under 5MB or try a different image.');
          }
        } catch (compressionError) {
          throw new Error('Thumbnail too large. Please upload an image under 5MB or try a different image.');
        }
      }

      // Try Firebase Storage first
      try {
        const timestamp = Date.now();
        const fileName = `blog-thumbnails/${blogId}/${timestamp}-${fileToUpload.name}`;
        const storageRef = ref(storage, fileName);

        const snapshot = await uploadBytes(storageRef, fileToUpload);
        const downloadURL = await getDownloadURL(snapshot.ref);

        return { type: 'firebase', url: downloadURL };
      } catch (storageError) {
        // Fallback to base64 storage
        try {
          const base64Data = await this.convertImageToBase64(fileToUpload);
          return { type: 'base64', url: base64Data };
        } catch (base64Error) {
          throw new Error('Failed to process image. Please try a different image.');
        }
      }
    } catch (error) {
      console.error('Error uploading thumbnail:', error);

      // Handle specific CORS errors
      if (error.message.includes('CORS') || error.message.includes('cors')) {
        console.warn('CORS error detected, attempting fallback to base64 storage');
        try {
          const base64Data = await this.convertImageToBase64(file);
          return { type: 'base64', url: base64Data };
        } catch (fallbackError) {
          throw new Error('CORS Error: Unable to upload image. Please try again or contact support.');
        }
      }

      // Handle network errors
      if (error.code === 'storage/network-request-failed') {
        console.warn('Network error detected, attempting fallback to base64 storage');
        try {
          const base64Data = await this.convertImageToBase64(file);
          return { type: 'base64', url: base64Data };
        } catch (fallbackError) {
          throw new Error('Network error: Unable to upload image. Please check your connection and try again.');
        }
      }

      // Handle quota exceeded
      if (error.code === 'storage/quota-exceeded') {
        throw new Error('Storage quota exceeded: Please contact administrator.');
      }

      // Generic error
      throw new Error(error.message || 'Failed to upload thumbnail image');
    }
  }

  // Delete thumbnail from Firebase Storage
  async deleteThumbnail(thumbnailURL) {
    try {
      if (!thumbnailURL) return;

      // Extract the file path from the URL
      const url = new URL(thumbnailURL);
      const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
      if (pathMatch) {
        const filePath = decodeURIComponent(pathMatch[1]);
        const storageRef = ref(storage, filePath);
        await deleteObject(storageRef);
      }
    } catch (error) {
      console.error('Error deleting thumbnail:', error);
      // Don't throw error as the blog might still be deleted successfully
    }
  }

  // Fallback to localStorage if Firestore fails
  async createBlogFallback(blogData) {
    try {
      const { title, description, content, thumbnailFile } = blogData;

      // Generate slug
      const slug = this.generateSlug(title);

      // Handle thumbnail for fallback
      let thumbnailData = null;
      if (thumbnailFile) {
        try {
          thumbnailData = await this.uploadThumbnail(thumbnailFile, `fallback-${Date.now()}`);
        } catch (error) {
          console.warn('Thumbnail upload failed in fallback, using base64:', error);
          thumbnailData = await this.convertImageToBase64(thumbnailFile);
          thumbnailData = { type: 'base64', url: thumbnailData };
        }
      }

      // Create blog document for localStorage
      const blogDoc = {
        id: `fallback-${Date.now()}`,
        title: title.trim(),
        description: description?.trim() || '',
        content,
        thumbnailURL: thumbnailData?.url || '',
        thumbnailType: thumbnailData?.type || 'none',
        slug,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        published: true,
        isFallback: true
      };

      // Store in localStorage
      const existingBlogs = JSON.parse(localStorage.getItem('fallback-blogs') || '[]');
      existingBlogs.unshift(blogDoc);
      localStorage.setItem('fallback-blogs', JSON.stringify(existingBlogs));

      return blogDoc;
    } catch (error) {
      console.error('Error in fallback storage:', error);
      throw new Error('Failed to save blog. Please try again.');
    }
  }

  // Create a new blog post
  async createBlog(blogData) {
    try {
      const { title, description, content, thumbnailFile } = blogData;

      if (!title || !content) {
        throw new Error('Title and content are required');
      }

      // Generate slug
      const slug = this.generateSlug(title);

      // Check if slug already exists
      const existingBlog = await this.getBlogBySlug(slug);
      if (existingBlog) {
        throw new Error('A blog post with this title already exists');
      }

      // Upload thumbnail if provided
      let thumbnailData = null;
      if (thumbnailFile) {
        const tempId = `temp-${Date.now()}`;
        thumbnailData = await this.uploadThumbnail(thumbnailFile, tempId);
      }

      // Create blog document
      const blogDoc = {
        title: title.trim(),
        description: description?.trim() || '',
        content,
        thumbnailURL: thumbnailData?.url || '',
        thumbnailType: thumbnailData?.type || 'none',
        slug,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        published: true
      };

      const docRef = await addDoc(collection(db, this.collectionName), blogDoc);

      // Update the thumbnail path with the actual document ID if using Firebase Storage
      if (thumbnailFile && thumbnailData?.type === 'firebase') {
        const newThumbnailData = await this.uploadThumbnail(thumbnailFile, docRef.id);
        await updateDoc(docRef, {
          thumbnailURL: newThumbnailData.url,
          thumbnailType: newThumbnailData.type
        });

        // Delete the temporary thumbnail
        await this.deleteThumbnail(thumbnailData.url);
      }

      return { id: docRef.id, ...blogDoc };
    } catch (error) {
      console.error('Error creating blog in Firestore, attempting fallback:', error);

      // Try fallback storage
      try {
        return await this.createBlogFallback(blogData);
      } catch (fallbackError) {
        console.error('Fallback storage also failed:', fallbackError);
        throw new Error('Unable to save blog. Please check your connection and try again.');
      }
    }
  }

  // Update an existing blog post
  async updateBlog(blogId, blogData) {
    try {
      const { title, description, content, thumbnailFile, thumbnailURL } = blogData;

      if (!title || !content) {
        throw new Error('Title and content are required');
      }

      const blogRef = doc(db, this.collectionName, blogId);
      const blogDoc = await getDoc(blogRef);

      if (!blogDoc.exists()) {
        throw new Error('Blog post not found');
      }

      const currentData = blogDoc.data();
      let finalThumbnailURL = thumbnailURL;

      // Handle thumbnail upload if new file is provided
      let thumbnailData = null;
      if (thumbnailFile) {
        // Delete old thumbnail if it exists and is from Firebase Storage
        if (currentData.thumbnailURL && currentData.thumbnailType === 'firebase') {
          await this.deleteThumbnail(currentData.thumbnailURL);
        }

        // Upload new thumbnail
        thumbnailData = await this.uploadThumbnail(thumbnailFile, blogId);
      }

      // Generate new slug if title changed
      let slug = currentData.slug;
      if (title !== currentData.title) {
        slug = this.generateSlug(title);

        // Check if new slug already exists
        const existingBlog = await this.getBlogBySlug(slug);
        if (existingBlog && existingBlog.id !== blogId) {
          throw new Error('A blog post with this title already exists');
        }
      }

      // Update blog document
      const updateData = {
        title: title.trim(),
        description: description?.trim() || '',
        content,
        thumbnailURL: thumbnailData?.url || finalThumbnailURL,
        thumbnailType: thumbnailData?.type || currentData.thumbnailType || 'none',
        slug,
        updatedAt: serverTimestamp()
      };

      await updateDoc(blogRef, updateData);

      return { id: blogId, ...updateData };
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  }

  // Delete a blog post
  async deleteBlog(blogId) {
    try {
      const blogRef = doc(db, this.collectionName, blogId);
      const blogDoc = await getDoc(blogRef);

      if (!blogDoc.exists()) {
        throw new Error('Blog post not found');
      }

      const blogData = blogDoc.data();

      // Delete thumbnail from storage
      if (blogData.thumbnailURL) {
        await this.deleteThumbnail(blogData.thumbnailURL);
      }

      // Delete document from Firestore
      await deleteDoc(blogRef);

      return true;
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  }

  // Get all blog posts
  async getAllBlogs() {
    try {
      const blogsRef = collection(db, this.collectionName);
      const q = query(blogsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const blogs = [];
      querySnapshot.forEach((doc) => {
        blogs.push({ id: doc.id, ...doc.data() });
      });

      // Add fallback blogs from localStorage
      try {
        const fallbackBlogs = JSON.parse(localStorage.getItem('fallback-blogs') || '[]');
        blogs.push(...fallbackBlogs);
      } catch (error) {
        console.warn('Error loading fallback blogs:', error);
      }

      // Sort by creation date
      blogs.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return dateB - dateA;
      });

      return blogs;
    } catch (error) {
      console.error('Error getting blogs from Firestore, trying fallback:', error);

      // Fallback to localStorage only
      try {
        const fallbackBlogs = JSON.parse(localStorage.getItem('fallback-blogs') || '[]');
        return fallbackBlogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } catch (fallbackError) {
        console.error('Fallback blog loading also failed:', fallbackError);
        return [];
      }
    }
  }

  // Get blog by ID
  async getBlogById(blogId) {
    try {
      const blogRef = doc(db, this.collectionName, blogId);
      const blogDoc = await getDoc(blogRef);

      if (!blogDoc.exists()) {
        return null;
      }

      return { id: blogDoc.id, ...blogDoc.data() };
    } catch (error) {
      console.error('Error getting blog by ID:', error);
      throw error;
    }
  }

  // Get blog by slug
  async getBlogBySlug(slug) {
    try {
      const blogs = await this.getAllBlogs();
      return blogs.find(blog => blog.slug === slug);
    } catch (error) {
      console.error('Error getting blog by slug:', error);
      throw error;
    }
  }

  // Subscribe to real-time updates
  subscribeToBlogs(callback) {
    try {
      const blogsRef = collection(db, this.collectionName);
      const q = query(blogsRef, orderBy('createdAt', 'desc'));

      return onSnapshot(q, (querySnapshot) => {
        const blogs = [];
        querySnapshot.forEach((doc) => {
          blogs.push({ id: doc.id, ...doc.data() });
        });

        // Add fallback blogs from localStorage
        try {
          const fallbackBlogs = JSON.parse(localStorage.getItem('fallback-blogs') || '[]');
          blogs.push(...fallbackBlogs);
        } catch (error) {
          console.warn('Error loading fallback blogs:', error);
        }

        // Sort by creation date
        blogs.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
          const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
          return dateB - dateA;
        });

        callback(blogs);
      });
    } catch (error) {
      console.error('Error subscribing to blogs, using fallback:', error);

      // Fallback to localStorage only
      try {
        const fallbackBlogs = JSON.parse(localStorage.getItem('fallback-blogs') || '[]');
        const sortedBlogs = fallbackBlogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        callback(sortedBlogs);
      } catch (fallbackError) {
        console.error('Fallback blog loading also failed:', fallbackError);
        callback([]);
      }
    }
  }

  // Subscribe to a single blog
  subscribeToBlog(blogId, callback) {
    try {
      const blogRef = doc(db, this.collectionName, blogId);

      return onSnapshot(blogRef, (doc) => {
        if (doc.exists()) {
          callback({ id: doc.id, ...doc.data() });
        } else {
          callback(null);
        }
      });
    } catch (error) {
      console.error('Error subscribing to blog:', error);
      throw error;
    }
  }
}

// Create singleton instance
const blogService = new BlogService();

export default blogService;
