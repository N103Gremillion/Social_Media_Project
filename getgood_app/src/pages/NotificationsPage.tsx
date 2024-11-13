import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap-grid.min.css'
import defaultProfilePic from '../defaultProfile.jpg'

const PORT = 4000; 

interface Notification {
    id: number;
    reciever_id: number;
    sender_id: number;
    type: 'like' | 'follow_request';
    post_id?: number; 
    created_at: string;
    senderName: string;
    senderProfilePicture: string | 'Person2Icon';
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const userId = sessionStorage.getItem("userID");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`http://localhost:${PORT}/notifications?userId=${userId}`,
          {
            headers: { Accept: "application/json" },
          },
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched data:", data);
        setNotifications(data.notifications);
      } catch (error) {
        setError((error as Error).message);
      }
    };

    fetchNotifications();
  }, []);

  

  const acceptFollowRequest = async (notificationId: number) => {
    try {
        const response = await fetch(`http://localhost:${PORT}/notifications/${notificationId}/accept`, {
            method: 'POST', 
        });
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json(); 
        console.log("Query executed, response:", data);
        setNotifications((prevNotifications) =>
            prevNotifications.filter(
            (notification) => notification.id !== notificationId
            )
        );
    } catch (error) {
      console.error("Error accepting follow request:", error);
    }
  };

  const rejectFollowRequest = async (notificationId: number) => {
    try {
      const response = await fetch(`http://localhost:${PORT}/notifications/${notificationId}/reject`, {
        method: 'POST',
      })
    
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json(); 
      console.log("Query executed, response:", data);
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification.id !== notificationId
        )
      );
    } catch (error) {
      console.error("Error rejecting follow request:", error);
    }
  };

  console.log("Notifications:", notifications);
  return (
    <Container style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh'}}> 
        <h2 style={{ color: '#fff' }}>Notifications</h2> 
        {error ? ( 
            <p>Error loading notifications: {error}</p> 
        ) : ( 
        <Row className="flex-column"> 
            {notifications.map((notification) => ( 
                <Col key={notification.id} className="mb-3"> 
                    <Card style={{ width: '100%', backgroundColor: '#333', color: '#fff' }}> 
                        <Card.Body> 
                            <div className="d-flex align-items-center mb-2"> 
                                {notification.senderProfilePicture ? ( 
                                    <img src={defaultProfilePic} className="rounded-circle" width="40" height="40" />
                            ) : ( 
                                <FaUserCircle size={40} />
                                )} 
                                <div className="ms-3"> 
                                    <Card.Title style={{ color: '#fff'}}>{notification.senderName}</Card.Title> 
                                    <Card.Text style={{ color: '#fff'}}>{new Date(notification.created_at).toLocaleString()}</Card.Text> 
                                </div> 
                            </div> 
                                {notification.type === 'like' && notification.post_id && ( 
                                    <Card.Text style={{ color: '#fff'}}>Liked your post</Card.Text> 
                                )} 
                                {notification.type === 'follow_request' && ( 
                                    <div> 
                                        <Card.Text>Sent you a follow request</Card.Text> 
                                        <Button variant="success" onClick={() => acceptFollowRequest(notification.id)} className="me-2" > Accept </Button> 
                                        <Button variant="danger" onClick={() => rejectFollowRequest(notification.id)} > Deny </Button> 
                                    </div> 
                                )} 
                        </Card.Body> 
                    </Card> 
                     </Col> 
            ))} 
        </Row> 
        )} 
    </Container>
  ); 
};

export default NotificationsPage; 