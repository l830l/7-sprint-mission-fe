export const formatMessageDate = (dateString) => {
  const date = new Date(dateString.replace(" ", "T"));
  const today = new Date();

  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  if (isToday) return "오늘";
  if (isYesterday) return "어제";

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};
