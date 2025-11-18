import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { newEnvironment } from "./environment";
import { evaluate } from "./evaluator";
import * as ast from "./ast";
import * as token from "./token";

export interface CompilationResult {
  success: boolean;
  errors: string[];
  output?: string; // inspected result of execution
  ast?: ast.Program;
}

export async function compileBrolang(code: string): Promise<CompilationResult> {
  const l = new Lexer(code);
  const p = new Parser(l);
  const program = p.parseProgram();
  if (p.errors.length > 0) {
    return { success: false, errors: p.errors, ast: program };
  }
  const env = newEnvironment();
  const evaluated = evaluate(program, env);
  if (evaluated && (evaluated as any).inspect) {
    return { success: true, errors: [], output: (evaluated as any).inspect(), ast: program };
  }
  return { success: true, errors: [], output: undefined, ast: program };
}

export default compileBrolang;
