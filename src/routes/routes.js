const express = require('express');
const userController = require('../controllers/userController');
const rankingController = require('../controllers/rankingController');
const quizController = require('../controllers/quizController');
const answersController = require('../controllers/answersController');

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
routes.post('/quiz/update/:quiz_id', quizController.updateQuiz);
routes.get('/quiz', quizController.index);
routes.delete('/quiz/delete/:id', quizController.deleteQuiz);

routes.post('/question/update/:question_id', quizController.updateQuestion);
routes.post('/quiz/add_question/:quiz_id', quizController.addQuestion);
routes.delete('/quiz/delete_question/:question_id', quizController.deleteQuestion);


routes.post('/answer/add/:question_id', answersController.addAnswer);
routes.post('/answer/set/correct', answersController.setCorrectAnswer);
routes.delete('/answer/delete/:answer_id', answersController.deleteAnswer);

routes.post('/answer/save', answersController.saveAnswer);
routes.get('/answers/:user_id', answersController.answers);
routes.get('/answers', answersController.listAnswers);

module.exports = routes;