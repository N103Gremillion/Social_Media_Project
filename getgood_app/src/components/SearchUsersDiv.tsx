import React, {useState} from 'react';
import { Offcanvas, Form, ListGroup } from 'react-bootstrap';
import axios from "axios";

interface SlideOutDivProps {
    show: boolean;       
    handleClose: () => void; 
}

interface User {
    name: string;
    id: number;
}

const SlideOutDiv : React.FC<SlideOutDivProps> = ({ show, handleClose }) => {

    const [users, setUsers] = useState<User[]>([]);
    const BASE_URL: string = 'http://localhost:4000/';

    const fetchUsersWithSubstring = async ( curTextInput: string ) => { 
        // fetches the inital 1st 10 posts
        await axios.get(`${BASE_URL}usersWithSub?query=${curTextInput}`)
        .then( response => {
          setUsers(response.data);
        })
        .catch(error => console.error('error fetching posts: ', error))
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const curTextInput = event.target.value;
        fetchUsersWithSubstring(curTextInput);
    }

    // querey the database for users close to the input string
    return (
        <Offcanvas show={show} onHide={handleClose} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Search</Form.Label>
                    <Form.Control
                        placeholder="userName" 
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
                            {user.name}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Offcanvas.Body>
        </Offcanvas>
    );
}

export default SlideOutDiv;
