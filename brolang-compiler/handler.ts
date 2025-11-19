// import { Environment } from './environment';
// import { Lexer } from './lexer';
// import { Parser } from './parser';
// import { evalNode } from './evaluator';
// import { Program } from './ast';

// let GlobalEnv: Environment;

// export function setGlobalEnvironment(env: Environment) {
//     GlobalEnv = env;
// }

// export interface CompileResponse {
//     result?: string;
//     error?: string;
// }

// export function compileCode(code: string): CompileResponse {
//     if (!code) {
//         return {
//             error: 'Kuchh likh to sahi be!',
//         };
//     }

//     try {
//         const lexer = new Lexer(code);
//         const parser = new Parser(lexer);
//         // const program = parser.parseProgram();
//         // const result = evalNode(program as Program, GlobalEnv);

//         // return {
//         //     result: result.inspect(),
//         // };
//     } catch (error) {
//         console.error('Compilation error:', error);
//         return {
//             error: 'An error occurred during compilation.',
//         };
//     }
// }