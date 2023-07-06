export const extractedDate = (imagePath: string) => {
  if (imagePath.length) {
    const fileName = imagePath.substring(imagePath.lastIndexOf('/') + 1);
    const dateInNumber = parseInt(
      fileName.substring(fileName.indexOf('_') + 1, fileName.indexOf('.')),
    );
    return dateInNumber;
  }
};

export const getFormattedDate = (timestamp: number | undefined) => {
  if (typeof timestamp === 'number') {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
  }
  return '';
};

export const getArrayNumberToFill = (length: number): number => {
  const remainder = length % 3;
  if (remainder === 0) {
    return 0;
  } else if (remainder === 1) {
    return 2;
  } else {
    return 1;
  }
};
