const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const mysql = require('mysql2');
const multer = require('multer');
const { error } = require('console');
const baseUrl = 'http://localhost:4000';
const config = require(path.resolve(__dirname, '../config.json'));

const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken")

const storage = multer.diskStorage({

	destination: (req, file, cb) => {
	
		const publicDirectory = path.join(__dirname, '../public');

		if (req.body.type === 'mainFeedPost') {
			directory = path.join(publicDirectory, '/mainFeedImages');
		} else if (req.body.type === 'profile') {
			directory = path.join(publicDirectory, '/profilePictures');
		} else {
			return cb(new Error('Invalid type specified'), null);
		}

		// Create directory if it doesn't exist
		fs.mkdir(directory, { recursive: true }, (err) => {
			if (err) return cb(err);
			cb(null, directory);
		});
	},

	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
	}
});

// upload images to backend
const upload = multer({ 
	storage: storage,
	limits: { fileSize: 10 * 1024 * 1024 },
	fileFilter: function (req, file, cb) {
		const filetypes = /jpeg|jpg|png|gif/;
		const mimetype = filetypes.test(file.mimetype);
		const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

		// if it is the correct extension and 
		if (mimetype && extname) {
			return cb(null, true);
		}
		cb(new Error('you can only upload images'));
	}
 });

 const pool = mysql.createPool({
	host: config.MYSQL_HOST,
	user: config.MYSQL_USER,
	password: config.MYSQL_PASSWORD,
	database: config.MYSQL_DATABASE
  });

router.post('/addProfilePicture', upload.single('image'), (req, res) => {
	const id = req.body.id;
	const type = req.body.type;
	const imagePath = req.file ? `${baseUrl}/profilePictures/${req.file.filename}` : null;
	
	const addPic = 'UPDATE users SET profilePicture = ? WHERE id = ?';

	pool.query(addPic, [imagePath, id], (error, results) => {
		if (error) {
			return res.status(500).json({ error: error.message });
		}
		res.status(201).json({ id: results.insertId });
	})
})

router.get('/getProfilePicture', (req, res) => {
  	const userId = req.query.uId;

	if (!userId){
		return res.status(400).send('User ID is required');
	}

    const getImagePathQuery = 'SELECT profilePicture FROM users WHERE id = ?';

    pool.query(getImagePathQuery, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Image not found' });
        }

        // Send the file located at the image path
		const profilePictureUrl = results[0].profilePicture;
        res.json({profilePictureUrl});
    });
})

router.get('/usersWithSub', (req, res) => {
    const subString = req.query.query;

    const query = `
        SELECT 
            id, name, profilePicture
        FROM
            users
        WHERE
            name LIKE ?;
    `;

    // Adding wildcards for substring matching
    const wildcardSubString = `%${subString}%`;

    pool.query(query, [wildcardSubString], (error, results) => {
        if (error) {
            console.error("Error fetching the users from database", error);
            return res.status(500).json();
        }

        // Map results to the desired format
        const usersWithSubstring = results.map(user => ({
            name: user.name,
			profilePictureUrl: user.profilePicture,
            id: user.id
        }));
        
        res.status(200).json(usersWithSubstring);
    });
});


router.get('/name', (req, res) => {
	const userId = req.query.id;
	
	const getUsername = 'select name from users where id = ?';
	
	pool.query(getUsername, [userId], (error, results) => {
		if(error) {
			return res.status(500).json({ error: error.message});
		}
		res.status(200).json({ userName: results });
	})
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

	const getUserGoalsQuery = 'select id, goals.name, goals.description, date_format(goals.start_date, "%Y-%m-%d") as startDate, date_format(goals.end_date, "%Y-%m-%d") as endDate, goals.current_progress from goals join user_goals on goals.id = user_goals.goal_id where user_goals.user_id = ?';

	pool.query(getUserGoalsQuery, [userId], (error,results) => {
		if (error) {
			return res.status(500).json({ error: error.message});
		}
		res.json(results);
	});
});

router.post('/sendEmail', async (req, res) => {
	const {email, subject, text} = req.body

	try {
		const transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 465,
			secure: true,
			auth: {
				user: "getgoalstesting@gmail.com",
				pass: "bnqh ifyz wbsw jpet"
			}
		})

		await transporter.sendMail({
			from: "getgoalstesting@gmail.com",
			to: email,
			subject: `${subject}`,
			text: `${text}`
		})
		return res.status(201).json("Success")

	} catch(error) {
		console.log("Email not sent")
		console.log(error)
		res.status(500).json({error: error.message})
	}
})

router.post('/addUser', async (req,res) => {
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

	if(password === undefined) {
		const checkForUserCommand = 'select id from users where email = ?';
		pool.query(checkForUserCommand, [email], (error, results) => {
	
			if (error) {
				return res.status(500).json({ error: error.message });
			}
			else if(results.length !== 1) {
				return res.status(500).json({ error: "User not found" });
			}
			res.status(201).json(results);
		})
	}
	else {
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
	}

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

router.put('/editGoal', (req,res) => {
	const { userId, goalId, goalName, goalDescription, goalStartDate, goalEndDate } = req.body;

	const editGoalQuery = "update goals set name = ?, description = ?, start_date = ?, end_date = ? where id = ? and id in (select goal_id from user_goals where user_id = ?)";

	pool.query(editGoalQuery, [goalName, goalDescription, goalStartDate, goalEndDate, goalId, userId], (error, results) => {
		if (error) {
			return res.status(500).json({error});
		}
		res.status(200).json(results);
	});
})

router.delete('/deleteGoal', (req,res) => {
	const { userId, goalId } = req.body;

	const deleteQuery = "delete from goals where id=?";
	const deleteConnectionQuery = "delete from user_goals where user_id=? and goal_id=?";
	pool.query(deleteQuery, [goalId], (error,results) => {
		if (error) {
			console.log(error.name);
			return res.status(500).json({error: error });
		}
	});

	pool.query(deleteConnectionQuery, [userId, goalId], (error, results) => {
		if (error) {
			console.log(error);
			return res.status(500).json({ error: error });
		}
		res.status(201).json({ deleted: true });
	});
});

router.post('/api/checkpoint', (req,res) => {
	const { goalId, name, date} = req.body;
	const addQuery = "insert into checkpoints (name, date) values (?,?)";
	const addConnectionQuery = "insert into goal_checkpoints (goal_id, checkpoint_id) values (?,?)";

	pool.query(addQuery, [name, date],(error, results) => {
                if (error) {
					console.log(error.message);
                    return res.status(500).json({ error: error.cause });
                }
		addGoalCheckpointConnection(results.insertId,goalId,addConnectionQuery,req,res);
        });
});

router.put('/api/checkpoint', (req, res) => {
	const { id, name, date} = req.body;

	const editCheckpointQuery = "update checkpoints set name = ?, `date` = ? where id = ?"

	pool.query(editCheckpointQuery, [name, date, id], (error, results) => {
		if (error) {
			console.log(error.message);
			return res.status(500).json({error});
		}
		res.status(200).json({results});
	})
})

router.delete('/deleteCheckpoints', (req,res) => {
	const { goalId } = req.body;
	const deleteQuery = "delete from checkpoints where id in (select checkpoint_id from goal_checkpoints where goal_id = ?)";

	pool.query(deleteQuery, [goalId], (error, results) => {
		if (error) {
			return res.status(500).json({ error: error.message });
		}
		res.status(200).json({results});
	});
});

router.delete('/deleteCheckpoint', (req,res) => {
	const { checkpointId } = req.body;
	const deleteQuery = "delete from checkpoints where id = ?";

	pool.query(deleteQuery, [checkpointId], (error, results) => {
		if (error) {
			return res.status(500).json({ error: error.message });
		}
		res.status(200).json({results});
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

router.post('/getCheckpoints', (req,res) => {
	const { userId, goalId } = req.body;

	const query = "select id, name, date_format(date, '%Y-%m-%d') as date from checkpoints where (id in (select checkpoint_id from goal_checkpoints where goal_id = ?) and ? in (select goal_id from user_goals where user_id = ?))";

	pool.query(query, [goalId,goalId,userId], (error, results) => {
		if (error){
			return res.status(500).json({ error });
		}
		res.status(201).json(results);
	});
});

router.get('/api/checkpoints', (req,res) => {
	const userId = req.query.userId;
	const goalId = req.query.goalId;

	const query = "select id, name, date_format(date, '%Y-%m-%d') as date from checkpoints where (id in (select checkpoint_id from goal_checkpoints where goal_id = ?) and ? in (select goal_id from user_goals where user_id = ?)) order by date asc";

	pool.query(query, [goalId,goalId,userId], (error, results) => {
		if (error){
			return res.status(500).json({ error });
		}
		res.status(201).json({checkpoints: results});
	});
});

let posts = []

router.get('/api/postsOfUser', (req, res) => {

	const userId = req.query.userId;

	const query = `
	SELECT 
		id,
		owner_id,
		goal_id,
		checkpoint_id,
		title,
		content,
		author,
		DATE_FORMAT(date, '%d-%m-%Y') AS formatted_date,
		imagePath,
		likes
	FROM
		mainFeedPosts
	WHERE
		owner_id = ?;
	`;

	pool.query(query, [userId], (error, results) => {
		if (error){
			console.error("error fetching the posts form database", error);
			return res.status(500).json();
		}
		
		// add all elements in the table to the posts[]
		const formattedPosts = results.map(post => ({
			id: post.id,
			ownerId: post.owner_id,
			goalId: post.goal_id,
			checkpointId: post.checkpoint_id,
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

router.get('/api/posts', (req, res) => {
	const offset = parseInt(req.query.offset) || 0;
	const limit = parseInt(req.query.limit) || 12;

	const query = `
	SELECT 
		id,
		owner_id,
		goal_id,
		checkpoint_id,
		title,
		content,
		author,
		DATE_FORMAT(date, '%d-%m-%Y') AS formatted_date,
		imagePath,
		likes
	FROM
		mainFeedPosts
	LIMIT ? OFFSET ?;
	`;

	pool.query(query, [limit, offset], (error, results) => {
		if (error){
			console.error("error fetching the posts form database", error);
			return res.status(500).json();
		}
		
		// add all elements in the table to the posts[]
		const formattedPosts = results.map(post => ({
			id: post.id,
			ownerId: post.owner_id,
			goalId: post.goal_id,
			checkpointId: post.checkpoint_id,
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

router.post('/api/posts', upload.single('image'), (req, res) => {

	const { goal_id, checkpoint_id, owner_id, title, content, author, date } = req.body;
	const imagePath = req.file ? `${baseUrl}/mainFeedImages/${req.file.filename}` : null;
	const newPost = { goal_id, checkpoint_id, owner_id, title, content, author, date, imagePath, likes: 0 };
  
	// add post to the sql database
	const query = 'INSERT INTO mainFeedPosts (title, content, author, date, imagePath, likes, goal_id, checkpoint_id, owner_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
	  
	  pool.query(query, [newPost.title, newPost.content, newPost.author, newPost.date, newPost.imagePath, newPost.likes, newPost.goal_id, newPost.checkpoint_id, newPost.owner_id], (error, results) => {
		
		if (error){
			console.error("error when trying to send the post to database:", error);
			return res.status(500).json({ message: 'Error saving post to database' });
		}

		newPost.id = results.insertId;
		posts.push(newPost);
		res.status(201).json(newPost);
  
	  });
  
});

router.put('/api/posts/:id', upload.single('image'), (req, res) => {
	const postId = req.params.id;
	const { goal_id, checkpoint_id, owner_id, title, content, author, date } = req.body;
	const imagePath = req.file ? `${baseUrl}/mainFeedImages/${req.file.filename}` : null;
  
	// add post to the sql database
	const query = 'update mainFeedPosts set title=?, content=?, author=?, date=?, imagePath=coalesce(?,imagePath), goal_id=?, checkpoint_id=?, owner_id=? where id=?';
	  
	  pool.query(query, [title, content, author, date, imagePath, goal_id, checkpoint_id, owner_id, postId], (error, results) => {
		
		if (error){
			console.error("error when trying to send the post to database:", error);
			return res.status(500).json({ message: 'Error saving post to database' });
		}

		res.status(200).json(results);
  
	  });
  
});

router.delete('/api/posts', (req,res) => {
	const { postId } = req.body;
	const deleteQuery = "delete from mainfeedposts where id = ?";

	pool.query(deleteQuery, [postId], (error, results) => {
		if (error) {
			return res.status(500).json({ error: error.message });
		}
		res.status(200).json({results});
	});
});

router.post('/api/comments', (req,res) => {
	const { postId, content, author } = req.body;

	const query = 'insert into comments (post_id, content, author) values (?, ?, ?)';

	pool.query(query, [postId, content, author], (error, results) => {
		if (error) {
			return res.status(500).json({error: error});
		}
		res.status(200).json({comments: results});
	});
	
});

router.get('/api/comments', (req,res) => {
	const postId = req.query.postId;
	const query = 'select * from comments where post_id = ?';

	pool.query(query, [postId], (error, results) => {
		if (error) {
			return res.status(500).json({error: error});
		}
		res.status(201).json({comments: results});
	});

	
});

router.get('/api/postsFromCheckpoint', (req, res) => {
	const checkpointId = req.query.checkpointId;

	const query = "select id, owner_id, goal_id, checkpoint_id, title, content, author, DATE_FORMAT(date, '%Y-%m-%d') AS date, imagePath, likes from mainFeedPosts where checkpoint_id = ?";

	pool.query(query, [checkpointId], (error, results) => {
		if (error) {
			return res.status(500).json({error: error});
		}

		res.status(200).json({results});
	})
});

router.get('/api/goal', (req,res) => {
	const goalId = req.query.goalId;
	const query = "select name, description, date_format(start_date, '%Y-%m-%d') as start_date, date_format(end_date, '%Y-%m-%d') as end_date from goals where id = ?";

	pool.query(query, [goalId], (error, results) => {
		if (error) {
			return res.status(500).json({error: error});
		}
		res.status(200).json({results});
	})
});

function addGoalUserConnection(userId,goalId,query,req,res) {
	pool.query(query, [userId, goalId], (error, results) => {
                if (error) {
                        return res.status(500).json({error: error.message});
                }
                res.status(201).json({ goalId: goalId});
        });
};

function addGoalCheckpointConnection(checkpointId,goalId,query,req,res) {
        pool.query(query, [goalId, checkpointId], (error, results) => {
                if (error) {
                        return res.status(500).json({error: error.message});
                }
                res.status(200).json({ id: results.insertId});
        });
};

router.get('/authorInfo', (req,res) => {
	const authorId = req.query.authorId;

	const query = "select name, profilePicture from users where id = ?";

	pool.query(query, [authorId], (error, results) => {
		if (error) {
				return res.status(500).json({error: error.message});
		}
		res.status(200).json({ info: results });
	});

});

router.get('/isFollowing', (req, res) => {
  const { currentUserId, userIdToFollow } = req.query;  

  const query = `
    SELECT COUNT(*) AS isFollowing
    FROM followers
    WHERE follower_id = ? AND user_id = ?;
  `;

  pool.query(query, [currentUserId, userIdToFollow], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error });
    }

    // If the count is greater than 0, the user is following
    const isFollowing = results[0].isFollowing > 0;

    console.log(isFollowing); 

    return res.json({ isFollowing });
  });
});


router.post('/follow', async (req, res) => {
  
  const { followerId, userId } = req.body;

  // Check if follower is trying to follow themselves
  if (followerId == userId) {
    return res.status(400).json({ error: "User cannot follow themselves." });
  }

  try {
    const result = await pool.promise().query(
      `INSERT INTO followers (follower_id, user_id) VALUES (?, ?)`,
      [followerId, userId]
    );
		return res.status(201).json({ success: true});
  } catch (error) {
    if (error.code === `ER_DUP_ENTRY`) {
      res.status(409).json({ error: "Already following this user." });
    } else {
      res.status(500).json({ error: "Database error." });
    }
  }
});

router.post('/unfollow', async (req, res) => {
  const { followerId, userId } = req.body;

  // Check if both followerId and userId are provided
  if (!followerId || !userId) {
    return res.status(400).json({ error: "Missing followerId or userId." });
  }

  try {
    const query = `DELETE FROM followers WHERE follower_id = ? AND user_id = ?;`;
    const [result] = await pool.promise().query(query, [followerId, userId]);

    if (result.affectedRows > 0) {
      console.log("Unfollow successful. Rows affected:", result.affectedRows);
      return res.status(201).json({ success: true});
    } else {
      return res.status(404).json({ error: "Follow relationship not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: "Database error." });
  }
});

router.get('/followers', async (req, res) => {
	const { userId } = req.query;

	try {
			// Query to count followers
			const [[followerCount]] = await pool.promise().query(
					`SELECT COUNT(*) AS count
					 FROM followers f
					 WHERE f.user_id = ?`,
					[userId]
			);

			// Query to count following
			const [[followingCount]] = await pool.promise().query(
					`SELECT COUNT(*) AS count
					 FROM followers f
					 WHERE f.follower_id = ?`,
					[userId]
			);
			// Respond with the counts
			res.status(200).json({
					followersCount: followerCount.count,
					followingCount: followingCount.count
			});
	} catch (error) {
			res.status(500).json({ error: error.message || 'Database error.' });
	}
});

router.get('/followerIds', async (req, res) => {
	const { userId } = req.query;

	query = `
		SELECT user_id
		FROM followers
		WHERE follower_id = ?
	`
	const [followerIds] = await pool.promise().query(query, [userId]);
	res.status(200).json(followerIds);
});

router.get('/followingInfo', async (req, res) => {
	const { followingIds } = req.query;
	
	const query = `
	  SELECT name AS name, profilePicture AS profilePicture
	  FROM users
	  WHERE id IN (?);
	`;
  
	try {
	  const [followingInfo] = await pool.promise().query(query, [followingIds]); // Use query, not express.query
	  
	  res.status(200).json({
		followingInfo
	  });
	} catch (error) {
	  console.error('Error fetching following info:', error);
	  res.status(500).json({ error: 'Failed to fetch following information' });
	}
});

router.get ('/api/postsOfFollowing', async (req, res) => {
	// expects a comma separated value string in the querery 
	const followingIds = req.query.ids ? req.query.ids.split(',').map(id => parseInt(id)) : [];
	
	query = `
		SELECT
			id,
			owner_id,
			goal_id,
			checkpoint_id,
			title,
			content,
			author,
			DATE_FORMAT(date, '%d-%m-%Y') AS formatted_date,
			imagePath,
			likes
		FROM
			mainFeedPosts
		WHERE
			owner_id IN (?);
	`

	pool.query(query, [followingIds], (error, results) => {
		if (error){
			console.error("error fetching the posts form database", error);
			return res.status(500).json();
		}
		
		// add all elements in the table to the posts[]
		const formattedPosts = results.map(post => ({
			id: post.id,
			ownerId: post.owner_id,
			goalId: post.goal_id,
			checkpointId: post.checkpoint_id,
			title: post.title,
			content: post.content,
			author: post.author,
			date: post.formatted_date,
			imagePath: post.imagePath,
			likes: post.likes,
		}));
		
		console.log(formattedPosts);
		res.status(200).json(formattedPosts);
	});
});

router.post('/unfollow', async(req, res) => {
	const { followerId, userId } = req.body;

	try {
		const [result] = await db.query(
			`DELETE FROM followers WHERE follower_id = ? AND user_id = ?`,
			[followerId, userId]
		);
		if (result.affectedRows > 0) {
			res.status(200).json({ message: "User unfollowed successfully." });
		} else {
			res.status(404).json({ error: "Follow relationship not found." });
		}
	} catch (error) {
		res.status(500).json({ error: "Database error." });
	}
});

router.get('/user/:userId/followers', async(req, res) => {
	const { userID } = req.params; 

	try {
		cosnt [followers] = await db.query(
			`SELECT u.id, u.name, u.profilePicture
			 FROM followers f
			 JOIN users u ON f.follower_id = u.id
			 WHERE f.user_id = ?`,
			[userId]
		);

		const [following] = await db.query(
			`SELECT u.id, u.name, u.profilePicture
			 FROM followers f
			 JOIN users u ON f.user_id = u.id
			 WHERE f.follower_id = ?`,
			[userId]
		);

		res.status(200).json({ followers, following });
	} catch (error) {
		res.status(500).json({ error: "Database error." });
	}
});

router.get('/notifications', async (req, res) => {
	try {
		const userId = req.user?.id || req.query.userId; 
		const query = `SELECT n.id, n.reciever_id, n.sender_id, n.type, n.post_id, n.created_at, s.name AS senderName, s.profilePicture AS senderProfilePicture FROM notifications n JOIN users s ON n.sender_id = s.id WHERE n.reciever_id = ? ORDER BY n.created_at DESC`
		
		console.log("Recieved userId: ", userId);
		if (!userId) {
			return res.status(400).json({ error: "User ID is required to fetch notifications." });
		}

		console.log("Querying");
	    
		pool.query(query, [userId], (error,results) => {
			if (error) {
				console.error("Database error retrieving notifications:", error);
				return res.status(500).json({ error: "Database error retrieving notifications." });
			}
			console.log("Query successful, notifications:", results);
			res.json({ notifications: results })
		});
			
	} catch (error) {
		console.error("Unexpected error:", error); 
		res.status(500).json({ error: "Unexpected error retrieving notifications." });
	}
});

router.post('/notifications/:notificationId/accept', async (req, res) => {
	try {
		const { notificationId } = req.params;  
		const notification_query = `SELECT sender_id, reciever_id FROM notifications WHERE id = ? AND type = 'follow_request'`; 
		const follower_query = `INSERT INTO followers (follower_id, user_id) VALUES (?, ?)`; 
		
		console.log("NotificationId:", notificationId);
		pool.query(notification_query, [notificationId], (error,results) => {
			if (error) {
				console.error("Database error retreiving sender and recipiant id", error)
				return res.status(500).json({ error: "Database error retrieving notification data." });
			}
			console.log("Notification query:", results);
			if (results.length === 0) {
				return res.status(404).json({ error: "Notification not found or not a follow request"})
			}
			const { sender_id, reciever_id } = results[0]; 
			
			pool.query(follower_query,[sender_id, reciever_id], (error,results) => {
				if (error) {
					console.error("Database error adding follower", error)
					return res.status(500).json({ error: "Database error adding follower." });
				}
				const delete_query = `DELETE FROM notifications WHERE id = ?`; 
				pool.query(delete_query, [notificationId], (error,results) => {
					if (error) {
						console.error("Database error deleting notification", error);
						return res.status(500).json({error: "Database error deleting notification." });
					}
					res.status(200).json({ message: "Follow requset accepted and notification deleted." });
				});
			});
		});
	} catch (error) {
		console.error("Unexpected error processing follow request:", error); 
		res.status(500).json({ error: "Unexpected error processing follow request." });
	}
});

router.post('/notifications/:notificationId/reject', async (req, res) => { 
	try { 
		const { notificationId } = req.params; 
		const delete_query = `DELETE FROM notifications WHERE id = ? AND type = 'follow_request'`;
		pool.query( delete_query, [notificationId], (error, results) => { 
			if (error) { console.error("Database error rejecting follow request", error); 
				return res.status(500).json({ error: "Database error rejecting follow request." }); 
			} 
			
			if (results.affectedRows === 0) { 
				return res.status(404).json({ error: "Notification not found or not a follow request." }); 
			} 
			res.status(200).json({ message: "Follow request rejected." }); 
		}); 
	} catch (error) { 
		console.error("Unexpected error rejecting follow request:", error); 
		res.status(500).json({ error: "Unexpected error rejecting follow request." }); 
	} 
});  
module.exports = router