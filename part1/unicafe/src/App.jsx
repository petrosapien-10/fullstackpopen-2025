import { useState } from "react";

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>
        {value} {text === "positive" ? " %" : ""}
      </td>
    </tr>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad;
  const average = ((good * 1 + neutral * 0 + bad * -1) / all).toFixed(1);
  const positive = ((good / all) * 100).toFixed(1);

  if (all > 0) {
    return (
      <table border="7">
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={positive} />
        </tbody>
      </table>
    );
  }
  return <div>No feedback given</div>;
};

const Table = () => {};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleClick = (value) => {
    if (value === "good") {
      const updateGood = good + 1;
      setGood(updateGood);
      console.log("good is clicked");
      console.log("good count: ", good);
    }
    if (value === "neutral") {
      const updatedNeutral = neutral + 1;
      setNeutral(updatedNeutral);
      console.log("neutral is clicked");
      console.log("neutral count: ", neutral);
    }
    if (value === "bad") {
      const updatedBad = bad + 1;
      setBad(updatedBad);
      console.log("bad is clicked");
      console.log("bad count: ", bad);
    }
  };

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => handleClick("good")} text="good" />
      <Button onClick={() => handleClick("neutral")} text="neutral" />
      <Button onClick={() => handleClick("bad")} text="bad" />

      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
