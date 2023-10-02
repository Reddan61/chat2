export const compareRegExp = (text: string, regExp: RegExp) => {
  const isEqual = regExp.test(text);

  regExp.lastIndex = 0;

  return isEqual;
};
