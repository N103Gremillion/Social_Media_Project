import axios from 'axios';
import React, { useState, useEffect } from 'react'; 
import { Stage, Layer, Rect, Text, Line, Ellipse } from 'react-konva';
import AddGoalModal from '../components/AddGoalModal';
import AddCheckpointModal from '../components/AddCheckpointModal';
import EditGoalModal from '../components/EditGoalModal';
import EditCheckpointModal from '../components/EditCheckpointModal';
import EditPostModal from '../components/EditPostModal';
import "../components/styles/goals.css"

interface Goal {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
  }
  
  interface Checkpoint {
    id: number;
    name: string;
    date: string;
  }
  
  interface Post {
    id: number;
    goalId: number;
    checkpointId: number;
    title: string;
    content: string;
    author: string;
    date: string;
    imagePath: string;
    likes: number;
    visibilityStatus: string;
  }

const Goals: React.FC = () => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [currGoal, setCurrGoal] = useState<Goal | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [currPost, setCurrPost] = useState<Post | null>(null);
    const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
    const [currCheckpoint, setCurrCehckpoint] = useState<Checkpoint | null>(null);
    const [hoveredCheckpointId, setHoveredCheckpointId] = useState<number | null>(null);
    const [hoveredPostId, setHoveredPostId] = useState<number | null>(null);
    const [showAddGoalModal, setShowAddGoalModal] = useState<boolean>(false);
    const [showAddCheckpointModal, setShowAddCheckpointModal] = useState<boolean>(false);
    const [showEditGoalModal, setShowEditGoalModal] = useState<boolean>(false);
    const [showEditCheckpointModal, setShowEditCheckpointModal] = useState<Checkpoint | null>(null);
    const [showEditPostModal, setShowEditPostModal] = useState<Post | null>(null);
    const userId = sessionStorage.getItem('userID');
    const PORT = 4000;

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
                    onMouseEnter={() => setHoveredCheckpointId(checkpoint.id)}
                    onMouseLeave={() => setHoveredCheckpointId(null)}
                />
            );

            if (hoveredCheckpointId === checkpoint.id) {
                elements.push(
                    <Text
                      key={`edit-icon-${checkpoint.id}`}
                      x={leftX + ovalRadiusX + 50}
                      y={yPos + ovalRadiusY - 10}
                      text="✏️" 
                      fontSize={20}
                      onMouseEnter={() => setHoveredCheckpointId(checkpoint.id)}
                      onMouseLeave={() => setHoveredCheckpointId(null)}
                      onClick={() => setShowEditCheckpointModal(checkpoint)}
                    />
                )
            }

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
                            onMouseEnter={() => setHoveredPostId(post.id)}
                            onMouseLeave={() => setHoveredPostId(null)} 
                        /> 
                    );

                    if (hoveredPostId === post.id) {
                        elements.push (
                            <Text
                                key={`edit-icon-${checkpoint.id}`}
                                x={leftX + ovalRadiusX / 2 + rectWidth}
                                y={yPos + rectHeight / 4}
                                text="✏️" 
                                fontSize={20}
                                onMouseEnter={() => setHoveredPostId(post.id)}
                                onMouseLeave={() => setHoveredPostId(null)}
                                onMouseUp={() => setHoveredPostId(null)} 
                                onClick={() => setShowEditPostModal(post)}
                            />
                        )
                    }

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

    const getGoals = async () => {
        await axios.get(`http://localhost:${PORT}/getUserGoals`, {
            params: { userId: userId }
        })
        .then((response) => {
            setGoals(response.data);
        });
    };

    const getCheckpoints = async () => {
        if (!currGoal) {
            return;
        }
        await axios.get(`http://localhost:${PORT}/api/checkpoints`, {
            params: {
                goalId: currGoal.id,
                userId: userId
            }
        })
        .then((response) => {
            console.log(response, response.data.checkpoints);
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

    const handleAddGoal = async (goal: Goal) => {
        await axios.post(`http://localhost:${PORT}/addGoal`, {
            userId: userId,
            goalName: goal.name,
            goalDescription: goal.description,
            goalStartDate: goal.startDate,
            goalEndDate: goal.endDate
        })
        .then(() => {
            getGoals();
        });
    };

    const handleAddCheckpoint = async (data: {name: string, date: string}) => {
        if (!currGoal) {
            return;
        }
        await axios.post(`http://localhost:${PORT}/api/checkpoint`, {
            goalId: currGoal.id,
            name: data.name, 
            dat: data.date
        })
        .then(() => {
            getCheckpoints();
        })
    };

    const handleEditGoal = async (goal: Goal) => {
        await axios.put(`http://localhost:${PORT}/editGoal`, {
            userId: userId,
            goalId: goal.id,
            goalName: goal.name,
            goalDescription: goal.description,
            goalStartDate: goal.startDate,
            goalEndDate: goal.endDate
        })
        .then(() => {
            getGoals();
            getCheckpoints();
            getCheckpointPosts();
        });
    };
    
    const handleEditCheckpoint = async (checkpoint: Checkpoint) => {
        await axios.put(`http://localhost:${PORT}/api/checkpoint`, {
            id: checkpoint.id,
            name: checkpoint.name,
            date: checkpoint.date,
        })
        .then(() => {
            getCheckpoints();
            getCheckpointPosts();
        });
    };

    const handleCloseEditPost = () => {
        getCheckpointPosts();
        setShowEditPostModal(null);
    }

    useEffect(() => {
        getGoals();
    }, []);

    useEffect(() => {
        getCheckpoints();
    }, [currGoal]);

    useEffect(() => {
        getCheckpointPosts();
    }, [currCheckpoint]);


    const { elements, height } = renderValues(0, 30);

    return (
        <div className='goals-page'>
            <div className='goals-sidebar'>
                <h2>Goals</h2>
                <div className='goals-list'>
                    {goals && goals.map((goal) => (
                        <div className='goal-item' key={goal.id} onClick={() => setCurrGoal(goal)}>{goal.name}
                            <span className='edit-goal-icon' onClick={() => setShowEditGoalModal(true)}>✏️</span>
                        </div>
                    ))}
                </div>
                <button className='add-goal-icon' onClick={() => setShowAddGoalModal(true)}>➕</button>
            </div>
            <div className='checkpoints-display'>
                <Stage width={240} height={height}>
                    <Layer>
                        {currGoal && elements}
                    </Layer>
                </Stage>
                <button className='add-checkpoint-button' onClick={() => setShowAddCheckpointModal(true)}>Add Checkpoint</button>
            </div>
            <div className='image-container' >
                    {currPost && <img src={currPost.imagePath} key={currPost.id} className='img-fluid'/>}
            </div>
            {showAddGoalModal && <AddGoalModal 
            close={() => setShowAddGoalModal(false)}
            addGoal={handleAddGoal}
            />}
            {showEditGoalModal && currGoal && <EditGoalModal 
            handleClose={() => setShowEditGoalModal(false)}
            editGoal={handleEditGoal}
            goal={currGoal}
            />}
            {showEditCheckpointModal && <EditCheckpointModal 
            handleClose={() => setShowEditCheckpointModal(null)}
            editCheckpoint={handleEditCheckpoint}
            checkpoint={showEditCheckpointModal}
            />}
            {showAddCheckpointModal && currGoal && <AddCheckpointModal 
            handleClose={() => setShowAddCheckpointModal(false)}
            addCheckpoint={handleAddCheckpoint}
            />}
            {showEditPostModal && <EditPostModal 
            onClose={() => handleCloseEditPost()}
            post={showEditPostModal}
            />}
        </div>
    );
}

export default Goals;