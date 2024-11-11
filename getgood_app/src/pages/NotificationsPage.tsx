import React, { useState, useEffect } from 'react';
import axios from 'axios';


interface Notification {
    id: number;
    type: 'like' | 'follow_request';
    post_id?: number; 
    created_at: string;
    sender_name: string;
    sender_profile_picture: string;
}

const NotificationsPage: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]) 
    const userId = sessionStorage.getItem('userID')  

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get<{ notifications: Notification[] }>(
                    `/notifications`,
                    { params: { userId } }
                );
                setNotifications(response.data.notifications);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };
        if (userId) {
            fetchNotifications();     
        }
    }, [userId]);

    const acceptFollowRequest = async (notifciationId: number) => {
        try {
            await axios.post(`/notifications/${notifciationId}/accept`);
            setNotifications(prevNotifications =>
                prevNotifications.filter(notification => notification.id !== notifciationId)
            );
        } catch (error) {
            console.error("Error accepting follow request:", error); 
        }
    };

    const rejectFollowRequest = async (notificationId: number) => {
        try {
            await axios.post(`/notifications/${notificationId}/reject`);
            setNotifications(prevNotifications =>
                prevNotifications.filter(notification => notification.id !== notificationId));
        } catch (error) {
            console.error("Error rejecting follow request:", error); 
        }
    };

    return (
        <div>
            <h2>Notifications</h2>
            <ul>
                {notifications.map(notification => (
                    <li key = {notification.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '1em' }}>
                        <img
                            src={notification.sender_profile_picture}
                            alt={`${notification.sender_name}'s profile`}
                            style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '1em' }}
                        />
                        <div>
                            <p>
                                <strong>{notification.sender_name}</strong> {notification.type === 'like' ? 'liked your post': 'sent you a follow request'}
                            </p>
                            {notification.type === 'like' && (
                                <div>
                                    <button onClick={() => acceptFollowRequest(notification.id)}>Accept</button>
                                    <button onClick={() => rejectFollowRequest(notification.id)}>Deny</button>
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>    
    );
};

export default NotificationsPage; 