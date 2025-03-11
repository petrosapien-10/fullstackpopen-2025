import Person from "./Person";

const Persons = ({ persons, newSearchName }) => {
  return (
    <div>
      {persons
        .filter((person) => {
          return person.name
            .toLowerCase()
            .includes(newSearchName.toLocaleLowerCase());
        })
        .map((person) => (
          <Person key={person.id} person={person} />
        ))}
    </div>
  );
};

export default Persons;
