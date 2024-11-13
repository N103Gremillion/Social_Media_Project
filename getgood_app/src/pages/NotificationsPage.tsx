import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap-grid.min.css'

const PORT = 4000; 

interface Notification {
    id: number;
    reciever_id: number;
    sender_id: number;
    type: 'like' | 'follow_request';
    post_id?: number; 
    created_at: string;
    senderName: string;
    senderProfilePicture: string;
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
    <Container> 
        <h2>Notifications</h2> 
        {error ? ( 
            <p>Error loading notifications: {error}</p> 
        ) : ( 
        <Row className="flex-column"> 
            {notifications.map((notification) => ( 
                <Col key={notification.id} className="mb-3"> 
                    <Card style={{ width: '100%' }}> 
                        <Card.Body> 
                            <div className="d-flex align-items-center mb-2"> 
                                {notification.senderProfilePicture ? ( 
                                    <img src={notification.senderProfilePicture} alt={`${notification.senderName}'s profile`} className="rounded-circle" width="40" height="40" />
                            ) : ( 
                                <FaUserCircle size={40} />
                                )} 
                                <div className="ms-3"> 
                                    <Card.Title>{notification.senderName}</Card.Title> 
                                    <Card.Text>{new Date(notification.created_at).toLocaleString()}</Card.Text> 
                                </div> 
                            </div> 
                                {notification.type === 'like' && notification.post_id && ( 
                                    <Card.Text>Liked your post (ID: {notification.post_id})</Card.Text> 
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