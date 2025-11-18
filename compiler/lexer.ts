import { Token, makeToken, EOF, ILLEGAL, IDENT, INT, ASSIGN, PLUS, COMMA, SEMICOLON, LPAREN, RPAREN, LBRACE, RBRACE, LET, BANG, MINUS, SLASH, ASTERISK, LT, GT, EQ, NOT_EQ, lookupIdent } from "./token";

export class Lexer {
  private input: string;
  private position = 0;
  private readPosition = 0;
  private ch = "";

  constructor(input: string) {
    this.input = input;
    this.readChar();
  }

  private readChar(): void {
    if (this.readPosition >= this.input.length) {
      this.ch = "";
    } else {
      this.ch = this.input[this.readPosition];
    }
    this.position = this.readPosition;
    this.readPosition += 1;
  }

  private peekChar(): string {
    if (this.readPosition >= this.input.length) {
      return "";
    }
    return this.input[this.readPosition];
  }

  nextToken(): Token {
    this.skipWhitespace();

    let tok: Token;

    switch (this.ch) {
      case "=":
        if (this.peekChar() === "=") {
          const ch = this.ch;
          this.readChar();
          tok = makeToken(EQ, ch + this.ch);
        } else {
          tok = makeToken(ASSIGN, this.ch);
        }
        break;
      case "+":
        tok = makeToken(PLUS, this.ch);
        break;
      case "-":
        tok = makeToken(MINUS, this.ch);
        break;
      case "!":
        if (this.peekChar() === "=") {
          const ch = this.ch;
          this.readChar();
          tok = makeToken(NOT_EQ, ch + this.ch);
        } else {
          tok = makeToken(BANG, this.ch);
        }
        break;
      case "/":
        tok = makeToken(SLASH, this.ch);
        break;
      case "*":
        tok = makeToken(ASTERISK, this.ch);
        break;
      case "<":
        tok = makeToken(LT, this.ch);
        break;
      case ">":
        tok = makeToken(GT, this.ch);
        break;
      case ",":
        tok = makeToken(COMMA, this.ch);
        break;
      case ";":
        tok = makeToken(SEMICOLON, this.ch);
        break;
      case "(":
        tok = makeToken(LPAREN, this.ch);
        break;
      case ")":
        tok = makeToken(RPAREN, this.ch);
        break;
      case "{":
        tok = makeToken(LBRACE, this.ch);
        break;
      case "}":
        tok = makeToken(RBRACE, this.ch);
        break;
      case "":
        tok = makeToken(EOF, "");
        break;
      default:
        if (this.isLetter(this.ch)) {
          const literal = this.readIdentifier();
          const type = lookupIdent(literal);
          return makeToken(type, literal);
        } else if (this.isDigit(this.ch)) {
          const literal = this.readNumber();
          return makeToken(INT, literal);
        } else {
          tok = makeToken(ILLEGAL, this.ch);
        }
    }

    this.readChar();
    return tok;
  }

  private skipWhitespace(): void {
    while (this.ch === " " || this.ch === "\t" || this.ch === "\n" || this.ch === "\r") {
      this.readChar();
    }
  }

  private readIdentifier(): string {
    const pos = this.position;
    while (this.isLetter(this.ch)) {
      this.readChar();
    }
    return this.input.slice(pos, this.position);
  }

  private readNumber(): string {
    const pos = this.position;
    while (this.isDigit(this.ch)) {
      this.readChar();
    }
    return this.input.slice(pos, this.position);
  }

  private isLetter(ch: string): boolean {
    return /[a-zA-Z_]/.test(ch);
  }

  private isDigit(ch: string): boolean {
    return /[0-9]/.test(ch);
  }
}
