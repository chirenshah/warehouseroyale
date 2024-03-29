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
  increment,
  arrayRemove,
  arrayUnion,
} from 'firebase/firestore';

import app from './config';

export const db = getFirestore(app);
export default function unsub(setcoord) {
  onSnapshot(collection(db, 'instance1', 'Teams', 'Members'), (doc) => {
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
      doc(db, 'instance1', 'Teams', 'Members', window.localStorage.admin),
      {
        Cursor: [x, y],
      }
    );
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}

export async function writeConfig(roomWithOffer, connection) {
  let something = {};
  something[connection] = roomWithOffer;
  updateDoc(doc(db, 'instance1', 'Room 1'), something).catch((error) => {
    console.log(error.code);
  });
}

export async function makeOffer(offer) {
  setDoc(
    doc(db, 'instance1', 'Offers', window.localStorage.admin, offer.emp_id),
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
    'instance1',
    'Offers',
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
    doc(db, 'instance1', 'Offers', window.localStorage.admin, item)
  )
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
}
export async function returnSku(setskuList) {
  getDoc(doc(db, 'instance1', 'Logs')).then((val) => {
    setskuList(Object.keys(val.data()['Bins']));
  });
}

export async function updateLogs(from, to, id, quant) {
  let sfDocRef = doc(db, 'instance1', 'Logs');
  if (to === 'Order 1') {
    to = 'O1';
  }
  if (to === 'Order 2') {
    to = 'O2';
  }
  if (from && to && id && quant) {
    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(sfDocRef);
        if (!sfDoc.exists()) {
          throw Error('Document does not exist!');
        }
        let data = sfDoc.data();
        let bins = data['Bins'];
        let bin_id = data['Bins'][id];
        if (!(from in bin_id)) bin_id[from] = 0;
        if (!(to in bin_id)) bin_id[to] = 0;
        bin_id[from] -= quant;
        if (to !== 'Trash') {
          bin_id[to] += quant;
        }
        if (bin_id[from] === 0) delete bin_id[from];
        if (bin_id[to] === 0) delete bin_id[to];

        let email = localStorage.warehouse_user_email.replace('.', ',');
        let personal = data[email];
        if (personal === undefined) personal = [];
        for (let i = 0; i < quant; i++) {
          personal.push(id + ':' + from + ':' + to);
        }
        let file = {};
        file[email] = personal;

        file['Bins'] = bins;
        transaction.update(sfDocRef, file);
      });
      console.log('Transaction successfully committed!');
    } catch (e) {
      console.log('Transaction failed: ', e);
    }
  }
}

export async function flushbins(tmp) {
  const sfDocRef = doc(db, 'instance1', 'Room 1');
  updateDoc(sfDocRef, { Bins: tmp });
}

export async function writeInventory() {
  const data = Array.from(
    { length: 20 },
    () =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
      '123' +
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
      logs[data[randomVar]]['Receiving'] += 1;
    } else
      logs[data[randomVar]] = {
        Receiving: 1,
      };
    fin_data.push(temp);
  }

  updateDoc(doc(db, 'instance1', 'Logs'), {
    Bins: logs,
  });
  updateDoc(doc(db, 'instance1', 'Room 1'), {
    Bins: { Receiving: fin_data },
    Points: 0,
    O1: {},
    O2: {},
    Logs: [],
    start_time: new Date(),
  }).catch((err) => console.log(err));
}

export async function updateOrderList(selectData, label) {
  let temp = {
    orders: arrayRemove(selectData),
  };
  temp[label] = selectData;
  updateDoc(doc(db, 'instance1', 'Room 1'), temp).catch((err) =>
    console.log(err)
  );
}
export async function calculateLogs() {
  let physicalLogs = await getDoc(doc(db, 'instance1', 'Logs'));

  physicalLogs =
    physicalLogs.data()[localStorage.warehouse_user_email.replace('.', ',')];
  let actualLogs = await getDoc(doc(db, 'instance1', 'Room 1'));

  let actualLogsMap = {};
  actualLogs = actualLogs.data()['Logs'];
  actualLogs.forEach((val) => {
    val = val.split(':');
    if (val[0] in actualLogsMap) {
      actualLogsMap[val[0]].push([val[1], val[2]]);
    } else {
      actualLogsMap[val[0]] = [[val[1], val[2]]];
    }
  });
  let right = 0;
  let wrong = 0;
  for (let i = 0; i < physicalLogs.length; i++) {
    let phy = physicalLogs[i].split(':');
    if (phy[0] in actualLogsMap) {
      let flag = true;
      for (let j = 0; j < actualLogsMap[phy[0]].length; j++) {
        if (
          (actualLogsMap[phy[0]][j][0] === phy[1]) &
          (actualLogsMap[phy[0]][j][1] === phy[2])
        ) {
          right += 1;
          actualLogsMap[phy[0]][j] = [-1, -1, -1];
          flag = false;
          break;
        }
      }
      if (flag) {
        wrong += 1;
      }
    } else {
      wrong += 1;
    }
  }
  // scores[window.localStorage.admin.replace(".", ",")] = {
  //     right: right,
  //     wrong: wrong,
  // };
  let temp = {};
  temp['Score.' + localStorage.warehouse_user_email.replace('.', ',')] = {
    right: right,
    wrong: wrong,
  };
  updateDoc(doc(db, 'instance1', 'Logs'), temp);
  return temp;
}

export async function getPerformanceData() {
  let physicalLogs = await getDoc(doc(db, 'instance1', 'Logs'));
  physicalLogs = physicalLogs.data();
  return physicalLogs;
}

export async function updateOrderListManager(selectData) {
  let order = {};
  for (let i = 0; i < selectData['data-items'].length; i++) {
    order[selectData['data-items'][i]] = selectData['data-values'][i];
  }
  let temp = {
    orders: arrayUnion(order),
  };
  updateDoc(doc(db, 'instance1', 'Room 1'), temp).catch((err) =>
    console.log(err)
  );
}

export async function calculateScore(data, bins_val, bin_label) {
  // check how many bin_vals are present in data
  // errors are counted by units of absence of what should be and the presence of what shouldnt be.
  if (!bins_val || bins_val.length < 1) {
    let temp = {};
    temp[bin_label] = {};
    updateDoc(doc(db, 'instance1', 'Room 1'), temp);
    return;
  }
  const timeObject = new Date();
  for (let i = 0; i < bins_val.length; i++) {
    const id = Object.keys(bins_val[i])[0];

    if (
      4 - (timeObject.getTime() - bins_val[i][id].toDate()) / (1000 * 60) >
      0
    ) {
      if (id in data && data[id] > 0) {
        data[id] -= 1;
      } else {
        data['amount'] = parseInt(data['amount'] / 2);
      }
    }
  }
  let extra = 0;
  let amount = data['amount'];
  delete data['amount'];
  Object.keys(data).forEach((val, key) => {
    extra += data[val];
  });
  amount = parseInt(amount / Math.pow(2, extra));

  let temp = {
    Points: increment(amount),
  };
  temp[bin_label] = {};
  updateDoc(doc(db, 'instance1', 'Room 1'), temp);
}

// export async function createOrders(setOrder, bins_val, bin_label) {
//     getDoc(doc(db, "instance1", "Room 1")).then((val) => {
//         let data = val.data()["Bins"]["Receiving"];
//         let freq = {};
//         for (let z = 0; z < data.length; z++) {
//             if (Object.keys(data[z])[0] in freq) {
//                 freq[Object.keys(data[z])[0]] += 1;
//             } else {
//                 freq[Object.keys(data[z])[0]] = 1;
//             }
//         }
//         let orders1 = [];
//         let orders2 = [];
//         //let orderSize;
//         for (var keys in freq) {
//             let temp = {};
//             temp[keys] = Math.ceil(freq[keys] * Math.random());
//             let ran_val = Math.random();
//             if ((ran_val > 0.3) & (ran_val < 0.5)) {
//                 orders1.push(temp);
//             } else if ((ran_val > 0.9) & (ran_val < 1)) {
//                 orders2.push(temp);
//             }
//         }
//         let dict = { O1: orders1, O2: orders2 };
//         let points = 0;
//         setOrder((prev) => {

//             for (let i = 0; i < prev[bin_label].length; i++) {
//                 for (let j = 0; j < bins_val[bin_label].length; j++) {
//                     if (
//                         Object.keys(bins_val[bin_label][j])[0] ===
//                         Object.keys(prev[bin_label][i])[0]
//                     ) {
//                         points += 1;

//                         prev[bin_label][j][
//                             Object.keys(prev[bin_label][j])[0]
//                         ] -= 1;

//                         if (
//                             prev[bin_label][j][
//                                 Object.keys(prev[bin_label][j])[0]
//                             ] <= 0
//                         ) {
//                             delete prev[bin_label][j];
//                         }
//                     }
//                 }
//             }
//             dict = prev;
//             dict[bin_label] = orders1;
//             console.log(dict);
//             getDoc(doc(db, "instance1", "Room 1")).then((val) => {
//                 if (val.data()["Points"]) {
//                     points += val.data()["Points"];
//                 }
//                 updateDoc(doc(db, "instance1", "Room 1"), {
//                     Points: points,
//                 });
//             });
//             updateDoc(doc(db, "instance1", "Room 1"), dict);
//             return dict;
//         });
//         bins_val[bin_label] = [];
//         // console.log(bin_label, bins_val);
//         if ("O1" in bins_val) {
//             updateDoc(doc(db, "instance1", "Room 1"), { Bins: bins_val });
//         }
//         console.log(dict);
//     });
// }

export async function binUpdate(from, to, id, set_data, timer) {
  const sfDocRef = doc(db, 'instance1', 'Room 1');
  try {
    await runTransaction(db, async (transaction) => {
      const sfDoc = await transaction.get(sfDocRef);
      if (!sfDoc.exists()) {
        throw 'Document does not exist!';
      }
      const data = sfDoc.data()['Bins'];
      let logs = sfDoc.data()['Logs'];
      if (!logs) {
        logs = [];
      }
      logs.push(
        id + ':' + from + ':' + to + ':' + localStorage.warehouse_user_email
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
        throw 'Exception';
      }
      data[from] = from_var;
      if (to !== 'Trash') {
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
    console.log('Transaction successfully committed!');
  } catch (e) {
    console.log('Transaction failed: ', e);
  }
}

export async function binListener(
  set_data,
  setorderList,
  setStartTime,
  setselectedOrders
) {
  onSnapshot(doc(db, 'instance1', 'Room 1'), async (snapshot) => {
    set_data(snapshot.data()['Bins']);
    setorderList(snapshot.data()['orders']);
    setStartTime(snapshot.data()['start_time'].toDate());
    setselectedOrders({
      O1: snapshot.data()['O1'],
      O2: snapshot.data()['O2'],
    });
  });
}

export async function chat_sendMessage(message) {
  if (message !== '') {
    const messagesRef = collection(db, 'instance1', 'Room 1', 'Chats');
    addDoc(messagesRef, {
      text: message,
      createdAt: serverTimestamp(),
      user: localStorage.warehouse_user_email,
    });
  }
}

export async function readConfig() {
  const docRef = doc(db, 'instance1', 'Room 1');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    // doc.data() will be undefined in this case
    console.log('No such document!');
  }
}
export async function answerlistener(peerConnection, connection) {
  onSnapshot(doc(db, 'instance1', 'Room 1'), async (snapshot) => {
    if (
      snapshot.data()[connection]['answer'] &&
      !peerConnection.currentRemoteDescription
    ) {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(snapshot.data()[connection]['answer'])
      );
    }
    if (
      snapshot.data()['iceCandidates'] &&
      !!peerConnection.currentRemoteDescription
    ) {
      peerConnection.addIceCandidate(snapshot.data()['iceCandidates']);
    }
  });
}

export async function addIceCandidate(json) {
  await updateDoc(doc(db, 'instance1', 'Room 1'), {
    iceCandidates: json,
  });
}
export async function skuFinder(skuId) {
  let physicalLogs = await getDoc(doc(db, 'instance1', 'Logs'));
  let records = physicalLogs.data()['Bins'][skuId];
  return records;
}
export async function icelistners(peerConnection) {
  onSnapshot(
    collection(db, 'instance1', 'Room 1', 'iceCandidates'),
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          peerConnection.addIceCandidate(candidate);
        }
      });
    }
  );
}
export async function createInstance() {}
