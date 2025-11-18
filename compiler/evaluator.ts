import * as ast from "./ast";
import * as obj from "./object";
import { Environment, newEnclosedEnvironment } from "./environment";

const TRUE = new obj.BooleanObj(true);
const FALSE = new obj.BooleanObj(false);
const NULL = new obj.Null();

function nativeBoolToBooleanObj(input: boolean): obj.BooleanObj {
  return input ? TRUE : FALSE;
}

export function evalProgram(program: ast.Program, env: Environment): obj.BObject | null {
  let result: obj.BObject | null = null;
  for (const statement of program.statements) {
    result = evaluate(statement, env);
    if (result instanceof obj.ReturnValue) {
      return result.value;
    }
    if (result instanceof obj.ErrorObj) {
      return result;
    }
  }
  return result;
}

export function evaluate(node: any, env: Environment): obj.BObject | null {
  if (!node) return null;

  // Statements
  if (node.constructor.name === 'Program') {
    return evalProgram(node as ast.Program, env);
  }

  if (node.constructor.name === 'ExpressionStatement') {
    return evaluate(node.expression, env);
  }

  if (node.constructor.name === 'IntegerLiteral') {
    return new obj.Integer(node.value);
  }

  if (node.constructor.name === 'BooleanLiteral') {
    return nativeBoolToBooleanObj(node.value);
  }

  if (node.constructor.name === 'PrefixExpression') {
    const right = evaluate(node.right, env);
    if (right instanceof obj.ErrorObj) return right;
    return evalPrefixExpression(node.operator, right!);
  }

  if (node.constructor.name === 'InfixExpression') {
    const left = evaluate(node.left, env);
    if (left instanceof obj.ErrorObj) return left;
    const right = evaluate(node.right, env);
    if (right instanceof obj.ErrorObj) return right;
    return evalInfixExpression(node.operator, left!, right!);
  }

  if (node.constructor.name === 'BlockStatement') {
    let result: obj.BObject | null = null;
    for (const stmt of node.statements) {
      result = evaluate(stmt, env);
      if (result) {
        if (result instanceof obj.ReturnValue || result instanceof obj.ErrorObj) return result;
      }
    }
    return result;
  }

  if (node.constructor.name === 'IfExpression') {
    const condition = evaluate(node.condition, env);
    if (condition instanceof obj.ErrorObj) return condition;
    if (isTruthy(condition)) {
      return evaluate(node.consequence, env);
    } else if (node.alternative) {
      return evaluate(node.alternative, env);
    } else {
      return NULL;
    }
  }

  if (node.constructor.name === 'ReturnStatement') {
    const val = evaluate(node.returnValue, env);
    if (val instanceof obj.ErrorObj) return val;
    return new obj.ReturnValue(val!);
  }

  if (node.constructor.name === 'LetStatement') {
    const val = evaluate(node.value, env);
    if (val instanceof obj.ErrorObj) return val;
    env.set(node.name.value, val!);
    return null;
  }

  if (node.constructor.name === 'Identifier') {
    return evalIdentifier(node, env);
  }

  if (node.constructor.name === 'FunctionLiteral') {
    return new obj.FunctionObj(node.parameters, node.body, env);
  }

  if (node.constructor.name === 'CallExpression') {
    const fn = evaluate(node.fn, env);
    if (fn instanceof obj.ErrorObj) return fn;
    const args: obj.BObject[] = [];
    for (const a of node.arguments) {
      const evaluated = evaluate(a, env);
      if (evaluated instanceof obj.ErrorObj) return evaluated;
      args.push(evaluated!);
    }
    return applyFunction(fn!, args);
  }

  return null;
}

function evalPrefixExpression(operator: string, right: obj.BObject): obj.BObject | obj.ErrorObj {
  switch (operator) {
    case '!':
      return evalBangOperatorExpression(right);
    case '-':
      if (right.type() !== obj.INTEGER_OBJ) {
        return new obj.ErrorObj(`unknown operator: -${right.type()}`);
      }
      return new obj.Integer(-((right as obj.Integer).value));
    default:
      return new obj.ErrorObj(`unknown operator: ${operator}${right.type()}`);
  }
}

function evalBangOperatorExpression(right: obj.BObject): obj.BooleanObj | obj.Null {
  if (right === TRUE) return FALSE;
  if (right === FALSE) return TRUE;
  if (right === NULL) return TRUE;
  return FALSE;
}

function evalInfixExpression(operator: string, left: obj.BObject, right: obj.BObject): obj.BObject | obj.ErrorObj {
  if (left.type() === obj.INTEGER_OBJ && right.type() === obj.INTEGER_OBJ) {
    const leftVal = (left as obj.Integer).value;
    const rightVal = (right as obj.Integer).value;
    switch (operator) {
      case '+': return new obj.Integer(leftVal + rightVal);
      case '-': return new obj.Integer(leftVal - rightVal);
      case '*': return new obj.Integer(leftVal * rightVal);
      case '/': return new obj.Integer(Math.floor(leftVal / rightVal));
      case '<': return nativeBoolToBooleanObj(leftVal < rightVal);
      case '>': return nativeBoolToBooleanObj(leftVal > rightVal);
      case '==': return nativeBoolToBooleanObj(leftVal === rightVal);
      case '!=': return nativeBoolToBooleanObj(leftVal !== rightVal);
    }
  }

  if (operator === '==') return nativeBoolToBooleanObj(left === right);
  if (operator === '!=') return nativeBoolToBooleanObj(left !== right);

  if (left.type() !== right.type()) {
    return new obj.ErrorObj(`type mismatch: ${left.type()} ${operator} ${right.type()}`);
  }

  return new obj.ErrorObj(`unknown operator: ${left.type()} ${operator} ${right.type()}`);
}

function isTruthy(objt: obj.BObject | null): boolean {
  if (objt === NULL) return false;
  if (objt === TRUE) return true;
  if (objt === FALSE) return false;
  return true;
}

function evalIdentifier(node: any, env: Environment): obj.BObject | obj.ErrorObj {
  const val = env.get(node.value);
  if (val !== undefined) return val;
  return new obj.ErrorObj(`identifier not found: ${node.value}`);
}

function applyFunction(fn: obj.BObject, args: obj.BObject[]): obj.BObject | obj.ErrorObj {
  if (fn instanceof obj.FunctionObj) {
    const extendedEnv = newEnclosedEnvironment(fn.env);
    for (let i = 0; i < fn.parameters.length; i++) {
      extendedEnv.set(fn.parameters[i].value, args[i]);
    }
    const evaluated = evaluate(fn.body, extendedEnv);
    if (evaluated instanceof obj.ReturnValue) return evaluated.value;
    return evaluated!;
  }

  return new obj.ErrorObj(`not a function: ${fn.type()}`);
}
