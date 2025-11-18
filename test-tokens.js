const { Lexer } = require('./compiler/lexer');
const { getBrolangConfig } = require('./compiler/config/getBrolangConfig');

const code = 'chal_bhai(bhai_sun i = 0; i < 10; i = i + 1) { bol_bhai(i); }';
const config = {
  tokens: {
    keywords: {
      "bhai_sun": "LET",
      "bol_bhai": "PRINT",
      "chal_bhai": "FOR",
      "sach": "TRUE",
      "jhuth": "FALSE",
      "bas_kar_bhai": "BREAK",
      "aage_bhad_bhai": "CONTINUE",
      "agar": "IF",
      "nahi_to": "ELSE",
      "nahi_to_agar": "ELSE_IF",
      "jaha_tak": "WHILE",
      "suna_bhai": "INPUT"
    }
  }
};

const l = new Lexer(code, config);
let tok = l.nextToken();
console.log('Tokens:');
while (tok.type !== 'EOF') {
  console.log(`  Type: ${tok.type}, Literal: "${tok.literal}"`);
  tok = l.nextToken();
}
