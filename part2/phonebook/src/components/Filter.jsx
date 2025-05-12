const Filter = ({ newSearchName, handleSearchNameChange }) => {
  return (
    <div>
      filter shown with:
      <input value={newSearchName} onChange={handleSearchNameChange} />
    </div>
  );
};

export default Filter;

