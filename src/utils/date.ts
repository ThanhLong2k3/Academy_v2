import moment from 'moment';

export const formatDate = (
  inputDate: string | null | undefined,
  fromFormat = 'DD/MM/YYYY',
  toFormat = 'YYYY-MM-DD',
): string | null => {
  if (!inputDate) return null;

  const date = moment(inputDate, fromFormat);

  if (!date.isValid()) {
    console.warn(`Invalid date: ${inputDate}`);
    return null;
  }

  return date.format(toFormat);
};
