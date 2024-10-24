import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface AddCheckpointModalProps {
    isOpen: boolean;
    close: () => void;
    saveChanges: () => void;
    deleteCheckpoint: () => void;
    checkpointName: string;
    setCheckpointName: (name: string) => void;
    checkpointDate: string;
    setCheckpointDate: (date: string) => void;
    clearCheckpointFields: () => void;
}

const AddCheckpointModal: React.FC<AddCheckpointModalProps> = ({
    isOpen,
    close,
    saveChanges,
    deleteCheckpoint,
    checkpointName,
    setCheckpointName,
    checkpointDate,
    setCheckpointDate,
    clearCheckpointFields
  }) => {
    const style = {
        backgroundColor: 'black',
        color: 'white'
    }
    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        saveChanges();
        close();
    };
    const handeDeleteCheckpoint = (e: React.FormEvent) => {
        e.preventDefault();
        deleteCheckpoint();
        close();
        
    };
    const handleClose = () => {
        clearCheckpointFields();
        close();
    }
    return (
        <Modal show={isOpen} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Checkpoint</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="checkpointName">
                        <Form.Label>Checkpoint Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={checkpointName}
                            style={style}
                            onChange={(e: any) => setCheckpointName(e.target.value)}
                            placeholder="Enter checkpoint name"
                            autoComplete='off'
                        />
                    </Form.Group>
                    <Form.Group controlId="checkpointDate">
                        <Form.Label>Checkpoint Date</Form.Label>
                        <Form.Control
                            type="date"
                            style={style}
                            value={checkpointDate}
                            onChange={(e: any) => setCheckpointDate(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
                <Button variant="danger" onClick={handeDeleteCheckpoint}>Delete</Button>
            </Modal.Footer>
        </Modal>
    )
  };

export default AddCheckpointModal;