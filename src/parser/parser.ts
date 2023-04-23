import Token from '../common/token';
import TokenType from '../common/tokenType';
import {error} from '../error/error';
import ParseError from '../error/parseerror';
import {
  literalType,
  Expr,
  Binary,
  Unary,
  Literal,
  Grouping,
  Variable,
  Assignment,
} from '../syntaxtree/expr';
import {Expression, Print, Stmt, Var} from '../syntaxtree/stmt';

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

  public parse(): Promise<Stmt[]> {
    const statements: Stmt[] = [];
    while (!this.isAtEnd()) {
      statements.push(this.declaration());
    }
    return Promise.resolve(statements);
  }
  declaration(): Stmt {
    try {
      if (this.match(TokenType.VAR)) return this.varDeclaration();

      return this.statement();
    } catch (error) {
      if (error instanceof ParseError) {
        this.synchronize();
        return null;
      }
      throw error;
    }
  }
  varDeclaration(): Stmt {
    const name: Token = this.consume(
      TokenType.IDENTIFIER,
      'Expect variable name'
    );

    let inistializer: Expr = null;
    if (this.match(TokenType.EQUAL)) {
      inistializer = this.expression();
    }

    this.consume(TokenType.SEMICOLON, "Expect ';' after variable declaration");

    return new Var(name, inistializer);
  }

  statement(): Stmt {
    if (this.match(TokenType.PRINT)) return this.printStatement();

    return this.expressionStatement();
  }

  expressionStatement(): Stmt {
    const expr: Expr = this.expression();
    this.consume(TokenType.SEMICOLON, "Expect ';' after expression.");

    return new Expression(expr);
  }

  printStatement(): Stmt {
    const value: Expr = this.expression();
    this.consume(TokenType.SEMICOLON, "Expect ';' after value.");

    return new Print(value);
  }

  private expression(): Expr {
    return this.assignment();
  }

  private assignment(): Expr {
    const expr: Expr = this.equality();

    if (this.match(TokenType.EQUAL)) {
      const equals: Token = this.previous();
      const value: Expr = this.assignment();

      if (expr instanceof Variable) {
        const name: Token = expr.name;
        return new Assignment(name, value);
      }

      error(equals.line, 'Invalid assignment expression');
    }

    return expr;
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
    } else if (this.match(TokenType.IDENTIFIER)) {
      return new Variable(this.previous());
    } else if (this.match(TokenType.LEFT_PARAM)) {
      const expr: Expr = this.expression();
      this.consume(TokenType.RIGHT_PARAM, "Expect ')' after expression");
      return new Grouping(expr);
    }

    throw ParseError.error(this.peek(), 'Unexpected token');
  }

  consume(tokenType: TokenType, message: string): Token {
    if (this.match(tokenType)) return this.previous();

    throw ParseError.error(this.peek(), message);
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

  private synchronize(): void {
    this.current++;

    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.SEMICOLON) return;

      const type = this.peek().type;
      const syncTypes = [
        TokenType.CLASS,
        TokenType.FUN,
        TokenType.VAR,
        TokenType.FOR,
        TokenType.IF,
        TokenType.WHILE,
        TokenType.PRINT,
        TokenType.RETURN,
      ];

      if (syncTypes.includes(type)) return;
      this.current++;
    }
  }
}

export default Parser;
