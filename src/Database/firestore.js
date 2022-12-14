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
import { GrOrderedList } from "react-icons/gr";

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

export async function updateLogs(from, to, id, quant) {
    let sfDocRef = doc(db, "instance1", "Logs");
    if (to === "Order 1") {
        to = "O1";
    }
    if (to === "Order 2") {
        to = "O2";
    }
    try {
        await runTransaction(db, async (transaction) => {
            const sfDoc = await transaction.get(sfDocRef);
            if (!sfDoc.exists()) {
                throw Error("Document does not exist!");
            }
            let data = sfDoc.data();
            let email = window.localStorage.admin.replace(".", ",");
            if (!(email in data)) {
                data[email] = [];
            }
            data = data[email];
            for (let i = 0; i < quant; i++) {
                data.push(id + ":" + from + ":" + to);
            }
            let file = {};
            file[email] = data;

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
    let inventorySize = 200;
    let fin_data = [];
    for (let index = 0; index < inventorySize; index++) {
        let temp = {};
        temp[data[Math.round(Math.random() * (data.length - 1))]] = "10:00";
        fin_data.push(temp);
    }

    updateDoc(doc(db, "instance1", "Room 1"), {
        Bins: { Inventory: fin_data },
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

    updateDoc(doc(db, "instance1", "Logs"), {
        Score: {
            right: right,
            wrong: wrong,
        },
    });
}

export async function getPerformanceData() {
    let physicalLogs = await getDoc(doc(db, "instance1", "Logs"));
    physicalLogs = physicalLogs.data();
    return physicalLogs;
}

// Standard Normal variate using Box-Muller transform.
function gaussianRandom(mean = 0, stdev = 1) {
    let u = 1 - Math.random(); //Converting [0,1) to (0,1)
    let v = Math.random();
    let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}
export async function creatOrderOptions(range) {
    let physicalLogs = await getDoc(doc(db, "instance1", "Logs"));
    let max_sku = 15;
    let min_sku = 5;
    let OrderedList = [];
    // console.log(physicalLogs.data());
    let sku_ids = Object.keys(physicalLogs.data()["Bins"]);
    for (let i = 0; i < range; i++) {
        let order = {};
        let amount = 0;
        for (let j = 0; j < sku_ids.length; j++) {
            if (Math.random() < 0.2) {
                const quantity = Math.floor(
                    Math.random() * (max_sku - min_sku) + min_sku
                );
                order[sku_ids[j]] = quantity;
                let val = Math.floor(quantity * gaussianRandom(1, 0.3));
                amount += val;
            }
        }
        order["Points"] = amount;
        order["title"] =
            "Order #" + Math.floor(Math.random() * (9999 - 999) + 999);
        order["status"] = false;
        if (amount > 0) OrderedList.push(order);
    }
    return OrderedList;
    // console.log(OrderedList);
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
            getDoc(doc(db, "instance1", "Room 1")).then((val) => {
                if (val.data()["Points"]) {
                    points += val.data()["Points"];
                }
                updateDoc(doc(db, "instance1", "Room 1"), {
                    Points: points,
                });
            });
            return dict;
        });
        bins_val[bin_label] = [];
        // console.log(bin_label, bins_val);
        if ("O1" in bins_val) {
            updateDoc(doc(db, "instance1", "Room 1"), { Bins: bins_val });
        }
        updateDoc(doc(db, "instance1", "Room 1"), dict);
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
            if (data[from].length === from_var.length) {
                throw "Exception";
            }
            data[from] = from_var;
            if (timer !== "Expired") {
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

export async function binListener(set_data, setorderList) {
    onSnapshot(doc(db, "instance1", "Room 1"), async (snapshot) => {
        set_data(snapshot.data()["Bins"]);
        let temp = {
            O1: snapshot.data()["O1"],
            O2: snapshot.data()["O2"],
        };
        setorderList(temp);
    });
}
export async function orderListListerner(setorderList) {
    onSnapshot(doc(db, "instance1", "Room 1"), async (snapshot) => {
        setorderList(snapshot.data()["orders"]);
    });
}

export async function updateOrderList(orderList) {
    updateDoc(doc(db, "instance1", "Room 1"), {
        orders: orderList,
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
    let records = physicalLogs.data()["Bins"][skuId];
    return records;
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
