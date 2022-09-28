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
import { ordersGrid } from "../components/views/Manager/dashboard/data/dummy";
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

export async function writeConfig(roomWithOffer, connection) {
    let something = {};
    something[connection] = roomWithOffer;
    updateDoc(doc(db, "instance1", "Room 1"), something).catch((error) => {
        console.log(error.code);
    });
}

export async function makeOffer(offer) {
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

export async function updateLogs(from, to, id) {
    let sfDocRef = doc(db, "instance1", "Logs");
    try {
        await runTransaction(db, async (transaction) => {
            const sfDoc = await transaction.get(sfDocRef);
            if (!sfDoc.exists()) {
                throw "Document does not exist!";
            }
            let data = sfDoc.data();
            let email = window.localStorage.admin.replace(".", ",");
            if (!(email in data)) {
                data[email] = [];
            }
            data = data[email];
            data.push(id + ":" + from + ":" + to);
            let file = {};
            file[email] = data;
            console.log(file);
            transaction.update(sfDocRef, file);
        });
        console.log("Transaction successfully committed!");
    } catch (e) {
        console.log("Transaction failed: ", e);
    }
}

export async function flushbins(tmp) {
    const sfDocRef = doc(db, "instance1", "Room 1");
    updateDoc(sfDocRef, { Bins: tmp });
}

export async function writeInventory() {
    const data = Array.from(
        { length: 20 },
        () =>
            String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
            "123" +
            Math.floor(Math.random() * 100000).toString()
    );
    let Inventory = {};
    let inventorysize = 20;
    for (let j = 0; j < inventorysize; j++) {
        Inventory[data[j]] = "10:00";
    }
    console.log(Object.keys(Inventory).length);
    updateDoc(doc(db, "instance1", "Room 1"), {
        Bins: { Inventory },
    }).catch((err) => console.log(err));
}

export async function calculateLogs() {
    let physicalLogs = await getDoc(doc(db, "instance1", "Logs"));
    physicalLogs =
        physicalLogs.data()[window.localStorage.admin.replace(".", ",")];
    let actualLogs = await getDoc(doc(db, "instance1", "Room 1"));
    let actualLogsMap = {};
    actualLogs = actualLogs.data()["Logs"];
    actualLogs.forEach((val) => {
        val = val.split(":");
        if (val[0] in actualLogsMap) {
            actualLogsMap[val[0]].push([val[1], val[2]]);
        } else {
            actualLogsMap[val[0]] = [[val[1], val[2]]];
        }
    });
    let right = 0;
    let wrong = 0;
    physicalLogs.forEach((val) => {
        val = val.split(":");
        let flag = false;
        if (val[0] in actualLogsMap) {
            try {
                actualLogsMap[val[0]].forEach((Logs) => {
                    console.log(val[1], Logs[0]);
                    if ((Logs[0] == val[1]) & (Logs[1] == val[2])) {
                        flag = true;
                        throw "Exception";
                    }
                });
            } catch (e) {
                console.log(e);
            }
            if (flag) {
                right += 1;
            } else {
                wrong += 1;
            }
        } else {
            wrong += 1;
        }
    });
    console.log(right, wrong);
}

export async function createOrders() {
    getDoc(doc(db, "instance1", "Room 1")).then((val) => {
        const counts = {};
        let data = val.data()["Bins"]["Inventory"];
        for (const num of Object.keys(data)) {
            counts[num] = counts[num] ? counts[num] + 1 : 1;
        }
        let orders1 = {};
        let orders2 = {};
        Object.keys(counts).forEach((value, index) => {
            if (index < 5) {
                orders1[value] = Math.ceil(counts[value] * Math.random() * 5);
            } else if ((index < 10) & (index >= 5)) {
                orders2[value] = Math.ceil(counts[value] * Math.random() * 5);
            }
        });
        updateDoc(doc(db, "instance1", "Room 1"), {
            Order1: orders1,
            Order2: orders2,
        });
    });
}
export async function binUpdate(from, to, id, set_data, timer) {
    const sfDocRef = doc(db, "instance1", "Room 1");
    try {
        await runTransaction(db, async (transaction) => {
            const sfDoc = await transaction.get(sfDocRef);
            if (!sfDoc.exists()) {
                throw "Document does not exist!";
            }
            const data = sfDoc.data()["Bins"];
            const logs = sfDoc.data()["Logs"];
            logs.push(id + ":" + from + ":" + to);
            delete data[from][id];
            if (to !== "delete") {
                if (to in data) {
                    data[to][id] = timer;
                } else {
                    data[to] = {};
                    data[to][id] = timer;
                }
            }
            transaction.update(sfDocRef, { Bins: data, Logs: logs });
            set_data(data);
        });
        console.log("Transaction successfully committed!");
    } catch (e) {
        console.log("Transaction failed: ", e);
    }
}

export async function binListener(set_data, setSkuList) {
    onSnapshot(doc(db, "instance1", "Room 1"), async (snapshot) => {
        set_data(snapshot.data()["Bins"]);
        setSkuList(snapshot.data()["Bins"]["Inventory"]);
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
export async function answerlistener(peerConnection, connection) {
    onSnapshot(doc(db, "instance1", "Room 1"), async (snapshot) => {
        if (
            snapshot.data()[connection]["answer"] &&
            !peerConnection.currentRemoteDescription
        ) {
            await peerConnection.setRemoteDescription(
                new RTCSessionDescription(snapshot.data()[connection]["answer"])
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
