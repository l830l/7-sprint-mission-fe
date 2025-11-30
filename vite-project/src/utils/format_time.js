export const formatKoreanTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString.replace(" ", "T")); // Safari 호환용
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return formatter.format(date); // "오후 9:00"
};
