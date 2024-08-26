import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';

const ConfirmationDialog = ({ open, handleClose, handleConfirm, title, content }) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={handleConfirm}>Confirmar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
