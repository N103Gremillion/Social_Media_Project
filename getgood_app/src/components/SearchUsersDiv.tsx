import React, { useState } from 'react';
import { Offcanvas, Form, ListGroup } from 'react-bootstrap';
import axios from "axios";
import AccountOverview from '../pages/AccountOverview';

interface SlideOutDivProps {
    show: boolean;       
    handleClose: () => void; 
}

interface User {
    name: string;
    id: number;
}

const SlideOutDiv: React.FC<SlideOutDivProps> = ({ show, handleClose }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [hoveredUserId, setHoveredUserId] = useState<number | null>(null); 
    const BASE_URL: string = 'http://localhost:4000/';

    const fetchUsersWithSubstring = async (curTextInput: string) => { 
        await axios.get(`${BASE_URL}usersWithSub?query=${curTextInput}`)
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => console.error('Error fetching users:', error));
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const curTextInput = event.target.value;
        fetchUsersWithSubstring(curTextInput);
    }

    const handleNamePressed = (user: User) => {
        setSelectedUser(user); 
        handleClose(); 
    }

    return (
        <>
            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        <Form.Group className="mb-3">
                            <Form.Label>Search</Form.Label>
                            <Form.Control
                                placeholder="userName" 
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <ListGroup>
                        {users.map((user) => (
                            <ListGroup.Item
                                key={user.id} 
                                onClick={() => handleNamePressed(user)} 
                                onMouseEnter={() => setHoveredUserId(user.id)}
                                onMouseLeave={() => setHoveredUserId(null)} 
                                className={hoveredUserId === user.id ? 'bg-primary text-white' : ''}
                            >
                                {user.name}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Offcanvas.Body>
            </Offcanvas>
            {selectedUser && (
                <AccountOverview 
                    userInfo={selectedUser} 
                    show={!!selectedUser} 
                    handleClose={() => setSelectedUser(null)} 
                />
            )}
        </>
    );
}

export default SlideOutDiv;
