const express = require('express');
const path = require('path');
const router = express.Router();
const rootDir=require('../util/path');


router.get('/sucess', (req, res, next) => {
     res.sendFile(path.join(rootDir, 'views', 'sucess.html'));
});

module.exports = router;