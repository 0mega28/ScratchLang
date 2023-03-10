import Token from '../common/token';
import TokenType from '../common/tokenType';

class RuntimeError extends Error {
  token: Token;
  constructor(token: Token, message: string) {
    super(message);
    this.token = token;
  }
}

export default RuntimeError;
