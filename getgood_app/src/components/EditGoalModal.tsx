import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface Goal {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
}

interface EditGoalModalProps {
    handleClose: () => void;
    editGoal: (goal: Goal) => void;
    goal: Goal;
}

const EditGoalModal: React.FC<EditGoalModalProps> = ({handleClose, editGoal, goal }) => {
    const [goalName, setGoalName] = useState<string>(goal.name);
    const [goalDescription, setGoalDescription] = useState<string>(goal.description);
    const [goalStartDate, setGoalStartDate] = useState<string>(goal.startDate);
    const [goalEndDate, setGoalEndDate] = useState<string>(goal.endDate);

    const handleEditGoal = (e: React.FormEvent) => {
        e.preventDefault();

        editGoal({
            id: goal.id,
            name: goalName,
            description: goalDescription,
            startDate: goalStartDate,
            endDate: goalEndDate,
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
                <Modal.Title>Edit Goal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleEditGoal}>
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
    );
}

export default EditGoalModal;