import error from '../error';
import {isAlpha, isAplhaNumeric, isDigit} from '../utils';
import Token, {literal} from './token';
import TokenType from './tokenType';

class Scanner {
  private source: string;
  private static tokens: Token[] = [];
  private start!: number;
  private current!: number;
  private line!: number;
  private hasError?: boolean;
  private static keywords: Map<string, TokenType> = new Map<
    string,
    TokenType
  >();

  static {
    Scanner.keywords.set('and', TokenType.AND);
    Scanner.keywords.set('class', TokenType.CLASS);
    Scanner.keywords.set('else', TokenType.ELSE);
    Scanner.keywords.set('false', TokenType.FALSE);
    Scanner.keywords.set('function', TokenType.FUN);
    Scanner.keywords.set('for', TokenType.FOR);
    Scanner.keywords.set('if', TokenType.IF);
    Scanner.keywords.set('nil', TokenType.NIL);
    Scanner.keywords.set('or', TokenType.OR);
    Scanner.keywords.set('print', TokenType.PRINT);
    Scanner.keywords.set('return', TokenType.RETURN);
    Scanner.keywords.set('super', TokenType.SUPER);
    Scanner.keywords.set('this', TokenType.THIS);
    Scanner.keywords.set('true', TokenType.TRUE);
    Scanner.keywords.set('var', TokenType.VAR);
    Scanner.keywords.set('while', TokenType.WHILE);
  }

  constructor(source: string) {
    this.source = source;
    this.current = 0;
    this.line = 1;
    this.hasError = false;
  }

  scanTokens() {
    return new Promise<Token[]>((resolve, reject) => {
      while (!this.isAtEnd()) {
        this.start = this.current;
        this.scanToken();
      }

      Scanner.tokens.push(new Token(TokenType.EOF, '', null, this.line));

      this.hasError ? reject('Scanning failed') : resolve(Scanner.tokens);
    });
  }

  private scanToken(): void {
    const char: string = this.advance();

    switch (char) {
      case '(':
        this.addToken(TokenType.LEFT_PARAM);
        break;
      case ')':
        this.addToken(TokenType.RIGHT_PARAM);
        break;
      case '{':
        this.addToken(TokenType.LEFT_BRACE);
        break;
      case '}':
        this.addToken(TokenType.RIGHT_BRACE);
        break;
      case ',':
        this.addToken(TokenType.COMMA);
        break;
      case '.':
        this.addToken(TokenType.DOT);
        break;
      case '-':
        this.addToken(TokenType.MINUS);
        break;
      case '+':
        this.addToken(TokenType.PLUS);
        break;
      case '*':
        this.addToken(TokenType.STAR);
        break;
      case ';':
        this.addToken(TokenType.SEMICOLON);
        break;

      case '!':
        this.match('=')
          ? this.addToken(TokenType.BANG_EQUAL)
          : this.addToken(TokenType.BANG);
        break;
      case '=':
        this.match('=')
          ? this.addToken(TokenType.EQUAL_EQUAL)
          : this.addToken(TokenType.EQUAL);
        break;
      case '>':
        this.match('=')
          ? this.addToken(TokenType.GREATER_EQUAL)
          : this.addToken(TokenType.GREATER);
        break;
      case '<':
        this.match('=')
          ? this.addToken(TokenType.LESS_EQUAL)
          : this.addToken(TokenType.LESS);
        break;

      case '/':
        if (this.match('/')) {
          while (this.peek() !== '\n' && !this.isAtEnd()) this.advance();
        } else {
          this.addToken(TokenType.SLASH);
        }
        break;

      case ' ':
      case '\r':
      case '\t':
        break;

      case '\n':
        this.line++;
        break;

      case '"':
        while (this.peek() !== '"') {
          if (this.isAtEnd()) {
            error(this.line, 'Cannot find end of string');
            this.hasError = true;
            return;
          }
          if (this.peek() === '\n') {
            this.line++;
          }
          this.advance();
        }
        // found '"'
        this.advance();
        this.addToken(
          TokenType.STRING,
          this.source.substring(this.start + 1, this.current - 1)
        );
        break;

      default:
        if (isDigit(char)) {
          this.handleNumber();
        } else if (isAlpha(char)) {
          this.handleAlpha();
        } else {
          error(this.line, `Unexpected character: ${char}`);
          this.hasError = true;
        }
        break;
    }
  }

  private handleAlpha() {
    while (isAplhaNumeric(this.peek())) {
      this.advance();
    }

    const text = this.source.substring(this.start, this.current);
    if (Scanner.keywords.has(text)) {
      const tokenType: TokenType = Scanner.keywords.get(text) || TokenType.EOF;
      this.addToken(tokenType);
    } else {
      this.addToken(TokenType.IDENTIFIER, text);
    }
  }

  private handleNumber() {
    while (isDigit(this.peek())) {
      this.advance();
    }

    if (this.peek() === '.' && isDigit(this.peek(1))) {
      while (isDigit(this.peek())) {
        this.advance();
      }
    }

    const value = Number(this.source.substring(this.start, this.current));
    this.addToken(TokenType.NUMBER, value);
  }

  /**
   * doesn't increment the current position
   * @returns the current character
   */
  private peek(lookAhead = 0): string {
    if (this.current + lookAhead >= this.source.length) return '\0';
    return this.isAtEnd() ? '\0' : this.source.charAt(this.current);
  }

  /**
   * increments the current position
   * @returns if the current character matches the expected character
   */
  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) !== expected) return false;
    this.current++;
    return true;
  }

  /**
   * @returns the current character and increments the pointer
   */
  private advance(): string {
    return this.source.charAt(this.current++);
  }

  private addToken(type: TokenType, literal: literal = null) {
    const lexeme = this.source.substring(this.start, this.current);
    Scanner.tokens.push(new Token(type, lexeme, literal, this.line));
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }
}

export default Scanner;
