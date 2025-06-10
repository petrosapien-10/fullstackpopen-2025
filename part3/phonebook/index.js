const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

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
  response.json(persons);
});

app.get("/info", (request, response) => {
  const date = new Date();
  response.json(`Phone book has info for ${persons.length} people${date}`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.json(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const { name, number, id } = request.body;

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

  const person = {
    id,
    name,
    number,
  };

  persons = persons.concat(person);
  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
