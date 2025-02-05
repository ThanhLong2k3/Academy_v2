import moment from 'moment';

export const formatDate = (
    inputDate: string | string[],
    fromFormat: string = 'DD/MM/YYYY',
    toFormat: string = 'YYYY-MM-DD',
) => {
    // Parse the input date using moment and specify the input format
    const date = moment(inputDate, fromFormat);

    // Format the date in the desired format
    const formattedDate = date.format(toFormat);

    return formattedDate;
};
