import { collection, addDoc, serverTimestamp, doc, deleteDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";

export interface MockTestLead {
  name: string;
  email: string;
  phone: string;
  testType: string;
  score?: string;
  status: string;
  createdAt?: any;
}

export const leadService = {
  async saveLead(lead: Omit<MockTestLead, 'createdAt'>) {
    try {
      const docRef = await addDoc(collection(db, "leads"), {
        ...lead,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "leads");
    }
  },

  async deleteLead(id: string) {
    try {
      const docRef = doc(db, "leads", id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `leads/${id}`);
    }
  }
};
