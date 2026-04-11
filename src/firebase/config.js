import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCziWQtWkjRcJJvi10AWh_CJrGt24o53dk',
  authDomain: 'campussync-c3d3c.firebaseapp.com',
  projectId: 'campussync-c3d3c',
  storageBucket: 'campussync-c3d3c.firebasestorage.app',
  messagingSenderId: '638669051572',
  appId: '1:638669051572:web:49f6cf7f24819ea8b7e9e1',
};

const firebaseApp = initializeApp(firebaseConfig);

export const app = firebaseApp;
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export default firebaseApp;
