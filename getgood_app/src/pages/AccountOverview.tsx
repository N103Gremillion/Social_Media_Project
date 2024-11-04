import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

interface UserInfo {
    name: string;
    id: number;
}

interface AccountOverviewProps {
    userInfo: UserInfo; 
    show: boolean; 
    handleClose: () => void; 
}

const AccountOverview = ({ userInfo, show, handleClose }: AccountOverviewProps) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>User Information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Name: {userInfo.name}</p>
                <p>ID: {userInfo.id}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AccountOverview;
