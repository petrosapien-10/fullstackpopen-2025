import { useQuery } from "@apollo/client";
import { ME, ALL_BOOKS_BY_GENRE } from "../queries";

const Recommendations = ({ show }) => {
  const meResult = useQuery(ME);

  const favoriteGenre = meResult.data?.me?.favoriteGenre || "";

  const allBooksByGenreResult = useQuery(ALL_BOOKS_BY_GENRE, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre || !show,
  });

  if (!show) return null;
  if (meResult.loading || allBooksByGenreResult.loading)
    return <div>Loading...</div>;
  if (meResult.error || allBooksByGenreResult.error)
    return <div>Error loading data</div>;

  if (!favoriteGenre) {
    return <div>No favorite genre set for this user.</div>;
  }

  const recommendedBooks = allBooksByGenreResult.data?.allBooks || [];

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        Books in your favorite genre: <strong>{favoriteGenre}</strong>
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
          {recommendedBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;
