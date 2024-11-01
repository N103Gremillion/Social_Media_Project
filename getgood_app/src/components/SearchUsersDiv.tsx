import React, {useState} from 'react';
import { Offcanvas, Form, ListGroup } from 'react-bootstrap';

interface SlideOutDivProps {
    show: boolean;       
    handleClose: () => void; 
}

const SlideOutDiv : React.FC<SlideOutDivProps> = ({ show, handleClose }) => {

    const [input, setInput] = useState('');
    const [users, setUsers] = useState<String[]>(['apple', 'orange', 'bannana', 'cherry', 'green', 'blue', 'grey', 'black', 'stuff']);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    }

    // querey the database for users close to the input string

    return (
        <Offcanvas show={show} onHide={handleClose} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Search</Form.Label>
                    <Form.Control
                        type="email" placeholder="userName" value={input}
                        onChange={handleInputChange}
                    >
                    </Form.Control> 
                </Form.Group>
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <ListGroup>
                    {users.map((user, index) => (
                        <ListGroup.Item
                            key={index}
                        >
                            {user}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Offcanvas.Body>
        </Offcanvas>
    );
}

export default SlideOutDiv;
