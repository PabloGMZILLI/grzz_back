const connection = require('../database/connection');

module.exports = {
    async listAnswers(req, res) {
        try {
            const answers = await connection('user_answered').select('*');
            res.json(answers);
        } catch (e) {
            console.log(e);
            return res.sendStatus(500);
        }
    },

    async answers(req, res) {
        const { user_id } = req.params;
        try {
            const answers = await connection('user_answered').select('*').where('user_id', '=', user_id);
            res.json(answers);
        } catch (e) {
            console.log(e);
            return res.sendStatus(500);
        }
    },

    async saveAnswer(req, res) {
        var { user_id, quiz_id, question_id, answer_checked_id, timespent } = req.body;
        var pontuation = 0;
        if (timespent > 600) {
            timespent = 600;
        }
        try {
            let created = new Date();
            const user = await connection('users').select('id').where('id', user_id).first();
            const ans = await connection('questions').select('correct_answer_id', 'points').where('id', question_id).first();
            if (!ans || !user) res.sendStatus(404);
            
            if (ans.correct_answer_id == answer_checked_id) {
                if (timespent < 20) {
                    pontuation = ans.points;
                } else {
                    pontuation = Math.abs((timespent / 60) - ans.points);
                    pontuation = parseFloat(pontuation.toFixed(2));
                    if (pontuation < (ans.points / 2)) pontuation = (ans.points / 2);
                }
                // Pegar pontuação salva do banco.
                let user_points = await connection('users').where('id', user.id).select('points').first();
                if (!user_points) return res.json(false);
    
                // Somar pontuação da questão com a pontuação do banco.
                await connection('users').where('id', user.id).update({ points: user_points.points + pontuation });
            }

            var success = await connection('user_answered').insert({
                user_id: user_id,
                quiz_id: quiz_id,
                question_id: question_id,
                answer_checked_id: answer_checked_id,
                points: pontuation,
                timespent: timespent,
                datetime: created.toString()
            });
            return res.json(true);
        } catch (err) {
            console.log(err);
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
                result = await connection('questions').select('id').where('id', '=', question_id).first();
                if (!result) return res.send(false);

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
        const { answer_id } = req.params;
        const { user_id } = req.headers;

        var statusQuestionTable = false;
        var statusRelqa = false;
        try {
            if (!user_id) res.sendStatus(401);
            const user = await connection('users').select('account_type').where('id', user_id).first();
            
            if (user && user.account_type == "admin") {
                hasQuestion = await connection('answers').select('id').where('id', '=', answer_id).first();
                if (!hasQuestion) return res.sendStatus(404);

                statusQuestionTable = await connection('answers').where('id', '=', answer_id).del();

                statusRelqa = await connection('relation_question_answer').where('answer_id', '=', answer_id).del();
                if (statusQuestionTable && statusRelqa ) {
                    return res.send(true);
                } else {
                    console.log("Something didn't work =/" + "response Table question: " + !!statusQuestionTable +  ". Response table relation question answer: " + !!statusRelqa );
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
}