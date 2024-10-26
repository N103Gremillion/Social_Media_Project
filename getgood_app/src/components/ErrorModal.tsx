import React from 'react';
import { Modal } from 'react-bootstrap';

interface ErrorModalProps {
    errorMessage: string;
    close: () => void;
    isOpen: boolean;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
    errorMessage,
    close,
    isOpen
    }) => {
        return(
            <Modal show={isOpen} onHide={close}>
                <Modal.Header closeButton>{errorMessage}</Modal.Header>
            </Modal>
        )
    };

export default ErrorModal;
