import React, { useEffect, useState } from "react";
import { Constants, MeetingProvider } from "@videosdk.live/react-sdk";
import { LeaveScreen } from "./components/screens/LeaveScreen";
import { JoiningScreen } from "./components/screens/JoiningScreen";
import { ILSContainer } from "./interactive-live-streaming/ILSContainer";
import { MeetingAppProvider } from "./MeetingAppContextDef";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Hello from "./components/Hello";
import Main from "./Main";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";
const App = () => {
  const [iscreateMeetingClicked, setIscreateMeetingClicked] = useState(false);
const [isJoinMeetingClicked, setIsJoinMeetingClicked] = useState(false);
  const [latestMeetingTimestamp, setLatestMeetingTimestamp] = useState(null); // State variable to store the timestamp of the latest meeting
  const [studioCode, setStudioCode] = useState("");
  const [bool, setBool] = useState(Boolean);
console.log('jjfgjhgj',studioCode);
  const [token, setToken] = useState("");
  console.log('peter',token);
  const [meetingId, setMeetingId] = useState("");
  console.log('peter',meetingId);
  useEffect(() => {
    // Function to fetch the latest meeting code from Firestore.
    const fetchLatestMeetingCode = async () => {
      const meetingCodesRef = collection(db, "codes");
      const q = query(meetingCodesRef, orderBy("createdAt", "desc"), limit(1));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const latestData = querySnapshot.docs[0].data();
        setStudioCode(latestData.code);
        setBool(latestData.status);
        setLatestMeetingTimestamp(latestData.createdAt.toDate());
      }
    };

    if (isJoinMeetingClicked) {
      fetchLatestMeetingCode();
    }
  }, [isJoinMeetingClicked]);


  const [participantName, setParticipantName] = useState("");
  const [micOn, setMicOn] = useState(false);
  const [webcamOn, setWebcamOn] = useState(true);
  const [selectedMic, setSelectedMic] = useState({ id: null });
  const [selectedWebcam, setSelectedWebcam] = useState({ id: null });
  const [selectWebcamDeviceId, setSelectWebcamDeviceId] = useState(
    selectedWebcam.id
  );
  const [meetingMode, setMeetingMode] = useState(Constants.modes.CONFERENCE);
  const [selectMicDeviceId, setSelectMicDeviceId] = useState(selectedMic.id);
  const [isMeetingStarted, setMeetingStarted] = useState(false);
  const [isMeetingLeft, setIsMeetingLeft] = useState(false);

  const isMobile = window.matchMedia(
    "only screen and (max-width: 768px)"
  ).matches;

  useEffect(() => {
    if (isMobile) {
      window.onbeforeunload = () => {
        return "Are you sure you want to exit?";
      };
    }
  }, [isMobile]);
  const link =`${window.location.origin}`

  return (
    <>
   <BrowserRouter>
   
  
      {isMeetingStarted ? (
        <MeetingAppProvider
          selectedMic={selectedMic}
          selectedWebcam={selectedWebcam}
          initialMicOn={micOn}
          initialWebcamOn={webcamOn}
        >
          <MeetingProvider
            config={{
              meetingId,
              micEnabled: micOn,
              webcamEnabled: webcamOn,
              name: participantName ? participantName : "TestUser",
              mode: meetingMode,
              multiStream: false,
            }}
            token={token}
            reinitialiseMeetingOnConfigChange={true}
            joinWithoutUserInteraction={true}
          >
            <Routes>
    <Route path={`/:id`} element={
      <ILSContainer
      onMeetingLeave={() => {
        setToken("");
        setMeetingId("");
        setParticipantName("");
        setWebcamOn(false);
        setMicOn(false);
        setMeetingStarted(false);
      }}
      setIsMeetingLeft={setIsMeetingLeft}
      selectedMic={selectedMic}
      selectedWebcam={selectedWebcam}
      selectWebcamDeviceId={selectWebcamDeviceId}
      setSelectWebcamDeviceId={setSelectWebcamDeviceId}
      selectMicDeviceId={selectMicDeviceId}
      setSelectMicDeviceId={setSelectMicDeviceId}
      micEnabled={micOn}
      webcamEnabled={webcamOn}
      meetingMode={meetingMode}
      setMeetingMode={setMeetingMode}
    />
    }/>
   </Routes>
            
          </MeetingProvider>
        </MeetingAppProvider>
      ) : isMeetingLeft ? (
        <LeaveScreen setIsMeetingLeft={setIsMeetingLeft} />
      ) : (
        <JoiningScreen
          participantName={participantName}
          setParticipantName={setParticipantName}
          setMeetingId={setMeetingId}
          setToken={setToken}
          setMicOn={setMicOn}
          micEnabled={micOn}
          webcamEnabled={webcamOn}
          setSelectedMic={setSelectedMic}
          setSelectedWebcam={setSelectedWebcam}
          setWebcamOn={setWebcamOn}
          codes={studioCode}
          boo={bool}
          onClickStartMeeting={() => {
            setMeetingStarted(true);
          }}
          startMeeting={isMeetingStarted}
          setIsMeetingLeft={setIsMeetingLeft}
          meetingMode={meetingMode}
          setMeetingMode={setMeetingMode}
        />
      )} </BrowserRouter>
    </>
  );
};

export default App;
