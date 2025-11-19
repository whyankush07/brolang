import * as ast from "./ast";
import * as obj from "./object";
import { Environment, newEnclosedEnvironment } from "./environment";
import * as errors from "./errors";

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

  if (node.constructor.name === 'StringLiteral') {
    return new obj.StringObj(node.value);
  }

  if (node.constructor.name === 'BooleanLiteral') {
    return nativeBoolToBooleanObj(node.value);
  }

  if (node.constructor.name === 'ArrayLiteral') {
    const elements = evalExpressions(node.elements, env);
    if (elements.length === 1 && elements[0] instanceof obj.ErrorObj) {
      return elements[0];
    }
    return new obj.ArrayObj(elements);
  }

  if (node.constructor.name === 'IndexExpression') {
    const left = evaluate(node.left, env);
    if (left instanceof obj.ErrorObj) return left;
    const index = evaluate(node.index, env);
    if (index instanceof obj.ErrorObj) return index;
    return evalIndexExpression(left!, index!);
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
      if (node.alternative.constructor.name === 'IfExpression') {
        return evaluate(node.alternative, env);
      } else {
        return evaluate(node.alternative, env);
      }
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

  if (node.constructor.name === 'AssignmentStatement') {
    const val = evaluate(node.value, env);
    if (val instanceof obj.ErrorObj) return val;
    env.set(node.name.value, val!);
    return null;
  }

  if (node.constructor.name === 'WhileStatement') {
    let result: obj.BObject | null = null;
    while (true) {
      const condition = evaluate(node.condition, env);
      if (condition instanceof obj.ErrorObj) return condition;
      if (!isTruthy(condition)) break;
      result = evaluate(node.body, env);
      if (result instanceof obj.ReturnValue || result instanceof obj.ErrorObj) return result;
      if (result instanceof obj.Break) break;
      if (result instanceof obj.Continue) continue;
    }
    return result;
  }

  if (node.constructor.name === 'ForStatement') {
    // Execute initialization
    if (node.init) {
      const initResult = evaluate(node.init, env);
      if (initResult instanceof obj.ErrorObj) return initResult;
    }
    
    let result: obj.BObject | null = null;
    while (true) {
      // Check condition
      if (node.condition) {
        const condition = evaluate(node.condition, env);
        if (condition instanceof obj.ErrorObj) return condition;
        if (!isTruthy(condition)) break;
      }
      
      // Execute body
      result = evaluate(node.body, env);
      if (result instanceof obj.ReturnValue || result instanceof obj.ErrorObj) return result;
      if (result instanceof obj.Break) break;
      if (result instanceof obj.Continue) {
        // Execute update before continuing
        if (node.update) {
          const updateResult = evaluate(node.update, env);
          if (updateResult instanceof obj.ErrorObj) return updateResult;
        }
        continue;
      }
      
      // Execute update
      if (node.update) {
        const updateResult = evaluate(node.update, env);
        if (updateResult instanceof obj.ErrorObj) return updateResult;
      }
    }
    return result;
  }

  if (node.constructor.name === 'BreakStatement') {
    return new obj.Break();
  }

  if (node.constructor.name === 'ContinueStatement') {
    return new obj.Continue();
  }

  if (node.constructor.name === 'PrintStatement') {
    const val = evaluate(node.value, env);
    if (val instanceof obj.ErrorObj) return val;
    env.prints.push(val!.inspect());
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
        return new obj.ErrorObj(errors.unknownPrefixOperatorError(operator, right.type()));
      }
      return new obj.Integer(-((right as obj.Integer).value));
    default:
      return new obj.ErrorObj(errors.unknownPrefixOperatorError(operator, right.type()));
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
      case '%': return new obj.Integer(leftVal % rightVal);
      case '<': return nativeBoolToBooleanObj(leftVal < rightVal);
      case '>': return nativeBoolToBooleanObj(leftVal > rightVal);
      case '<=': return nativeBoolToBooleanObj(leftVal <= rightVal);
      case '>=': return nativeBoolToBooleanObj(leftVal >= rightVal);
      case '==': return nativeBoolToBooleanObj(leftVal === rightVal);
      case '!=': return nativeBoolToBooleanObj(leftVal !== rightVal);
    }
  }

  if (operator === '==') return nativeBoolToBooleanObj(left === right);
  if (operator === '!=') return nativeBoolToBooleanObj(left !== right);

  if (left.type() !== right.type()) {
    return new obj.ErrorObj(errors.typeMismatchError(left.type(), operator, right.type()));
  }

  return new obj.ErrorObj(errors.unknownInfixOperatorError(left.type(), operator, right.type()));
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
  return new obj.ErrorObj(errors.identifierNotFoundError(node.value));
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

  return new obj.ErrorObj(errors.notAFunctionError(fn.type()));
}

function evalExpressions(exps: any[], env: Environment): obj.BObject[] {
  const result: obj.BObject[] = [];
  for (const e of exps) {
    const evaluated = evaluate(e, env);
    if (evaluated instanceof obj.ErrorObj) {
      return [evaluated];
    }
    if (evaluated) result.push(evaluated);
  }
  return result;
}

function evalIndexExpression(left: obj.BObject, index: obj.BObject): obj.BObject | obj.ErrorObj {
  if (left.type() === obj.ARRAY_OBJ && index.type() === obj.INTEGER_OBJ) {
    return evalArrayIndexExpression(left as obj.ArrayObj, index as obj.Integer);
  }
  return new obj.ErrorObj(`Index operator not supported: ${left.type()}`);
}

function evalArrayIndexExpression(array: obj.ArrayObj, index: obj.Integer): obj.BObject | obj.ErrorObj {
  const idx = index.value;
  const max = array.elements.length - 1;
  
  if (idx < 0 || idx > max) {
    return new obj.ErrorObj(`Aukaat m rehle aukaat m, ${idx} index pe kuch nahi hai! Bahar mat jaa array se!!`);
  }
  
  return array.elements[idx];
}
