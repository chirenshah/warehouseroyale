import {
    doc,
    onSnapshot,
    getFirestore,
    collection,
    setDoc,
    updateDoc,
    getDoc,
} from "firebase/firestore";
import app from "./config";

const db = getFirestore(app);
export default function unsub(setcoord) {
    onSnapshot(collection(db, "instance1", "Teams", "Members"), (doc) => {
        var ans = {};
        doc.forEach((doc) => {
            if (doc.id !== window.localStorage.admin) {
                ans[doc.id] = doc.data();
            }
        });
        setcoord(ans);
    });
}

export async function updateCursor(x, y) {
    try {
        await setDoc(
            doc(db, "instance1", "Teams", "Members", window.localStorage.admin),
            {
                Cursor: [x, y],
            }
        );
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export async function writeConfig(roomWithOffer) {
    updateDoc(doc(db, "instance1", "Room 1"), {
        roomWithOffer: roomWithOffer,
    }).catch((error) => {
        console.log(error.code);
    });
}

export async function readConfig() {
    const docRef = doc(db, "instance1", "Room 1");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}
export async function answerlistener(peerConnection) {
    onSnapshot(doc(db, "instance1", "Room 1", ""), async (snapshot) => {
        if (
            snapshot.data()["roomWithOffer"]["answer"] &&
            !peerConnection.currentRemoteDescription
        ) {
            await peerConnection.setRemoteDescription(
                new RTCSessionDescription(
                    snapshot.data()["roomWithOffer"]["answer"]
                )
            );
        }
        if(snapshot.data()["iceCandidates"] && !peerConnection.currentRemoteDescription){
            peerConnection.addIceCandidate(snapshot.data()["iceCandidates"])
        }
    });
}

export async function addIceCandidate(json) {
    await updateDoc(doc(db, "instance1", "Room 1"), {
        iceCandidates:json
    });
}
export async function icelistners(peerConnection) {
    onSnapshot(
        collection(db, "instance1", "Room 1", "iceCandidates"),
        (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    peerConnection.addIceCandidate(candidate);
                }
            });
        }
    );
}
export async function createInstance() {}
