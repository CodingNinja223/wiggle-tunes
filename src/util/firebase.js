import firebase from 'firebase';
import 'firebase/firebase-firestore'
import {getStorage,ref} from 'firebase/firebase-storage';





const firebaseConfig = {
    apiKey: "AIzaSyBjVrL49-4W0pZdTZZajj8wcVB4V0q2vNw",
    authDomain: "notifications-cf5cc.firebaseapp.com",
    projectId: "notifications-cf5cc",
    storageBucket: "notifications-cf5cc.appspot.com",
    messagingSenderId: "91242150845",
    appId: "1:91242150845:web:60e730900d222dc45770d4"
  };



if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}
    

export const db=firebase.firestore();
export const storage=firebase.storage();