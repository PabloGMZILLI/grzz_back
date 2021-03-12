const express = require('express');
const userController = require('../controllers/userController');
const rankingController = require('../controllers/rankingController');
const quizController = require('../controllers/quizController');
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

routes.post('/quiz/create', quizController.create);
routes.get('/quiz', quizController.index);
routes.delete('/quiz/delete/:id', quizController.delete);
routes.post('/quiz/user/answer', quizController.userAnswer);

routes.post('/shifts/create', shiftController.create);
routes.get('/shifts/:user_id', shiftController.index);
routes.get('/shifts', shiftController.index);
routes.delete('/shifts/delete/:id', shiftController.delete);

module.exports = routes;