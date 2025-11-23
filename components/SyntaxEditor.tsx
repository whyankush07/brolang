'use client';
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Settings, Keyboard, AlertCircle, ChevronDown, ChevronUp, Save, RotateCcw, X } from 'lucide-react';

interface Keywords {
  [key: string]: string;
}

interface Precedences {
  [key: string]: number;
}

interface ErrorMessages {
  [key: string]: string;
}

interface BrolangConfig {
  tokens: {
    keywords: Keywords;
  };
  syntax: {
    precedences: Precedences;
    prefixTokens: string[];
    infixTokens: string[];
  };
  errors: {
    messages: ErrorMessages;
  };
}

interface ExpandedSections {
  keywords: boolean;
  precedences: boolean;
  prefixTokens: boolean;
  infixTokens: boolean;
  errors: boolean;
}

type SectionKey = keyof ExpandedSections;

const defaultConfig: BrolangConfig = {
  tokens: {
    keywords: {
      bhai_sun: "LET",
      bol_bhai: "PRINT",
      suna_bhai: "INPUT",
      agar: "IF",
      nahi_to: "ELSE",
      nahi_to_agar: "ELSE_IF",
      jaha_tak: "WHILE",
      chal_bhai: "FOR",
      sach: "TRUE",
      jhuth: "FALSE",
      bas_kar_bhai: "BREAK",
      aage_bhad_bhai: "CONTINUE"
    }
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
      "(": 5
    },
    prefixTokens: [
      "IDENT", "INT", "STRING", "TRUE", "FALSE", "!", "-", "("
    ],
    infixTokens: [
      "+", "-", "/", "*", "%", "==", "!=", "<", ">", "<=", ">=", "("
    ]
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
      NOT_A_FUNCTION_ERROR: "Not a function: {type} - ye function nahi hai, call kaise karoge?"
    }
  }
};

const SectionHeader = ({ icon: Icon, title, onClick, isExpanded }: { icon: React.ComponentType<{ className?: string }>, title: string, onClick: () => void, isExpanded: boolean }) => (
  <button
    type="button"
    className="w-full flex items-center justify-between p-4 bg-[#3e3e3e]/5 dark:bg-[#FDFDF9]/5 rounded-lg hover:bg-[#3e3e3e]/10 dark:hover:bg-[#FDFDF9]/10 transition-colors"
    onClick={onClick}
  >
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-[#3e3e3e] dark:text-[#FDFDF9]" />
      <h3 className="font-semibold text-[#3e3e3e] dark:text-[#FDFDF9]">{title}</h3>
    </div>
    {isExpanded ? (
      <ChevronUp className="w-5 h-5 text-[#3e3e3e]/70 dark:text-[#FDFDF9]/70" />
    ) : (
      <ChevronDown className="w-5 h-5 text-[#3e3e3e]/70 dark:text-[#FDFDF9]/70" />
    )}
  </button>
);

export default function SyntaxEditor() {
  const [config, setConfig] = useState(defaultConfig);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    keywords: true,
    precedences: false,
    prefixTokens: false,
    infixTokens: false,
    errors: false
  });

  useEffect(() => {
    const stored = localStorage.getItem('brolangConfig');
    if (stored) {
      try {
        const parsedConfig = JSON.parse(stored);
        setConfig(parsedConfig);
      } catch {
        setConfig(defaultConfig);
      }
    }
  }, []);

    const toggleSection = (section: SectionKey) => {
      setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const updateKeyword = (oldKey: string, newKey: string, value: string) => {
    setConfig(prev => {
      const newKeywords = { ...prev.tokens.keywords };
      if (oldKey !== newKey) {
        delete newKeywords[oldKey];
      }
      newKeywords[newKey] = value;
      return {
        ...prev,
        tokens: { ...prev.tokens, keywords: newKeywords }
      };
    });
  };

  const updatePrecedence = (operator: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      syntax: {
        ...prev.syntax,
        precedences: { ...prev.syntax.precedences, [operator]: parseInt(value) || 0 }
      }
    }));
  };

  const updateErrorMessage = (key: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        messages: { ...prev.errors.messages, [key]: value }
      }
    }));
  };

  const handleSave = () => {
    localStorage.setItem('brolangConfig', JSON.stringify(config));
    setIsOpen(false);
    window.location.reload();
  };

  const handleReset = () => {
    setConfig(defaultConfig);
    localStorage.setItem('brolangConfig', JSON.stringify(defaultConfig));
    window.location.reload();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="gap-2 bg-[#3e3e3e] hover:bg-[#2e2e2e] text-[#FDFDF9] dark:bg-[#FDFDF9] dark:text-[#3e3e3e] dark:hover:bg-[#ededde]">
          <Settings className="w-4 h-4" />
          Customize Syntax
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-hidden flex flex-col p-0 bg-[#FDFDF9] dark:bg-[#3e3e3e]">
        <SheetHeader className="p-6 pb-4 border-b border-[#3e3e3e]/10 dark:border-[#FDFDF9]/10">
          <SheetTitle className="text-2xl font-bold text-[#3e3e3e] dark:text-[#FDFDF9]">
            Brolang Configuration
          </SheetTitle>
          <p className="text-sm text-[#3e3e3e]/70 dark:text-[#FDFDF9]/70 mt-2">
            Customize keywords, operators, and error messages
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Keywords Section */}
          <div>
            <SectionHeader 
              icon={Keyboard} 
              title="Keywords" 
              onClick={() => toggleSection('keywords')}
              isExpanded={expandedSections.keywords}
            />
            {expandedSections.keywords && (
              <div className="grid grid-cols-1 gap-4 p-4 bg-[#FDFDF9] dark:bg-[#2e2e2e] rounded-lg mt-2 border border-[#3e3e3e]/10 dark:border-[#FDFDF9]/10">
                {Object.entries(config.tokens.keywords).map(([key, value]) => (
                  <div key={key} className="space-y-2 p-3 bg-white dark:bg-[#3e3e3e] rounded-lg border border-[#3e3e3e]/10 dark:border-[#FDFDF9]/10">
                    <label className="text-xs font-medium text-[#3e3e3e]/70 dark:text-[#FDFDF9]/70 uppercase tracking-wide">
                      Keyword
                    </label>
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => updateKeyword(key, e.target.value, value)}
                      className="w-full px-3 py-2 border border-[#3e3e3e]/20 dark:border-[#FDFDF9]/20 rounded-lg bg-[#FDFDF9] dark:bg-[#2e2e2e] text-[#3e3e3e] dark:text-[#FDFDF9] focus:ring-2 focus:ring-[#3e3e3e] dark:focus:ring-[#FDFDF9] focus:border-transparent transition-all"
                    />
                    <label className="text-xs font-medium text-[#3e3e3e]/70 dark:text-[#FDFDF9]/70 uppercase tracking-wide">
                      Token Type
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateKeyword(key, key, e.target.value)}
                      className="w-full px-3 py-2 border border-[#3e3e3e]/20 dark:border-[#FDFDF9]/20 rounded-lg bg-[#FDFDF9] dark:bg-[#2e2e2e] text-[#3e3e3e] dark:text-[#FDFDF9] focus:ring-2 focus:ring-[#3e3e3e] dark:focus:ring-[#FDFDF9] focus:border-transparent transition-all"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Operator Precedences */}
          <div>
            <SectionHeader 
              icon={Settings} 
              title="Operator Precedences" 
              onClick={() => toggleSection('precedences')}
              isExpanded={expandedSections.precedences}
            />
            {expandedSections.precedences && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-[#FDFDF9] dark:bg-[#2e2e2e] rounded-lg mt-2 border border-[#3e3e3e]/10 dark:border-[#FDFDF9]/10">
                {Object.entries(config.syntax.precedences).map(([op, prec]) => (
                  <div key={op} className="space-y-2 p-3 bg-white dark:bg-[#3e3e3e] rounded-lg border border-[#3e3e3e]/10 dark:border-[#FDFDF9]/10">
                    <label className="text-sm font-semibold text-[#3e3e3e] dark:text-[#FDFDF9] block text-center">
                      {op}
                    </label>
                    <input
                      type="number"
                      value={prec}
                      onChange={(e) => updatePrecedence(op, e.target.value)}
                      className="w-full px-3 py-2 border border-[#3e3e3e]/20 dark:border-[#FDFDF9]/20 rounded-lg text-center bg-[#FDFDF9] dark:bg-[#2e2e2e] text-[#3e3e3e] dark:text-[#FDFDF9] focus:ring-2 focus:ring-[#3e3e3e] dark:focus:ring-[#FDFDF9] focus:border-transparent transition-all"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error Messages */}
          <div>
            <SectionHeader 
              icon={AlertCircle} 
              title="Error Messages" 
              onClick={() => toggleSection('errors')}
              isExpanded={expandedSections.errors}
            />
            {expandedSections.errors && (
              <div className="space-y-4 p-4 bg-[#FDFDF9] dark:bg-[#2e2e2e] rounded-lg mt-2 border border-[#3e3e3e]/10 dark:border-[#FDFDF9]/10">
                {Object.entries(config.errors.messages).map(([key, message]) => (
                  <div key={key} className="space-y-2 p-3 bg-white dark:bg-[#3e3e3e] rounded-lg border border-[#3e3e3e]/10 dark:border-[#FDFDF9]/10">
                    <label className="text-sm font-medium text-[#3e3e3e] dark:text-[#FDFDF9] flex items-center gap-2">
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-xs font-mono">
                        {key}
                      </span>
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => updateErrorMessage(key, e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-[#3e3e3e]/20 dark:border-[#FDFDF9]/20 rounded-lg bg-[#FDFDF9] dark:bg-[#2e2e2e] text-[#3e3e3e] dark:text-[#FDFDF9] focus:ring-2 focus:ring-[#3e3e3e] dark:focus:ring-[#FDFDF9] focus:border-transparent transition-all resize-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 p-6 border-t border-[#3e3e3e]/10 dark:border-[#FDFDF9]/10 bg-[#FDFDF9] dark:bg-[#2e2e2e]">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="gap-2 border-[#3e3e3e]/20 dark:border-[#FDFDF9]/20 text-[#3e3e3e] dark:text-[#FDFDF9] hover:bg-[#3e3e3e]/5 dark:hover:bg-[#FDFDF9]/5"
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="gap-2 border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Default
          </Button>
          <Button
            onClick={handleSave}
            className="gap-2 bg-[#3e3e3e] hover:bg-[#2e2e2e] text-[#FDFDF9] dark:bg-[#FDFDF9] dark:text-[#3e3e3e] dark:hover:bg-[#ededde]"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}