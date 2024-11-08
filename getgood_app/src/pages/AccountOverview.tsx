import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/explore.css';
import ImageModal from '../components/ImageModal';
import { useState, useEffect } from 'react';
import { Modal, Button, Image } from 'react-bootstrap';
import axios from 'axios';

interface UserInfo {
    name: string;
    profilePictureUrl: string;
    id: number;
}

interface AccountOverviewProps {
    userInfo: UserInfo; 
    show: boolean; 
    handleClose: () => void; 
}

interface ImageData {
    id: number;
    title: string;
    content: string;
    author: string;
    date: string;
    imagePath: string;
    likes: number;
    visibilityStatus: string;
}

const AccountOverview = ({ userInfo, show, handleClose }: AccountOverviewProps) => {

    const [posts, setPosts] = useState<ImageData[]>([]);
    const [selectedImage, setSelectedImage] = useState<ImageData | null>(null)
    const BASE_URL: string = 'http://localhost:4000/';

    const fetchUsersPosts = async () => { 
        // fetch all of the current users posts
        await axios.get(`${BASE_URL}api/postsOfUser?userId=${userInfo.id}`)
        .then( response => {
          setPosts(response.data);
        })
        .catch(error => console.error('error fetching posts: ', error))
    }
    
    useEffect( () => { 
        fetchUsersPosts();
    }, []);

    const openModal = (image: ImageData) => {
        setSelectedImage(image);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    return (
        <Modal show={show} onHide={handleClose} dialogClassName="modal-lg">
            <Modal.Header style={{backgroundColor:'#2e2e2e', color: 'white'}}closeButton>
                <Modal.Title>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div>
                    <Image 
                        src={userInfo.profilePictureUrl} 
                        roundedCircle 
                        className="me-2" 
                        style={{ width: 60, height: 60 }} 
                    />
                    <p>{userInfo.name}</p>
                    </div>
                    <div style={{ marginLeft: '40px', display: 'flex', flexDirection: 'column'}}>
                        <span style={{ fontSize: '16px' }}><strong>Follows:</strong> </span>
                        <span style={{ fontSize: '16px' }}><strong>Following:</strong></span>
                    </div>
                </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="overview-body">
                <div className={"overviewImages-display"}>
                    {posts.map((post) => (
                        <img
                            key={post.id}
                            src={post.imagePath}
                            onClick={() => openModal(post)}
                            className="overviewImage"
                        />
                    ))}
                    {selectedImage && (
                    <div className="image-modal">
                        <ImageModal image={selectedImage} onClose={closeModal} />
                    </div>
                )}
                </div>
            </Modal.Body>
            <Modal.Footer style={{backgroundColor:'#2e2e2e', color: 'white'}}>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AccountOverview;
