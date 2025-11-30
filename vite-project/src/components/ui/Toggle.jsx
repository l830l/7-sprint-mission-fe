const Toggle = ({ id, checked, onChange, text }) => {
  return (
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
      />
      {text && (
        <label className="form-check-label" htmlFor={id}>
          {text}
        </label>
      )}
    </div>
  );
};

export default Toggle;
