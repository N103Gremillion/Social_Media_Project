import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface AddCheckpointModalProps {
    isOpen: boolean;
    close: () => void;
    addCheckpoint: () => void;
    checkpointName: string;
    setCheckpointName: (name: string) => void;
    checkpointDate: string;
    setCheckpointDate: (date: string) => void;
}

const AddCheckpointModal: React.FC<AddCheckpointModalProps> = ({
    isOpen,
    close,
    addCheckpoint,
    checkpointName,
    setCheckpointName,
    checkpointDate,
    setCheckpointDate
  }) => {
    const handleAddCheckpoint = (e: React.FormEvent) => {
        e.preventDefault();
        addCheckpoint();
        close();
    };
    return (
        <Modal show={isOpen} onHide={close}>
            <Modal.Header closeButton>
                <Modal.Title>Add Checkpoint</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="checkpointName">
                        <Form.Label>Checkpoint Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={checkpointName}
                            onChange={(e: any) => setCheckpointName(e.target.value)}
                            placeholder="Enter checkpoint name"
                            autoComplete='off'
                        />
                    </Form.Group>
                    <Form.Group controlId="checkpointDate">
                        <Form.Label>Checkpoint Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={checkpointDate}
                            onChange={(e: any) => setCheckpointDate(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleAddCheckpoint}>Add Checkpoint</Button>
            </Modal.Footer>
        </Modal>
    )
  };

export default AddCheckpointModal;