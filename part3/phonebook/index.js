require("dotenv").config();

const express = require("express");

const morgan = require("morgan");
const app = express();
const cors = require("cors");

const Person = require("./models/person");

app.use(express.json());
app.use(cors());

morgan.token("data", (req) => {
  if (req.body && Object.keys(req.body).length > 0) {
    return JSON.stringify(req.body);
  }
  return "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

app.use(express.static("dist"));

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response) => {
  const date = new Date();
  response.json(`Phone book has info for ${persons.length} people${date}`);
});

// app.get("/api/persons/:id", (request, response) => {
//   const id = request.params.id;
//   const person = persons.find((person) => person.id === id);
//   if (person) {
//     response.json(person);
//   } else {
//     response.json(404).end();
//   }
// });

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
});

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;

  const isMissingName = !name;
  const isMissingNumber = !number;

  if (isMissingName) {
    return response.status(400).json({ error: "name is missing" });
  }

  if (isMissingNumber) {
    return response.status(400).json({ error: "number is missing" });
  }

  const isExisted = persons.find((person) => person.name === name);

  if (isExisted) {
    return response.status(400).json({ error: "name must be unique" });
  }

  const person = new Person({
    name,
    number,
  })

  person.save().then((result) => {
    console.log(`Added ${result.name} number ${result.name} to phonebook`);
  });

  response.json(person);
});

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknow endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'mailformatted id' })
  }

  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
