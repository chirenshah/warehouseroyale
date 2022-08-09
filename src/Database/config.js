import { initializeApp } from "@firebase/app";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDXxbm6RXwQ1PqwdrIJbz6UG5SsHpFCLFc",
    authDomain: "warehouseville.firebaseapp.com",
    projectId: "warehouseville",
    storageBucket: "warehouseville.appspot.com",
    messagingSenderId: "962904736071",
    appId: "1:962904736071:web:b718b9a859129e994b8c62",
    measurementId: "G-4E7NGW69SK",
};

const app = initializeApp(firebaseConfig);
export default app;
