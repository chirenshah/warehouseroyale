
import {writeConfig,readConfig,icelistners,addIceCandidate} from '../Database/firestore'
const configuration = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };
  var roomCreated = true;
  const peerConnection = new RTCPeerConnection();
  peerConnection.onicecandidate = function (event){ 
    console.log("event");
  }
  export async function test(){
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    const roomWithOffer = {
      'offer': {
        type: offer.type,
        sdp: offer.sdp,
      },
    };
    if(roomCreated) { 
      let offer = await readConfig(roomWithOffer)
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer['roomWithOffer']['offer']));
      const answer = await peerConnection.createAnswer();
      const roomWithAnswer = {
        offer:offer['roomWithOffer']['offer'],
        answer: {
          type: answer.type,
          sdp: answer.sdp,
        },
      };
      writeConfig(roomWithAnswer);
      //console.log(peerConnection);
      collectIceCandidates()
      await peerConnection.setLocalDescription(answer);
    }
    else{
      writeConfig(roomWithOffer);
      
    }
  } 

  
  async function collectIceCandidates() {
    //console.log("called");
    
    peerConnection.onconnectionstatechange = (event) => {
      console.log(event);
    }
    peerConnection.addEventListener('icecandidate', event => {
      console.log("inside");
      if (event.candidate) {
        const json = event.candidate.toJSON();
        addIceCandidate(json);
      }
      icelistners(peerConnection);
    });
}