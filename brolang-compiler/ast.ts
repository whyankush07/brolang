export interface Node {
  tokenLiteral(): string;
}

export interface Statement extends Node {
  statementNode(): void;
}

export interface Expression extends Node {
  expressionNode(): void;
}

export class Program implements Node {
  statements: Statement[] = [];

  tokenLiteral(): string {
    if (this.statements.length > 0) {
      return this.statements[0].tokenLiteral();
    }
    return "";
  }
}

export class Identifier implements Expression {
  value: string;
  tokenLiteralValue: string;
  constructor(tokenLiteral: string, value: string) {
    this.tokenLiteralValue = tokenLiteral;
    this.value = value;
  }
  expressionNode(): void {}
  tokenLiteral(): string {
    return this.tokenLiteralValue;
  }
}

export class LetStatement implements Statement {
  name: Identifier;
  value: Expression | null = null;
  tokenLiteralValue: string;
  constructor(tokenLiteral: string, name: Identifier) {
    this.tokenLiteralValue = tokenLiteral;
    this.name = name;
  }
  statementNode(): void {}
  tokenLiteral(): string {
    return this.tokenLiteralValue;
  }
}

export class ReturnStatement implements Statement {
  returnValue: Expression | null = null;
  tokenLiteralValue: string;
  constructor(tokenLiteral: string) {
    this.tokenLiteralValue = tokenLiteral;
  }
  statementNode(): void {}
  tokenLiteral(): string {
    return this.tokenLiteralValue;
  }
}

export class WhileStatement implements Statement {
  condition: Expression | null = null;
  body: BlockStatement | null = null;
  tokenLiteralValue: string;
  constructor(tokenLiteral: string) {
    this.tokenLiteralValue = tokenLiteral;
  }
  statementNode(): void {}
  tokenLiteral(): string {
    return this.tokenLiteralValue;
  }
}

export class BreakStatement implements Statement {
  tokenLiteralValue: string;
  constructor(tokenLiteral: string) {
    this.tokenLiteralValue = tokenLiteral;
  }
  statementNode(): void {}
  tokenLiteral(): string {
    return this.tokenLiteralValue;
  }
}

export class ContinueStatement implements Statement {
  tokenLiteralValue: string;
  constructor(tokenLiteral: string) {
    this.tokenLiteralValue = tokenLiteral;
  }
  statementNode(): void {}
  tokenLiteral(): string {
    return this.tokenLiteralValue;
  }
}

export class ForStatement implements Statement {
  init: Statement | null = null;
  condition: Expression | null = null;
  update: Statement | null = null;
  body: BlockStatement | null = null;
  tokenLiteralValue: string;
  constructor(tokenLiteral: string) {
    this.tokenLiteralValue = tokenLiteral;
  }
  statementNode(): void {}
  tokenLiteral(): string {
    return this.tokenLiteralValue;
  }
}

export class PrintStatement implements Statement {
  value: Expression | null = null;
  tokenLiteralValue: string;
  constructor(tokenLiteral: string) {
    this.tokenLiteralValue = tokenLiteral;
  }
  statementNode(): void {}
  tokenLiteral(): string {
    return this.tokenLiteralValue;
  }
}

export class AssignmentStatement implements Statement {
  name: Identifier;
  value: Expression | null = null;
  tokenLiteralValue: string;
  constructor(tokenLiteral: string, name: Identifier) {
    this.tokenLiteralValue = tokenLiteral;
    this.name = name;
  }
  statementNode(): void {}
  tokenLiteral(): string {
    return this.tokenLiteralValue;
  }
}

export class ExpressionStatement implements Statement {
  expression: Expression | null = null;
  tokenLiteralValue: string;
  constructor(tokenLiteral: string) {
    this.tokenLiteralValue = tokenLiteral;
  }
  statementNode(): void {}
  tokenLiteral(): string {
    return this.tokenLiteralValue;
  }
}

export class IntegerLiteral implements Expression {
  value: number;
  tokenLiteralValue: string;
  constructor(tokenLiteral: string, value: number) {
    this.tokenLiteralValue = tokenLiteral;
    this.value = value;
  }
  expressionNode(): void {}
  tokenLiteral(): string {
    return this.tokenLiteralValue;
  }
}

export class StringLiteral implements Expression {
  value: string;
  tokenLiteralValue: string;
  constructor(tokenLiteral: string, value: string) {
    this.tokenLiteralValue = tokenLiteral;
    this.value = value;
  }
  expressionNode(): void {}
  tokenLiteral(): string {
    return this.tokenLiteralValue;
  }
}

export class BooleanLiteral implements Expression {
  value: boolean;
  tokenLiteralValue: string;
  constructor(tokenLiteral: string, value: boolean) {
    this.tokenLiteralValue = tokenLiteral;
    this.value = value;
  }
  expressionNode(): void {}
  tokenLiteral(): string {
    return this.tokenLiteralValue;
  }
}

export class ArrayLiteral implements Expression {
  elements: Expression[] = [];
  tokenLiteralValue: string;
  constructor(tokenLiteral: string) {
    this.tokenLiteralValue = tokenLiteral;
  }
  expressionNode(): void {}
  tokenLiteral(): string {
    return this.tokenLiteralValue;
  }
}

export class IndexExpression implements Expression {
  left: Expression | null = null;
  index: Expression | null = null;
  tokenLiteralValue: string;
  constructor(tokenLiteral: string) {
    this.tokenLiteralValue = tokenLiteral;
  }
  expressionNode(): void {}
  tokenLiteral(): string {
    return this.tokenLiteralValue;
  }
}

export class PrefixExpression implements Expression {
  operator: string;
  right: Expression | null = null;
  tokenLiteralValue: string;
  constructor(tokenLiteral: string, operator: string) {
    this.tokenLiteralValue = tokenLiteral;
    this.operator = operator;
  }
  expressionNode(): void {}
  tokenLiteral(): string {
    return this.tokenLiteralValue;
  }
}

export class InfixExpression implements Expression {
  left: Expression | null = null;
  operator: string;
  right: Expression | null = null;
  tokenLiteralValue: string;
  constructor(tokenLiteral: string, operator: string) {
    this.tokenLiteralValue = tokenLiteral;
    this.operator = operator;
  }
  expressionNode(): void {}
  tokenLiteral(): string {
    return this.tokenLiteralValue;
  }
}

export class IfExpression implements Expression {
  condition: Expression | null = null;
  consequence: BlockStatement | null = null;
  alternative: BlockStatement | IfExpression | null = null;
  tokenLiteralValue: string;
  constructor(tokenLiteral: string) {
    this.tokenLiteralValue = tokenLiteral;
  }
  expressionNode(): void {}
  tokenLiteral(): string {
    return this.tokenLiteralValue;
  }
}

export class BlockStatement implements Statement {
  statements: Statement[] = [];
  tokenLiteralValue: string;
  constructor(tokenLiteral: string) {
    this.tokenLiteralValue = tokenLiteral;
  }
  statementNode(): void {}
  tokenLiteral(): string {
    return this.tokenLiteralValue;
  }
}

export class FunctionLiteral implements Expression {
  parameters: Identifier[] = [];
  body: BlockStatement | null = null;
  tokenLiteralValue: string;
  constructor(tokenLiteral: string) {
    this.tokenLiteralValue = tokenLiteral;
  }
  expressionNode(): void {}
  tokenLiteral(): string {
    return this.tokenLiteralValue;
  }
}

export class CallExpression implements Expression {
  fn: Expression | null = null;
  arguments: Expression[] = [];
  tokenLiteralValue: string;
  constructor(tokenLiteral: string) {
    this.tokenLiteralValue = tokenLiteral;
  }
  expressionNode(): void {}
  tokenLiteral(): string {
    return this.tokenLiteralValue;
  }
}
