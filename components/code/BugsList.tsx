'use client';
import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useToast } from '@/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, CheckSquare } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'

interface Bug {
    id: string;
    bug: string;
    status: 'OPEN' | 'CLOSED';
    createdAt: string;
}

type ActionType = 'DELETE' | 'UPDATE';

export default function BugList() {
    const [bugs, setBugs] = useState<Bug[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [password, setPassword] = useState<string>('');
    const [selectedBug, setSelectedBug] = useState<string | null>(null);
    const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
    const [currentAction, setCurrentAction] = useState<ActionType>('UPDATE');
    const { data: session } = useSession();
    const router = useRouter();

    const fetchBugs = async () => {
        if (session?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
            setLoading(false);
            toast.error('Unauthorized Access');
            router.push('/');
            return;
        }
        try {
            const response = await axios.get('/api/bug/report');
            setBugs(response.data.bugs);
        } catch (error) {
            const axiosError = error as AxiosError<{ success: boolean, message: string }>;
            const errorMessage = axiosError.response?.data.message || 'Failed to fetch bugs';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBugs();
    }, []);

    const handleAction = async (bugId: string, action: ActionType) => {
        setSelectedBug(bugId);
        setCurrentAction(action);
        setShowPasswordModal(true);
    };

    const handlePasswordSubmit = async () => {
        try {
            if (currentAction === 'UPDATE') {
                await axios.put('/api/bug/report',
                    {
                        bugId: selectedBug,
                        status: 'CLOSED'
                    },
                    {
                        headers: {
                            'x-auth-password': password
                        }
                    }
                );
            } else {
                await axios.delete('/api/bug/report',
                    {
                        data: { bugId: selectedBug },
                        headers: {
                            'x-auth-password': password
                        }
                    }
                );
            }

            await fetchBugs();
            setShowPasswordModal(false);
            setPassword('');
            toast.success(`Bug ${currentAction === 'UPDATE' ? 'updated' : 'deleted'} successfully`);
        } catch (error) {
            const axiosMessage = error as AxiosError<{ success: boolean, message: string }>;
            const errorMessage = axiosMessage.response?.data.message || `Failed to ${currentAction.toLowerCase()} bug`;
            toast.error(errorMessage);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4 bg-[#FDFDF9] dark:bg-[#3e3e3e] rounded-lg pt-20">
            <h2 className="text-xl font-bold mb-4">Reported Bugs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {bugs.map((bug) => (
                    <div
                        key={bug.id}
                        className="p-4 border dark:border-gray-700 rounded-lg flex items-center justify-between"
                    >
                        <div>
                            <p className="mb-2">{bug.bug}</p>
                            <p className="text-sm text-gray-500">
                                {new Date(bug.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className={`px-2 py-1 rounded-full text-sm ${bug.status === 'OPEN'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                }`}>
                                {bug.status}
                            </span>
                            <div className="flex space-x-2">
                                {bug.status === 'OPEN' && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleAction(bug.id, 'UPDATE')}
                                    >
                                        <CheckSquare className="h-4 w-4" />
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleAction(bug.id, 'DELETE')}
                                >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enter Admin Password</DialogTitle>
                    </DialogHeader>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                    />
                    <Button onClick={handlePasswordSubmit}>Submit</Button>
                </DialogContent>
            </Dialog>
        </div>
    );
}