const Button = ({ text, addClassName = "", onClick }) => {
  return (
    <>
      <button className={`btn ${addClassName}`} onClick={onClick}>
        {text}
      </button>
    </>
  );
};

export default Button;
