import Person from "./Person";

const Persons = ({ persons, newSearchName, handleDeletePerson }) => {
  return (
    <div>
      {persons
        .filter((person) => {
          return person.name
            .toLowerCase()
            .includes(newSearchName.toLocaleLowerCase());
        })
        .map((person) => (
          <Person
            key={person.id}
            person={person}
            handleDeletePerson={handleDeletePerson}
          />
        ))}
    </div>
  );
};

export default Persons;
