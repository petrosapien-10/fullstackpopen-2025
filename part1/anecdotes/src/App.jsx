import { useState } from "react";

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const Header = ({ text }) => {
  return (
    <>
      <h1>{text}</h1>
    </>
  );
};

const Button = ({ text, onClick }) => {
  return <button onClick={onClick}>{text}</button>;
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));
  const [mostVote, setMostVote] = useState(0);

  const handleNext = () => {
    let randomNumber = 0;

    // a do-while loop to make sure we see a different anecdote
    do {
      randomNumber = getRandomInt(anecdotes.length);
    } while (randomNumber === selected);

    setSelected(randomNumber);
  };

  const handleVote = () => {
    const copy = [...votes];
    copy[selected] += 1;
    setVotes(copy);

    const max = Math.max(...copy);
    const indexOfMax = copy.indexOf(max);
    setMostVote(indexOfMax);
  };

  return (
    <>
      <Header text="Anecdote of the day" />
      <div>{anecdotes[selected]}</div>
      <div>
        has {votes[selected]} vote{votes[selected] > 1 ? "s" : ""}
      </div>
      <Button onClick={handleVote} text="vote" />
      <Button onClick={handleNext} text="next anecdote" />

      <Header text="Anecdote with most votes" />
      <div>{anecdotes[mostVote]}</div>
      <div>
        has {votes[mostVote]} vote{votes[mostVote] > 1 ? "s" : ""}
      </div>
    </>
  );
};

export default App;
