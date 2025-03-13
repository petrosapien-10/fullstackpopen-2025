import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newSearchName, setNewSearchName] = useState("");

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      console.log("Fetched persons: ", initialPersons);
      setPersons(initialPersons);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    //check if the person is already in the list or not
    const personExisted = persons.some(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );

    if (personExisted) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one`
        )
      ) {
        const index = persons.findIndex(
          (person) => person.name.toLowerCase() === newName.toLowerCase()
        );

        const changedPerson = { ...persons[index], number: newNumber };
        personService
          .update(persons[index].id, changedPerson)
          .then((returnedPerson) => {
            console.log("Updated person: ", returnedPerson);
            setPersons(
              persons.map((person) => {
                return person.id === persons[index].id
                  ? returnedPerson
                  : person;
              })
            );

            setNewName("");
            setNewNumber("");
          });
      } else {
        console.log("Person update canceled");
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      };

      personService.create(personObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));

        setNewName("");
        setNewNumber("");
      });
    }
  };

  const handleNameChange = (event) => {
    console.log("name: ", event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    console.log("number:", event.target.value);
    setNewNumber(event.target.value);
  };

  const handleSearchNameChange = (event) => {
    console.log("searchName:", event.target.value);
    setNewSearchName(event.target.value);
  };

  const handleDeletePerson = (person) => {
    console.log(`person with id ${person.id} needs to be deleted`);
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
        .deletePerson(person.id)
        .then((returnedPerson) => {
          console.log("Deleted person", returnedPerson);
          setPersons(persons.filter((p) => p.id !== person.id));
        })
        .catch((error) => {
          console.error("Error deleting person: ", error);
        });
    } else {
      console.log("Person delete canceled");
    }
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter
        newSearchName={newSearchName}
        handleSearchNameChange={handleSearchNameChange}
      />

      <h2>Add a new contact</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        addPerson={addPerson}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      <Persons
        persons={persons}
        newSearchName={newSearchName}
        handleDeletePerson={handleDeletePerson}
      />
    </div>
  );
};

export default App;
