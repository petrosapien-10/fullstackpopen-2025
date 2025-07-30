// underweight range  < 18.5
// normal range: 18.5 - 24.9
// overweight range: 25 - 29.9
// obese range: > 30

//BMI formula: bmi = weight(kg) / ((height(m))**2)

interface BodyValues {
  height: number;
  weight: number;
}

export const parseArguments = (args: string[]): BodyValues => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    };
  } else {
    throw new Error("Provided height and weight were not numbers!");
  }
};

export const calculateBmi = (height: number, weight: number): string => {
  const bmi = weight / (height / 100) ** 2;

  if (height <= 0 || weight <= 0) {
    throw new Error("Height and weight must be positive numbers!");
  }

  if (bmi < 18.5) {
    return "Underweight";
  } else if (bmi < 25) {
    return "Normal weight";
  } else if (bmi < 30) {
    return "Overweight";
  } else {
    return "Obese";
  }
};

try {
  const { height, weight } = parseArguments(process.argv);
  console.log(calculateBmi(height, weight));
} catch (error: unknown) {
  let errorMessage = "something went wrong: ";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}
