export type ObjectType = string;

export interface BObject {
  type(): ObjectType;
  inspect(): string;
}

export const INTEGER_OBJ: ObjectType = "INTEGER";
export const BOOLEAN_OBJ: ObjectType = "BOOLEAN";
export const NULL_OBJ: ObjectType = "NULL";
export const RETURN_VALUE_OBJ: ObjectType = "RETURN_VALUE";
export const ERROR_OBJ: ObjectType = "ERROR";
export const FUNCTION_OBJ: ObjectType = "FUNCTION";

export class Integer implements BObject {
  value: number;
  constructor(v: number) { this.value = v; }
  type(): ObjectType { return INTEGER_OBJ; }
  inspect(): string { return String(this.value); }
}

export class BooleanObj implements BObject {
  value: boolean;
  constructor(v: boolean) { this.value = v; }
  type(): ObjectType { return BOOLEAN_OBJ; }
  inspect(): string { return String(this.value); }
}

export class Null implements BObject {
  type(): ObjectType { return NULL_OBJ; }
  inspect(): string { return "null"; }
}

export class ReturnValue implements BObject {
  value: BObject;
  constructor(v: BObject) { this.value = v; }
  type(): ObjectType { return RETURN_VALUE_OBJ; }
  inspect(): string { return this.value.inspect(); }
}

export class ErrorObj implements BObject {
  message: string;
  constructor(m: string) { this.message = m; }
  type(): ObjectType { return ERROR_OBJ; }
  inspect(): string { return `ERROR: ${this.message}`; }
}

export class FunctionObj implements BObject {
  parameters: any[]; // ast.Identifier[]
  body: any; // ast.BlockStatement
  env: any; // Environment
  constructor(params: any[], body: any, env: any) {
    this.parameters = params;
    this.body = body;
    this.env = env;
  }
  type(): ObjectType { return FUNCTION_OBJ; }
  inspect(): string { return `fn(${this.parameters.map(p => p.value).join(", ")}) { ... }`; }
}
