'use client';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Keyboard, AlertCircle, ChevronDown, ChevronUp, Save, RotateCcw, X, LucideIcon } from 'lucide-react';

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

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  section: SectionKey;
  onClick: () => void;
  isExpanded: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon: Icon, title, section, onClick, isExpanded }) => (
  <motion.div
    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-colors"
    onClick={onClick}
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
  >
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-indigo-600" />
      <h3 className="font-semibold text-gray-800">{title}</h3>
    </div>
    {isExpanded ? (
      <ChevronUp className="w-5 h-5 text-gray-600" />
    ) : (
      <ChevronDown className="w-5 h-5 text-gray-600" />
    )}
  </motion.div>
);

export default function SyntaxEditor() {
  const [config, setConfig] = useState<BrolangConfig>(defaultConfig);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    keywords: true,
    precedences: false,
    prefixTokens: false,
    infixTokens: false,
    errors: false
  });

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('brolangConfig');
      if (stored) {
        try {
          const parsedConfig = JSON.parse(stored) as BrolangConfig;
          setConfig(parsedConfig);
        } catch {
          setConfig(defaultConfig);
        }
      }
    }
  }, [isOpen]);

  const toggleSection = (section: SectionKey): void => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateKeyword = (oldKey: string, newKey: string, value: string): void => {
    setConfig(prev => {
      const newKeywords: Keywords = { ...prev.tokens.keywords };
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

  const updatePrecedence = (operator: string, value: string): void => {
    setConfig(prev => ({
      ...prev,
      syntax: {
        ...prev.syntax,
        precedences: { ...prev.syntax.precedences, [operator]: parseInt(value) || 0 }
      }
    }));
  };

  const updateErrorMessage = (key: string, value: string): void => {
    setConfig(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        messages: { ...prev.errors.messages, [key]: value }
      }
    }));
  };

  const handleSave = (): void => {
    localStorage.setItem('brolangConfig', JSON.stringify(config));
    setIsOpen(false);
    window.location.reload();
  };

  const handleReset = (): void => {
    setConfig(defaultConfig);
    localStorage.setItem('brolangConfig', JSON.stringify(defaultConfig));
    window.location.reload();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-[#3e3e3e] hover:bg-[#2e2e2e] text-[#FDFDF9] dark:bg-[#FDFDF9] dark:text-[#3e3e3e] dark:hover:bg-[#ededde]">
          <Settings className="w-4 h-4" />
          Customize Syntax & Errors
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 bg-[#FDFDF9] dark:bg-[#3e3e3e]">
        <DialogHeader className="p-6 pb-4 border-b border-[#3e3e3e]/10 dark:border-[#FDFDF9]/10 bg-[#FDFDF9] dark:bg-[#3e3e3e]">
          <DialogTitle className="text-2xl font-bold text-[#3e3e3e] dark:text-[#FDFDF9]">
            Brolang Configuration
          </DialogTitle>
          <p className="text-sm text-[#3e3e3e]/70 dark:text-[#FDFDF9]/70 mt-2">
            Customize keywords, operators, and error messages for your Brolang compiler
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Keywords Section */}
          <div>
            <SectionHeader 
              icon={Keyboard} 
              title="Keywords" 
              section="keywords" 
              onClick={() => toggleSection('keywords')}
              isExpanded={expandedSections.keywords}
            />
            <AnimatePresence>
              {expandedSections.keywords && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-lg mt-2 border">
                    {Object.entries(config.tokens.keywords).map(([key, value]) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                      >
                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                          Keyword
                        </label>
                        <input
                          type="text"
                          value={key}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateKeyword(key, e.target.value, value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                          Token Type
                        </label>
                        <input
                          type="text"
                          value={value}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateKeyword(key, key, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Operator Precedences */}
          <div>
            <SectionHeader 
              icon={Settings} 
              title="Operator Precedences" 
              section="precedences"
              onClick={() => toggleSection('precedences')}
              isExpanded={expandedSections.precedences}
            />
            <AnimatePresence>
              {expandedSections.precedences && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg mt-2 border">
                    {Object.entries(config.syntax.precedences).map(([op, prec]) => (
                      <motion.div
                        key={op}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-2"
                      >
                        <label className="text-sm font-semibold text-gray-700 block text-center">
                          {op}
                        </label>
                        <input
                          type="number"
                          value={prec}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePrecedence(op, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Error Messages */}
          <div>
            <SectionHeader 
              icon={AlertCircle} 
              title="Error Messages" 
              section="errors"
              onClick={() => toggleSection('errors')}
              isExpanded={expandedSections.errors}
            />
            <AnimatePresence>
              {expandedSections.errors && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 p-4 bg-white rounded-lg mt-2 border">
                    {Object.entries(config.errors.messages).map(([key, message]) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-2"
                      >
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-mono">
                            {key}
                          </span>
                        </label>
                        <textarea
                          value={message}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateErrorMessage(key, e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="gap-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Default
          </Button>
          <Button
            onClick={handleSave}
            className="gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}