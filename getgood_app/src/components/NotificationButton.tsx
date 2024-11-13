import React from 'react'; 
import { useNavigate } from 'react-router-dom';
import './styles/NotificationButton.css';

const NotificationButton: React.FC = () => {
    const navigate = useNavigate(); 

    const handleNavigate = () => {
        navigate('/dashboard/notifications');
    };

    return (
        <button className='notification-button' onClick={handleNavigate} title='Notifications'>
            🔔         
        </button>
    )
}

export default NotificationButton; 