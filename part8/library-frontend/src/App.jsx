import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import { useApolloClient } from "@apollo/client";
import Recommendations from "./components/Recommendations";

const App = () => {
  const [page, setPage] = useState("authors");
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  console.log("token: ", token);

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>

        {token && <button onClick={() => setPage("add")}>add book</button>}

        {!token ? (
          <button onClick={() => setPage("login")}>login</button>
        ) : (
          <>
            <button onClick={() => setPage("recommendations")}>
              recommendations
            </button>
            <button onClick={logout}>logout</button>
          </>
        )}
      </div>

      <Notify errorMessage={errorMessage} />

      <Authors show={page === "authors"} setError={notify} />

      <Books show={page === "books"} setError={notify} />

      {!token && (
        <Login
          show={page === "login"}
          setToken={setToken}
          setError={notify}
          setPage={setPage}
        />
      )}

      {token && <NewBook show={page === "add"} setError={notify} />}
      {token && <Recommendations show={page === "recommendations"} />}
    </div>
  );
};

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null;
  }
  return <div style={{ color: "red" }}>{errorMessage}</div>;
};

export default App;
