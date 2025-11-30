export const highlightText = (text, keyword) => {
  if (!keyword || keyword.trim() === "") return text;

  const regex = new RegExp(`(${keyword})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) =>
    part.toLowerCase().includes(keyword.toLowerCase()) ? (
      <span key={i} className="highlight">
        {part}
      </span>
    ) : (
      part
    )
  );
};
