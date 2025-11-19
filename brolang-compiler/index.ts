import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { newEnvironment } from "./environment";
import { evaluate } from "./evaluator";
import * as ast from "./ast";
import { getBrolangConfig } from './config/getBrolangConfig';
import * as obj from "./object";

export interface CompilationResult {
  success: boolean;
  errors: string[];
  output?: string;
  ast?: ast.Program;
}

export async function compileBrolang(code: string): Promise<CompilationResult> {
  const config = getBrolangConfig();
  const l = new Lexer(code, config);
  const p = new Parser(l, config);
  const program = p.parseProgram();
  if (p.errors.length > 0) {
    return { success: false, errors: p.errors, ast: program };
  }
  const env = newEnvironment();
  const evaluated = evaluate(program, env);
  if (evaluated instanceof obj.ErrorObj) {
    return { success: false, errors: [evaluated.message], ast: program };
  }
  return { success: true, errors: [], output: env.prints.join('\n'), ast: program };
}

export default compileBrolang;
