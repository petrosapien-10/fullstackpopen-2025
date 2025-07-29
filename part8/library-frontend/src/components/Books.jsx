import { useQuery, useSubscription } from "@apollo/client";
import { ALL_BOOKS, ALL_BOOKS_BY_GENRE, BOOK_ADDED } from "../queries";
import { useState } from "react";
import { useApolloClient } from "@apollo/client";

export const updateCache = (cache, query, addedBook) => {
  const uniqById = (a) => {
    const seen = new Set();
    return a.filter((book) => {
      const id = book.id;
      return seen.has(id) ? false : seen.add(id);
    });
  };

  cache.updateQuery(query, (data) => {
    if (!data) return;

    return {
      allBooks: uniqById(data.allBooks.concat(addedBook)),
    };
  });
};

const Books = (props) => {
  const [genre, setGenre] = useState("");
  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded;
      props.setError(
        `New book added: ${addedBook.title} by ${addedBook.author.name}`
      );
      updateCache(
        client.cache,
        { query: ALL_BOOKS_BY_GENRE, variables: { genre } },
        addedBook
      );
    },
  });

  const allBooksByGenreResult = useQuery(ALL_BOOKS_BY_GENRE, {
    variables: { genre },
    skip: !props.show,
  });

  const allBooksResult = useQuery(ALL_BOOKS);

  if (!props.show) return null;
  if (allBooksByGenreResult.loading || allBooksResult.loading)
    return <div>Loading...</div>;
  if (allBooksByGenreResult.error || allBooksResult.error)
    return <div>Error loading books</div>;

  const books = allBooksByGenreResult.data?.allBooks || [];
  const allBooks = allBooksResult.data?.allBooks || [];

  const allGenres = [...new Set(allBooks.flatMap((book) => book.genres))];

  return (
    <div>
      <h2>books</h2>
      <p>
        in genre <strong>{genre || "all"}</strong>
      </p>

      <table>
        <thead>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {/*genre === "" makes the backend skip filtering, so all books are returned*/}
        <button onClick={() => setGenre("")}>All genres</button>
        {allGenres.map((genreOption) => (
          <button
            key={genreOption}
            value={genreOption}
            onClick={(e) => {
              const selectedGenre = e.target.value;
              setGenre(selectedGenre);
              allBooksByGenreResult.refetch({ genre: selectedGenre });
            }}
          >
            {genreOption}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Books;
