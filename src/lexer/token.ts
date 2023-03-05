import TokenType from './tokenType';

type literal = string | number | null;

class Token {
  type: TokenType;
  lexeme: string;
  literal: literal;
  line: number;

  constructor(
    type: TokenType,
    lexeme: string,
    literal: string | number | null,
    line: number
  ) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }
}

export default Token;
export {literal};
