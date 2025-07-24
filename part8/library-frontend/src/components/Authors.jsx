import { useQuery, useMutation } from "@apollo/client";
import { ALL_AUTHORS, SET_BIRTH_YEAR } from "../queries";
import { useEffect, useState } from "react";
const Authors = ({ show, setError }) => {
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");

  const [editAuthor, editAuthorResult] = useMutation(SET_BIRTH_YEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  useEffect(() => {
    if (editAuthorResult.data && editAuthorResult.data.editAuthor === null) {
      setError("author not found");
    }
  }, [editAuthorResult.data, setError]);

  const getAllAuthorsResult = useQuery(ALL_AUTHORS);

  if (getAllAuthorsResult.loading) {
    return <div>Loading...</div>;
  }
  if (!show) {
    return null;
  }

  const authors = getAllAuthorsResult.data.allAuthors;

  const submit = async (event) => {
    event.preventDefault();
    console.log(name, typeof name);
    console.log(birthYear, typeof Number(birthYear));
    editAuthor({ variables: { name, setBornTo: Number(birthYear) } });

    setName("");
    setBirthYear("");
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Set birth year</h3>
      <form action="submit" onSubmit={submit}>
        {/* <div>
          name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div> */}
        <select value={name} onChange={(event) => setName(event.target.value)}>
          <option value="">choose an author:</option>
          {authors.map((author) => {
            return (
              <option key={author.name} value={author.name}>
                {author.name}
              </option>
            );
          })}
        </select>
        <div>
          born
          <input
            type="number"
            value={birthYear}
            onChange={(event) => setBirthYear(event.target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
