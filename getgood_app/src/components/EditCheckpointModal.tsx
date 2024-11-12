import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface Checkpoint {
    id: number;
    name: string;
    date: string;
}

interface EditCheckpointModalProps {
    handleClose: () => void;
    editCheckpoint: (checkpoint: Checkpoint) => void;
    checkpoint: Checkpoint;
}

const EditCheckpointModal: React.FC<EditCheckpointModalProps> = ({handleClose, editCheckpoint, checkpoint }) => {
    const [checkpointName, setCheckpointName] = useState<string>(checkpoint.name);
    const [completionDate, setCompletionDate] = useState<string>(checkpoint.date);
    console.log(checkpoint, completionDate);
    const handleEditGoal = (e: React.FormEvent) => {
        e.preventDefault();

        editCheckpoint({
            id: checkpoint.id,
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
                <Modal.Title>Edit Checkpoint</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleEditGoal}>
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
                        <Button variant="primary" type='submit'>Save Changes</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default EditCheckpointModal;