import { useEffect, useState } from "react";
import "./App.css";
import { Visibility, type DiaryEntry, Weather } from "./types";
import { createDiaryEntry, getAllDiaryEntries } from "./diaryService";

function App() {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState("");
  const [visibility, setVisibility] = useState("");
  const [weather, setWeather] = useState("");
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>();

  useEffect(() => {
    getAllDiaryEntries().then((data) => {
      setDiaryEntries(data);
    });
  }, []);

  const diaryEntryCreation = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const data = await createDiaryEntry({
        date,
        visibility,
        weather,
        comment,
      });
      if (data) {
        setDiaryEntries(diaryEntries.concat(data));
        setErrorMessage(null);
        setDate("");
        setVisibility("");
        setWeather("");
        setComment("");
      }
    } catch (error: unknown) {
      if (typeof error === "string") {
        setErrorMessage(error);
      } else {
        setErrorMessage("Unknown error");
      }
    }
  };

  return (
    <div>
      <h2>Add new entry</h2>
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}

      <form onSubmit={diaryEntryCreation}>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        <div>
          <div>
            <label>Visibility:</label>
            {Object.values(Visibility).map((v) => (
              <label key={v}>
                <input
                  type="radio"
                  name="visibility"
                  value={v}
                  checked={visibility === v}
                  onChange={() => setVisibility(v)}
                />
                {v}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label>Weather:</label>
          {Object.values(Weather).map((w) => (
            <label key={w}>
              <input
                type="radio"
                name="weather"
                value={w}
                checked={weather === w}
                onChange={() => setWeather(w)}
              />
              {w}
            </label>
          ))}
        </div>
        <div>
          comment:{" "}
          <input
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </div>
        <button type="submit">add</button>
      </form>

      <h2>Diary Entries</h2>

      {diaryEntries.map((entry) => (
        <div key={entry.id}>
          <h3>{entry.date}</h3>
          <p>visibility: {entry.visibility}</p>
          <p>weather: {entry.weather}</p>
          <p>comment: {entry.comment}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
