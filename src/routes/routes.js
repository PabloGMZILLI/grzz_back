const express = require('express');
const userController = require('../controllers/userController');
const rankingController = require('../controllers/rankingController');
const quizController = require('../controllers/quizController');
const scheduleController = require('../controllers/scheduleController');
const shiftController = require('../controllers/shiftController');

const routes = express.Router();

routes.get('/ranking', rankingController.index);
routes.post('/points/add', rankingController.add);
routes.post('/points/remove', rankingController.remove);
routes.post('/points/reset', rankingController.reset);


routes.get('/users', userController.index);
routes.post('/register', userController.create);
routes.post('/login', userController.login);
routes.put('/workspace/set/:uid', userController.setWorkspace);

routes.delete('/schedules/delete/:id', scheduleController.delete);
routes.post('/schedules/create', scheduleController.create);
routes.get('/schedules', scheduleController.index);

routes.post('/quiz/create', quizController.create);
routes.get('/quiz', quizController.index);
routes.delete('/quiz/delete/:id', quizController.delete);

routes.post('/shifts/create', shiftController.create);
routes.get('/shifts/:user_id', shiftController.index);
routes.get('/shifts', shiftController.index);
routes.delete('/shifts/delete/:id', shiftController.delete);

module.exports = routes;