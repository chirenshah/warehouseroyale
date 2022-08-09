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
  export async function test(){
    const peerConnection = new RTCPeerConnection(configuration);
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log(peerConnection);
  }
  
  