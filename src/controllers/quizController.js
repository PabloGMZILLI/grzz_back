const connection = require("../database/connection");

module.exports = {
    async index(req, res) {
        const relations_quiz_questions = await connection("relationqq").select(
            "*"
        );
        var questions;
        let quizzes = [];

        function arrayRand() {
            return Math.round(Math.random()) - 0.5;
        }

        if (relations_quiz_questions.length == 0) {
            return res.send("Nenhum quiz cadastrado");
        }
        for (let i = 0; i < relations_quiz_questions.length; i++) {
            questions = await connection("questions")
                .select("*")
                .where("id", relations_quiz_questions[i].question_id)
                .first();
            var teste = true;
            for (let i = 0; i < quizzes.length; i++) {
                if (quizzes[i].id == relations_quiz_questions[i].quiz_id) {
                    //console.log(quizzes[i]);
                    if (!quizzes[i].questions) {
                        quizzes[i].questions = [];
                    } else {
                        quizzes[i].questions.push(questions);
                    }
                    teste = false;
                }
            }
            if (teste) {
                let quiz = await connection("quiz")
                    .select("*")
                    .where("id", relations_quiz_questions[i].quiz_id)
                    .first();
                quizzes.push(quiz);
                if (!quizzes[i].questions) {
                    quizzes[i].questions = [questions];
                } else {
                    quizzes[i].questions.push(questions);
                }
            }
            // console.log(quizzes);
        }

        // sort questions randomly
        for (var i = 0; i < quizzes.length; i++) {
            //console.log(quizzes[i].questions);
            quizzes[i].questions.sort(arrayRand);
        }
        return res.json(quizzes);
    },

    async delete(req, res) {
        const { id } = req.params;
        const { user_id } = req.headers;
        let status = false;
        try {
            const user = await connection("users")
                .select("account_type")
                .where("id", user_id)
                .first();

            if (user && user.account_type == "admin") {
                const answers = await connection("quiz")
                    .select("question_id")
                    .where("id", id);
                for (let i = 0; i < answers.length; i++) {
                    let countAnswers = await connection("quiz")
                        .select("id")
                        .where("question_id", answers[i]);
                    if (countAnswers == 1) {
                        await connection("questions")
                            .where("id", answers[i])
                            .del();
                    }
                }

                status = await connection("quiz").where("id", id).del();
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
        const user = await connection("users")
            .select("name", "account_type")
            .where("id", user_id)
            .first();
        if (user && user.account_type == "admin") {
            let quiz_id = await connection("quiz").insert({
                name: name,
                to_workspace: to_workspace,
                created_by: user.name,
                last_modify: last_modify,
                modify_by: user.name,
            });
            for (let i = 0; i < questions.length; i++) {
                max_time = questions[i].max_time;
                if (questions[i].max_time > 600) {
                    max_time = 600;
                }
                question_id = await connection("questions").insert({
                    question: questions[i].question,
                    points: questions[i].points,
                    max_time: max_time,
                    correct_answer: questions[i].correct_answer,
                    wrong_answers: questions[i].wrong_answers,
                });

                await connection("relationqq").insert({
                    quiz_id: quiz_id,
                    question_id: question_id,
                    author: user.name,
                });
            }

            return res.send(true);
        }
        return res.sendStatus(401);
    },

    async listAnswer(req, res) {
        const { name, to_workspace, questions } = req.body;
        const { user_id, last_modify } = req.headers;

        return res.sendStatus(401);
    },

    async userAnswer(req, res) {
        const { user_id } = req.headers;
        var { quiz_id, question_id, answer, time, date } = req.body;
        var pontuation = 0;
        var response;
        var correct = false;
        if (time > 600) {
            time = 600;
        }
        try {
            const user = await connection("users")
                .select("id")
                .where("id", user_id)
                .first();
            const ans = await connection("questions")
                .select("correct_answer", "points")
                .where("id", question_id)
                .first();
            if (!ans) {
                res.sendStatus(401);
            }
            if (ans.correct_answer.toLowerCase() == answer.toLowerCase()) {
                if (time < 20) {
                    pontuation = ans.points;
                } else {
                    pontuation = Math.abs(time / 60 - ans.points);
                    pontuation = parseFloat(pontuation.toFixed(2));
                    if (pontuation < ans.points / 2)
                        pontuation = ans.points / 2;
                }
                // Pegar pontuação salva do banco.
                let user_points = await connection("users")
                    .where("id", user.id)
                    .select("points")
                    .first();
                if (!user_points) return res.json(false);

                // Somar pontuação da questão com a pontuação do banco.
                await connection("users")
                    .where("id", user.id)
                    .update({ points: user_points.points + pontuation });

                correct = true;
                response = {
                    answer: {
                        user_id: user_id,
                        quiz_id: quiz_id,
                        question_id: question_id,
                        answer_selected: answer,
                        correct: correct,
                        date: date,
                    },
                };
            }

            await connection("answers").insert(response["answer"]);

            return res.json(pontuation);
        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    },
};
