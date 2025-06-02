import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, doc, deleteDoc, setDoc, addDoc, getDocs, query, 
  collection, updateDoc, where, increment, FieldValue } from 'firebase/firestore'; 

import {
  getAuth,
  GoogleAuthProvider,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:  import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const Firebase = initializeApp(firebaseConfig);
export const analytics = getAnalytics(Firebase);

export const auth = getAuth();

export const Providers = { google: new GoogleAuthProvider() };
export const db = getFirestore(Firebase);

export const addField = async () => {
  await setDoc(doc(db, 'cities'), {
    name: 'Los Angeles',
    state: 'CA',
    country: 'USA'
  });
}

export type User = {
  id: number;
  name: string;
  success: number;
  common: number;
  userId: number;
  companies?: Company[];
};

export const addUser = async (user: Pick<User, 'id' | 'name'>) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('userId', '==', user.id));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return;
  }

  await setDoc(
    doc(db, 'users', user.id.toString()),
    {
      name: user.name,
      success: 0,
      common: 0,
      userId: user.id
    }
  );
};

export const getUsers = async () => {
  const q = query(collection(db, 'users'));
  const querySnapshot = await getDocs(q);
  const users = querySnapshot.docs
    .map((d) => {
      const obj = d.data();
      return ({ id: d.id, ...obj }) as unknown as User
    });
  return users;
};


export type Company = {
  id: string;
  name: string;
  success: boolean;
  userId: number;
}

export const addCompany = async (company: Omit<Company, 'id'>) => {
  const docRef = await addDoc(collection(db, 'companies'), company);

  const userRef = doc(db, 'users', company.userId.toString());

  const updated: { common: FieldValue, success?: FieldValue } = { common: increment(1) };
  if (company.success) {
    updated.success = increment(1);
  }
  await updateDoc(userRef, updated);

  return docRef.id;
};

export const deleteCompany = async (company: Company) => {
  await deleteDoc(doc(db, 'companies', company.id));
  
  const userRef = doc(db, 'users', company.userId.toString());
  const updated: { common: FieldValue, success?: FieldValue } = { common: increment(-1) };
  if (company.success) {
    updated.success = increment(-1);
  }
  await updateDoc(userRef, updated);
};

export const getCompaniesByUserId = async (userId: number) => {
  const companiesRef = collection(db, 'companies');

  const q = query(companiesRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as  unknown as Company[];
};

export const getCompanies = async () => {
  const companiesRef = collection(db, 'companies');

  const q = query(companiesRef);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as  unknown as Company[];
};
