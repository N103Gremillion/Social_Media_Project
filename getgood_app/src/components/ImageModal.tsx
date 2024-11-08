import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from "react-bootstrap";
import { Stage, Layer, Rect, Text, Line, Ellipse } from 'react-konva';
import "./styles/imageModal.css"
import axios from 'axios';

interface Image {
    goalId: number;
    checkpointId: number;
    ownerId: number;
    id: number;
    title: string;
    content: string;
    author: string;
    date: string;
    imagePath: string;
    likes: number;
    visibilityStatus: string;
}

interface ImageModalProps {
    image: Image;
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
    const [posts, setPosts] = useState<Image[]>([]);
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

    const getComments = async () => {
        await axios.get(`http://localhost:${PORT}/api/comments?postId=${image.id}`)
        .then((response) => {
            setComments(response.data.comments);
        });
    }

    const getCheckpointPosts = async () => {
        await axios.get(`http://localhost:${PORT}/api/postsFromCheckpoint?checkpointId=${image.checkpointId}`)
        .then((response) => {
            setPosts((response.data.results).filter((post: Image) => post.id !== image.id));
        });
    }
    
    useEffect(() => { 
        getComments();
        getCheckpointPosts();
    }, [])

    return (
        <Modal show={true} onHide={onClose} dialogClassName='image-modal'>
            <Modal.Header closeButton={true}/>
            <Modal.Body className='modal-body'>
                <div className='goal'>
                    <Stage width={300} height={600}>
                        <Layer>
                            <Ellipse
                                x={150}
                                y={50}
                                radiusX={90}
                                radiusY={50}
                                fill="black"
                                stroke="white"
                            />
                            <Text
                                x={60}
                                y={0}
                                text={image.title}
                                fontSize={14}
                                width={180}
                                height={100}
                                fill="white"
                                align="center"
                                verticalAlign="middle"
                            />
                            {posts.map((post, index) => (
                                <React.Fragment key={post.id}>
                                    <Line
                                    points={[150, 100+60*index, 150, 120+60*index]}
                                    stroke="white"
                                    dash={[10, 5]}
                                    />
                                    <Rect
                                        x={100}
                                        y={120 + index * 60}
                                        width={100}
                                        height={40}
                                        fill="black"
                                        stroke="white"
                                    />
                                    <Text
                                        x={100}
                                        y={120 + index * 60}
                                        text={post.title}
                                        fontSize={12}
                                        width={100}
                                        height={40}
                                        fill="white"
                                        align="center"
                                        verticalAlign="middle"
                                    />
                                </React.Fragment>
                            ))}
                        </Layer>
                    </Stage>
                </div>
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