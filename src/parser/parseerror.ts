import Token from '../common/token';
import error from '../error';

class ParseError extends Error {
  public static error(token: Token, message: string): ParseError {
    error(token.line, message);

    return new ParseError();
  }
}

export default ParseError;
