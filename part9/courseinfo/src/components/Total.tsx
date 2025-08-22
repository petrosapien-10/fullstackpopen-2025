interface TotalProps {
  totalExercises: number;
}

export const Total = (props: TotalProps): React.JSX.Element => {
  return <p>Number of exercises {props.totalExercises}</p>;
};
