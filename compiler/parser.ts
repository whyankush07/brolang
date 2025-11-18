import { Lexer } from "./lexer";
import * as token from "./token";
import * as ast from "./ast";
import * as errors from "./errors";

type prefixParseFn = () => ast.Expression | null;
type infixParseFn = (left: ast.Expression) => ast.Expression | null;

const Precedences: Record<string, number> = {
  [token.EQ]: 1,
  [token.NOT_EQ]: 1,
  [token.LT]: 2,
  [token.GT]: 2,
  [token.PLUS]: 3,
  [token.MINUS]: 3,
  [token.SLASH]: 4,
  [token.ASTERISK]: 4,
  [token.LPAREN]: 5,
};

const LOWEST = 0;

export class Parser {
  l: Lexer;
  errors: string[] = [];
  private curToken: token.Token;
  private peekToken: token.Token;
  private prefixParseFns: Map<string, prefixParseFn> = new Map();
  private infixParseFns: Map<string, infixParseFn> = new Map();

  constructor(l: Lexer) {
    this.l = l;
    // Read two tokens, so curToken and peekToken are set
    this.curToken = this.l.nextToken();
    this.peekToken = this.l.nextToken();

    this.registerPrefix(token.IDENT, this.parseIdentifier.bind(this));
    this.registerPrefix(token.INT, this.parseIntegerLiteral.bind(this));
    this.registerPrefix(token.TRUE, this.parseBoolean.bind(this));
    this.registerPrefix(token.FALSE, this.parseBoolean.bind(this));
    this.registerPrefix(token.BANG, this.parsePrefixExpression.bind(this));
    this.registerPrefix(token.MINUS, this.parsePrefixExpression.bind(this));
    this.registerPrefix(token.LPAREN, this.parseGroupedExpression.bind(this));
    this.registerPrefix(token.IF, this.parseIfExpression.bind(this));

    this.registerInfix(token.PLUS, this.parseInfixExpression.bind(this));
    this.registerInfix(token.MINUS, this.parseInfixExpression.bind(this));
    this.registerInfix(token.SLASH, this.parseInfixExpression.bind(this));
    this.registerInfix(token.ASTERISK, this.parseInfixExpression.bind(this));
    this.registerInfix(token.EQ, this.parseInfixExpression.bind(this));
    this.registerInfix(token.NOT_EQ, this.parseInfixExpression.bind(this));
    this.registerInfix(token.LT, this.parseInfixExpression.bind(this));
    this.registerInfix(token.GT, this.parseInfixExpression.bind(this));
    this.registerInfix(token.LPAREN, this.parseCallExpression.bind(this));
  }

  private registerPrefix(tokenType: string, fn: prefixParseFn) {
    this.prefixParseFns.set(tokenType, fn);
  }

  private registerInfix(tokenType: string, fn: infixParseFn) {
    this.infixParseFns.set(tokenType, fn);
  }

  private nextToken(): void {
    this.curToken = this.peekToken;
    this.peekToken = this.l.nextToken();
  }

  parseProgram(): ast.Program {
    const program = new ast.Program();

    while (this.curToken.type !== token.EOF) {
      const stmt = this.parseStatement();
      if (stmt) program.statements.push(stmt);
      this.nextToken();
    }

    return program;
  }

  parseStatement(): ast.Statement | null {
    if (this.curToken.type === token.LET) {
      return this.parseLetStatement();
    }
    return this.parseExpressionStatement();
  }

  private parseLetStatement(): ast.LetStatement | null {
    const stmt = new ast.LetStatement(this.curToken.literal, new ast.Identifier("", ""));
    if (!this.expectPeek(token.IDENT)) {
      return null;
    }
    stmt.name = new ast.Identifier(this.curToken.literal, this.curToken.literal);
    if (!this.expectPeek(token.ASSIGN)) {
      return null;
    }
    this.nextToken();
    stmt.value = this.parseExpression(LOWEST);
    if (this.peekToken.type === token.SEMICOLON) {
      this.nextToken();
    }
    return stmt;
  }

  private parseReturnStatement(): ast.ReturnStatement | null {
    const stmt = new ast.ReturnStatement(this.curToken.literal);
    this.nextToken();
    stmt.returnValue = this.parseExpression(LOWEST);
    if (this.peekToken.type === token.SEMICOLON) this.nextToken();
    return stmt;
  }

  private parseExpressionStatement(): ast.ExpressionStatement | null {
    const stmt = new ast.ExpressionStatement(this.curToken.literal);
    stmt.expression = this.parseExpression(LOWEST);
    if (this.peekToken.type === token.SEMICOLON) this.nextToken();
    return stmt;
  }

  private parseExpression(precedence: number): ast.Expression | null {
    const prefix = this.prefixParseFns.get(this.curToken.type);
    if (!prefix) {
      this.noPrefixParseFnError(this.curToken.type);
      return null;
    }
    let leftExp = prefix();

    while (this.peekToken.type !== token.SEMICOLON && precedence < this.peekPrecedence()) {
      const infix = this.infixParseFns.get(this.peekToken.type);
      if (!infix) return leftExp;
      this.nextToken();
      leftExp = infix(leftExp as ast.Expression);
    }

    return leftExp;
  }

  private parseIdentifier(): ast.Expression {
    return new ast.Identifier(this.curToken.literal, this.curToken.literal);
  }

  private parseIntegerLiteral(): ast.Expression | null {
    const lit = new ast.IntegerLiteral(this.curToken.literal, 0);
    const val = parseInt(this.curToken.literal, 10);
    if (isNaN(val)) {
      this.errors.push(errors.parseIntegerError(this.curToken.literal));
      return null;
    }
    lit.value = val;
    return lit;
  }

  private parseBoolean(): ast.Expression {
    return new ast.BooleanLiteral(this.curToken.literal, this.curToken.type === token.TRUE);
  }

  private parsePrefixExpression(): ast.Expression {
    const expression = new ast.PrefixExpression(this.curToken.literal, this.curToken.literal);
    this.nextToken();
    expression.right = this.parseExpression(6);
    return expression;
  }

  private parseInfixExpression(left: ast.Expression): ast.Expression {
    const expression = new ast.InfixExpression(this.curToken.literal, this.curToken.literal);
    expression.left = left;
    const precedence = this.curPrecedence();
    this.nextToken();
    expression.right = this.parseExpression(precedence);
    return expression;
  }

  private parseGroupedExpression(): ast.Expression | null {
    this.nextToken();
    const exp = this.parseExpression(LOWEST);
    if (!this.expectPeek(token.RPAREN)) return null;
    return exp;
  }

  private parseIfExpression(): ast.Expression | null {
    const expression = new ast.IfExpression(this.curToken.literal);
    if (!this.expectPeek(token.LPAREN)) return null;
    this.nextToken();
    expression.condition = this.parseExpression(LOWEST);
    if (!this.expectPeek(token.RPAREN)) return null;
    if (!this.expectPeek(token.LBRACE)) return null;
    expression.consequence = this.parseBlockStatement();
    if (this.peekToken.type === token.ELSE) {
      this.nextToken();
      if (!this.expectPeek(token.LBRACE)) return null;
      expression.alternative = this.parseBlockStatement();
    }
    return expression;
  }

  private parseBlockStatement(): ast.BlockStatement {
    const block = new ast.BlockStatement(this.curToken.literal);
    this.nextToken();
    while (this.curToken.type !== token.RBRACE && this.curToken.type !== token.EOF) {
      const stmt = this.parseStatement();
      if (stmt) block.statements.push(stmt);
      this.nextToken();
    }
    return block;
  }

  private parseFunctionLiteral(): ast.Expression | null {
    const lit = new ast.FunctionLiteral(this.curToken.literal);
    if (!this.expectPeek(token.LPAREN)) return null;
    lit.parameters = this.parseFunctionParameters();
    if (!this.expectPeek(token.LBRACE)) return null;
    lit.body = this.parseBlockStatement();
    return lit;
  }

  private parseFunctionParameters(): ast.Identifier[] {
    const identifiers: ast.Identifier[] = [];
    if (this.peekToken.type === token.RPAREN) {
      this.nextToken();
      return identifiers;
    }
    this.nextToken();
    const ident = new ast.Identifier(this.curToken.literal, this.curToken.literal);
    identifiers.push(ident);
    while (this.peekToken.type === token.COMMA) {
      this.nextToken();
      this.nextToken();
      identifiers.push(new ast.Identifier(this.curToken.literal, this.curToken.literal));
    }
    if (!this.expectPeek(token.RPAREN)) return [];
    return identifiers;
  }

  private parseCallExpression(fn: ast.Expression): ast.Expression {
    const exp = new ast.CallExpression(this.curToken.literal);
    exp.fn = fn;
    exp.arguments = this.parseCallArguments();
    return exp;
  }

  private parseCallArguments(): ast.Expression[] {
    const args: ast.Expression[] = [];
    if (this.peekToken.type === token.RPAREN) {
      this.nextToken();
      return args;
    }
    this.nextToken();
    const first = this.parseExpression(LOWEST);
    if (first) args.push(first);
    while (this.peekToken.type === token.COMMA) {
      this.nextToken();
      this.nextToken();
      const e = this.parseExpression(LOWEST);
      if (e) args.push(e);
    }
    if (!this.expectPeek(token.RPAREN)) return [];
    return args;
  }

  private noPrefixParseFnError(t: string) {
    this.errors.push(errors.noPrefixParseFnError(t));
  }

  private expectPeek(t: string): boolean {
    if (this.peekToken.type === t) {
      this.nextToken();
      return true;
    }
    this.peekError(t);
    return false;
  }

  private peekError(t: string) {
    this.errors.push(errors.expectedTokenError(t, this.peekToken.type));
  }

  private peekPrecedence(): number {
    const p = Precedences[this.peekToken.type];
    return p ?? LOWEST;
  }

  private curPrecedence(): number {
    const p = Precedences[this.curToken.type];
    return p ?? LOWEST;
  }
}
