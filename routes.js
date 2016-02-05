var express = require('express');
var router = express.Router();
var stationController = require('./controllers/stationController');
var dailyDataController = require('./controllers/dailyDataController');

router.get('/', function(req, res) {
    res.send('Welcome to Climax API');
});

router.get('/stations', stationController.getAll);
router.get('/stations/:id', stationController.getById);
router.post('/stations', stationController.create);
router.put('/stations/:id', stationController.update);
router.delete('/stations/:id', stationController.delete);
router.delete('/stations', stationController.deleteAll);

router.get('/daily-data', dailyDataController.getAll);
router.delete('/daily-data', dailyDataController.deleteAll);


module.exports = router;