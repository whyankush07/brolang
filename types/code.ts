export interface CodeState {
    code: string;
    response: string;
    isLoading: boolean;
}

export interface CodeContextType {
    codeState: CodeState;
    setCode: (code: string) => void;
    submitCode: () => Promise<void>;
}