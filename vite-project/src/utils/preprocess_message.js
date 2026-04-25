import { formatMessageDate } from "./format_data";

export const preprocessMessages = (messages) => {
  let lastDate = null;
  return messages?.map((msg) => {
    const dateLabel = formatMessageDate(msg.createAt);
    const isNewDate = dateLabel !== lastDate;

    if (isNewDate) lastDate = dateLabel;

    return {
      ...msg,
      dateLabel,
      shouldShowDateLabel: isNewDate,
    };
  });
};