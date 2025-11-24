import { useToast } from '@/hooks/use-toast';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import axios, { AxiosError } from 'axios';
import {toast} from 'sonner';

interface BugReportProps {
    setIsBugOpen: (isOpen: boolean) => void;
}

const BugReport: React.FC<BugReportProps> = ({ setIsBugOpen }) => {
    const [bugDescription, setBugDescription] = useState<string>('');
    const [isSending, setIsSending] = useState<boolean>(false);

    const handleSubmit = async () => {
        setIsSending(true);
        try {
            const response = await axios.post('/api/bug/report', { bugDescription }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 201) {
                toast.success(response.data.message);
                setIsBugOpen(false);
            } else {
                toast.error('Failed to report the bug. Please try again later.');
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ success: boolean, message: string }>;
            console.error('Error reporting bug:', axiosError);
            const errorMessage = axiosError.response?.data.message;
            toast.error(errorMessage);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="absolute right-0 mt-2 w-64 bg-[#FDFDF9] dark:bg-[#3e3e3e] shadow-lg rounded-lg p-4 z-50">
            <h3 className="text-sm font-semibold mb-2">Report a Bug</h3>
            <textarea
                value={bugDescription}
                onChange={(e) => setBugDescription(e.target.value)}
                className="w-full h-24 p-2 border border-gray-300 dark:border-gray-700 rounded resize-none"
                placeholder="Describe the issue..."
            />
            <Button
                onClick={handleSubmit}
                disabled={isSending}
                variant={'default'}
                className='w-full'
            >
                {isSending ? 'Sending...' : 'Send'}
            </Button>
        </div>
    );
};

export default BugReport;