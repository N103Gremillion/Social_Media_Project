import 'bootstrap-icons/font/bootstrap-icons.css';
import { Button } from 'react-bootstrap';
import SlideOutDiv from './SearchUsersDiv';
import { useState } from 'react';

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
  
export default SearchButton;
  