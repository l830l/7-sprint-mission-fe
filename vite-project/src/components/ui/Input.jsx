const Input = ({
  type = "text",
  placeholder,
  value,
  setValue,
  addClassName,
  id,
  onKeyPress,
  validation = {},
}) => {
  return (
    <input
      className={`form-control ${addClassName}`}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      id={id}
      autoComplete={type === "password" ? "new-password" : "off"}
      onKeyPress={onKeyPress}
      {...validation}
    />
  );
};

export default Input;
