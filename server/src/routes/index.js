const express = require('express');
const router = express.Router();

const viApiRoutes = require('./v1');

router.use('/v1', viApiRoutes);

module.exports = router;