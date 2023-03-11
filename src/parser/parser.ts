import Token from '../common/token';
import TokenType from '../common/tokenType';
import ParseError from '../error/parseerror';
import {
  literalType,
  Expr,
  Binary,
  Unary,
  Literal,
  Grouping,
} from '../syntaxtree/expr';

/**
 * expression     → equality ;
 * equality       → comparison ( ( "!=" | "==" ) comparison )* ;
 * comparison     → term ( ( ">" | ">=" | "<" | "<=" ) term )* ;
 * term           → factor ( ( "-" | "+" ) factor )* ;
 * factor         → unary ( ( "/" | "*" ) unary )* ;
 * unary          → ( "!" | "-" ) unary | primary ;
 * primary        → NUMBER | STRING | "true" | "false" | "nil" | "(" expression ")" ;
 */
class Parser {
  private tokens: Token[];
  private current: number;
  static literalMap: Map<TokenType, literalType> = new Map();

  static {
    this.literalMap.set(TokenType.TRUE, true);
    this.literalMap.set(TokenType.FALSE, false);
    this.literalMap.set(TokenType.NIL, null);
  }

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.current = 0;
  }

  public parse() {
    try {
      return Promise.resolve(this.expression());
    } catch (error) {
      if (error instanceof ParseError) {
        return Promise.reject(error);
      } else {
        throw error;
      }
    }
  }

  private expression(): Expr {
    return this.equality();
  }

  private equality(): Expr {
    let expr: Expr = this.comparision();

    while (
      this.match(TokenType.BANG_EQUAL) ||
      this.match(TokenType.EQUAL_EQUAL)
    ) {
      const operator: Token = this.previous();
      const right: Expr = this.comparision();

      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  comparision(): Expr {
    let expr: Expr = this.term();

    while (
      this.match(TokenType.GREATER) ||
      this.match(TokenType.GREATER_EQUAL) ||
      this.match(TokenType.LESS) ||
      this.match(TokenType.LESS_EQUAL)
    ) {
      const operator: Token = this.previous();
      const right: Expr = this.term();

      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  term(): Expr {
    let expr: Expr = this.factor();

    while (this.match(TokenType.MINUS) || this.match(TokenType.PLUS)) {
      const operator: Token = this.previous();
      const right: Expr = this.factor();

      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  factor(): Expr {
    let expr: Expr = this.unary();

    while (this.match(TokenType.SLASH) || this.match(TokenType.STAR)) {
      const operator: Token = this.previous();
      const right: Expr = this.unary();

      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  unary(): Expr {
    if (this.match(TokenType.BANG) || this.match(TokenType.MINUS)) {
      const operator: Token = this.previous();
      const right: Expr = this.unary();
      return new Unary(operator, right);
    }

    return this.primary();
  }

  primary(): Expr {
    if (this.match(TokenType.NUMBER) || this.match(TokenType.STRING)) {
      return new Literal(this.previous().literal);
    } else if (
      this.match(TokenType.FALSE) ||
      this.match(TokenType.TRUE) ||
      this.match(TokenType.NIL)
    ) {
      return new Literal(
        Parser.literalMap.get(this.previous().type) as literalType
      );
    } else if (this.match(TokenType.LEFT_PARAM)) {
      const expr: Expr = this.expression();
      this.consume(TokenType.RIGHT_PARAM, "Expect ')' after expression");
      return new Grouping(expr);
    }

    throw ParseError.error(this.peek(), 'Unexpected token');
  }

  consume(tokenType: TokenType, message: string) {
    if (this.match(tokenType)) return;

    return ParseError.error(this.peek(), message);
  }

  peek(): Token {
    return this.tokens[this.current];
  }

  previous(): Token {
    if (this.current <= 0)
      throw new Error(
        'current should be greater than 0 before calling previous'
      );

    return this.tokens[this.current - 1];
  }

  match(tokenType: TokenType): boolean {
    if (this.isAtEnd()) return false;
    if (this.tokens[this.current].type !== tokenType) return false;
    this.current++;
    return true;
  }

  private isAtEnd(): boolean {
    return this.tokens[this.current].type === TokenType.EOF;
  }

  private synchronize() {
    throw new Error('Not implemented');
  }
}

export default Parser;
