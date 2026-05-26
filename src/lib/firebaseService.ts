import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  getDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Video, UserReview } from '../types';
import { DEFAULT_VIDEOS } from '../data';

const VIDEOS_COL = 'videos';
const REVIEWS_COL = 'reviews';
const USERS_COL = 'users';

/**
 * Helper to recursively remove undefined properties from documents before sending to Firestore,
 * keeping the standard JSON-safe and database-clean data structure.
 */
function sanitize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

/**
 * Fetches the video catalog from Firestore. 
 * If the collection is empty, it merges and seeds with default cinematic titles.
 */
export async function fetchVideosFromFirestore(): Promise<Video[]> {
  try {
    const querySnapshot = await getDocs(collection(db, VIDEOS_COL));
    const list: Video[] = [];
    querySnapshot.forEach((docSnap) => {
      list.push(docSnap.data() as Video);
    });

    if (list.length === 0) {
      console.log("Firestore catalog empty. Seeding with default Spanish & English classics...");
      // Seed DEFAULT_VIDEOS
      for (const video of DEFAULT_VIDEOS) {
        await setDoc(doc(db, VIDEOS_COL, video.id), sanitize(video));
      }
      return DEFAULT_VIDEOS;
    }

    // Sort to keep a predictable order
    return list.sort((a, b) => a.id.localeCompare(b.id));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, VIDEOS_COL);
    return DEFAULT_VIDEOS;
  }
}

/**
 * Saves or updates a video in Firestore (Publishing CMS)
 */
export async function saveVideoToFirestore(video: Video): Promise<void> {
  try {
    await setDoc(doc(db, VIDEOS_COL, video.id), sanitize(video));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${VIDEOS_COL}/${video.id}`);
  }
}

/**
 * Deletes a video from the catalog
 */
export async function deleteVideoFromFirestore(videoId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, VIDEOS_COL, videoId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${VIDEOS_COL}/${videoId}`);
  }
}

/**
 * Fetches all reviews from Firestore.
 */
export async function fetchReviewsFromFirestore(): Promise<UserReview[]> {
  try {
    const list: UserReview[] = [];
    const querySnapshot = await getDocs(collection(db, REVIEWS_COL));
    querySnapshot.forEach((docSnap) => {
      list.push(docSnap.data() as UserReview);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, REVIEWS_COL);
    return [];
  }
}

/**
 * Adds a new review of a classic video to Firestore.
 */
export async function saveReviewToFirestore(review: UserReview): Promise<void> {
  try {
    await setDoc(doc(db, REVIEWS_COL, review.id), sanitize(review));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${REVIEWS_COL}/${review.id}`);
  }
}

/**
 * Deletes a user review
 */
export async function deleteReviewFromFirestore(reviewId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, REVIEWS_COL, reviewId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${REVIEWS_COL}/${reviewId}`);
  }
}

export interface UserProfileData {
  id: string;
  email: string;
  clubPoints?: number;
  triviaSolved?: boolean;
  favorites?: string[];
  totebag?: string;
}

/**
 * Retrieves a user's cloud profile (favorites, rewards count, trivia)
 */
export async function getUserProfile(userId: string): Promise<UserProfileData | null> {
  try {
    const docSnap = await getDoc(doc(db, USERS_COL, userId));
    if (docSnap.exists()) {
      return docSnap.data() as UserProfileData;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${USERS_COL}/${userId}`);
    return null;
  }
}

/**
 * Saves a user's cloud profile
 */
export async function saveUserProfile(userId: string, data: UserProfileData): Promise<void> {
  try {
    await setDoc(doc(db, USERS_COL, userId), sanitize(data), { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${USERS_COL}/${userId}`);
  }
}
