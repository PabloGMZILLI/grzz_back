const connection = require('../database/connection');


module.exports = {
    async index (req, res) {
        const { user_id = '' } = req.headers;
        let users = [];
        try {
            const user = await connection('users').select('account_type').where('id', user_id).first();
            if (user && user.account_type == "admin") {
                let response = await connection('users').select('id', 'account_type', 'name', 'phone', 'email', 'birthday', 'points').orderBy('points', 'desc');
                users = { ranking: response };
                return res.json(users);
            }
            return res.sendStatus(401);
        } catch (error) {
            return res.sendStatus(500);
        }
    },
    async add (req, res) {
        const { user_id = '' } = req.headers;
        const { user, points } = req.body;
        try {
            if (points) {
                let pontuation = await connection('users').where('id', user).select('points').first();
                var sumPoints = pontuation.points + points;
            } 

            const userType = await connection('users').select('account_type').where('id', user_id).first();
            if (userType && userType.account_type == "admin" && points) {
                await connection('users').where('id', user).update({points: sumPoints})
                res.json(true);
            } else {
                res.json(false);
            }
        } catch(error) {
            res.sendStatus(500)
        }
    },
    async remove (req, res) {
        const { user_id = '' } = req.headers;
        const { user, points } = req.body;
        try {
            if (points) {
                let pontuation = await connection('users').where('id', user).select('points').first();
                if (pontuation.points == 0) {
                    res.json(true);
                }
                var sumPoints = pontuation.points - points;
                if (sumPoints < 0) {
                    sumPoints = 0;
                }
            } 

            const userType = await connection('users').select('account_type').where('id', user_id).first();
            if (userType && userType.account_type == "admin" && points) {
                await connection('users').where('id', user).update({points: sumPoints})
                res.json(true);
            } else {
                res.json(false);
            }
        } catch(error) {
            res.sendStatus(500)
        }
    },
    async reset (req, res) {
        const { user_id = '' } = req.headers;
        const { user } = req.body;
        try {
            const userType = await connection('users').select('account_type').where('id', user_id).first();
            if (userType && userType.account_type == "admin") {
                await connection('users').where('id', user).update({points: 0})
                res.json(true);
            } else {
                res.json(false);
            }
        } catch(error) {
            res.sendStatus(500)
        }
    }
}