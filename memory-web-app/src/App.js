import "./App.module.css";
import Timeline from "./pages/Timeline";
import EditSingleTimeline from "./pages/EditSingleTimeline";
import NewTimeline from "./pages/NewTimeline";
import Diaries from "./pages/Diaries/Diaries";
import NewDiary from "./pages/Diaries/NewDiary";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebaseui/dist/firebaseui.css";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import Login from "./pages/Login";
import DisplaySingleDiary from "./pages/Diaries/DisplaySingleDiary";
import SearchResults from "./pages/SearchResults";
import EditSingleDiary from "./pages/Diaries/EditDiary";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// import "firebase/compat/performance";
import { getPerformance, incrementMetric } from "firebase/performance";
import { trace as createTrace } from "firebase/performance";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  databaseURL: process.env.REACT_APP_databaseURL,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  measurementId: process.env.REACT_APP_measurementId,
};

// Initialize Firebase
const app = firebase.apps.length
  ? firebase.app()
  : initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const perf = getPerformance(app);

const uiConfig = {
  signInFlow: "popup",
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccessWithAuthResult: (authResult, redirectUrl) => {
      // Redirect to /user/:userId/timeline after successful login
      const userId = authResult.user.uid;
      window.location.href = `/user/${userId}/timeline`;
      return false;
    },
  },
};

function App() {
  // State to keep track of signed-in state
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [timelines, setTimelines] = useState([]);
  const [diaries, setDiaries] = useState([]);
  const [userId, setUserId] = useState(null);
  const currentUser = firebase.auth().currentUser;
  const [redirectToTimeline, setRedirectToTimeline] = useState(false);

  const handleDiaryCreated = (newDiary) => {
    setDiaries((prevDiaries) => [...prevDiaries, newDiary]);
  };

  const onAddTimeline = (newTimeline) => {
    setTimelines([...timelines, newTimeline]);
  };

  const deleteSelectedTimelines = (selectedTimelineIds) => {
    setTimelines(
      timelines.filter((timeline) => !selectedTimelineIds.includes(timeline.id))
    );
  };

  const deleteSelectedDiaries = (selectedDiaryIds) => {
    setDiaries(diaries.filter((diary) => !selectedDiaryIds.includes(diary.id)));
  };

  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        // This gets called whenever a user signs in or out
        setIsSignedIn(!!user);

        if (user) {
          setUserId(user.uid); // Set userId when the user is signed in
          // setRedirectToTimeline(true);

          const fetchTimelines = async () => {
            const db = getFirestore();
            const q = query(
              collection(db, "timeline"),
              where("userID", "==", user.uid)
            );

            // Create a custom trace
            const fetchTimelinesTrace = createTrace(perf, "fetch_timelines");

            // Start the trace
            fetchTimelinesTrace.start();

            fetchTimelinesTrace.incrementMetric("api_calls", 1);

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
              const fetchedTimelines = [];
              querySnapshot.forEach((doc) => {
                fetchedTimelines.push({ id: doc.id, ...doc.data() });
              });
              setTimelines(fetchedTimelines);

              if (fetchTimelinesTrace.isRunning) {
                // Stop the trace and record the metric
                fetchTimelinesTrace.stop();
              }
            });

            return () => unsubscribe();
          };

          fetchTimelines();
        } else {
          setUserId(null); // Set userId to null when the user is signed out
          setTimelines([]);

          setRedirectToTimeline(false);
        }
      });

    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Redirect to /user/:userId/timeline if the user is signed in */}
          {redirectToTimeline && <Navigate to={`/user/${userId}/timeline`} />}
          {/* Render the login page if the user is not signed in */}
          {!isSignedIn && (
            <Route path="/" element={<Login uiConfig={uiConfig} />} />
          )}
          {/* Render the timeline page if the user is signed in */}
          {isSignedIn && userId && (
            <>
              <Route
                path="/user/:userId/timeline"
                element={
                  <Timeline
                    onDeleteSelectedTimelines={deleteSelectedTimelines}
                  />
                }
              />
              <Route
                path="/"
                element={<Navigate to={`/user/${userId}/timeline`} />}
              />
            </>
          )}
          <Route
            path="/user/:userId/new-timeline"
            element={
              <NewTimeline userId={userId} onAddTimeline={onAddTimeline} />
            }
          />
          <Route
            path="/user/:userId/timeline/:timelineId/diaries"
            element={
              <Diaries onDeleteSelectedDiaries={deleteSelectedDiaries} />
            }
          ></Route>
          <Route
            path="/user/:userId/timeline/:timelineId/diaries/new"
            element={<NewDiary onDiaryCreated={handleDiaryCreated} />}
          />
          <Route
            path="/user/:userId/timeline/:timelineId/edit"
            element={<EditSingleTimeline />}
          />
          <Route
            path="/user/:userId/timeline/:timelineId/diaries/:diaryId"
            element={<DisplaySingleDiary />}
          />
          <Route
            path="/user/:userId/timeline/:timelineId/diaries/:diaryId/edit"
            element={<EditSingleDiary />}
          ></Route>
          <Route
            path="/search"
            element={currentUser ? <SearchResults user={currentUser} /> : null}
          />
          <Route path="/login" element={<Login uiConfig={uiConfig} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
