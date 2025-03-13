const Person = ({ person, handleDeletePerson }) => {
  return (
    <div>
      {person.name} {person.number}
      <button onClick={() => handleDeletePerson(person)}>delete</button>
    </div>
  );
};

export default Person;
