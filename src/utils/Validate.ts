export const checkEmpty = (value: any, key: any) => {
  if (!value.trim()) {
    return `${key}`;
  } else {
    return '';
  }
};

export const checkMinLength = (value: any, key: any, length: number) => {
  if (value.trim().length < length) {
    return `${key}`;
  } else {
    return '';
  }
};
