import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import CodeBlock from './CodeBlock';
import { CodeSnippet as CodeSnippetType } from './CodeDocuments' ;

interface DocSectionProps extends CodeSnippetType {
    className?: string;
}

const fadeIn: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1] as any
        }
    }
};


interface DocumentationGridProps {
    sections: CodeSnippetType[];
    columns?: 1 | 2 | 3;
    className?: string;
}

const DocSection: React.FC<DocSectionProps> = ({
    title,
    description,
    code,
    language,
    className
}) => {
    return (
        <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className={cn("h-full", className)}
        >
            <h2 className="text-xl font-bold mb-2 text-[#1F2937] dark:text-[#E5E7EB]">
                {title}
            </h2>
            {description && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-[#4B5563] dark:text-[#9CA3AF] mb-4 text-sm"
                >
                    {description}
                </motion.p>
            )}
            <CodeBlock code={code} language={language} />
        </motion.div>
    );
};

const DocumentationGrid: React.FC<DocumentationGridProps> = ({
    sections,
    columns = 2,
    className
}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={cn(
                'w-full max-w-[1400px] mx-auto p-4 font-satoshi',
                className
            )}
        >
            <style jsx global>{`
        ::-webkit-scrollbar {
          display: none;
        }
        html {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

            <motion.div
                className={cn(
                    'grid gap-6',
                    {
                        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3': columns === 3,
                        'grid-cols-1 md:grid-cols-2': columns === 2,
                        'grid-cols-1': columns === 1
                    }
                )}
            >
                {sections.map((section, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.5,
                            delay: index * 0.1
                        }}
                    >
                        <DocSection
                            title={section.title}
                            description={section.description}
                            code={section.code}
                            language={section.language}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default DocumentationGrid;