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
  increment,
  limit,
  arrayRemove,
  arrayUnion,
} from 'firebase/firestore';

import app from './config';
export const db = getFirestore(app);
export async function unsub() {
  let individualQueries = [];
  let user_info = JSON.parse(localStorage.getItem('warehouse_user'));
  let list = await getDoc(
    doc(db, user_info.classId, 'Team ' + user_info.teamId)
  );
  list = list.data()['userList'];
  for (let i = 0; i < list.length; i++) {
    let chatName = [user_info.email, list[i]].sort().join('-');
    console.log(chatName);
    individualQueries.push(
      query(
        collection(db, user_info.classId, 'Team ' + user_info.teamId, chatName),
        orderBy('createdAt', 'desc'),
        limit(100)
      )
    );
  }
  for (let j = 0; j < list.length; j++) {
    let messages = [];
    onSnapshot(individualQueries[j], (snapshot) => {
      console.log(snapshot.docs.map((doc) => messages.push(doc.data())));
    });
  }
  // onSnapshot(collection(db, 'instance1', 'Teams', 'Members'), (doc) => {
  //   var ans = {};
  //   doc.forEach((doc) => {
  //     if (doc.id !== window.localStorage.admin) {
  //       ans[doc.id] = doc.data();
  //     }
  //   });
  //   setcoord(ans);
  // });
}

// export async function updateCursor(x, y) {
//   try {
//     await setDoc(
//       doc(db, 'instance1', 'Teams', 'Members', window.localStorage.admin),
//       {
//         Cursor: [x, y],
//       }
//     );
//   } catch (e) {
//     console.error('Error adding document: ', e);
//   }
// }

// export async function writeConfig(roomWithOffer, connection) {
//   let something = {};
//   something[connection] = roomWithOffer;
//   updateDoc(doc(db, 'instance1', 'Room 1'), something).catch((error) => {
//     console.log(error.code);
//   });
// }

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
  let user_info = JSON.parse(localStorage.getItem('warehouse_user'));
  getDoc(doc(db, user_info.classId, 'Team ' + user_info.teamId)).then((val) => {
    setskuList(Object.keys(val.data()['userLogs']));
  });
}

export async function purchaseInventory(inventorySku, inventoryQuant) {
  let user_info = JSON.parse(localStorage.getItem('warehouse_user'));
  let temp = await getDoc(
    doc(db, user_info.classId, 'Team ' + user_info.teamId)
  );
  temp = temp.data()['Bins']['Receiving'];
  for (let index = 0; index < inventoryQuant; index++) {
    let tempObj = {};
    tempObj[inventorySku] = Date();
    temp.push(tempObj);
  }
  updateDoc(doc(db, user_info.classId, 'Team ' + user_info.teamId), {
    'Bins.Receiving': temp,
    Points: increment(-inventoryQuant),
  });
}

export async function binUpdate(from, to, id, set_data, timer) {
  let user_info = JSON.parse(localStorage.getItem('warehouse_user'));
  const sfDocRef = doc(db, user_info.classId, 'Team ' + user_info.teamId);
  console.log('Team ' + user_info.teamId);
  try {
    await runTransaction(db, async (transaction) => {
      const sfDoc = await transaction.get(sfDocRef);
      if (!sfDoc.exists()) {
        throw Error('Document does not exist!');
      }
      const data = sfDoc.data()['Bins'];
      let logs = sfDoc.data()['Logs'];
      let sku = logs[id];
      if (!(from in sku)) sku[from] = 0;
      if (!(to in sku)) sku[to] = 0;
      sku[from] -= 1;
      sku[to] += 1;
      if (sku[from] === 0) delete sku[from];
      if (sku[to] === 0) delete sku[to];

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
        //   data[from] = data[from].filter((val) => val !== id);
        // } else {
        //   throw 'Exception';
        // }
      }
      if (count === 0) {
        throw Error('Exception');
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

export async function updateLogs(from, to, id, quant) {
  let user_info = JSON.parse(localStorage.getItem('warehouse_user'));
  let sfDocRef = doc(db, user_info.classId, 'Team ' + user_info.teamId);
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
        let bins = data['userLogs'];
        let bin_id = data['userLogs'][id];
        if (!(from in bin_id)) bin_id[from] = 0;
        if (!(to in bin_id)) bin_id[to] = 0;
        bin_id[from] -= quant;
        if (to !== 'Trash') {
          bin_id[to] += quant;
        }
        if (bin_id[from] === 0) delete bin_id[from];
        if (bin_id[to] === 0) delete bin_id[to];

        let email = user_info.email.replace('.', ',');
        let personal = data[email];
        if (personal === undefined) personal = [];
        for (let i = 0; i < quant; i++) {
          personal.push(id + ':' + from + ':' + to);
        }
        let file = {};
        file[email] = personal;
        file['userLogs'] = bins;
        transaction.update(sfDocRef, file);
      });
      console.log('Transaction successfully committed!');
    } catch (e) {
      console.log('Transaction failed: ', e);
    }
  }
}

// export async function flushbins(tmp) {
//   const sfDocRef = doc(db, 'instance1', 'Room 1');
//   updateDoc(sfDocRef, { Bins: tmp });
// }

export async function createInstance(config) {
  const batch = writeBatch(db);
  let { bins, logs } = await writeInventory(config['Number Of SKU']);
  let temp = {
    Bins: { Receiving: bins },
    Points: [],
    O1: {},
    O2: {},
    Logs: logs,
    IRI: [],
    start_time: config['start_time'],
    orders: [],
    userList: [],
    userLogs: logs,
  };
  batch.set(doc(db, 'Class List', config['Class Number']), {});
  for (let i = 0; i < config['Total no. of teams']; i++) {
    const teamRef = doc(db, config['Class Number'], 'Team ' + (i + 1));
    batch.set(teamRef, temp);
  }
  batch.set(doc(db, config['Class Number'], 'Configuration'), config);
  batch.commit().catch((error) => {
    console.log(error.code);
  });
}

export async function writeInventory(UniqueSku) {
  const data = Array.from(
    { length: UniqueSku },
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
  return { bins: fin_data, logs: logs };
}

// export async function updateOrderList(selectData, label) {
//   let temp = {
//     orders: arrayRemove(selectData),
//   };
//   temp[label] = selectData;
//   updateDoc(doc(db, 'instance1', 'Room 1'), temp).catch((err) =>
//     console.log(err)
//   );
// }
export async function calculateLogs() {
  let iri = 0;
  let user_info = JSON.parse(localStorage.getItem('warehouse_user'));
  let data = await getDoc(
    doc(db, user_info.classId, 'Team ' + user_info.teamId)
  );
  let physicalLogs = data.data()['userLogs'];
  let actualLogs = data.data()['Logs'];
  console.log(data.data());
  let skus = Object.keys(actualLogs);

  for (let i = 0; i < skus.length; i++) {
    let temp = Object.keys(actualLogs[skus[i]]);
    for (let j = 0; j < temp.length; j++) {
      if (temp[j] in physicalLogs[skus[i]]) {
        iri += Math.abs(
          actualLogs[skus[i]][temp[j]] - physicalLogs[skus[i]][temp[j]]
        );
      } else {
        iri += actualLogs[skus[i]][temp[j]];
      }
    }
  }
  // scores[window.localStorage.admin.replace(".", ",")] = {
  //     right: right,
  //     wrong: wrong,
  // };
  updateDoc(doc(db, user_info.classId, 'Team ' + user_info.teamId), {
    IRI: arrayUnion(iri),
  });
}

// export async function getPerformanceData() {
//   let physicalLogs = await getDoc(doc(db, 'instance1', 'Logs'));
//   physicalLogs = physicalLogs.data();
//   return physicalLogs;
// }

// Standard Normal variate using Box-Muller transform.
function gaussianRandom(mean = 0, stdev = 1) {
  let u = 1 - Math.random(); //Converting [0,1) to (0,1)
  let v = Math.random();
  let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  // Transform to the desired mean and standard deviation:
  return z * stdev + mean;
}
export async function creatOrderOptions(range) {
  let user_info = JSON.parse(localStorage.getItem('warehouse_user'));
  let physicalLogs = await getDoc(
    doc(db, user_info.classId, 'Team ' + user_info.teamId)
  );
  let max_sku = 15;
  let min_sku = 5;
  let OrderedList = [];
  let sku_ids = Object.keys(physicalLogs.data()['userLogs']);
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
    order['Points'] = amount;
    order['title'] = 'Order #' + Math.floor(Math.random() * (9999 - 999) + 999);
    order['status'] = false;
    if (amount > 0) OrderedList.push(order);
  }
  return OrderedList;
  // console.log(OrderedList);
}

export async function calculateScore(data, bins_val, bin_label) {
  console.log('CALCULATE SCORE', data, bins_val, bin_label);
  // check how many bin_vals are present in data
  // errors are counted by units of absence of what should be and the presence of what shouldnt be.
  let user_info = JSON.parse(localStorage.getItem('warehouse_user'));
  if (!bins_val || bins_val.length < 1) {
    let temp = {};
    temp[bin_label] = {};
    updateDoc(doc(db, user_info.classId, 'Team ' + user_info.teamId), temp);
    return;
  }
  if (!data['amount']) {
    let temp = {};
    temp[bin_label] = {};
    temp['Bins.' + bin_label] = [];
    // updateDoc(doc(db, user_info.classId, 'Team ' + user_info.teamId), {
    //   'Bins.O1': [],
    // });
    updateDoc(doc(db, user_info.classId, 'Team ' + user_info.teamId), temp);
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
  temp['Bins.' + bin_label] = [];
  updateDoc(doc(db, user_info.classId, 'Team ' + user_info.teamId), temp);
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

export async function binListener(
  set_data,
  setorderList,
  setStartTime,
  setselectedOrders
) {
  let user_info = JSON.parse(localStorage.getItem('warehouse_user'));
  onSnapshot(
    doc(db, user_info.classId, 'Team ' + user_info.teamId),
    async (snapshot) => {
      set_data(snapshot.data()['Bins']);
      setorderList(snapshot.data()['orders']);
      setStartTime(snapshot.data()['start_time'].toDate());
      setselectedOrders({
        O1: snapshot.data()['O1'],
        O2: snapshot.data()['O2'],
      });
    }
  );
}
export async function orderListListerner(setorderList) {
  let user_info = JSON.parse(localStorage.getItem('warehouse_user'));
  onSnapshot(
    doc(db, user_info.classId, 'Team ' + user_info.teamId),
    async (snapshot) => {
      console.log(Object.keys(snapshot.data()['userLogs']));
      setorderList(snapshot.data()['orders']);
    }
  );
}

export async function updateOrderList(orderList, label) {
  let user_info = JSON.parse(localStorage.getItem('warehouse_user'));
  let temp = {
    orders: arrayRemove(orderList),
  };
  temp[label] = orderList;
  updateDoc(doc(db, user_info.classId, 'Team ' + user_info.teamId), temp);
}

export async function chat_sendMessage(message, to) {
  if (message !== '') {
    let user_info = JSON.parse(localStorage.getItem('warehouse_user'));
    let emailDestination = '';
    if (to !== 'Everyone') {
      emailDestination = [user_info.email, to].sort().join('-');
    } else {
      emailDestination = to;
    }
    const messagesRef = collection(
      db,
      user_info.classId,
      'Team ' + user_info.teamId,
      emailDestination
    );
    addDoc(messagesRef, {
      text: message,
      createdAt: serverTimestamp(),
      sender: user_info.email,
      receiver: to,
    });
  }
}

// export async function readConfig() {
//   const docRef = doc(db, 'instance1', 'Room 1');
//   const docSnap = await getDoc(docRef);
//   if (docSnap.exists()) {
//     return docSnap.data();
//   } else {
//     // doc.data() will be undefined in this case
//     console.log('No such document!');
//   }
// }

export async function skuFinder(skuId) {
  let user_info = JSON.parse(localStorage.getItem('warehouse_user'));
  let physicalLogs = await getDoc(
    doc(db, user_info.classId, 'Team ' + user_info.teamId)
  );
  return physicalLogs.data()['userLogs'][skuId];
}

// export async function addIceCandidate(json) {
//   await updateDoc(doc(db, 'instance1', 'Room 1'), {
//     iceCandidates: json,
//   });
// }

// export async function icelistners(peerConnection) {
//   onSnapshot(
//     collection(db, 'instance1', 'Room 1', 'iceCandidates'),
//     (snapshot) => {
//       snapshot.docChanges().forEach((change) => {
//         if (change.type === 'added') {
//           const candidate = new RTCIceCandidate(change.doc.data());
//           peerConnection.addIceCandidate(candidate);
//         }
//       });
//     }
//   );
// }

// export async function answerlistener(peerConnection, connection) {
//   onSnapshot(doc(db, 'instance1', 'Room 1'), async (snapshot) => {
//     if (
//       snapshot.data()[connection]['answer'] &&
//       !peerConnection.currentRemoteDescription
//     ) {
//       await peerConnection.setRemoteDescription(
//         new RTCSessionDescription(snapshot.data()[connection]['answer'])
//       );
//     }
//     if (
//       snapshot.data()['iceCandidates'] &&
//       !!peerConnection.currentRemoteDescription
//     ) {
//       peerConnection.addIceCandidate(snapshot.data()['iceCandidates']);
//     }
//   });
// }
