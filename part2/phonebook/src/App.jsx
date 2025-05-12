import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import personService from "./services/persons";
import "./index.css";

const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  return <div className={type}>{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newSearchName, setNewSearchName] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

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
        const existingPerson = persons.find(
          (person) => person.name.toLowerCase() === newName.toLowerCase()
        );

        const changedPerson = { ...existingPerson, number: newNumber };
        personService
          .update(existingPerson.id, changedPerson)
          .then((returnedPerson) => {
            console.log("Updated person: ", returnedPerson);

            setPersons(
              persons.map((person) =>
                person.id === returnedPerson.id ? returnedPerson : person
              )
            );

            setMessageType("success");
            setMessage(`Updated ${returnedPerson.name}`);

            setTimeout(() => {
              setMessageType(null);
              setMessage(null);
            }, 3000);

            setNewName("");
            setNewNumber("");
          })
          .catch((error) => {
            console.error("Error updating person: ", error);
            setMessageType("error");
            setMessage(
              `Information of ${changedPerson.name} has already been removed from server`
            );
            setTimeout(() => {
              setMessage(null);
              setMessageType(null);
            }, 3000);
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

        setMessageType("success");
        setMessage(`Added ${returnedPerson.name}`);

        setTimeout(() => {
          setMessageType(null);
          setMessage(null);
        }, 3000);
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

          setPersons(persons.filter((p) => p.id !== returnedPerson.id));

          setMessageType("success");
          setMessage(`Deleted ${returnedPerson.name}`);

          setTimeout(() => {
            setMessageType(null);
            setMessage(null);
          }, 3000);
        })
        .catch((error) => {
          console.error("Error deleting person: ", error);
          setMessageType("error");
          setMessage(
            `Information of ${person.name} has already been removed from server`
          );
          setTimeout(() => {
            setMessage(null);
            setMessageType(null);
          }, 3000);
        });
    } else {
      console.log("Person delete canceled");
    }
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} type={messageType} />
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
