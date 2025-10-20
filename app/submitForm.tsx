import { useState } from 'react';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";

import { timerString } from './stopwatch';

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

export default function SubmitForm({ activity, score }) {

  const [name, setName] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [highScore, setHighScore] = useState(null);
  
  const getHighScore = () => {
    get(ref(db)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (activity in data) {
          let highScoreTemp = null;
          for (const key in data[activity]) {
            const entry = data[activity][key];
            if (!highScoreTemp || entry["time"] < highScoreTemp["score"]) {
              highScoreTemp = {
                name: entry["name"],
                score: entry["time"],
                time: key
              };
            }
          }
          setHighScore(highScoreTemp);
        }

      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!submitted && name && name.length > 0) {
      const currTime = new Date();
      set(ref(db, `${activity}/` + currTime), {
        time: score,
        name: name
      })
      .then(() => {
        console.log("Score uploaded");
        getHighScore();
      })
      .catch((error) => {
        console.log(error);
      });
      setSubmitted(true);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-10 sm:mt-30 flex flex-col sm:flex-row items-center text-white">
        <label for="name" className="text-xl text-white">Name</label>
        <div className="mt-5 sm:mt-0 rounded-md ml-8 bg-white/5 pl-3 outline-1 -outline-offset-1 outline-gray-600 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-500">
          <input
            autoFocus
            onChange={(e) => setName(e.target.value)}
            id="name"
            name="name"
            type="text"
            placeholder=""
            className="block text-3xl w-70 h-15 min-w-0 grow bg-gray-800 py-1.5 pr-3 pl-1 text-white placeholder:text-gray-500 focus:outline-none"
          />
        </div>
        <div className="ml-8 mt-5 sm:mt-0">
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <svg className="w-10 h-10" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
            <span className="sr-only">Submit</span>
          </button>
        </div>
      </div>
      <p className="text-xl mt-5 text-center text-white">
        {
          submitted ? 
            <div>
              <p>Submitted</p>
              {
                highScore ? 
                  <p className="mt-5 sm:mt-10">High Score: {highScore["name"]}, {timerString(highScore["score"])}</p>
                : null
              }
            </div>
          : null 
        }
      </p>
    </form>
  );
}