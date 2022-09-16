import {
    doc,
    onSnapshot,
    getFirestore,
    collection,
    setDoc,
    updateDoc,
    getDoc,
    getDocs,
    deleteDoc,
    writeBatch,
    runTransaction,
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

export async function writeConfig(roomWithOffer,connection) {
    let something = {
    }
    something[connection] = roomWithOffer
    updateDoc(doc(db, "instance1", "Room 1"), something).catch((error) => {
        console.log(error.code);
    });
}

export async function makeOffer(offer) {
    console.log(offer);
    setDoc(
        doc(db, "instance1", "Offers", window.localStorage.admin, offer.emp_id),
        {
            Percentage: offer.share,
        }
    ).catch((error) => {
        console.log(error.message);
    });
}

export async function readOffer() {
    const colRef = collection(
        db,
        "instance1",
        "Offers",
        window.localStorage.admin
    );
    const querySnapshot = await getDocs(colRef);
    let arr = {};
    querySnapshot.forEach((doc) => {
        arr[doc.id] = doc.data();
        // doc.data() is never undefined for query doc snapshots
    });
    return arr;
}

export async function deleteOffer(item) {
    await deleteDoc(
        doc(db, "instance1", "Offers", window.localStorage.admin, item)
    )
        .then((val) => {
            return true;
        })
        .catch((error) => {
            return false;
        });
}

export async function flushbins(tmp){
    const sfDocRef = doc(db, "instance1", "Room 1")
    updateDoc(sfDocRef,{"Bins":tmp})
}

export async function binUpdate(from,to,id,new_test){
    const sfDocRef = doc(db, "instance1", "Room 1")
    try {
        await runTransaction(db, async (transaction) => {
          const sfDoc = await transaction.get(sfDocRef);
          if (!sfDoc.exists()) {
            throw "Document does not exist!";
          }
          const data = sfDoc.data()['Bins']
          if(from != ''){
            data[from] = data[from].filter((ele)=> ele != id);
            console.log(data[from]);
          }
          if(to in data){
            data[to].push(id)
          }
          else{
            data[to] = [id]
          }
          transaction.update(sfDocRef, {"Bins":data});
          new_test(data);
        });
        console.log("Transaction successfully committed!");
      } catch (e) {
        console.log("Transaction failed: ", e);
      }
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
export async function answerlistener(peerConnection,connection) {
    onSnapshot(doc(db, "instance1", "Room 1"), async (snapshot) => {
        if (
            snapshot.data()[connection]["answer"] &&
            !peerConnection.currentRemoteDescription
        ) {
            await peerConnection.setRemoteDescription(
                new RTCSessionDescription(
                    snapshot.data()[connection]["answer"]
                )
            );
        }
        if (
            snapshot.data()["iceCandidates"] &&
            !!peerConnection.currentRemoteDescription
        ) {
            peerConnection.addIceCandidate(snapshot.data()["iceCandidates"]);
        }
    });
}

export async function addIceCandidate(json) {
    await updateDoc(doc(db, "instance1", "Room 1"), {
        iceCandidates: json,
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
