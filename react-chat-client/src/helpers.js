import moment from "moment";

export function formatTime(doc = {}) {
  doc.time = moment(doc.time.toString(), "ddd MMM DD YYYY, HH:mm:ss ZZ").format(
    "YYYY-MM-DD HH:mm:ss"
  );
  return doc;
}

function formatDateTerm(date) {
  const originFormat = "YYYY-MM-DD HH:mm:ss";
  const formatedDate = moment(date, originFormat).format("YYYY-MM-DD");
  const year = moment(date, originFormat).format("YYYY");
  const today = moment().format("YYYY-MM-DD");
  const yesterday = moment()
    .subtract(1, "d")
    .format("YYYY-MM-DD");
  const thisYear = moment().format("YYYY");
  if (year === thisYear) {
    switch (formatedDate) {
      case today:
        return "Today";
      case yesterday:
        return "Yesterday";
      default:
        return moment(date, originFormat).format("MMM Do");
    }
  }
  return moment(date, originFormat).format("MMM Do YYYY");
}

export const groupChats = (chats = []) => {
  let formattedChats = chats.map(chat => {
    chat.date = formatDateTerm(chat.time);
    chat.time = `${chat.date}, ${moment(
      chat.time,
      "YYYY-MM-DD HH:mm:ss"
    ).format("HH:mm:ss")}`;
    return chat;
  });

  let allDates = chats.map(chat => chat.date);
  let uniqueDates = allDates.filter(
    (date, index) => allDates.indexOf(date) === index
  );
  let chatsPerDate = uniqueDates.map(date => ({
    date,
    chats: formattedChats.filter(chat => chat.date === date)
  }));
  return chatsPerDate;
};