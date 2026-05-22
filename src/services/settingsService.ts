import { db } from "../lib/firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

export interface GoogleReviewItem {
  stars: number;
  text: string;
  author: string;
  role: string;
  date: string;
  initials: string;
  bgColor: string;
}

export interface SpecialPopupSettings {
  enabled: boolean;
  image: string;
  link?: string;
  title?: string;
  buttonText?: string;
}

export interface SiteSettings {
  heroImage: string;
  heroTitle?: string;
  heroSubtitle?: string;
  logoImage?: string;
  reviews?: GoogleReviewItem[];
  popup?: SpecialPopupSettings;
}

const SETTINGS_DOC_ID = "global";
const COLLECTION_NAME = "settings";

export const settingsService = {
  getSettings: async (): Promise<SiteSettings | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, SETTINGS_DOC_ID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as SiteSettings;
      }
      return null;
    } catch (error) {
      console.error("Error fetching settings:", error);
      return null;
    }
  },

  subscribeToSettings: (callback: (settings: SiteSettings) => void) => {
    const docRef = doc(db, COLLECTION_NAME, SETTINGS_DOC_ID);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as SiteSettings);
      }
    }, (error) => {
      console.error("Error subscribing to settings:", error);
    });
  },

  updateSettings: async (settings: Partial<SiteSettings>) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, SETTINGS_DOC_ID);
      await setDoc(docRef, settings, { merge: true });
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  }
};
