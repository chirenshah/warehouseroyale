import {
    writeConfig,
    readConfig,
    addIceCandidate,
    answerlistener,
} from "../Database/firestore";
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
const peerConnection = new RTCPeerConnection();
const dataChannel = peerConnection.createDataChannel("my channel");
dataChannel.addEventListener('open', event => {
    
});
export function cursorListner(setcoord){
    peerConnection.addEventListener("datachannel",(event)=>{
        let receiverChannel = event.channel
        receiverChannel.onmessage = ((event)=>{
            setcoord(JSON.parse(event.data));
        })
    })
}

export function sendMessage(x,y){
    let cursor = {
        x:x,
        y:y
    }
    
    dataChannel.send(JSON.stringify(cursor));
}

//registerPeerConnectionListeners();
peerConnection.addEventListener("icecandidate", (event) => {
    if (event.candidate) {
        let message = {}
        message.candidate = event.candidate.candidate;
        message.sdpMid = event.candidate.sdpMid;
        message.sdpMLineIndex = event.candidate.sdpMLineIndex;
        addIceCandidate(message);
      }
});

async function joinRoom(offer){
    if (!peerConnection.currentRemoteDescription) {
        await peerConnection.setRemoteDescription(
            new RTCSessionDescription(offer["roomWithOffer"]["offer"])
        );
    }
    const answer = await peerConnection.createAnswer();
    const roomWithAnswer = {
        offer: offer["roomWithOffer"]["offer"],
        answer: {
            type: answer.type,
            sdp: answer.sdp,
        },
    };
    writeConfig(roomWithAnswer);
    await peerConnection.setLocalDescription(answer);
}

export async function room(){
    let offer = await readConfig();
    if(offer['roomWithOffer']){
        joinRoom(offer);
    }else{
        createRoom();
    }
}

export async function createRoom(){
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    const roomWithOffer = {
        offer: {
            type: offer.type,
            sdp: offer.sdp,
        },
    };
    writeConfig(roomWithOffer);
    answerlistener(peerConnection);
    //console.log(peerConnection);
}

// function registerPeerConnectionListeners() {
//     peerConnection.addEventListener("icegatheringstatechange", () => {
//         console.log(
//             `ICE gathering state changed: ${peerConnection.iceGatheringState}`
//         );
//     });

//     peerConnection.addEventListener("connectionstatechange", () => {
//         console.log(
//             `Connection state change: ${peerConnection.connectionState}`
//         );
//     });

//     peerConnection.addEventListener("signalingstatechange", () => {
//         console.log(`Signaling state change: ${peerConnection.signalingState}`);
//     });

//     peerConnection.addEventListener("iceconnectionstatechange ", () => {
//         console.log(
//             `ICE connection state change: ${peerConnection.iceConnectionState}`
//         );
//     });
// }
