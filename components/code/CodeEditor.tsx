'use client';
import { Editor } from '@monaco-editor/react';
import { useCode } from '@/context/CodeContext';
import { useTheme } from 'next-themes';
import { getBrolangConfig } from '@/compiler/config/getBrolangConfig';

declare global {
  interface Window {
    monaco: typeof import('monaco-editor');
  }
}

export const CodeEditor = () => {
  const { codeState, setCode } = useCode();
  const { theme } = useTheme();

  const handleEditorMount = (editor: import('monaco-editor').editor.IStandaloneCodeEditor, monaco: typeof import('monaco-editor')) => {
    window.monaco = monaco;

    const config = getBrolangConfig();

    monaco.languages.register({ id: 'brolang' });

    monaco.languages.setMonarchTokensProvider('brolang', {
      defaultToken: 'invalid',

      keywords: Object.keys(config.tokens.keywords),

      operators: [
        '=', '+', '-', '!', '*', '/', '%',
        '<', '>', '==', '!=', '>=', '<='
      ],

      // brackets: [
      //   ['{', '}', 'delimiter.curly'],
      //   ['[', ']', 'delimiter.square'],
      //   ['(', ')', 'delimiter.parenthesis']
      // ],

      symbols: /[=><!~?:&|+\-*\/\^%]+/,

      digits: /\d+(_+\d+)*/,
      identifiers: /[a-zA-Z_][\w$]*/,

      tokenizer: {
        root: [
          [/[a-zA-Z_][\w$]*/, {
            cases: {
              '@keywords': 'keyword',
              '@default': 'identifier'
            }
          }],

          { include: '@whitespace' },

          [/[{}()\[\]]/, '@brackets'],
          [/[,;]/, 'delimiter'],

          [/@digits/, 'number'],

          [/@symbols/, {
            cases: {
              '@operators': 'operator',
              '@default': 'symbol'
            }
          }],

          [/"([^"\\]|\\.)*$/, 'string.invalid'],
          [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
          [/'([^'\\]|\\.)*$/, 'string.invalid'],
          [/'/, { token: 'string.quote', bracket: '@open', next: '@string_single' }],
        ],

        string: [
          [/[^\\"]+/, 'string'],
          [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
        ],

        string_single: [
          [/[^\\']+/, 'string'],
          [/'/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
        ],

        whitespace: [
          [/[ \t\r\n]+/, 'white'],
          [/\/\*/, 'comment', '@comment'],
          [/\/\/.*$/, 'comment'],
        ],

        comment: [
          [/[^\/*]+/, 'comment'],
          [/\*\//, 'comment', '@pop'],
          [/[\/*]/, 'comment']
        ],
      }
    });

    monaco.languages.registerCompletionItemProvider('bhailang', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };
        return {
          suggestions: Object.keys(config.tokens.keywords).map(keyword => ({
            label: keyword,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: keyword,
            range: range
          }))
        };
      }
    });

    monaco.languages.setLanguageConfiguration('brolang', {
      comments: {
        lineComment: '//',
        blockComment: ['/*', '*/']
      },
      brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')']
      ],
      autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" }
      ],
      surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" }
      ],
      wordPattern: /(-?\d*\.\d\w*)|([^`~!@#%^&*()\-=+[{\]}\\|;:'".,<>\/?\s]+)/g,
    });

    if (theme === 'dark') {
      monaco.editor.defineTheme('brolang-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'keyword', foreground: '#FF92D0' },
          { token: 'identifier', foreground: '#61AFEF' },
          { token: 'string', foreground: '#98C379' },
          { token: 'number', foreground: '#D19A66' },
          { token: 'operator', foreground: '#56B6C2' },
          { token: 'comment', foreground: '#7F848E', fontStyle: 'italic' },
          { token: 'delimiter', foreground: '#ABB2BF' }
        ],
        colors: {
          'editor.background': '#282C34',
          'editor.foreground': '#ABB2BF',
          'editor.lineHighlightBackground': '#2C313C',
          'editorCursor.foreground': '#528BFF',
          'editor.selectionBackground': '#3E4451',
          'editor.inactiveSelectionBackground': '#3E4451'
        }
      });
      monaco.editor.setTheme('brolang-dark');
    } else {
      monaco.editor.defineTheme('brolang-light', {
        base: 'vs',
        inherit: true,
        rules: [
          { token: 'keyword', foreground: '#D73A49' },
          { token: 'identifier', foreground: '#24292E' },
          { token: 'string', foreground: '#032F62' },
          { token: 'number', foreground: '#005CC5' },
          { token: 'operator', foreground: '#D73A49' },
          { token: 'comment', foreground: '#6A737D', fontStyle: 'italic' },
          { token: 'delimiter', foreground: '#24292E' }
        ],
        colors: {
          'editor.background': '#FFFFFF',
          'editor.foreground': '#24292E',
          'editor.lineHighlightBackground': '#F6F8FA',
          'editorCursor.foreground': '#24292E',
          'editor.selectionBackground': '#B4D5FE',
          'editor.inactiveSelectionBackground': '#B4D5FE'
        }
      });
      monaco.editor.setTheme('brolang-light');
    }
  };

  return (
    <div className="relative w-full h-[60vh] p-[2px] rounded-lg overflow-hidden before:content-[''] before:absolute before:inset-0 before:z-[-1] before:animate-pulse before:bg-gradient-to-r before:from-blue-500 before:via-purple-500 before:to-pink-500">
      <div className="w-full h-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
        <Editor
          height="100%"
          width="100%"
          defaultLanguage="brolang"
          value={codeState.code}
          onChange={(value) => setCode(value || '')}
          onMount={handleEditorMount}
          options={{
            tabSize: 2,
            automaticLayout: true,
            formatOnType: true,
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'monospace',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            roundedSelection: false,
            wordWrap: 'on',
          }}
          className="transition-colors duration-200"
        />
      </div>
    </div>
  );
};

export default CodeEditor;