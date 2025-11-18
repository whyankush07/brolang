'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import DocumentationGrid from './docsComponents/DocsGrid';
import { documentationSections } from './docsComponents/CodeDocuments';
import { useCode } from '@/context/CodeContext';
import { EnglishDocuments } from './docsComponents/EnglishDocuments';


export default function DocumentationPage() {

    return (
        <div className={cn(
            'min-h-screen font-satoshi antialiased',
            'bg-[#FDFDF9] dark:bg-[#060606]',
            'pt-32 pb-16'
        )}>
            <DocumentationGrid
                sections={documentationSections}
                columns={3}
            />
        </div>
    );
};
