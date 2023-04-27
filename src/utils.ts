export const dateFormat = (timestamp: number) => {
  const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds

  const month = date.getUTCMonth(); // Get month index (0-11)
  const day = date.getUTCDate(); // Get day of the month (1-31)

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const formattedDate = `${monthNames[month]} ${day}`;
  return formattedDate;
};
