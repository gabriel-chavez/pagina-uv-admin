import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

// Definir las interfaces
interface SnackbarContextType {
    openSnackbar: (message: string, severity?: AlertColor) => void;
    closeSnackbar: () => void;
}

// Crear el contexto
const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

// Instancia global que usaremos en Axios
let snackbarInstance: SnackbarContextType | undefined;

// Definir el proveedor del contexto
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

    const snackbarContextValue: SnackbarContextType = {
        openSnackbar,
        closeSnackbar,
    };

    // Guardamos la instancia global
    snackbarInstance = snackbarContextValue;

    return (
        <SnackbarContext.Provider value={snackbarContextValue}>
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

// Hook para utilizar el Snackbar dentro de componentes React
export const useSnackbar = (): SnackbarContextType => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};

// Función global para usar en Axios
export const openGlobalSnackbar = (message: string, severity: AlertColor = 'error') => {
    if (snackbarInstance) {
        snackbarInstance.openSnackbar(message, severity);
    }
};
