import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAEZGFEmKvA3LVm36v_7qc3ZTTHAgSihyA",
  authDomain: "aural-skills-4828e.firebaseapp.com",
  databaseURL: "https://aural-skills-4828e-default-rtdb.firebaseio.com",
  projectId: "aural-skills-4828e",
  storageBucket: "aural-skills-4828e.firebasestorage.app",
  messagingSenderId: "252641250559",
  appId: "1:252641250559:web:2b819bd60ddd519fbd90ca",
  measurementId: "G-F4T01EF8V5"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db);

const solfegeScores = [];
const intervalsScores = [];

get(dbRef).then((snapshot) => {
  if (snapshot.exists()) {
    const data = snapshot.val();
    if ("solfege" in data) {
      for (const key in data["solfege"]) {
        const entry = data["solfege"][key];
        solfegeScores.push({
          name: entry["name"],
          score: entry["time"],
          time: key
        });
      }
    }
    solfegeScores.sort((a, b) => a["score"] - b["score"])

    if ("intervals" in data) {
      for (const key in data["intervals"]) {
        const entry = data["intervals"][key];
        intervalsScores.push({
          name: entry["name"],
          score: entry["time"],
          time: key
        });
      }
    }
    intervalsScores.sort((a, b) => a["score"] - b["score"])
    
    console.log(solfegeScores);
    console.log(intervalsScores);
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});