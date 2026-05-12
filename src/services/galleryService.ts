import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  createdAt: any;
}

export const galleryService = {
  getGallery: (callback: (items: GalleryItem[]) => void) => {
    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryItem[];
      callback(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "gallery");
    });
  },

  addItem: async (item: Omit<GalleryItem, 'id' | 'createdAt'>) => {
    try {
      const docRef = await addDoc(collection(db, "gallery"), {
        ...item,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "gallery");
    }
  },

  deleteItem: async (id: string) => {
    try {
      await deleteDoc(doc(db, "gallery", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `gallery/${id}`);
    }
  }
};
