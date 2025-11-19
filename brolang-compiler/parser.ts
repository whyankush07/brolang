import { Lexer } from "./lexer";
import * as token from "./token";
import * as ast from "./ast";
import * as errors from "./errors";
import { BrolangConfig } from './config/defaultConfig';

type prefixParseFn = () => ast.Expression | null;
type infixParseFn = (left: ast.Expression) => ast.Expression | null;

const defaultPrecedences: Record<string, number> = {
  [token.EQ]: 1,
  [token.NOT_EQ]: 1,
  [token.LT]: 2,
  [token.GT]: 2,
  [token.LTE]: 2,
  [token.GTE]: 2,
  [token.PLUS]: 3,
  [token.MINUS]: 3,
  [token.SLASH]: 4,
  [token.ASTERISK]: 4,
  [token.MOD]: 4,
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
  private precedences: Record<string, number>;
  private config?: BrolangConfig;

  constructor(l: Lexer, config?: BrolangConfig) {
    this.l = l;
    this.config = config;
    this.precedences = config ? { ...defaultPrecedences, ...config.syntax.precedences } : defaultPrecedences;
    // Read two tokens, so curToken and peekToken are set
    this.curToken = this.l.nextToken();
    this.peekToken = this.l.nextToken();

    this.registerPrefix(token.IDENT, this.parseIdentifier.bind(this));
    this.registerPrefix(token.INT, this.parseIntegerLiteral.bind(this));
    this.registerPrefix(token.STRING, this.parseStringLiteral.bind(this));
    this.registerPrefix(token.TRUE, this.parseBoolean.bind(this));
    this.registerPrefix(token.FALSE, this.parseBoolean.bind(this));
    this.registerPrefix(token.BANG, this.parsePrefixExpression.bind(this));
    this.registerPrefix(token.MINUS, this.parsePrefixExpression.bind(this));
    this.registerPrefix(token.LPAREN, this.parseGroupedExpression.bind(this));
    this.registerPrefix(token.IF, this.parseIfExpression.bind(this));
    this.registerPrefix(token.LBRACKET, this.parseArrayLiteral.bind(this));

    this.registerInfix(token.PLUS, this.parseInfixExpression.bind(this));
    this.registerInfix(token.MINUS, this.parseInfixExpression.bind(this));
    this.registerInfix(token.SLASH, this.parseInfixExpression.bind(this));
    this.registerInfix(token.ASTERISK, this.parseInfixExpression.bind(this));
    this.registerInfix(token.MOD, this.parseInfixExpression.bind(this));
    this.registerInfix(token.EQ, this.parseInfixExpression.bind(this));
    this.registerInfix(token.NOT_EQ, this.parseInfixExpression.bind(this));
    this.registerInfix(token.LT, this.parseInfixExpression.bind(this));
    this.registerInfix(token.GT, this.parseInfixExpression.bind(this));
    this.registerInfix(token.LTE, this.parseInfixExpression.bind(this));
    this.registerInfix(token.GTE, this.parseInfixExpression.bind(this));
    this.registerInfix(token.LPAREN, this.parseCallExpression.bind(this));
    this.registerInfix(token.LBRACKET, this.parseIndexExpression.bind(this));
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
      
      if (this.peekToken.type === token.SEMICOLON) {
        this.nextToken();
      }
      this.nextToken();
    }

    return program;
  }

  parseStatement(): ast.Statement | null {
    if (this.curToken.type === token.LET) {
      return this.parseLetStatement();
    }
    if (this.curToken.type === token.FOR) {
      return this.parseForStatement();
    }
    if (this.curToken.type === token.WHILE) {
      return this.parseWhileStatement();
    }
    if (this.curToken.type === token.BREAK) {
      return this.parseBreakStatement();
    }
    if (this.curToken.type === token.CONTINUE) {
      return this.parseContinueStatement();
    }
    if (this.curToken.type === token.PRINT) {
      return this.parsePrintStatement();
    }
    if (this.curToken.type === token.IDENT && this.peekToken.type === token.ASSIGN) {
      return this.parseAssignmentStatement();
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
    return stmt;
  }

  private parseReturnStatement(): ast.ReturnStatement | null {
    const stmt = new ast.ReturnStatement(this.curToken.literal);
    this.nextToken();
    stmt.returnValue = this.parseExpression(LOWEST);
    if (this.peekToken.type === token.SEMICOLON) this.nextToken();
    return stmt;
  }

  private parseWhileStatement(): ast.WhileStatement | null {
    const stmt = new ast.WhileStatement(this.curToken.literal);
    if (!this.expectPeek(token.LPAREN)) return null;
    this.nextToken();
    stmt.condition = this.parseExpression(LOWEST);
    if (!this.expectPeek(token.RPAREN)) return null;
    if (!this.expectPeek(token.LBRACE)) return null;
    stmt.body = this.parseBlockStatement();
    return stmt;
  }

  private parseForStatement(): ast.ForStatement | null {
    const stmt = new ast.ForStatement(this.curToken.literal);
    
    if (!this.expectPeek(token.LPAREN)) return null;
    
    // Parse initialization
    this.nextToken(); // Move past '('
    if (this.curToken.type !== token.SEMICOLON) {
      stmt.init = this.parseStatement();
      if (stmt.init === null) return null;
    }
    
    if (!this.expectPeek(token.SEMICOLON)) return null;
    
    // Parse condition
    this.nextToken(); // Move past semicolon
    if (this.curToken.type !== token.SEMICOLON) {
      stmt.condition = this.parseExpression(LOWEST);
      if (stmt.condition === null) return null;
    }
    
    if (!this.expectPeek(token.SEMICOLON)) return null;
    
    // Parse update
    this.nextToken(); // Move past semicolon
    if (this.curToken.type !== token.RPAREN) {
      stmt.update = this.parseStatement();
      if (stmt.update === null) return null;
    }
    
    if (!this.expectPeek(token.RPAREN)) return null;
    if (!this.expectPeek(token.LBRACE)) return null;
    
    stmt.body = this.parseBlockStatement();
    return stmt;
  }

  private parseBreakStatement(): ast.BreakStatement | null {
    const stmt = new ast.BreakStatement(this.curToken.literal);
    if (this.peekToken.type === token.SEMICOLON) this.nextToken();
    return stmt;
  }

  private parseContinueStatement(): ast.ContinueStatement | null {
    const stmt = new ast.ContinueStatement(this.curToken.literal);
    if (this.peekToken.type === token.SEMICOLON) this.nextToken();
    return stmt;
  }

  private parsePrintStatement(): ast.PrintStatement | null {
    const stmt = new ast.PrintStatement(this.curToken.literal);
    if (!this.expectPeek(token.LPAREN)) return null;
    this.nextToken();
    stmt.value = this.parseExpression(LOWEST);
    if (!this.expectPeek(token.RPAREN)) return null;
    if (this.peekToken.type === token.SEMICOLON) this.nextToken();
    return stmt;
  }

  private parseAssignmentStatement(): ast.AssignmentStatement | null {
    const ident = new ast.Identifier(this.curToken.literal, this.curToken.literal);
    const stmt = new ast.AssignmentStatement(this.curToken.literal, ident);
    this.nextToken(); // consume IDENT
    this.nextToken(); // consume ASSIGN
    stmt.value = this.parseExpression(LOWEST);
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
      this.errors.push(errors.parseIntegerError(this.curToken.literal, this.config));
      return null;
    }
    lit.value = val;
    return lit;
  }

  private parseStringLiteral(): ast.Expression {
    return new ast.StringLiteral(this.curToken.literal, this.curToken.literal);
  }

  private parseArrayLiteral(): ast.Expression | null {
    const array = new ast.ArrayLiteral(this.curToken.literal);
    array.elements = this.parseExpressionList(token.RBRACKET);
    return array;
  }

  private parseExpressionList(end: string): ast.Expression[] {
    const list: ast.Expression[] = [];

    if (this.peekToken.type === end) {
      this.nextToken();
      return list;
    }

    this.nextToken();
    const expr = this.parseExpression(LOWEST);
    if (expr) list.push(expr);

    while (this.peekToken.type === token.COMMA) {
      this.nextToken();
      this.nextToken();
      const expr = this.parseExpression(LOWEST);
      if (expr) list.push(expr);
    }

    if (!this.expectPeek(end)) {
      return [];
    }

    return list;
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

  private parseIndexExpression(left: ast.Expression): ast.Expression | null {
    const exp = new ast.IndexExpression(this.curToken.literal);
    exp.left = left;
    
    this.nextToken();
    exp.index = this.parseExpression(LOWEST);
    
    if (!this.expectPeek(token.RBRACKET)) {
      return null;
    }
    
    return exp;
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
    while (this.peekToken.type === token.ELSE_IF) {
      this.nextToken(); // consume ELSE_IF
      const elseIf = new ast.IfExpression(this.curToken.literal);
      if (!this.expectPeek(token.LPAREN)) return null;
      this.nextToken();
      elseIf.condition = this.parseExpression(LOWEST);
      if (!this.expectPeek(token.RPAREN)) return null;
      if (!this.expectPeek(token.LBRACE)) return null;
      elseIf.consequence = this.parseBlockStatement();
      if (!expression.alternative) {
        expression.alternative = elseIf;
      } else {
        let current: ast.IfExpression | ast.BlockStatement | null = expression.alternative;
        while (current && current.constructor.name === 'IfExpression' && (current as ast.IfExpression).alternative) {
          current = (current as ast.IfExpression).alternative;
        }
        if (current && current.constructor.name === 'IfExpression') {
          (current as ast.IfExpression).alternative = elseIf;
        }
      }
    }
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
    this.errors.push(errors.noPrefixParseFnError(t, this.config));
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
    this.errors.push(errors.expectedTokenError(t, this.peekToken.type, this.config));
  }

  private peekPrecedence(): number {
    const p = this.precedences[this.peekToken.type];
    return p ?? LOWEST;
  }

  private curPrecedence(): number {
    const p = this.precedences[this.curToken.type];
    return p ?? LOWEST;
  }
}
