import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface Checkpoint {
    name: string;
    date: string;
}

interface AddCheckpointModalProps {
    handleClose: () => void;
    addCheckpoint: (checkpoint: Checkpoint) => void;
}

const AddCheckpointModal: React.FC<AddCheckpointModalProps> = ({handleClose, addCheckpoint }) => {
    const [checkpointName, setCheckpointName] = useState<string>("");
    const [completionDate, setCompletionDate] = useState<string>((new Date().toISOString().split('T')[0]));

    const handleAddGoal = (e: React.FormEvent) => {
        e.preventDefault();

        addCheckpoint({
            name: checkpointName,
            date: completionDate,
        });

        handleClose();
    };

    const style = {
        backgroundColor: 'black',
        color: 'white'
    }

    return (
        <Modal show={true} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Checkpoint</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleAddGoal}>
                    <Form.Group controlId="checkpointName">
                        <Form.Label>Checkpoint Name</Form.Label>
                        <Form.Control
                            type="text"
                            style={style}
                            value={checkpointName}
                            onChange={(e: any) => setCheckpointName(e.target.value)}
                            placeholder="Enter checkpoint name"
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="completionDate">
                        <Form.Label>Checkpoint Completion Date</Form.Label>
                        <Form.Control
                            type="date"
                            style={style}
                            value={completionDate}
                            onChange={(e: any) => setCompletionDate(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId='submitButton'>
                        <Button variant="primary" type='submit'>Add Checkpoint</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default AddCheckpointModal;