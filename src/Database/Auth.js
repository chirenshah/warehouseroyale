import {
    getAuth,
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import app from "./config";

const auth = getAuth(app);
export function emailAuth({ email }) {
    const actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be in the authorized domains list in the Firebase Console.
        url: "https://warehouseville.web.app/",
        handleCodeInApp: true,
    };
    sendSignInLinkToEmail(auth, email, actionCodeSettings)
        .then(() => {
            console.log("Success");
            window.localStorage.setItem("emailForSignIn", email);
        })
        .catch((error) => {
            console.log(error.code);
        });
}

export function emailPasswordAuth(email, password, setUser, setError) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            window.localStorage.setItem("admin", email);
            setUser(userCredential.user);
        })
        .catch((error) => {
            setError(error.message);
        });
}

export function isLogged() {
    isSignInWithEmailLink(auth, window.location.href);
}

export function signout() {
    signOut(auth)
        .then(() => {
            // Sign-out successful.
        })
        .catch((error) => {
            // An error happened.
        });
}
