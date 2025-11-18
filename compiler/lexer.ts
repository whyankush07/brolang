import { Token, makeToken, EOF, ILLEGAL, IDENT, INT, STRING, ASSIGN, PLUS, COMMA, SEMICOLON, LPAREN, RPAREN, LBRACE, RBRACE, LBRACKET, RBRACKET, LET, BANG, MINUS, SLASH, ASTERISK, MOD, LT, GT, EQ, NOT_EQ, GTE, LTE, lookupIdent } from "./token";
import { BrolangConfig } from './config/defaultConfig';

export class Lexer {
  private input: string;
  private position = 0;
  private readPosition = 0;
  private ch = "";
  private config?: BrolangConfig;

  constructor(input: string, config?: BrolangConfig) {
    this.input = input;
    this.config = config;
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
      case "%":
        tok = makeToken(MOD, this.ch);
        break;
      case "<":
        if (this.peekChar() === "=") {
          const ch = this.ch;
          this.readChar();
          tok = makeToken(LTE, ch + this.ch);
        } else {
          tok = makeToken(LT, this.ch);
        }
        break;
      case ">":
        if (this.peekChar() === "=") {
          const ch = this.ch;
          this.readChar();
          tok = makeToken(GTE, ch + this.ch);
        } else {
          tok = makeToken(GT, this.ch);
        }
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
      case "[":
        tok = makeToken(LBRACKET, this.ch);
        break;
      case "]":
        tok = makeToken(RBRACKET, this.ch);
        break;
      case '"':
        tok = makeToken(STRING, this.readString());
        break;
      case "'":
        tok = makeToken(STRING, this.readString());
        break;
      case "":
        tok = makeToken(EOF, "");
        break;
      default:
        if (this.isLetter(this.ch)) {
          const literal = this.readIdentifier();
          const type = lookupIdent(literal, this.config);
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
    while (this.isLetter(this.ch) || this.isDigit(this.ch) || this.ch === "_") {
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

  private readString(): string {
    const quote = this.ch;
    this.readChar(); // skip opening quote
    const pos = this.position;
    while (this.ch !== quote && this.ch !== "") {
      this.readChar();
    }
    const str = this.input.slice(pos, this.position);
    // Don't call readChar() here - it will be called by nextToken() after the switch
    return str;
  }

  private isLetter(ch: string): boolean {
    return /[a-zA-Z_]/.test(ch);
  }

  private isDigit(ch: string): boolean {
    return /[0-9]/.test(ch);
  }
}
