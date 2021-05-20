const connection = require('../database/connection');

module.exports = {
    async index(req, res) {
        normalizedQuiz = [];
        function arrayRand() {
            return Math.round(Math.random()) - 0.5;
        }
        allQuizzes = []
        quizData = await connection('quiz').select('*');
        for (let i = 0; i < quizData.length; i++) {
            quiz = quizData[i];
            allQuestions = [];

            questionsIds = await connection('relation_quiz_question')
                .select('question_id').where('quiz_id', '=', quiz.id);

            for (let j = 0; j < questionsIds.length; j++) {
                answers = []
                questions = await connection('questions').select('*')
                    .where('id', '=', questionsIds[j].question_id);
                questions = questions[0];
                answersIds = await connection('relation_question_answer')
                    .select('answer_id').where('question_id', '=', questionsIds[j].question_id);
                allAnswers = [];
                for (let k = 0; k < answersIds.length; k++) {
                    answers = await connection('answers').select('*')
                        .where('id', '=', answersIds[k].answer_id);
                    answers = answers[0];
                    allAnswers.push(answers);
                }

                normalizedQuestions = {
                    id: questions.id,
                    question: questions.question,
                    points: questions.points,
                    max_time: questions.max_time,
                    correct_answer_id: questions.correct_answer_id,
                    answers: allAnswers.sort(arrayRand)
                }
                allQuestions.push(normalizedQuestions);
            }
            normalizedQuiz = {
                id: quiz.id,
                name: quiz.name,
                to_workspace: quiz.to_workspace,
                created_by: quiz.created_by,
                last_modify: quiz.last_modify,
                modify_by: quiz.modify_by,
                questions: allQuestions.sort(arrayRand)
            }
            allQuizzes.push(normalizedQuiz)
        }
        return res.json(allQuizzes);
    },

    async deleteQuiz(req, res) {
        const { id } = req.params;
        const { user_id } = req.headers;
        let status = false;
        try {
            if (!user_id) res.sendStatus(401);
            const user = await connection('users').select('account_type').where('id', user_id).first();

            if (user && user.account_type == "admin") {
                status = await connection('quiz').where('id', id).del();
                status = await connection('relation_quiz_question').where('quiz_id', id).del();
            }
            return res.send(!!status);
        } catch {
            return res.sendStatus(500);
        }
    },

    async create(req, res) {
        const { name, to_workspace, questions } = req.body;
        const { user_id, last_modify } = req.headers;
        let question_id;
        let max_time;
        try {
            const user = await connection('users').select('name', 'account_type').where('id', user_id).first();
            if (user && user.account_type == "admin") {
                let quiz_id = await connection('quiz').insert({
                    name: name,
                    to_workspace: to_workspace,
                    created_by: user.name,
                    last_modify: last_modify,
                    modify_by: user.name
                });
                for (let i = 0; i < questions.length; i++) {
                    max_time = questions[i].max_time;
                    if (questions[i].max_time > 600) {
                        max_time = 600;
                    }
                    question_id = await connection('questions').insert({
                        question: questions[i].question,
                        points: questions[i].points,
                        max_time: max_time,
                        correct_answer_id: -1,
                    });
                    await connection('relation_quiz_question').insert({
                        'quiz_id': quiz_id,
                        'question_id': question_id,
                    });
                    for (let j = 0; j < questions[i].answers.length; j++) {
                        answer_id = await connection('answers').insert({
                            answer: questions[i].answers[j].answer,
                            checked: false,
                        });
                        if (questions[i].answers[j].correct) {
                            await connection('questions').update({ correct_answer_id: answer_id }).where('id', '=', question_id)
                            console.log('setada resposta certa: ' + questions[i].answers[j].answer + ' ' + answer_id)
                        }
                        await connection('relation_question_answer').insert({
                            'question_id': question_id,
                            'answer_id': answer_id,
                        });
                    }

                };
                return res.send(true);
            }
        } catch (error) {
            res.error(500);
        }

        return res.sendStatus(401)
    },

    // Add questions to existent quiz.
    async addQuestion(req, res) {
        const { quiz_id } = req.params;
        const { question, points, max_time, answers } = req.body;
        const { user_id } = req.headers;
        try {
            const user = await connection('users').select('account_type').where('id', user_id).first();

            if (user && user.account_type == "admin") {
                question_id = await connection('questions').insert({
                    question: question,
                    points: points,
                    max_time: max_time,
                    correct_answer_id: -1,
                });
                await connection('relation_quiz_question').insert({
                    'quiz_id': quiz_id,
                    'question_id': question_id,
                });
                for (let j = 0; j < answers.length; j++) {
                    answer_id = await connection('answers').insert({
                        answer: answers[j].answer,
                        checked: false,
                    });
                    if (answers[j].correct) {
                        await connection('questions').update({ correct_answer_id: answer_id }).where('id', '=', question_id);
                    }
                    await connection('relation_question_answer').insert({
                        'question_id': question_id,
                        'answer_id': answer_id,
                    });
                }
                return res.send(true);
            } else {
                return res.sendStatus(401);
            }
        } catch {
            return res.sendStatus(500);
        }
    },

    // Delete questions in existent quiz.
    async deleteQuestion(req, res) {
        const { question_id } = req.params;
        const { user_id } = req.headers;

        var statusQuestionTable = false;
        var statusRelqq = false;
        var statusRelqa = false;
        try {
            if (!user_id) res.sendStatus(401);
            const user = await connection('users').select('account_type').where('id', user_id).first();
            
            if (user && user.account_type == "admin") {
                questionQtd = await connection('questions').select('id').where('id', '=', question_id);
                if (questionQtd.length < 1) return res.sendStatus(404);
                statusQuestionTable = await connection('questions').where('id', '=', question_id).del();

                statusRelqq = await connection('relation_quiz_question').where('question_id', '=', question_id).del();
                statusRelqa = await connection('relation_question_answer').where('question_id', '=', question_id).del();
                if (statusQuestionTable && statusRelqq && statusRelqa ) {
                    return res.send(true);
                } else {
                    console.log("Something didn't work =/" + "response Table question: " + !!statusQuestionTable, ". Response table relation quiz question: " + !!statusRelqq + ". Response table relation question answer: " + !!statusRelqa );
                    return res.send("Something didn't work =/");

                }

            } else {
                return res.sendStatus(401);
            }
        } catch(error) {
            console.error(error);
            return res.sendStatus(500);
        }
    },

    // Add answer to existent question.
    async addAnswer(req, res) {
        const { question_id } = req.params;
        const { answer, correct } = req.body;
        const { user_id } = req.headers;
        try {
            const user = await connection('users').select('account_type').where('id', user_id).first();
            if (user && user.account_type == "admin") {
                answer_id = await connection('answers').insert({
                    answer: answer,
                    checked: false,
                });

                if (correct) {
                    await connection('questions').update({ correct_answer_id: answer_id }).where('id', '=', question_id);
                }
                await connection('relation_question_answer').insert({
                    'question_id': question_id,
                    'answer_id': answer_id,
                });
                return res.send(true);
            } else {
                return res.sendStatus(401);
            }
        } catch {
            return res.sendStatus(500);
        }
    },

    // Add answer to existent question.
    async deleteAnswer(req, res) {
        const { question_id } = req.params;
        const { answer, correct } = req.body;
        const { user_id } = req.headers;
        try {
            if (!user_id) res.sendStatus(401);
            const user = await connection('users').select('account_type').where('id', user_id).first();
            if (user && user.account_type == "admin") {
                answer_id = await connection('answers').insert({
                    answer: answer,
                    checked: false,
                });

                if (correct) {
                    await connection('questions').update({ correct_answer_id: answer_id }).where('id', '=', question_id);
                }
                await connection('relation_question_answer').insert({
                    'question_id': question_id,
                    'answer_id': answer_id,
                });
                return res.send(true);
            } else {
                return res.sendStatus(401);
            }
        } catch {
            return res.sendStatus(500);
        }
    },
}