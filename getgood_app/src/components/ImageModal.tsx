import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from "react-bootstrap";
import { Stage, Layer, Rect, Text, Line, Ellipse } from 'react-konva';
import { useNavigate } from 'react-router-dom';
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

interface NewGoal {
    name: String;
    description: String;
    start_date: String;
    end_date: String;
}

interface Checkpoint {
    goalId: number;
    name: string;
    date: string;
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
    const [currPost, setCurrPost] = useState<Image>(image);
    const [checkpoints, setCheckpoints] = useState<any[]>([]);
    const [currCheckpoint, setCurrCehckpoint] = useState<any>();
    const [goal, setGoal] = useState<NewGoal>();
    const navigate = useNavigate();
    const PORT = 4000;

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        await axios.post(`http://localhost:${PORT}/api/comments`, {
            postId: currPost.id,
            content: newComment
        })

        await axios.get(`http://localhost:${PORT}/api/comments?postId=${currPost.id}`)
        .then((response) => {
            setComments(response.data.comments);
        });

        setNewComment("");
    };

    const renderValues = (yPos: number, leftX: number) => {
        let elements = [];
        let ovalRadiusX = 90;
        let ovalRadiusY = 50;
        let rectWidth = ovalRadiusX;
        let rectHeight = 40;
        let lineHeight = 30;

        // Add starting oval
        elements.push(
        <Ellipse
            x={leftX+ovalRadiusX}
            y={yPos+ovalRadiusY}
            radiusX={ovalRadiusX}
            radiusY={ovalRadiusY}
            fill="black"
            stroke="white"
        />);
        elements.push(
            <Text
                x={leftX}
                y={yPos}
                text={"Start"}
                fontSize={14}
                width={ovalRadiusX*2}
                height={ovalRadiusY*2}
                fill="white"
                align="center"
                verticalAlign="middle"
            />
        );

        yPos += ovalRadiusY*2;


        checkpoints.forEach((checkpoint) => {
            elements.push(
                <Line
                points={[leftX+ovalRadiusX, yPos, leftX+ovalRadiusX, yPos+lineHeight]}
                stroke="white"
                dash={[10, 5]}
                />  
            );

            yPos += lineHeight;

            elements.push(
                <Ellipse
                    x={leftX+ovalRadiusX}
                    y={yPos+ovalRadiusY}
                    radiusX={ovalRadiusX}
                    radiusY={ovalRadiusY}
                    fill="black"
                    stroke="white"
                    onClick={() => setCurrCehckpoint(checkpoint)}
                    listening={true}
                />
            );

            elements.push(
                <Text
                    x={leftX}
                    y={yPos}
                    text={checkpoint.name}
                    fontSize={14}
                    width={ovalRadiusX*2}
                    height={ovalRadiusY*2}
                    fill="white"
                    align="center"
                    verticalAlign="middle"
                    listening={false}
                />
            );

            yPos += ovalRadiusY*2;

            // Add posts of currently clicked checkpoint
            if (checkpoint === currCheckpoint) {
                posts.forEach((post) => {
                    elements.push(
                        <Line
                        points={[leftX+ovalRadiusX, yPos, leftX+ovalRadiusX, yPos+lineHeight]}
                        stroke="white"
                        dash={[10, 5]}
                        />  
                    );
        
                    yPos += lineHeight;
                    
                    elements.push(
                        <Rect
                            x={leftX + (ovalRadiusX/2)}
                            y={yPos}
                            width={rectWidth}
                            height={rectHeight}
                            fill="black"
                            stroke="white"
                            onClick={() => setCurrPost(post)}
                            listening={true}
                        />  
                        
                    );

                    elements.push (
                        <Text
                            x={leftX + (ovalRadiusX/2)}
                            y={yPos}
                            text={post.title}
                            fontSize={12}
                            width={rectWidth}
                            height={rectHeight}
                            fill="white"
                            align="center"
                            verticalAlign="middle"
                            listening={false}
                        /> 
                    );

                    yPos += rectHeight;
                });
                
            };
        });

        // Add ending oval
        elements.push(
            <Line
            points={[leftX+ovalRadiusX, yPos, leftX+ovalRadiusX, yPos+lineHeight]}
            stroke="white"
            dash={[10, 5]}
            />  
        );

        yPos += lineHeight;

        elements.push(
            <Ellipse
                x={leftX+ovalRadiusX}
                y={yPos+ovalRadiusY}
                radiusX={ovalRadiusX}
                radiusY={ovalRadiusY}
                fill="black"
                stroke="white"
            />
        );
        elements.push(
            <Text
                x={leftX}
                y={yPos}
                text={"End"}
                fontSize={14}
                width={ovalRadiusX*2}
                height={ovalRadiusY*2}
                fill="white"
                align="center"
                verticalAlign="middle"
            />
        );

        yPos += ovalRadiusY*2;

        return { elements, height: yPos};
    }

    const handleCopyGoal = async () => {
        const newGoal = await axios.get(`http://localhost:${PORT}/api/goal?goalId=${currPost.goalId}`);
        const goalData = newGoal.data.results[0];

        const goalId = await addGoal(goalData);

        await addCheckpoints(goalId, checkpoints);
        
        navigate("/dashboard/goals");
    };

    const addGoal = async (goalData: NewGoal) => {
        if (!goalData) {
            return null;
        }
        const newGoal = await axios.post(`http://localhost:${PORT}/addGoal`, {
            userId: sessionStorage.getItem("userID"),
            goalName: goalData.name,
            goalDescription: goalData.description,
            goalStartDate: goalData.start_date,
            goalEndDate: goalData.end_date
        });
        return newGoal.data.goalId;
    };

    const addCheckpoints = async (goalId: number, checkpoints: Checkpoint[]) => {
        if (!checkpoints) {
            return;
        }
        for (const checkpoint of checkpoints) {
            await addCheckpoint(goalId, checkpoint);
        }
    };

    const addCheckpoint = async (goalId: number, checkpoint: Checkpoint) => {
        await axios.post(`http://localhost:${PORT}/api/checkpoint`, {
                goalId: goalId,
                name: checkpoint.name,
                date: checkpoint.date
            })
    };


    const getComments = async () => {
        await axios.get(`http://localhost:${PORT}/api/comments?postId=${currPost.id}`)
        .then((response) => {
            setComments(response.data.comments);
        });
    };

    const getCheckpoints = async () => {
        await axios.get(`http://localhost:${PORT}/api/checkpoints`, {
            params: {
                goalId: currPost.goalId,
                userId: currPost.ownerId
            }
        })
        .then((response) => {
            setCheckpoints(response.data.checkpoints);
        });
    };

    const getCheckpointPosts = async () => {
        if (!currCheckpoint) {
            return;
        }
        await axios.get(`http://localhost:${PORT}/api/postsFromCheckpoint?checkpointId=${currCheckpoint.id}`)
        .then((response) => {
            setPosts((response.data.results));
        });
    };

    useEffect(() => {
        getComments();
    }, [currPost]);

    useEffect(() => {
        getCheckpointPosts();
    }, [currCheckpoint]);

    useEffect(() => {
        if (currPost && checkpoints) {
            setCurrCehckpoint(checkpoints.find((checkpoint) => checkpoint.id === currPost.checkpointId));
        }
    }, [checkpoints]);

    useEffect(() => { 
        getComments();
        getCheckpoints();
    }, []);

    const { elements, height } = renderValues(0, 100);

    return (
        <Modal show={true} onHide={onClose} dialogClassName='image-modal'>
            <Modal.Header closeButton={true}/>
            <Modal.Body className='modal-body'>
                <div className='goal'>
                    <Stage width={300} height={height}>
                        <Layer>
                            {elements}
                        </Layer>
                    </Stage>
                    <Button className='copy-goal-button' onClick={handleCopyGoal}>Copy Goal</Button>
                </div>
                <div className='image-container' >
                    <img src={currPost.imagePath} key={currPost.id} className='img-fluid'/>
                </div>

                <div className='comment-section'>
                    <div className='post-information'>
                        <div className='image-title'>
                            <strong>{currPost.title}</strong>
                        </div>
                        <strong>Description</strong>
                        <p>{currPost.content}</p>
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