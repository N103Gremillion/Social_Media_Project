import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface AddGoalModalProps {
    close: () => void;
    addGoal: (goal: {
        name: string;
        description: string;
        startDate: string;
        endDate: string
    }) => void;
}

const AddGoalModal: React.FC<AddGoalModalProps> = ({
    close,
    addGoal,
  }) => {
    const [goalName, setGoalName] = useState<string>('');
    const [goalDescription, setGoalDescription] = useState<string>('');
    const [goalStartDate, setGoalStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [goalEndDate, setGoalEndDate] = useState<string>('');

    const style = {
        backgroundColor: 'black',
        color: 'white'
    }
    const handleAddGoal = (e: React.FormEvent) => {
        e.preventDefault();

        const startDate = new Date(goalStartDate);
        const endDate = new Date(goalEndDate);

        if (startDate > endDate) {
            alert("Start date must be after end date");
            return;
        }
        
        addGoal({
            name: goalName,
            description: goalDescription,
            startDate: goalStartDate,
            endDate: goalEndDate
        });

        setGoalName('');
        setGoalDescription('');
        setGoalStartDate('');
        setGoalEndDate('');

        close();
    };
    const handleClose = () => {
        close();
    }
    return (
        <Modal show={true} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Goal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleAddGoal}>
                    <Form.Group controlId="goalName">
                        <Form.Label>Goal Name</Form.Label>
                        <Form.Control
                            type="text"
                            style={style}
                            value={goalName}
                            onChange={(e: any) => setGoalName(e.target.value)}
                            placeholder="Enter checkpoint name"
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="goalDescription">
                        <Form.Label>Goal Description</Form.Label>
                        <Form.Control
                            type="text"
                            style={style}
                            value={goalDescription}
                            onChange={(e: any) => setGoalDescription(e.target.value)}
                            placeholder="Enter Goal Description"
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="goalStartDate">
                        <Form.Label>Goal Start Date</Form.Label>
                        <Form.Control
                            type="date"
                            style={style}
                            value={goalStartDate}
                            onChange={(e: any) => setGoalStartDate(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="goalEndDate">
                        <Form.Label>Goal End Date</Form.Label>
                        <Form.Control
                            type="date"
                            style={style}
                            value={goalEndDate}
                            onChange={(e: any) => setGoalEndDate(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId='submitButton'>
                        <Button variant="primary" type='submit'>Save Changes</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
    )
  };

export default AddGoalModal;