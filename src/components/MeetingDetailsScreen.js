import { CheckIcon, ClipboardIcon } from "@heroicons/react/outline";
import { Constants } from "@videosdk.live/react-sdk";
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

export function MeetingDetailsScreen({
  onClickJoin,
  _handleOnCreateMeeting,
  participantName,
  setParticipantName,
  videoTrack,
  setVideoTrack,
  onClickStartMeeting,
  setMeetingMode,
  meetingMode,
  codes,
  boo
}) {
  const [studioCode1, setStudioCode1] = useState("");
  const [studioCode12, setStudioCode12] = useState("");
  const [studioCodeError, setStudioCodeError] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [iscreateMeetingClicked, setIscreateMeetingClicked] = useState(false);
  const [isJoinMeetingClicked, setIsJoinMeetingClicked] = useState(false);
  const [latestMeetingCode, setLatestMeetingCode] = useState(""); // State variable to store the latest meeting code
  const [latestMeetingTimestamp, setLatestMeetingTimestamp] = useState(null); // State variable to store the timestamp of the latest meeting
  const [studioCode, setStudioCode] = useState("");
  const [bool, setBool] = useState(Boolean);
  // const userName = "Jimmy"; // Set the user's name here
  console.log('bool',boo);
  console.log('codes',codes);
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

    // if (isJoinMeetingClicked) {
      fetchLatestMeetingCode();
    // }
  }, [isJoinMeetingClicked]);

  const generateMeetingCode = () => {
    // Generate a random meeting code. You can customize this as needed.

    let code = studioCode;

    return code;
  };

  const saveMeetingCodeToFirestore = async (code) => {
    const meetingCodesRef = collection(db, "codes");
    const bool = true;
    const docRef = await addDoc(meetingCodesRef, {
      code,
      status: bool,
      createdAt: new Date(),
    });
    setStudioCode1(code); // Update the latest code state
  };
  useEffect(() => {
    setStudioCode(latestMeetingCode);
  }, []);

  console.log("studioCode", studioCode);
  // const handleInputChange = (e) => {
  //   const newValue = latestMeetingCode;
  //   setStudioCode(newValue);
  // };
  console.log("new value", latestMeetingCode);

  return (
    <div
      className={`flex flex-1 flex-col justify-center w-full md:p-[6px] sm:p-1 p-1.5`}
    >
      {/* Display the user's name and meeting code */}
      {/* {studioCode1} */}
      <div className="absolute top-0 left-0 p-4 text-white bg-purple-350">
        <p>{` ${latestMeetingCode}`}</p>
      </div>
      {iscreateMeetingClicked ? (
        <div className="border border-solid border-gray-400 rounded-xl px-4 py-3  flex items-center justify-center">
          <p className="text-white text-base">{`Studio code : ${studioCode}`}</p>
          <button
            className="ml-2"
            onClick={() => {
              navigator.clipboard.writeText(studioCode);
              setIsCopied(true);
              setTimeout(() => {
                setIsCopied(false);
              }, 3000);
            }}
          >
            {isCopied ? (
              <CheckIcon className="h-5 w-5 text-green-400" />
            ) : (
              <ClipboardIcon className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      ) : isJoinMeetingClicked ? (
        <>
          {/* <p style={{ color: "red" }}>{studioCode}</p> */}
          {meetingMode === Constants.modes.CONFERENCE ? (
            <>
              <input
                // defaultValue={studioCode}
                onChange={(e) => {
                  setStudioCode(e.target.value);
                }}
                placeholder={"Enter studio code"}
                className="px-4 py-3 bg-gray-650 rounded-xl text-black w-full text-center"
              />
              {studioCodeError && (
                <p className="text-xs text-red-600">
                  Please enter valid studioCode
                </p>
              )}
            </>
          ) : null}
          {/* <input
            defaultValue={studioCode}
            onChange={(e) => {
              setStudioCode(e.target.value);
            }}
            placeholder={"Enter studio code"}
            className="px-4 py-3 bg-gray-650 rounded-xl text-white w-full text-center"
          />
          {studioCodeError && (
            <p className="text-xs text-red-600">
              Please enter valid studioCode
            </p>
          )}
          */}
        </>
      ) : null}
      {(iscreateMeetingClicked || isJoinMeetingClicked) && (
        <>
          <input
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            placeholder="Enter your name"
            className="px-4 py-3 mt-5 bg-gray-650 rounded-xl text-black w-full text-center"
          />
              <Link to={`${studioCode}`}> 

          <button
            disabled={participantName.length < 3}
            className={`w-full ${
              participantName.length < 3 ? "bg-gray-650" : "bg-purple-350"
            }  text-white px-2 py-3 rounded-xl mt-5`}
            onClick={async (e) => {
              if (iscreateMeetingClicked) {
                if (videoTrack) {
                  videoTrack.stop();
                  setVideoTrack(null);
                }
                onClickStartMeeting();
                const code = generateMeetingCode();
                setStudioCode(code);
                await saveMeetingCodeToFirestore(code);
              } else {
                if (studioCode.match(/\w{4}-\w{4}-\w{4}/)) {
                  onClickJoin(studioCode);
                } else setStudioCodeError(true);
              }
            }}
          >
            {iscreateMeetingClicked
              ? "Start a meeting"
              : isJoinMeetingClicked &&
                meetingMode === Constants.modes.CONFERENCE
              ? "Join Studio"
              : "Join Streaming Room"}
          </button></Link>
        </>
      )}
      {!iscreateMeetingClicked && !isJoinMeetingClicked && (
        <div className="w-full md:mt-0 mt-4 flex flex-col">
          <div className="flex items-center justify-center flex-col w-full">
            {/* { !studioCode ? ( */}
              <>

                <button
                  className="w-full bg-purple-350 text-white px-2 py-3 rounded-xl"
                  onClick={async (e) => {
                    const studioCode = await _handleOnCreateMeeting();
                    const studioCodess = await _handleOnCreateMeeting();
                    setStudioCode(studioCode);
                    setStudioCode12(studioCodess)
                    //  setBool(false)
                    setIscreateMeetingClicked(true);
                    setMeetingMode(Constants.modes.CONFERENCE);
                    await saveMeetingCodeToFirestore(studioCode);
                  }}
                >
                  Create a meeting
                </button>
               
              </>
            {/* ) : ( */}
              <>
                <button
                  className="w-full bg-purple-350 text-white px-2 py-3 mt-5 rounded-xl"
                  onClick={async (e) => {
                    setIsJoinMeetingClicked(true);
                    await saveMeetingCodeToFirestore(studioCode);
                    setMeetingMode(Constants.modes.CONFERENCE);
                  }}
                >
                  Join as a Guest
                </button>
                <Link to={`${studioCode}`}>
                <button
                  className="w-full bg-gray-650 text-white px-2 py-3 rounded-xl mt-5"
                  onClick={(e) => {
                    setIsJoinMeetingClicked(true);
                    setMeetingMode(Constants.modes.VIEWER);
                  }}
                >
                  Join as a Viewer        
                </button>
                </Link>
              </>
            {/* )} */}
          </div>
        </div>
      )}
      {/* Display the latest meeting code with timestamp */}
      {latestMeetingCode && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold text-white">
            Latest Meeting Code
          </h2>
          <p className="text-white">{`${latestMeetingCode} - ${latestMeetingTimestamp?.toLocaleString()}`}</p>
        </div>
      )}
         
    </div>
  );
}
