import type { Route } from "./+types/solfege";
import { useState, useEffect, useRef } from 'react';
import { timerString, Stopwatch } from '../stopwatch';
import SubmitForm from '../submitForm';

const CHORDS = new Map([
  ["I", "do mi so"],
  ["i", "do me so"],
  ["V", "so ti re"],
  ["IV", "fa la do"],
  ["iv", "fa le do"],
  ["ii", "re fa la"],
  ["ii°", "re fa le"],
  ["vi", "la do mi"],
  ["VI", "le do me"],
  ["iii", "mi so ti"],
  ["III", "me so te"],
  ["vii°", "ti re fa"],
  ["VII", "te re fa"],
  ["V7", "so ti re fa"],
  ["vii°7", "ti re fa le"],
  ["ii7", "re fa la do"],
  ["ii𝆩7", "re fa le do"],
  ["iv7", "fa le do me"],
  ["N", "ra fa le"],
  ["V/V", "re fi la"],
  ["V/IV", "do mi so"],
  ["V/ii", "la di mi"],
  ["V/vi", "mi si ti"],
  ["V/VI", "me so te"],
  ["V/iii", "ti ri fi"],
  ["V/III", "te re fa"],
  ["V/VII", "fa la do"],
  ["V7/V", "re fi la do"],
  ["V7/IV", "do mi so te"],
  ["V7/ii", "la di mi so"],
  ["V7/vi", "mi si ti re"],
  ["V7/VI", "me so te ra"],
  ["V7/iii", "ti ri fi la"],
  ["V7/III", "te re fa le"],
  ["V7/VII", "fa la do me"],
]);

const chordsArray = [...CHORDS.entries()];

const NUMCHORDS = 15; // has to be less than chordsArray.length

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Aural Skills Solfege" },
    { name: "description", content: "Solfege practice" },
  ];
}

export default function Solfege() {
  const [started, setStarted] = useState(false);
  const [showStopwatch, setShowStopwatch] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [count, setCount] = useState(1);
  const [chord, setChord] = useState("");
  const [currentChordIndex, setCurrentChordIndex] = useState(-1);
  const [seenChordIndices, setSeenChordIndices] = useState<number[]>([]);
  const [inversion, setInversion] = useState("");
  const [secondary, setSecondary] = useState("");
  const [solfege, setSolfege] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [time, setTime] = useState(null);

  const solfege1Ref = useRef(null);
  const solfege2Ref = useRef(null);
  const solfege3Ref = useRef(null);
  const solfege4Ref = useRef(null);
  const inputRefs = [solfege1Ref, solfege2Ref, solfege3Ref, solfege4Ref];
  const submitButtonRef = useRef(null);

  useEffect(() => {
    selectChord();
  }, [count]);

  const clearInputsAndChords = () => {
    inputRefs.forEach((ref) => {
      if (ref && ref.current) {
        ref.current.value = "";
      }
    });
    setInversion("");
    setSecondary("");
  }

  const checkInputs = () => {
    for (let i = 0; i < solfege.length; i++) {
      if (inputRefs[i] && inputRefs[i].current && inputRefs[i].current.value.toLowerCase() != solfege[i]) return false;
    }
    if (solfege.length == 3 && solfege4Ref && solfege4Ref.current && solfege4Ref.current.value != "") return false;
    
    return true;
  }

  const selectChord = () => {
    console.log(seenChordIndices);
    const randomWindow = chordsArray.length - 2 * (NUMCHORDS - 1);
    let randomIndex = Math.floor(Math.random() * randomWindow) + 2 * (count - 1);
    while (seenChordIndices.includes(randomIndex)) {
      randomIndex = Math.floor(Math.random() * randomWindow) + 2 * (count - 1);
    }
    console.log(randomIndex);
    setCurrentChordIndex(randomIndex);

    const newChord = chordsArray[randomIndex];
    let chordStr = newChord[0];
    const solfegeArray = newChord[1].split(" ");
    let i = chordStr.indexOf("/");
    if (i != -1) {
      setSecondary(chordStr.substring(i + 1, chordStr.length));
      chordStr = chordStr.substring(0, i);
    }
    let inversions = ["", "6", "64"];
    if (chordStr[chordStr.length - 1] == "7") {
      setChord(chordStr.substring(0, chordStr.length - 1));
      inversions = ["7", "65", "43", "42"];
    }
    else {
      if (chordStr == "N") {
        inversions = ["", "6"];
      }
      setChord(chordStr);
    }

    let randomInvIndex = Math.floor(Math.random() * Math.min(Math.floor(count / 2), inversions.length));
    setInversion(inversions[randomInvIndex]);
    const invertedSolfegeArray = [];
    for (let x = 0; x < solfegeArray.length; x++) {
      invertedSolfegeArray.push(solfegeArray[(randomInvIndex + x) % solfegeArray.length]);
    }

    setSolfege(invertedSolfegeArray);
  }

  const handleChange = (e, nextInputRef) => {
    const { value, maxLength } = e.target;

    if (value.length === maxLength && nextInputRef && nextInputRef.current) {
      nextInputRef.current.focus();
    }
  };

  const handleKeyPress = (e, prevInputRef) => {
    const { value, maxLength } = e.target;

    if (e.key === 'Backspace' && value.length === 0 && prevInputRef && prevInputRef.current) {
      prevInputRef.current.focus();
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
      if (checkInputs()) {
        setError(false);
        if (count == NUMCHORDS) {
          setShowSubmitForm(true);
          setStarted(false);
          setShowStopwatch(false);
        }
        else {
          clearInputsAndChords();
          setSeenChordIndices([...seenChordIndices, currentChordIndex])
          setCount(count + 1);
          if (solfege1Ref.current) solfege1Ref.current.focus();
        }
      }
      else {
        setError(true);
      }
  }

  const chordSymbol = () => {
    const chord_split = chord.split(' ');
    return (
      <div className="flex justify-center font-serif">
        <p className="text-9xl text-center">
          {chord_split[0]}
        </p>
        <p className="flex flex-col ml-3 text-5xl font-semibold text-wrap w-2 h-10">
          <span>
          {
            inversion.length > 0 ? inversion[0] : null
          }
          </span>
          <span>
          {
            inversion.length > 1 ? inversion[1] : null
          }
          </span>
        </p>
        {
          secondary !== "" ? 
            <p className="ml-6 text-9xl text-center">
              /{secondary}
            </p>
          : null
        }
      </div>
    )
    
  }

  const getInputFieldClasses = () => {
    let classes = "rounded-md ml-8 bg-white/5 pl-3 outline-1 -outline-offset-1 outline-gray-600 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-500";
    if (error) classes = classes + " outline-red-500";
    return classes;
  }

  const inputFieldTextClasses = "block text-6xl w-25 h-20 min-w-0 grow bg-gray-800 py-1.5 pr-3 pl-1 text-white placeholder:text-gray-500 focus:outline-none";

  const onStopwatchChange = (timeMs: number) => {
    setTime(timeMs);
  }

  return (
    <div className="flex h-screen justify-center">
      <div className="mt-20">
        {
          showStopwatch ?
            <Stopwatch onChange={onStopwatchChange} />
          :
            time ?
              <div className="m-20 text-5xl text-white">{timerString(time)}</div>
            : null
        }
        {
          started ? 
            <div>
              {count}
              {chordSymbol()}
              <form onSubmit={handleSubmit}>
                <div className="mt-50 flex items-center">
                  <div className={getInputFieldClasses()}>
                    <input
                      ref={solfege1Ref}
                      onChange={(e) => handleChange(e, solfege2Ref)}
                      onKeyDown={(e) => handleKeyPress(e, null)}
                      autoFocus
                      maxLength="2"
                      id="solfege1"
                      name="solfege1"
                      type="text"
                      placeholder=""
                      className={inputFieldTextClasses}
                    />
                  </div>
                  <div className={getInputFieldClasses()}>
                    <input
                      ref={solfege2Ref}
                      onChange={(e) => handleChange(e, solfege3Ref)}
                      onKeyDown={(e) => handleKeyPress(e, solfege1Ref)}
                      maxLength="2"
                      id="solfege2"
                      name="solfege2"
                      type="text"
                      placeholder=""
                      className={inputFieldTextClasses}
                    />
                  </div>
                  <div className={getInputFieldClasses()}>
                    <input
                      ref={solfege3Ref}
                      onChange={(e) => handleChange(e, solfege4Ref)}
                      onKeyDown={(e) => handleKeyPress(e, solfege2Ref)}
                      maxLength="2"
                      id="solfege3"
                      name="solfege3"
                      type="text"
                      placeholder=""
                      className={inputFieldTextClasses}
                    />
                  </div>
                  <div className={getInputFieldClasses()}>
                    <input
                      ref={solfege4Ref}
                      onChange={(e) => handleChange(e, submitButtonRef)}
                      onKeyDown={(e) => handleKeyPress(e, solfege3Ref)}
                      maxLength="2"
                      id="solfege4"
                      name="solfege4"
                      type="text"
                      placeholder=""
                      className={inputFieldTextClasses}
                    />
                  </div>
                </div>
                <div className="mt-15 flex justify-center">
                  <button
                    type="submit"
                    ref={submitButtonRef}
                    onKeyDown={(e) => handleKeyPress(e, solfege4Ref)}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    <svg className="w-10 h-10" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                    <span className="sr-only">Submit</span>
                  </button>
                </div>
              </form>
            </div>
          : 
            <div>
              {
                showSubmitForm ?
                  <div>
                    <SubmitForm activity="solfege" score={time} />
                  </div>
                :
                  null
              }
              <button onClick={() => {
                  clearInputsAndChords();
                  setSeenChordIndices([]);
                  setCount(1);
                  setStarted(true);
                  setShowStopwatch(true);
                  setTime(null);
                }}
                type="button" style={{ cursor: 'pointer' }} autoFocus className="mt-20 text-white p-6 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-4xl p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                START
                <span className="sr-only">Submit</span>
              </button>
            </div>
        }
      </div>
    </div>
  );
}
