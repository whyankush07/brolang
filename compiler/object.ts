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
export const BREAK_OBJ: ObjectType = "BREAK";
export const CONTINUE_OBJ: ObjectType = "CONTINUE";
export const STRING_OBJ: ObjectType = "STRING";
export const ARRAY_OBJ: ObjectType = "ARRAY";

export class Integer implements BObject {
  value: number;
  constructor(v: number) { this.value = v; }
  type(): ObjectType { return INTEGER_OBJ; }
  inspect(): string { return String(this.value); }
}

export class StringObj implements BObject {
  value: string;
  constructor(v: string) { this.value = v; }
  type(): ObjectType { return STRING_OBJ; }
  inspect(): string { return this.value; }
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

export class Break implements BObject {
  type(): ObjectType { return BREAK_OBJ; }
  inspect(): string { return "break"; }
}

export class Continue implements BObject {
  type(): ObjectType { return CONTINUE_OBJ; }
  inspect(): string { return "continue"; }
}

export class ArrayObj implements BObject {
  elements: BObject[];
  constructor(elements: BObject[]) { this.elements = elements; }
  type(): ObjectType { return ARRAY_OBJ; }
  inspect(): string {
    const elements = this.elements.map(e => e.inspect()).join(", ");
    return `[${elements}]`;
  }
}
