import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from "react-bootstrap";
import "./styles/imageModal.css"
import axios from 'axios';

interface ImageModalProps {
    image: {
        id: number;
        title: string;
        content: string;
        author: string;
        date: string;
        imagePath: string;
        likes: number;
        visibilityStatus: string;
    };

    onClose: () => void;
}

interface Comment {
    id: number;
    author: string;
    content: string;
    date: string;
}

const ImageModal: React.FC<ImageModalProps> = ({image, onClose}) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const PORT = 4000;

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        await axios.post(`http://localhost:${PORT}/api/comments`, {
            postId: image.id,
            content: newComment
        })

        await axios.get(`http://localhost:${PORT}/api/comments?postId=${image.id}`)
        .then((response) => {
            setComments(response.data.comments);
        });

        setNewComment("");
    };

    useEffect(() => {
        const getInitialComments = async () => {
            await axios.get(`http://localhost:${PORT}/api/comments?postId=${image.id}`)
            .then((response) => {
                setComments(response.data.comments);
            });
        }
        getInitialComments();

    }, [])

    return (
        <Modal show={true} onHide={onClose} dialogClassName='image-modal'>
            <Modal.Header closeButton={true}/>
            <Modal.Body className='modal-body'>
                <div className='image-container' >
                    <img src={image.imagePath} className='img-fluid'/>
                </div>

                <div className='comment-section'>
                    <div className='post-information'>
                        <div className='image-title'>
                            <strong>{image.title}</strong>
                        </div>
                        <strong>Description</strong>
                        <p>{image.content}</p>
                    </div>
                    

                    <div className='comments'>
                        {comments.map(comment => (
                            <div key={comment.id} className='comment'>
                                <strong>{comment.author}</strong>
                                <p>{comment.content}</p>
                            </div>
                        ))}
                    </div>
                    <div className='add-comment'>
                        <Form.Group className='input-comment'>
                        <Form.Control 
                            as={"textarea"}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder='Enter Comment'
                        />
                        </Form.Group>
                        <Button variant='primary' onClick={handleAddComment} className='comment-submit-button'>
                            Submit
                        </Button>
                    </div>
                    
                </div> 
            </Modal.Body>
        </Modal>
    )
}

export default ImageModal;