drop database if exists csc403;
create database csc403;
use csc403;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    profilePicture VARCHAR(255) DEFAULT './defaultProfile.jpg'
);

CREATE TABLE goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    current_progress FLOAT DEFAULT 0
);

CREATE TABLE user_goals (
    user_id INT,
    goal_id INT,
    PRIMARY KEY (user_id, goal_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
);

CREATE TABLE checkpoints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    date DATE,
    completed INT DEFAULT 0
);

CREATE TABLE goal_checkpoints (
    goal_id INT,
    checkpoint_id INT,
    PRIMARY KEY (goal_id, checkpoint_id),
    FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE,
    FOREIGN KEY (checkpoint_id) REFERENCES checkpoints(id) ON DELETE CASCADE
);

CREATE TABLE user_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    image_path VARCHAR(500),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE mainFeedPosts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT,
    goal_id INT,
    checkpoint_id INT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    imagePath VARCHAR(255),
    likes INT DEFAULT 0,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (checkpoint_id) REFERENCES checkpoints(id) ON DELETE CASCADE,
    FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
);

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT,
    post_id INT,
    author VARCHAR(100),
    FOREIGN KEY (post_id) REFERENCES mainFeedPosts(id) ON DELETE CASCADE
);

CREATE TABLE followers (
    follower_id INT,
    user_id INT,
    follow_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, user_id),
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reciever_id INT NOT NULL, 
    sender_id INT, 
    type ENUM('like', 'follow_request') NOT NULL,
    post_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reciever_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE, 
    FOREIGN KEY (post_id) REFERENCES mainFeedPosts(id) ON DELETE CASCADE
);

INSERT INTO users (name, email, password) VALUES ('testuser', 'testuser@something.com', 'password');

