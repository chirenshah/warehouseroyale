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
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    limit,
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
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        });
}
export async function returnSku(setskuList) {
    getDoc(doc(db, "instance1", "Logs")).then((val) => {
        setskuList(Object.keys(val.data()["Bins"]));
    });
}
export async function updateLogs(from, to, id, quant) {
    let sfDocRef = doc(db, "instance1", "Logs");
    if (to === "Order 1") {
        to = "O1";
    }
    if (to === "Order 2") {
        to = "O2";
    }
    if (from && to && id && quant) {
        try {
            await runTransaction(db, async (transaction) => {
                const sfDoc = await transaction.get(sfDocRef);
                if (!sfDoc.exists()) {
                    throw Error("Document does not exist!");
                }
                let data = sfDoc.data();
                let bins = data["Bins"];
                let times = quant;
                //console.log(bins[id].length);
                if (to == "Trash") {
                    let temp = [];
                    for (let i = 0; i < bins[id].length; i++) {
                        if (bins[id][i] === from && times > 0) {
                            times -= 1;
                        } else {
                            temp.push(bins[id][i]);
                        }
                    }
                    if (temp) {
                        bins[id] = temp;
                    } else {
                        delete bins[id];
                    }
                } else {
                    for (let i = 0; i < bins[id].length; i++) {
                        if (times <= 0) {
                            break;
                        }
                        if (bins[id][i] === from) {
                            bins[id][i] = to;
                            times -= 1;
                        }
                    }
                    while (times > 0) {
                        bins[id].push(to);
                    }
                }
                //console.log(bins[id]);
                let email = window.localStorage.admin.replace(".", ",");
                if (!(email in data)) {
                    data[email] = [];
                }
                let personal = data[email];
                for (let i = 0; i < quant; i++) {
                    personal.push(id + ":" + from + ":" + to);
                }
                let file = {};
                file[email] = personal;
                file["Bins"] = bins;
                transaction.update(sfDocRef, file);
            });
            console.log("Transaction successfully committed!");
        } catch (e) {
            console.log("Transaction failed: ", e);
        }
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
    let inventorySize = 200;
    let fin_data = [];
    let logs = {};
    for (let index = 0; index < inventorySize; index++) {
        let temp = {};
        var randomVar = Math.round(Math.random() * (data.length - 1));
        temp[data[randomVar]] = new Date();
        if (data[randomVar] in logs) {
            logs[data[randomVar]].push("Inventory");
        } else logs[data[randomVar]] = ["Inventory"];
        fin_data.push(temp);
    }

    updateDoc(doc(db, "instance1", "Logs"), {
        Bins: logs,
    });
    updateDoc(doc(db, "instance1", "Room 1"), {
        Bins: { Inventory: fin_data },
    }).catch((err) => console.log(err));
}

export async function calculateLogs() {
    let physicalLogs = await getDoc(doc(db, "instance1", "Logs"));
    let scores = physicalLogs.data()["Score"];
    physicalLogs =
        physicalLogs.data()[window.localStorage.admin.replace(".", ",")];
    let actualLogs = await getDoc(doc(db, "instance1", "Room 1"));

    let actualLogsMap = {};
    actualLogs = actualLogs.data()["Logs"];
    actualLogs.forEach((val) => {
        val = val.split(":");
        if (val[0] in actualLogsMap) {
            //console.log(val);
            actualLogsMap[val[0]].push([val[1], val[2], val[3]]);
        } else {
            actualLogsMap[val[0]] = [[val[1], val[2], val[3]]];
        }
    });
    //console.log(actualLogsMap[""]);
    let right = 0;
    let wrong = 0;
    console.log(actualLogsMap);
    for (let i = 0; i < physicalLogs.length; i++) {
        let phy = physicalLogs[i].split(":");
        //console.log(actualLogsMap[phy[0]], i, phy[0]);
        if (phy[0] in actualLogsMap) {
            let flag = true;
            for (let j = 0; j < actualLogsMap[phy[0]].length; j++) {
                if (
                    (actualLogsMap[phy[0]][j][0] === phy[1]) &
                    (actualLogsMap[phy[0]][j][1] === phy[2]) &
                    (actualLogsMap[phy[0]][j][2] === window.localStorage.admin)
                ) {
                    right += 1;
                    actualLogsMap[phy[0]][j] = [-1, -1, -1];
                    flag = false;
                    break;
                }
            }
            if (flag) {
                wrong += 1;
                console.log(phy[0]);
            }
        } else {
            wrong += 1;
        }
    }
    scores[window.localStorage.admin.replace(".", ",")] = {
        right: right,
        wrong: wrong,
    };
    updateDoc(doc(db, "instance1", "Logs"), {
        Score: scores,
    });
    return scores[window.localStorage.admin.replace(".", ",")];
}

export async function getPerformanceData() {
    let physicalLogs = await getDoc(doc(db, "instance1", "Logs"));
    physicalLogs = physicalLogs.data();
    return physicalLogs;
}

export async function createOrders(setOrder, bins_val, bin_label) {
    getDoc(doc(db, "instance1", "Room 1")).then((val) => {
        let data = val.data()["Bins"]["Inventory"];
        let freq = {};
        for (let z = 0; z < data.length; z++) {
            if (Object.keys(data[z])[0] in freq) {
                freq[Object.keys(data[z])[0]] += 1;
            } else {
                freq[Object.keys(data[z])[0]] = 1;
            }
        }
        let orders1 = [];
        let orders2 = [];
        //let orderSize;
        for (var keys in freq) {
            let temp = {};
            temp[keys] = Math.ceil(freq[keys] * Math.random());
            let ran_val = Math.random();
            if ((ran_val > 0.3) & (ran_val < 0.5)) {
                orders1.push(temp);
            } else if ((ran_val > 0.9) & (ran_val < 1)) {
                orders2.push(temp);
            }
        }
        let dict = { O1: orders1, O2: orders2 };
        let points = 0;
        setOrder((prev) => {
            //console.log(bins_val[bin_label]);
            for (let i = 0; i < prev[bin_label].length; i++) {
                for (let j = 0; j < bins_val[bin_label].length; j++) {
                    if (
                        Object.keys(bins_val[bin_label][j])[0] ===
                        Object.keys(prev[bin_label][i])[0]
                    ) {
                        points += 1;

                        prev[bin_label][j][
                            Object.keys(prev[bin_label][j])[0]
                        ] -= 1;

                        if (
                            prev[bin_label][j][
                                Object.keys(prev[bin_label][j])[0]
                            ] <= 0
                        ) {
                            delete prev[bin_label][j];
                        }
                    }
                }
            }
            dict = prev;
            dict[bin_label] = orders1;
            console.log(dict);
            getDoc(doc(db, "instance1", "Room 1")).then((val) => {
                if (val.data()["Points"]) {
                    points += val.data()["Points"];
                }
                updateDoc(doc(db, "instance1", "Room 1"), {
                    Points: points,
                });
            });
            updateDoc(doc(db, "instance1", "Room 1"), dict);
            return dict;
        });
        bins_val[bin_label] = [];
        // console.log(bin_label, bins_val);
        if ("O1" in bins_val) {
            updateDoc(doc(db, "instance1", "Room 1"), { Bins: bins_val });
        }
        console.log(dict);
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
            let logs = sfDoc.data()["Logs"];
            if (!logs) {
                logs = [];
            }
            logs.push(
                id + ":" + from + ":" + to + ":" + window.localStorage.admin
            );
            let from_var = [];
            let count = 0;
            for (let j = 0; j < data[from].length; j++) {
                if (Object.keys(data[from][j])[0] !== id) {
                    from_var.push(data[from][j]);
                } else {
                    count += 1;
                    if (count > 1) {
                        from_var.push(data[from][j]);
                    }
                }
                // if (data[from].includes(id)) {
                //     data[from] = data[from].filter((val) => val !== id);
                // } else {
                //     throw "Exception";
                // }
            }
            if (count === 0) {
                throw "Exception";
            }
            data[from] = from_var;
            if (to !== "Trash") {
                let temp = {};
                temp[id] = timer;
                if (to in data) {
                    data[to].push(temp);
                } else {
                    data[to] = [];
                    data[to].push(temp);
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

export async function binListener(set_data, setorderList, setStartTime) {
    onSnapshot(doc(db, "instance1", "Room 1"), async (snapshot) => {
        set_data(snapshot.data()["Bins"]);
        let temp = {
            O1: snapshot.data()["O1"],
            O2: snapshot.data()["O2"],
        };
        setorderList(temp);
        setStartTime(snapshot.data()["start_time"].toDate());
    });
}

export async function chat_sendMessage(message) {
    if (message !== "") {
        const messagesRef = collection(db, "instance1", "Room 1", "Chats");
        addDoc(messagesRef, {
            text: message,
            createdAt: serverTimestamp(),
            user: window.localStorage.admin,
        });
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
export async function skuFinder(skuId) {
    let physicalLogs = await getDoc(doc(db, "instance1", "Logs"));
    return physicalLogs.data()["Bins"][skuId][0];
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
