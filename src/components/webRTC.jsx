// import {
//     writeConfig,
//     readConfig,
//     addIceCandidate,
//     answerlistener,
// } from "../Database/firestore";
// const configuration = {
//     iceServers: [
//         {
//             urls: [
//                 "stun:stun1.l.google.com:19302",
//                 "stun:stun2.l.google.com:19302",
//             ],
//         },
//     ],
//     iceCandidatePoolSize: 10,
// };

export function cursorListner(setcoord) {
    peerConnection.addEventListener("datachannel", (event) => {
        let receiverChannel = event.channel;
        receiverChannel.onmessage = (event) => {
            setcoord(JSON.parse(event.data));
        };
    });
}

// export function sendMessage(x, y) {
//     // let cursor = {
//     //     x: x,
//     //     y: y,
//     // };
//     //dataChannel.send(JSON.stringify(cursor));
// }

const peerConnection = new RTCPeerConnection();
// Put everything in a function and call it from employee_game
// function peer2peerConnection() {
//     const players = [
//         "email2@gmail.com",
//         "shah.chiren25@gmail.com",
//         "email3@gmail.com",
//     ];
//     let playerIndex = players.indexOf(window.localStorage.admin);

//     // create connections
//     for (let index = playerIndex + 1; index < players.length; index++) {
//         createRoom(playerIndex + "-" + index);
//     }

//     //accept connections
//     for (let i = 0; i < playerIndex; i++) {
//         joinRoom(i + "-" + playerIndex);
//     }

//     //registerPeerConnectionListeners();
//     peerConnection.addEventListener("icecandidate", (event) => {
//         if (event.candidate) {
//             let message = {};
//             message.candidate = event.candidate.candidate;
//             message.sdpMid = event.candidate.sdpMid;
//             message.sdpMLineIndex = event.candidate.sdpMLineIndex;
//             addIceCandidate(message);
//         }
//     });

//     async function joinRoom(connection) {
//         let offer = await readConfig();
//         if (!peerConnection.currentRemoteDescription) {
//             await peerConnection.setRemoteDescription(
//                 new RTCSessionDescription(offer[connection]["offer"])
//             );
//         }

//         const answer = await peerConnection.createAnswer();
//         const roomWithAnswer = {
//             offer: offer[connection]["offer"],
//             answer: {
//                 type: answer.type,
//                 sdp: answer.sdp,
//             },
//         };
//         writeConfig(roomWithAnswer, connection);
//         await peerConnection.setLocalDescription(answer);
//     }

//     // export async function room(){
//     //     let offer = await readConfig();
//     //     if(offer['roomWithOffer']){
//     //         joinRoom(offer);
//     //     }else{
//     //         //createRoom();
//     //     }
//     // }

//     async function createRoom(label) {
//         const offer = await peerConnection.createOffer();
//         await peerConnection.setLocalDescription(offer);
//         const roomWithOffer = {
//             offer: {
//                 type: offer.type,
//                 sdp: offer.sdp,
//             },
//         };
//         writeConfig(roomWithOffer, label);
//         answerlistener(peerConnection, label);
//         //console.log(peerConnection);
//     }

//     function registerPeerConnectionListeners() {
//         peerConnection.addEventListener("icegatheringstatechange", () => {
//             console.log(
//                 `ICE gathering state changed: ${peerConnection.iceGatheringState}`
//             );
//         });

//         peerConnection.addEventListener("connectionstatechange", () => {
//             console.log(
//                 `Connection state change: ${peerConnection.connectionState}`
//             );
//         });

//         peerConnection.addEventListener("signalingstatechange", () => {
//             console.log(
//                 `Signaling state change: ${peerConnection.signalingState}`
//             );
//         });

//         peerConnection.addEventListener("iceconnectionstatechange ", () => {
//             console.log(
//                 `ICE connection state change: ${peerConnection.iceConnectionState}`
//             );
//         });
//     }
// }
