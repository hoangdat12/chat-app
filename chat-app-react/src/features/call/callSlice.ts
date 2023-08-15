import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DataConnection, MediaConnection, Peer } from 'peerjs';
import {
  CallInitiatePayload,
  CallType,
  IParticipant,
} from '../../ultils/interface';
import { RootState } from '../../app/store';

export interface CallState {
  isCalling: boolean;
  isCallInProgress: boolean;
  caller?: IParticipant;
  receiver?: IParticipant;
  peer?: Peer;
  call?: MediaConnection;
  connection?: DataConnection;
  isReceivingCall: boolean;
  remoteStream?: MediaStream;
  localStream?: MediaStream;
  activeConversationId?: string;
  // callType?: CallType;
  callType?: string;
  isMini?: boolean;
  endCall?: boolean;
  timeStartCall?: Date;
  timeEndCall?: Date;
}

const initialState: CallState = {
  isCalling: false,
  isCallInProgress: false,
  isReceivingCall: false,
};

export const callSlice = createSlice({
  name: 'callSlice',
  initialState,
  reducers: {
    setIsCalling: (state, action: PayloadAction<boolean>) => {
      state.isCalling = action.payload;
    },
    setPeer: (state, action: PayloadAction<Peer>) => {
      state.peer = action.payload;
    },
    setCall: (state, action: PayloadAction<MediaConnection>) => {
      state.call = action.payload;
    },
    setConnection: (state, action: PayloadAction<DataConnection>) => {
      state.connection = action.payload;
    },
    setIsReceivingCall: (state, action: PayloadAction<boolean>) => {
      state.isReceivingCall = action.payload;
    },
    setCaller: (state, action: PayloadAction<IParticipant>) => {
      state.caller = action.payload;
    },
    setReceiver: (state, action: PayloadAction<IParticipant>) => {
      state.receiver = action.payload;
    },
    setRemoteStream: (state, action: PayloadAction<MediaStream>) => {
      state.remoteStream = action.payload;
    },
    setLocalStream: (state, action: PayloadAction<MediaStream>) => {
      state.localStream = action.payload;
    },
    setIsCallInProgress: (state, action: PayloadAction<boolean>) => {
      state.isCallInProgress = action.payload;
      state.isCalling = false;
    },
    setActiveConversationId: (state, action: PayloadAction<string>) => {
      state.activeConversationId = action.payload;
    },
    setCallType: (state, action: PayloadAction<CallType>) => {
      state.callType = action.payload;
    },
    setIsMini: (state, action: PayloadAction<boolean>) => {
      state.isMini = action.payload;
    },
    setEndCall: (state, action: PayloadAction<boolean>) => {
      state.endCall = action.payload;
    },
    setTimeStartCall: (state, action: PayloadAction<Date>) => {
      state.timeStartCall = action.payload;
    },
    setTimeEndCall: (state, action: PayloadAction<Date | undefined>) => {
      state.timeEndCall = action.payload;
    },
    resetState: (state) => {
      state.isCalling = false;
      state.isCallInProgress = false;
      state.caller = undefined;
      state.call = undefined;
      state.connection = undefined;
      state.isReceivingCall = false;
      state.remoteStream = undefined;
      state.localStream = undefined;
      state.activeConversationId = undefined;
      state.receiver = undefined;
      state.callType = undefined;
      state.isMini = undefined;
      state.timeEndCall = new Date();
    },
    initiateCallState: (state, action: PayloadAction<CallInitiatePayload>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const {
  setIsCalling,
  setPeer,
  setCall,
  setConnection,
  setIsReceivingCall,
  setCaller,
  setRemoteStream,
  setLocalStream,
  setIsCallInProgress,
  setActiveConversationId,
  resetState,
  setIsMini,
  setEndCall,
  setTimeEndCall,
  setTimeStartCall,
  setReceiver,
  initiateCallState,
  setCallType,
} = callSlice.actions;
export default callSlice.reducer;
export const selectCall = (state: RootState) => state.call;
