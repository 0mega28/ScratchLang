function isAlpha(char: string): boolean {
  return /([a-z])|([A-Z])|(_)/.test(char);
}

function isDigit(char: string): boolean {
  return /\d/.test(char);
}

function isAplhaNumeric(char: string): boolean {
  return isDigit(char) || isAlpha(char);
}

export {isAlpha, isDigit, isAplhaNumeric};
