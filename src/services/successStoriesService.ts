import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";

export interface SuccessStory {
  id: string;
  studentName: string;
  course: string;
  certificateUrl: string;
  achievement?: string;
  date?: string;
  createdAt: any;
}

const COLLECTION_NAME = "success-stories";

export const successStoriesService = {
  getStories: (callback: (stories: SuccessStory[]) => void) => {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const stories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data({ serverTimestamps: 'estimate' })
      })) as SuccessStory[];
      callback(stories);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
    });
  },

  addStory: async (story: Omit<SuccessStory, 'id' | 'createdAt'>) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...story,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, COLLECTION_NAME);
    }
  },

  updateStory: async (id: string, story: Partial<Omit<SuccessStory, 'id' | 'createdAt'>>) => {
    try {
      await updateDoc(doc(db, COLLECTION_NAME, id), story);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
    }
  },

  deleteStory: async (id: string) => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
    }
  }
};
