import { collection, addDoc, updateDoc, deleteDoc, getDocs, orderBy, query, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { BlogPost } from '../constants/blogs';

const BLOG_COLLECTION = 'blogs';

export const blogService = {
  async getAllBlogs(): Promise<BlogPost[]> {
    try {
      const q = query(collection(db, BLOG_COLLECTION), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id as any, // Firebase uses string IDs, we'll cast to any to match existing type or update type later
        ...doc.data()
      })) as BlogPost[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, BLOG_COLLECTION);
      return [];
    }
  },

  async getBlogById(id: string): Promise<BlogPost | null> {
    try {
      const docRef = doc(db, BLOG_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id as any, ...docSnap.data() } as BlogPost;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `${BLOG_COLLECTION}/${id}`);
      return null;
    }
  },

  async createBlog(blog: Omit<BlogPost, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, BLOG_COLLECTION), {
        ...blog,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, BLOG_COLLECTION);
    }
  },

  async updateBlog(id: string, blog: Partial<BlogPost>) {
    try {
      const docRef = doc(db, BLOG_COLLECTION, id);
      await updateDoc(docRef, {
        ...blog,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${BLOG_COLLECTION}/${id}`);
    }
  },

  async deleteBlog(id: string) {
    try {
      const docRef = doc(db, BLOG_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${BLOG_COLLECTION}/${id}`);
    }
  }
};
