export type TokenType = string;

export interface Token {
  type: TokenType;
  literal: string;
}

export const ILLEGAL: TokenType = "ILLEGAL";
export const EOF: TokenType = "EOF";

export const IDENT: TokenType = "IDENT"; // add, foobar, x, y
export const INT: TokenType = "INT";
export const ASSIGN: TokenType = "=";
export const PLUS: TokenType = "+";
export const MINUS: TokenType = "-";
export const BANG: TokenType = "!";
export const ASTERISK: TokenType = "*";
export const SLASH: TokenType = "/";
export const LT: TokenType = "<";
export const GT: TokenType = ">";
export const COMMA: TokenType = ",";
export const SEMICOLON: TokenType = ";";
export const LPAREN: TokenType = "(";
export const RPAREN: TokenType = ")";
export const LBRACE: TokenType = "{";
export const RBRACE: TokenType = "}";

export const FUNCTION: TokenType = "FUNCTION";
export const LET: TokenType = "LET";
export const TRUE: TokenType = "TRUE";
export const FALSE: TokenType = "FALSE";
export const IF: TokenType = "IF";
export const ELSE: TokenType = "ELSE";
export const RETURN: TokenType = "RETURN";
export const EQ: TokenType = "==";
export const NOT_EQ: TokenType = "!=";

const keywords: Record<string, TokenType> = {
  fn: FUNCTION,
  let: LET,
  true: TRUE,
  false: FALSE,
  if: IF,
  else: ELSE,
  return: RETURN,
};

export function lookupIdent(ident: string): TokenType {
  return keywords[ident] || IDENT;
}

export function makeToken(type: TokenType, literal = ""): Token {
  return { type, literal };
}
