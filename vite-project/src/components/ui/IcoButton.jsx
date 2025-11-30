const Button = ({ icoClass, addClassName = "", onClick, title = "" }) => {
  return (
    <>
      <button
        className={`btn btn-ico-only ${addClassName}`}
        onClick={onClick}
        title={title}
      >
        <i className={`bi ${icoClass}`} />
      </button>
    </>
  );
};

export default Button;
