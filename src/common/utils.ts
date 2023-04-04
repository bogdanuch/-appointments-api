/** Used to remove time from date and convert it to string format */
export function dateTransformer(date: string | Date) {
  const dateObject = new Date(date);
  return (
    dateObject.getFullYear() +
    '.' +
    (dateObject.getMonth() + 1 > 9
      ? dateObject.getMonth() + 1
      : `0${dateObject.getMonth() + 1}`) +
    '.' +
    (dateObject.getDate() > 9
      ? dateObject.getDate()
      : `0${dateObject.getDate()}`)
  );
}
