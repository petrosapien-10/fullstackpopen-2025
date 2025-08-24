import { type CoursePart } from "../types";
import { assertNever } from "../utils/assertNever";

interface PartProps {
  part: CoursePart;
}

export const Part = ({ part }: PartProps): React.JSX.Element => {
  switch (part.kind) {
    case "basic":
      return (
        <>
          <h3>
            {part.name} {part.exerciseCount}
          </h3>
          <p>{part.description}</p>
        </>
      );
    case "group":
      return (
        <>
          <h3>
            {part.name} {part.exerciseCount}
          </h3>
          <p>project exerciese {part.groupProjectCount}</p>
        </>
      );
    case "background":
      return (
        <>
          <h3>
            {part.name} {part.exerciseCount}
          </h3>
          <p>{part.description}</p>
          <p>submit to {part.backgroundMaterial}</p>
        </>
      );
    case "special":
      return (
        <>
          <h3>
            {part.name} {part.exerciseCount}
          </h3>
          <p>{part.description}</p>
          <p>required skills: {part.requirements.join(", ")} </p>
        </>
      );
    default:
      return assertNever(part);
  }
};
