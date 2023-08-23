function dec2hex(dec: any) {
  return dec.toString(16).padStart(2, '0');
}

function generateId(len: any) {
  var arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join('');
}
import { MediaConnection, Peer } from 'peerjs';
import { useState, useEffect, useRef } from 'react';

const randomPeerId = generateId(10);

export const ButtonCall = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localScreenShareVideoRef = useRef<HTMLVideoElement>(null);
  const [username, setUsername] = useState('');
  const [peer, setPeer] = useState<Peer>(() => new Peer(randomPeerId));
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [disableLocalVideo, setDisableLocalVideo] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();
  const [showRemoteVideo, setShowRemoteVideo] = useState(true);
  const [deafen, setDeafen] = useState(false);
  const [connectedCall, setConnectedCall] = useState<MediaConnection>();

  useEffect(() => {
    if (!peer) return;
    console.log(peer);
    peer.on('call', async (call) => {
      setIsReceivingCall(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(mediaStream);
      call.answer(mediaStream);
      setConnectedCall(call);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
        localVideoRef.current.muted = true;
        localVideoRef.current.play();
      }
      call.on('stream', (stream) => {
        setRemoteStream(stream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
          remoteVideoRef.current.play();
        }
        stream.onaddtrack = (e) => {
          console.log(e);
        };
      });
    });
    peer.on('open', (id) => {
      console.log(`Peer Id: ${id}`);
    });
    peer.on('connection', () => {
      console.log('connection');
    });
  }, [localStream]);

  const connect = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    peer.connect(username);
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setLocalStream(mediaStream);
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = mediaStream;
      localVideoRef.current.muted = true;
      localVideoRef.current.play();
    }
    const call = peer.call(username, mediaStream);
    setConnectedCall(call);
    call.on('stream', (stream) => {
      setRemoteStream(stream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
        remoteVideoRef.current.play();
      }
    });
  };

  const toggleMicrophone = () =>
    localStream &&
    setMicrophoneEnabled((prev) => {
      localStream.getAudioTracks()[0].enabled = !prev;
      return !prev;
    });

  const toggleVideo = () =>
    localStream &&
    setVideoEnabled((prev) => {
      localStream.getVideoTracks()[0].enabled = !prev;
      return !prev;
    });

  const toggleRemoteVideo = () =>
    remoteStream &&
    setShowRemoteVideo((prev) => {
      remoteStream.getVideoTracks()[0].enabled = !prev;
      return !prev;
    });

  const deafenUser = () => {
    if (remoteStream) {
      remoteStream.getAudioTracks()[0].enabled =
        !remoteStream.getAudioTracks()[0].enabled;
    }
  };

  const shareScreen = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });
    if (remoteStream && connectedCall) {
      connectedCall.peerConnection
        .getSenders()[1]
        .replaceTrack(stream.getTracks()[0]);
      remoteStream.addTrack(stream.getTracks()[0]);
    }
    if (localScreenShareVideoRef.current) {
      localScreenShareVideoRef.current.srcObject = stream;
      localScreenShareVideoRef.current.play();
    }
  };

  return (
    <div>
      {randomPeerId}
      {/* {isReceivingCall && (
        <OverlayStyle>You are receiving a call!</OverlayStyle>
      )} */}
      <form onSubmit={connect}>
        <label htmlFor='username'></label>
        <input
          type='text'
          id='username'
          onChange={(e) => setUsername(e.target.value)}
        />
        <button>Connect</button>
      </form>
      <div>
        <button onClick={shareScreen}>Share Screen</button>
        <button onClick={toggleMicrophone}>
          {microphoneEnabled ? 'Mute' : 'Unmute'}
        </button>
        <button onClick={toggleVideo}>
          {videoEnabled ? 'Turn Off Video' : 'Turn On Video'}
        </button>
        <button onClick={toggleRemoteVideo}>
          {showRemoteVideo ? 'Turn Off User Video' : 'Turn On User video'}
        </button>
        <button onClick={deafenUser}>Mute User</button>
      </div>
      <div style={{ display: 'flex' }}>
        <div>
          <div>
            <span>Your Video</span>
          </div>
          <video ref={localVideoRef} width={400} height={400}></video>
        </div>
        <div>
          <div>
            <span>Remote</span>
          </div>
          <video ref={remoteVideoRef} width={400} height={400}></video>
        </div>
      </div>
      <div>
        <div>
          <span>Your Screen</span>
        </div>
        <video ref={localScreenShareVideoRef} width={400} height={400}></video>
      </div>
    </div>
  );
};

export default ButtonCall;
