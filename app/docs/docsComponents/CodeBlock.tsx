import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon, CopyIcon } from "lucide-react";

interface CodeBlockProps {
    code: string;
    language: string;
    className?: string;
}

const expandCollapse: Variants = {
    collapsed: {
        height: 160,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1] as any
        }
    },
    expanded: {
        height: 'auto',
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1] as any
        }
    }
};

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, className }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { toast } = useToast();

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(code.trim())
            .then(() => {
                toast({
                    title: "Copied to clipboard",
                    description: "Code snippet has been copied",
                });
            })
            .catch(() => {
                toast({
                    title: "Error",
                    description: "Failed to copy content",
                    variant: "destructive",
                });
            });
    };

    return (
        <Card className={cn(
            "border border-[#E2E2E2] dark:border-[#4a4a4a] overflow-hidden",
            className
        )}>
            <CardContent className="relative p-4">
                <motion.div
                    initial="collapsed"
                    animate={isExpanded ? "expanded" : "collapsed"}
                    variants={expandCollapse}
                    className="overflow-hidden"
                >
                    <pre className={cn(
                        "bg-[#1F2937] dark:bg-[#2D2D2D] p-4 rounded-lg overflow-x-auto text-sm",
                        "text-[#E5E7EB] font-mono leading-relaxed"
                    )}>
                        <code className={`language-${language}`}>{code.trim()}</code>
                    </pre>
                </motion.div>

                <motion.div
                    className="absolute top-3 right-3 flex space-x-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-[#F3F3F0] dark:hover:bg-[#4a4a4a] rounded-lg"
                            onClick={handleCopyToClipboard}
                        >
                            <CopyIcon className="h-4 w-4" />
                        </Button>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-[#F3F3F0] dark:hover:bg-[#4a4a4a] rounded-lg"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            <motion.div
                                initial={false}
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {isExpanded ? (
                                    <ChevronUpIcon className="h-4 w-4" />
                                ) : (
                                    <ChevronDownIcon className="h-4 w-4" />
                                )}
                            </motion.div>
                        </Button>
                    </motion.div>
                </motion.div>

                <AnimatePresence>
                    {!isExpanded && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#FDFDF9] dark:from-[#3e3e3e] to-transparent pointer-events-none"
                        />
                    )}
                </AnimatePresence>
            </CardContent>

            <AnimatePresence>
                {!isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Button
                            variant="ghost"
                            className="w-full text-sm hover:bg-[#F3F3F0] dark:hover:bg-[#4a4a4a]"
                            onClick={() => setIsExpanded(true)}
                        >
                            Show more
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
};

export default CodeBlock;