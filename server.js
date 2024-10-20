const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
const port = 3231;			


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
	password: 'root',		// BarOfChocolateEarPhones
	database: 'csc403'
});

// cors configuration to not block vite dev server
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');  // Or restrict to your frontend domain
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

app.get('/getProfilePicture', (req,res) => {
	const userId = req.query.userId;

	const getImagePathQuery = 'select image_path from user_images where user_id = ?';

	pool.query(getImagePathQuery, [userId], (err, results) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
	const imagePath = results[0].image_path;

	// send file located at image path
	res.sendFile(path.resolve(__dirname, imagePath));
	});
});

app.get('/api/getUserGoals', (req,res) => {
	const  userId  = req.query.userId;

	const getUserGoalsQuery = 'select goals.name, goals.description, goals.start_date, goals.end_date, goals.current_progress from goals join user_goals on goals.id = user_goals.goal_id where user_goals.user_id = ?';

	pool.query(getUserGoalsQuery, [userId], (error,results) => {
		if (error) {
			return res.status(500).json({ error: error.message});
		}
		res.setHeader('Content-Type', 'application/json')
		res.json(results);
	});
});


app.post('/addUser', (req,res) => {
	const { name, email, password } = req.body;

	const addUserCommand = 'insert into users (name,email,password) values (?,?,?)';

	pool.query(addUserCommand, [name, email, password], (error,results) => {
		if (error) {
			return res.status(500).json({ error: error.message });
		}
		res.status(201).json({ id: results.insertId });
	});
});

app.post('/checkForUser', (req,res) => {
	const { userName, userPassword } = req.body;

	const checkForUserCommand = 'select id from users where name = ? and password = ?';

	pool.query(checkForUserCommand, [userName, userPassword], (error, results) => {
		if (error) {
			return res.status(500).json({ error: error.message });
		}
		res.status(201).json({ results });
	})
})

app.post('/changeUserName', (req,res) => {
	const {userId, newName} = req.body;

	const changeNameQuery = 'update users set name = ? where id = ?';

	pool.query(changeNameQuery, [newName, userId], (error,results) => {
		if (error) {
			return res.status(500).json({ error: error.message });
		}
		res.status(201).json({ success: true });
	});
});

app.post('/changeUserPassword', (req,res) => {
	const {userId, newPassword} = req.body;

	const changeNameQuery = 'update users set password = ? where id = ?';

	pool.query(changeNameQuery, [newPassword, userId], (error,results) => {
		if (error) {
			return res.status(500).json({ error: error.message });
		}
		res.status(201).json({ success: true });
	});
});

app.post('/addGoal', (req,res) => {
	const { userId, goalName, goalDescription, goalStartDate, goalEndDate } = req.body;

	const addGoalUserConnectionQuery = 'insert into user_goals (user_id,goal_id) values (?,?)';
	const addGoalCommand = 'insert into goals (name,description,start_date,end_date) values (?,?,?,?)';

	pool.query(addGoalCommand, [goalName, goalDescription,goalStartDate,goalEndDate], (error,results) => {
		if (error) {
			return res.status(500).json({ error: error.message });
		}
		addGoalUserConnection(userId,results.insertId,addGoalUserConnectionQuery,req,res);
	});
});

app.post('/deleteGoal', (req,res) => {
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

app.post('/addCheckpoint', (req,res) => {
	const { goalId, name, date} = req.body;
	const addQuery = "insert into checkpoints (name, date) values (?,?)";
	const addConnectionQuery = "insert into goal_checkpoints (goal_id, checkpoint_id) values (?,?)";

	pool.query(addQuery, [name, date],(error, results) => {
                if (error) {
                        return res.status(500).json({ error: error.message });
                }
		addGoalCheckpointConnection(results.insertId,goalId,addConnectionQuery,req,res);
        });
});

app.post('/incrementLikes', (req,res) => {
	const { goalId } = req.body;

	const incrementLikesQuery = "update goals set likes = likes + 1 where id = ?";
	pool.query(incrementLikesQuery, [goalId], (error,results) => {
		if (error) {
			return res.status(500).json({error: error.message});
		}
	res.status(201).json({ message: "Likes incremented" });
	});
});

app.post('/decrementLikes', (req,res) => {
	const { goalId } = req.body;

	const incrementLikesQuery = "update goals set likes = likes - 1 where id = ?";
	pool.query(incrementLikesQuery, [goalId], (error,results) => {
		if (error) {
			return res.status(500).json({error: error.message});
		}
	res.status(201).json({ message: "Likes decremented" });
	});
});


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


app.listen(port, () => {
	console.log('server is running');
});
