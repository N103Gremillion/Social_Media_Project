import 'bootstrap-icons/font/bootstrap-icons.css';
import { Button } from 'react-bootstrap';
import SlideOutDiv from './SearchUsersDiv';
import { useState } from 'react';
import './styles/toolbar.css';
import { Link } from 'react-router-dom';

const SearchButton = () => {

    const [show, setShow] = useState<boolean>(false);

    const openSearchDiv = () => {
        setShow(true);
    }

    const handleClose = () => {
        setShow(false);
    }

    return (
        <>
            <Button variant="outline-black" className="nav-item" onClick={openSearchDiv}>
                <i className="bi bi-search"></i> Search
            </Button>
            <SlideOutDiv show={show} handleClose={handleClose} />
        </>
    );
    
}

const HomeButton = () => {
    return (
        <Link to="home" style={{ display: 'block', width: '80%', height: '80%' }}>
            <Button variant="outline-black" className="nav-item" style={{ width: '100%', height: '100%' }}>
                <i className="bi bi-house-door" /> Home
            </Button>
        </Link>
    );
};

export {SearchButton, HomeButton};
  