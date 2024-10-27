const express = require('express');
const path = require('path');
const router = express.Router();
const mysql = require('mysql2');
const multer = require('multer');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'profilePictures/');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	}
});

const upload = multer({ storage: storage });

const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'BottledchairsarealsoMice',
	database: 'csc403'
});

router.get('/getProfilePicture', (req, res) => {
  const userId = req.query.userId;

    const getImagePathQuery = 'SELECT image_path FROM user_images WHERE user_id = ?';

    pool.query(getImagePathQuery, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Image not found' });
        }

        const imagePath = results[0].image_path;

        // Send the file located at the image path
        res.sendFile(path.resolve(__dirname, imagePath));
    });
})

router.post('/getUsername', (req, res) => {
	const userId = req.body.id;
	
	const getUsername = 'select name from users where id = ?';
	
	pool.query(getUsername, [userId], (error, results) => {
		if(error) {
			return res.status(500).json({ error: error.message});
		}
		res.json(results);
	})
})

router.post('/getPassword', (req, res) => {
	const userId = req.body.id;
	
	const getUsername = 'select password from users where id = ?';
	
	pool.query(getUsername, [userId], (error, results) => {
		if(error) {
			return res.status(500).json({ error: error.message});
		}
		res.json(results);
	})
})

router.get('/getUserGoals', (req,res) => {
	const  userId  = req.query.userId;

	const getUserGoalsQuery = 'select id, goals.name, goals.description, goals.start_date, goals.end_date, goals.current_progress from goals join user_goals on goals.id = user_goals.goal_id where user_goals.user_id = ?';

	pool.query(getUserGoalsQuery, [userId], (error,results) => {
		if (error) {
			return res.status(500).json({ error: error.message});
		}
		res.json(results);
	});
});

router.post('/addUser', (req,res) => {
	const { name, email, password } = req.body;

	const addUserCommand = 'insert into users (name,email,password) values (?,?,?)';

	pool.query(addUserCommand, [name, email, password], (error,results) => {
		if (error) {
			return res.status(500).json({ error: error.message });
		}
		res.status(201).json({ id: results.insertId });
	});
});

router.post('/existingUsers', (req, res) => {
	const {email} = req.body;

	const checkUsers = 'select * from users where email = ?';

	pool.query(checkUsers, [email], (error, results) => {
		if (error) {
			return res.status(500).json({ error: error.message });
		}
		else if(results.length > 0){
			return res.status(500).json({error: "User already exists"});
		}
		else {
			return res.status(201).json({ results });
		}
	})
})

router.post('/checkForUser', (req,res) => {
	
	const { email, password } = req.body;

	const checkForUserCommand = 'select id from users where email = ? and password = ?';

	pool.query(checkForUserCommand, [email, password], (error, results) => {

		if (error) {
			return res.status(500).json({ error: error.message });
		}
		else if(results.length !== 1) {
			return res.status(500).json({ error: "User not found" });
		}
		res.status(201).json(results);
	})
})

router.post('/changeUserName', (req,res) => {
	const {id, userValue} = req.body;

	const changeNameQuery = 'update users set name = ? where id = ?';

	pool.query(changeNameQuery, [userValue, id], (error,results) => {
		if (error) {
			return res.status(500).json({ error: error.message });
		}
		res.status(201).json({ success: true });
	});
});

router.post('/changeUserPassword', (req,res) => {
	const {id, passwordValue} = req.body;

	const changeNameQuery = 'update users set password = ? where id = ?';

	pool.query(changeNameQuery, [passwordValue, id], (error,results) => {
		if (error) {
			return res.status(500).json({ error: error.message });
		}
		res.status(201).json({ success: true });
	});
});

router.post('/addGoal', (req,res) => {
	const { userId, goalName, goalDescription, goalStartDate, goalEndDate } = req.body;

	const addGoalUserConnectionQuery = 'insert into user_goals (user_id,goal_id) values (?,?)';
	const addGoalCommand = 'insert into goals (name,description,start_date,end_date) values (?,?,?,?)';

	pool.query(addGoalCommand, [goalName, goalDescription,goalStartDate,goalEndDate], (error,results) => {
		if (error) {
			return res.status(500).json({error: error});
		}
		addGoalUserConnection(userId,results.insertId,addGoalUserConnectionQuery,req,res);
	});
});

router.post('/deleteGoal', (req,res) => {
	const { userId, goalId } = req.body;

	const deleteQuery = "delete from goals where id=?";
	const deleteConnectionQuery = "delete from user_goals where user_id=? and goal_id=?";
	pool.query(deleteQuery, [goalId], (error,results) => {
		if (error) {
			return res.status(500).json({error: error.message});
		}
	});

	pool.query(deleteConnectionQuery, [userId, goalId], (error, results) => {
		if (error) {
			return res.status(500).json({ error: error.message });
		}
		res.status(201).json({ deleted: true });
	});
});

router.post('/addCheckpoint', (req,res) => {
	const { goalId, name, date, completed} = req.body;
	const addQuery = "insert into checkpoints (name, date, completed) values (?,?,?)";
	const addConnectionQuery = "insert into goal_checkpoints (goal_id, checkpoint_id) values (?,?)";

	pool.query(addQuery, [name, date, completed],(error, results) => {
                if (error) {
					console.log(error.message);
                    return res.status(500).json({ error: error.cause });
                }
		addGoalCheckpointConnection(results.insertId,goalId,addConnectionQuery,req,res);
        });
});

router.delete('/deleteCheckpoints', (req,res) => {
	const { goalId } = req.body;
	const deleteQuery = "delete from checkpoints where id in (select checkpoint_id from goal_checkpoints where goal_id = ?)";

	pool.query(deleteQuery, [goalId], (error, results) => {
		if (error) {
			return res.status(500).json({ error: error.message });
		}
	});
});

router.post('/incrementLikes', (req,res) => {
	const { goalId } = req.body;

	const incrementLikesQuery = "update goals set likes = likes + 1 where id = ?";
	pool.query(incrementLikesQuery, [goalId], (error,results) => {
		if (error) {
			return res.status(500).json({error: error.message});
		}
	res.status(201).json({ message: "Likes incremented" });
	});
});

router.post('/decrementLikes', (req,res) => {
	const { goalId } = req.body;

	const incrementLikesQuery = "update goals set likes = likes - 1 where id = ?";
	pool.query(incrementLikesQuery, [goalId], (error,results) => {
		if (error) {
			return res.status(500).json({error: error.message});
		}
	res.status(201).json({ message: "Likes decremented" });
	});
});

// for the posts on the mainFeed
let posts = [];

router.get('/api/posts', (req, res) => {

	const query = `
	SELECT 
		title,
		content,
		author,
		DATE_FORMAT(date, '%d-%m-%Y') AS formatted_date,
		imagePath,
		likes
	FROM
		mainFeedPosts;
	`;

	pool.query(query, (error, results) => {
		if (error){
			console.error("error fetching the posts form database", error);
			return res.status(500).json();
		}
		
		// add all elements in the table to the posts[]
		const formattedPosts = results.map(post => ({
			id: post.id,
			title: post.title,
			content: post.content,
			author: post.author,
			date: post.formatted_date,
			imagePath: post.imagePath,
			likes: post.likes,
		}));

		res.status(200).json(formattedPosts);
	});
});

router.post('/api/posts', (req, res) => {
  const { title, content, author, date, imagePath } = req.body;
  const newPost = { title, content, author, date, imagePath, likes: 0 };
	
	// add post to the sql database
  const query = 'INSERT INTO mainFeedPosts (title, content, author, date, imagePath, likes) VALUES (?, ?, ?, ?, ?, ?)';
	
	pool.query(query, [newPost.title, newPost.content, newPost.author, newPost.date, newPost.imagePath, newPost.likes], (error, results) => {
		
		if (error){
			console.error("error when trying to send the post to database:", error);
			return res.status(500).json({ message: 'Error saving post to database' });
		}

		newPost.id = results.insertId;
		posts.push(newPost);
		res.status(201).json(newPost);

	});
});

router.post('/getCheckpoints', (req,res) => {
	const { userId, goalId } = req.body;

	const query = "select * from checkpoints where (id in (select checkpoint_id from goal_checkpoints where goal_id = ?) and ? in (select goal_id from user_goals where user_id = ?))";

	pool.query(query, [goalId,goalId,userId], (error, results) => {
		if (error){
			return res.status(500).json({ error });
		}
		console.log(`${query}\n${results}\nuser: ${userId}, goal: ${goalId}`);
		res.status(201).json({checkpoints: results});
	});
	

})

function addGoalUserConnection(userId,goalId,query,req,res) {
	pool.query(query, [userId, goalId], (error, results) => {
                if (error) {
                        return res.status(500).json({error: error.message});
                }
                res.status(201).json({ id: goalId});
        });
}

function addGoalCheckpointConnection(checkpointId,goalId,query,req,res) {
        pool.query(query, [goalId, checkpointId], (error, results) => {
                if (error) {
                        return res.status(500).json({error: error.message});
                }
                res.status(201).json({ id: results.insertId});
        });
}

module.exports = router