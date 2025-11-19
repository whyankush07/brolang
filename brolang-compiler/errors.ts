import { BrolangConfig } from './config/defaultConfig';

export type ErrorType = string;

export const PARSE_INTEGER_ERROR: ErrorType = "PARSE_INTEGER_ERROR";
export const NO_PREFIX_PARSE_FN_ERROR: ErrorType = "NO_PREFIX_PARSE_FN_ERROR";
export const EXPECTED_TOKEN_ERROR: ErrorType = "EXPECTED_TOKEN_ERROR";
export const UNKNOWN_PREFIX_OPERATOR_ERROR: ErrorType = "UNKNOWN_PREFIX_OPERATOR_ERROR";
export const UNKNOWN_INFIX_OPERATOR_ERROR: ErrorType = "UNKNOWN_INFIX_OPERATOR_ERROR";
export const TYPE_MISMATCH_ERROR: ErrorType = "TYPE_MISMATCH_ERROR";
export const IDENTIFIER_NOT_FOUND_ERROR: ErrorType = "IDENTIFIER_NOT_FOUND_ERROR";
export const NOT_A_FUNCTION_ERROR: ErrorType = "NOT_A_FUNCTION_ERROR";

const defaultErrorMessages: Record<ErrorType, string> = {
  [PARSE_INTEGER_ERROR]: "Arre bhai, ye number nahi hai: '{literal}' - kya kar raha hai tu?",
  [NO_PREFIX_PARSE_FN_ERROR]: "Bhai, is '{token}' ke liye koi parse function nahi mila - galat syntax hai!",
  [EXPECTED_TOKEN_ERROR]: "Expected tha '{expected}', mila '{got}' - syntax thik kar bhai!",
  [UNKNOWN_PREFIX_OPERATOR_ERROR]: "Unknown operator: {operator}{type} - ye operator kaise use kar raha hai?",
  [UNKNOWN_INFIX_OPERATOR_ERROR]: "Unknown operator: {leftType} {operator} {rightType} - ye combination galat hai!",
  [TYPE_MISMATCH_ERROR]: "Type mismatch: {leftType} {operator} {rightType} - types match nahi kar rahe!",
  [IDENTIFIER_NOT_FOUND_ERROR]: "Identifier not found: '{identifier}' - ye variable kahan se laoge?",
  [NOT_A_FUNCTION_ERROR]: "Not a function: {type} - ye function nahi hai, call kaise karoge?",
};

export function getErrorMessage(errorType: ErrorType, replacements: Record<string, string> = {}, config?: BrolangConfig): string {
  const messages = config ? { ...defaultErrorMessages, ...config.errors.messages } : defaultErrorMessages;
  let message = messages[errorType];
  if (!message) {
    return `Unknown error type: ${errorType}`;
  }

  for (const [key, value] of Object.entries(replacements)) {
    message = message.replace(new RegExp(`{${key}}`, 'g'), value);
  }

  return message;
}

export function parseIntegerError(literal: string, config?: BrolangConfig): string {
  return getErrorMessage(PARSE_INTEGER_ERROR, { literal }, config);
}

export function noPrefixParseFnError(token: string, config?: BrolangConfig): string {
  return getErrorMessage(NO_PREFIX_PARSE_FN_ERROR, { token }, config);
}

export function expectedTokenError(expected: string, got: string, config?: BrolangConfig): string {
  return getErrorMessage(EXPECTED_TOKEN_ERROR, { expected, got }, config);
}

export function unknownPrefixOperatorError(operator: string, type: string, config?: BrolangConfig): string {
  return getErrorMessage(UNKNOWN_PREFIX_OPERATOR_ERROR, { operator, type }, config);
}

export function unknownInfixOperatorError(leftType: string, operator: string, rightType: string, config?: BrolangConfig): string {
  return getErrorMessage(UNKNOWN_INFIX_OPERATOR_ERROR, { leftType, operator, rightType }, config);
}

export function typeMismatchError(leftType: string, operator: string, rightType: string, config?: BrolangConfig): string {
  return getErrorMessage(TYPE_MISMATCH_ERROR, { leftType, operator, rightType }, config);
}

export function identifierNotFoundError(identifier: string, config?: BrolangConfig): string {
  return getErrorMessage(IDENTIFIER_NOT_FOUND_ERROR, { identifier }, config);
}

export function notAFunctionError(type: string, config?: BrolangConfig): string {
  return getErrorMessage(NOT_A_FUNCTION_ERROR, { type }, config);
}