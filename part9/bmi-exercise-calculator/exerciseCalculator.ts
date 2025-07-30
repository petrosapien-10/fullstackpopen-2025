interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ExerciseInput {
  target: number;
  dailyHours: number[];
}

export const parseArguments = (args: string[]): ExerciseInput => {
  if (args.length < 4) {
    throw new Error(
      "Not enough arguments. Provide a target and at least one day of training data."
    );
  }

  const values = args.slice(2).map((value) => Number(value));

  if (values.some(isNaN)) {
    throw new Error("All provided values must be numbers.");
  }

  const [target, ...dailyHours] = values;

  return {
    target,
    dailyHours,
  };
};

export const calculateExercises = (
  values: number[],
  target: number
): Result => {
  const periodLength = values.length;
  const trainingDays = values.filter((value) => value > 0).length;
  const average = values.reduce((sum, value) => sum + value, 0) / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average >= target) {
    rating = 3;
    ratingDescription = "Well done, you met the target";
  } else if (average >= target * 0.5) {
    rating = 2;
    ratingDescription = "Not too bad but could be better";
  } else {
    rating = 1;
    ratingDescription = "You need to train more";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

try {
  const { target, dailyHours } = parseArguments(process.argv);
  console.log(calculateExercises(dailyHours, target));
} catch (error: unknown) {
  let errorMessage = "something went wrong: ";
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}
