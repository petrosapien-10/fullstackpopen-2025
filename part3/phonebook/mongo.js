const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const personName = process.argv[3];

const personNumber = process.argv[4];

const url = `mongodb+srv://longnn:${password}@cluster0.txrkk.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("phonebook: ");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}

if (process.argv.length === 5) {
  const person = new Person({
    name: personName,
    number: personNumber,
  });

  person.save().then((result) => {
    console.log(`Added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}
