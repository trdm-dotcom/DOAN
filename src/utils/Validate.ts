export const checkEmpty = (value: string, key: any) => {
  if (value === null || value === undefined || value.trim() === '') {
    return `${key}`;
  } else {
    return null;
  }
};

export const checkMinLength = (value: any, key: any, length: number) => {
  if (value.trim().length < length) {
    return `${key}`;
  } else {
    return null;
  }
};
