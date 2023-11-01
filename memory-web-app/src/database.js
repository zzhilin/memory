import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { useState, useEffect } from "react";

const config = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  databaseURL: process.env.REACT_APP_databaseURL,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
};

firebase.initializeApp(config);
const database = firebase.firestore();
const storage = firebase.storage();

// User log out
export const logout = async () => {
  try {
    await firebase.auth().signOut();
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

// Custom hook for user authentication state
export const useAuthState = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    // Clean up the listener when the component is unmounted
    return () => {
      unsubscribe();
    };
  }, []);

  return user;
};

// Create new timeline
export const createTimeline = async (timeline, imageFile = null) => {
  const newTimelineRef = database.collection("timeline").doc();
  const userID = firebase.auth().currentUser.uid;
  const createdAt = new Date();

  let imageUrl = null;
  if (imageFile) {
    imageUrl = await uploadTimelineImage(newTimelineRef.id, imageFile);
  }

  await newTimelineRef.set({
    userID,
    title: timeline.title,
    description: timeline.description,
    visibility: timeline.visibility,
    createdAt,
    ...(imageUrl ? { image: imageUrl } : {}),
  });

  return { timelineID: newTimelineRef.id, imageUrl };
};

// Display all timelines
export const getTimeline = async () => {
  const querySnapshot = await database.collection("timeline").get();
  let results = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    results.push({
      timelineID: doc.id,
      title: data.title,
      description: data.description,
      visibility: data.visibility,
    });
  });
  return results;
};

// Edit timeline based on timelineID
export const updateTimeline = async (timeline) => {
  const timelineRef = database.collection("timeline").doc(timeline.timelineID);

  try {
    const timelineDoc = await timelineRef.get();
    if (!timelineDoc.exists) {
      return null; // Timeline with the given timelineID doesn't exist
    }

    await timelineRef.set(timeline);

    return timeline;
  } catch (error) {
    console.error("Error updating timeline:", error);
    return null;
  }
};

// Get timeline based on timelineID
export const getTimelineById = async (timelineId) => {
  const timelineRef = database.collection("timeline").doc(timelineId);

  try {
    const timelineDoc = await timelineRef.get();
    console.log("timelineDoc:", timelineDoc);

    if (timelineDoc.exists) {
      console.log("Timeline exists"); // Check if the timeline exists
      return { timelineID: timelineDoc.id, ...timelineDoc.data() };
    } else {
      console.log("Timeline does not exist");
      return null; // Timeline with the given timelineId doesn't exist
    }
  } catch (error) {
    console.error("Error getting timeline:", error);
    return null;
  }
};

// Fetch user timelines
export const fetchUserTimelines = async (userId) => {
  try {
    const querySnapshot = await database
      .collection("timeline")
      .where("userID", "==", userId)
      .get();

    let results = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      results.push({
        timelineID: doc.id,
        title: data.title,
        description: data.description,
        visibility: data.visibility,
        image: data.image,
      });
    });

    return results;
  } catch (error) {
    console.error("Error fetching user timelines:", error);
    return null;
  }
};

// Delete timeline
export const deleteTimeline = async (timeline) => {
  const diariesRef = database.collection("diary");
  const timelineRef = database.collection("timeline").doc(timeline.timelineID);

  try {
    const snapshot = await diariesRef
      .where("timelineID", "==", timeline.timelineID)
      .get();

    // Delete all diaries with the given timelineID
    snapshot.forEach((doc) => {
      doc.ref.delete();
    });

    // Delete the timeline itself
    await timelineRef.delete();

    return true;
  } catch (error) {
    console.error("Error deleting timeline:", error);
    return false;
  }
};

// Create new diary
// export const createDiary = async (diary, imageFile = null) => {
//   const docRef = await database.collection("diary").add({
//     title: diary.title,
//     date: Date.now(),
//     content: diary.content,
//     visibility: diary.visibility,
//     timelineId: diary.timelineId,
//   });

//   let imageUrl = null;
//   if (imageFile) {
//     imageUrl = await uploadDiaryImage(docRef.id, imageFile);
//     await docRef.update({ image: imageUrl });
//   }

//   return { id: docRef.id, image: imageUrl, ...diary };
// };
export const createDiary = async (diary, imageFile = null) => {
  const newDiaryRef = database.collection("diary").doc();
  const userID = firebase.auth().currentUser.uid;
  const createdAt = new Date();

  let imageUrl = null;
  if (imageFile) {
    imageUrl = await uploadDiaryImage(newDiaryRef.id, imageFile);
  }

  await newDiaryRef.set({
    userID,
    title: diary.title,
    lowercaseTitle: diary.title.toLowerCase(),
    date: createdAt,
    content: diary.content,
    visibility: diary.visibility,
    timelineId: diary.timelineId,
    ...(imageUrl ? { image: imageUrl } : {}),
  });

  return { id: newDiaryRef.id, image: imageUrl, ...diary };
};

export const getDiariesByTimelineID = async (timelineID) => {
  const diariesRef = database.collection("diary");

  try {
    const snapshot = await diariesRef
      .where("timelineId", "==", timelineID)
      .get();
    const diaries = snapshot.docs.map((doc) => ({
      diaryID: doc.id,
      ...doc.data(),
    }));
    return diaries;
  } catch (error) {
    console.error("Error getting diaries by timelineID:", error);
    return null;
  }
};

// Edit diary
export const updateDiary = async (diaryId, diary, imageFile = null) => {
  const diaryRef = database.collection("diary").doc(diaryId);

  try {
    if (imageFile) {
      const diaryDoc = await diaryRef.get();
      const currentImageUrl = diaryDoc.data().image;
      if (currentImageUrl) {
        await deleteDiaryImage(currentImageUrl); // Delete the old image if it exists
      }

      const imageUrl = await uploadDiaryImage(diaryId, imageFile); // Upload the new image
      diary.image = imageUrl;
    }
    diary.lowercaseTitle = diary.title.toLowerCase();
    await diaryRef.update(diary);

    return true;
  } catch (error) {
    console.error("Error updating diary:", error);
    return false;
  }
};

// Get diary based on diaryID
export const getDiaryById = async (diaryId) => {
  console.log("getDiaryById called with diaryId:", diaryId);
  const diaryRef = database.collection("diary").doc(diaryId);

  try {
    const doc = await diaryRef.get();

    if (doc.exists) {
      return { id: doc.id, ...doc.data() };
    } else {
      console.log("No diary found");
      return null;
    }
  } catch (error) {
    console.error("Error getting diary:", error);
    return null;
  }
};

// Delete diary based on diaryID
export const deleteDiary = async (diaryID) => {
  const diaryRef = database.collection("diary").doc(diaryID);

  try {
    const diaryDoc = await diaryRef.get();
    if (diaryDoc.exists) {
      const imageUrl = diaryDoc.data().image;
      if (imageUrl) {
        await deleteDiaryImage(imageUrl);
      }
    } else {
      console.log("No diary found");
      return false;
    }

    await diaryRef.delete();

    return true;
  } catch (error) {
    console.error("Error deleting diary:", error);
    return false;
  }
};

export const uploadDiaryImage = async (diaryId, imageFile) => {
  const storageRef = storage.ref();
  const diaryImageRef = storageRef.child(`diary-images/${diaryId}`);
  await diaryImageRef.put(imageFile);
  const url = await diaryImageRef.getDownloadURL();
  return url;
};

export const deleteDiaryImage = async (imageUrl) => {
  try {
    const fileRef = storage.refFromURL(imageUrl);
    await fileRef.delete();
    return true;
  } catch (error) {
    console.error("Error deleting diary image:", error);
    return false;
  }
};

// Search timelines
export const searchTimelines = async (searchTerm, userId) => {
  const querySnapshot = await database
    .collection("timeline")
    .where("userID", "==", userId)
    .orderBy("title")
    .startAt(searchTerm)
    .endAt(searchTerm + "\uf8ff")
    .get();
  let results = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    results.push({
      timelineID: doc.id,
      title: data.title,
      description: data.description,
      visibility: data.visibility,
      image: data.image,
    });
  });
  return results;
};

// Search diaries
export const searchDiaries = async (searchTerm, userId) => {
  console.log("searchDiaries called with:", searchTerm, userId);
  const querySnapshot = await database
    .collection("diary")
    .where("userID", "==", userId)
    .orderBy("lowercaseTitle") // Update this line
    .startAt(searchTerm.toLowerCase())
    .endAt(searchTerm.toLowerCase() + "\uf8ff")
    .get();
  let results = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    results.push({
      diaryID: doc.id,
      title: data.title,
      date: data.date,
      content: data.content,
      visibility: data.visibility,
      timelineId: data.timelineId,
      image: data.image,
    });
  });
  console.log("searchDiaries results:", results); // Add this line
  return results;
};

export const uploadTimelineImage = async (timelineId, imageFile) => {
  const storageRef = storage.ref();
  const timelineImageRef = storageRef.child(`timeline-images/${timelineId}`);
  await timelineImageRef.put(imageFile);
  const url = await timelineImageRef.getDownloadURL();
  return url;
};

export const deleteTimelineImage = async (imageUrl) => {
  try {
    const fileRef = storage.refFromURL(imageUrl);
    await fileRef.delete();
    return true;
  } catch (error) {
    console.error("Error deleting timeline image:", error);
    return false;
  }
};

export const clear = () => {
  database = {
    timeline: [],
    diary: [],
  };
};
