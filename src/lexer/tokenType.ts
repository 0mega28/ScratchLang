enum TokenType {
  /* Single character token */
  LEFT_PARAM,
  RIGHT_PARAM,
  LEFT_BRACE,
  RIGHT_BRACE,
  COMMA,
  DOT,
  MINUS,
  PLUS,
  STAR,
  SLASH,
  SEMICOLON,

  /* One or two character token */
  BANG,
  BANG_EQUAL,
  EQUAL,
  EQUAL_EQUAL,
  GREATER,
  GREATER_EQUAL,
  LESS,
  LESS_EQUAL,

  /* Literals */
  IDENTIFIER,
  STRING,
  NUMBER,

  /* Keywords */
  AND,
  CLASS,
  ELSE,
  FALSE,
  FUN,
  FOR,
  IF,
  NIL,
  OR,
  PRINT,
  RETURN,
  SUPER,
  THIS,
  TRUE,
  VAR,
  WHILE,

  EOF,
}

export default TokenType;
