export interface BrolangTokenConfig {
  keywords: Record<string, string>; // Maps keyword literals to token types
}

export interface BrolangSyntaxConfig {
  precedences: Record<string, number>;
  prefixTokens: string[];
  infixTokens: string[];
}

export interface BrolangErrorConfig {
  messages: Record<string, string>;
}

export interface BrolangConfig {
  tokens: BrolangTokenConfig;
  syntax: BrolangSyntaxConfig;
  errors: BrolangErrorConfig;
}

export const defaultConfig: BrolangConfig = {
  tokens: {
    keywords: {
      "bhai_sun": "LET",
      "bol_bhai": "PRINT",
      "suna_bhai": "INPUT",
      "agar": "IF",
      "nahi_to": "ELSE",
      "nahi_to_agar": "ELSE_IF",
      "jaha_tak": "WHILE",
      "chal_bhai": "FOR",
      "sach": "TRUE",
      "jhuth": "FALSE",
      "bas_kar_bhai": "BREAK",
      "aage_bhad_bhai": "CONTINUE",
    },
  },
  syntax: {
    precedences: {
      "==": 1,
      "!=": 1,
      "<": 2,
      ">": 2,
      "<=": 2,
      ">=": 2,
      "+": 3,
      "-": 3,
      "/": 4,
      "*": 4,
      "%": 4,
      "(": 5,
    },
    prefixTokens: ["IDENT", "INT", "STRING", "TRUE", "FALSE", "!", "-", "("],
    infixTokens: ["+", "-", "/", "*", "%", "==", "!=", "<", ">", "<=", ">=", "("],
  },
  errors: {
    messages: {
      PARSE_INTEGER_ERROR: "Arre bhai, ye number nahi hai: '{literal}' - kya kar raha hai tu?",
      NO_PREFIX_PARSE_FN_ERROR: "Bhai, is '{token}' ke liye koi parse function nahi mila - galat syntax hai!",
      EXPECTED_TOKEN_ERROR: "Expected tha '{expected}', mila '{got}' - syntax thik kar bhai!",
      UNKNOWN_PREFIX_OPERATOR_ERROR: "Unknown operator: {operator}{type} - ye operator kaise use kar raha hai?",
      UNKNOWN_INFIX_OPERATOR_ERROR: "Unknown operator: {leftType} {operator} {rightType} - ye combination galat hai!",
      TYPE_MISMATCH_ERROR: "Type mismatch: {leftType} {operator} {rightType} - types match nahi kar rahe!",
      IDENTIFIER_NOT_FOUND_ERROR: "Identifier not found: '{identifier}' - ye variable kahan se laoge?",
      NOT_A_FUNCTION_ERROR: "Not a function: {type} - ye function nahi hai, call kaise karoge?",
    },
  },
};