import React, { useState } from 'react';
import { Offcanvas, Form, ListGroup, Image } from 'react-bootstrap';
import axios from "axios";
import AccountOverview from '../pages/AccountOverview';
import PersonIcon from "@mui/icons-material/Person"

interface SlideOutDivProps {
    show: boolean;       
    handleClose: () => void; 
}

interface User {
    name: string;
    profilePictureUrl: string;
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
                console.log(response.data);
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
                                <div className="d-flex align-items-center">
                                    {user.profilePictureUrl && user.profilePictureUrl !== './defaultProfile.jpg' ? (
                                        <Image 
                                            src={user.profilePictureUrl} 
                                            roundedCircle 
                                            className="me-2" 
                                            style={{ width: 40, height: 40 }} 
                                        />
                                    ) : (
                                        <PersonIcon style={{ fontSize: 40, color: 'gray' }} />
                                    )}
                                    {user.name}
                                </div>
                                
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
