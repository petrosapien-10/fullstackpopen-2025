const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const phoneNumberValidator = number => {
  const parts = number.split('-')
  if (parts.length !== 2) {
    return false
  }
  if (!parts[0].match(/^\d{2,3}$/) || !parts[1].match(/^\d+$/)) {
    return false
  }

  return true
}


const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: phoneNumberValidator,
      message: props => `${props.value} is not a valid phone number!!!`
    },
    minLength: 8,
    required: true,
  }
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
