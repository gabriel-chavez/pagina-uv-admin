import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface SnackbarContextType {
    openSnackbar: (message: string, severity?: AlertColor) => void;
    closeSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

interface SnackbarProviderProps {
    children: ReactNode;
}

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');

    const openSnackbar = (message: string, severity: AlertColor = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const closeSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <SnackbarContext.Provider value={{ openSnackbar, closeSnackbar }}>
            {children}
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={snackbarOpen}
                autoHideDuration={10000}
                onClose={closeSnackbar}
                sx={{ zIndex: 9999 }}
            >
                <Alert onClose={closeSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = (): SnackbarContextType => {
    const context = useContext(SnackbarContext);
    if (context === undefined) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};
