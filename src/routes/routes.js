const express = require('express');
const userController = require('../controllers/userController');
const serviceController = require('../controllers/serviceController');
const scheduleController = require('../controllers/scheduleController');
const shiftController = require('../controllers/shiftController');

const routes = express.Router();

routes.get('/users', userController.index);
routes.post('/register', userController.create);
routes.post('/login', userController.login);

routes.delete('/schedules/delete/:id', scheduleController.delete);
routes.post('/schedules/create', scheduleController.create);
routes.get('/schedules', scheduleController.index);

routes.post('/services/create', serviceController.create);
routes.get('/services', serviceController.index);
routes.delete('/services/delete/:id', serviceController.delete);

routes.post('/shifts/create', shiftController.create);
routes.get('/shifts/:user_id', shiftController.index);
routes.get('/shifts', shiftController.index);
routes.delete('/shifts/delete/:id', shiftController.delete);

module.exports = routes;