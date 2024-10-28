const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./routes/router');

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const corsOptions = {
	origin: '*',
	credentials: true,
	optionSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.static('./public'));
app.use('/', router);

const port = 4000;

app.listen(port, () => {
	console.log('server is running on port ' , port);
});

