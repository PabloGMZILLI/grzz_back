const connection = require('../database/connection');

module.exports = {
    async listAnswer(req, res) {
        const { name, to_workspace, questions } = req.body;
        const { user_id, last_modify } = req.headers;

        return res.sendStatus(401)
    },

    async userAnswer(req, res) {
        const { user_id } = req.headers;
        var { quiz_id, question_id, answer_checked_id, datetime, timespent } = req.body;
        var pontuation = 0;
        if (timespent > 600) {
            timespent = 600;
        }
        try {
            const user = await connection('users').select('id').where('id', user_id).first();
            const ans = await connection('questions').select('correct_answer_id', 'points').where('id', question_id).first();
            if (!ans) {
                res.sendStatus(401);
            }
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

                await connection('answered').insert({
                    'user_id': user_id,
                    'quiz_id': quiz_id,
                    'question_id': question_id,
                    'answer_checked_id': answer,

                    'datetime': date
                });
            }

            


            return res.json(pontuation);
        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    },
}