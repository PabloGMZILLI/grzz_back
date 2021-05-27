const connection = require('../database/connection');
const url = require('url');

module.exports = {
    async index(req, res) {
        var { limit=10, offset=0, filterName='workspace', filter} = req.query;
        let users = [];
        filter ? filter =  filter.toLowerCase() : null;
        filterName ? filterName =  filterName.toLowerCase() : null;
        if (filter == 'all') filter = undefined;
        try {
            if (filter) {
                users = await connection('users').select('id', 'name', 'lastname', 'phone', 'workspace', 'email', 'city', 'birthday', 'points').where(filterName, '=' , filter).orderBy('points', 'desc').limit(limit).offset(offset);
            } else {
                users = await connection('users').select('id', 'name', 'lastname', 'phone', 'workspace', 'email', 'city', 'birthday', 'points').orderBy('points', 'desc').limit(limit).offset(offset);
            }
            if (users) return res.json(users);

            return res.sendStatus(401);
        } catch (error) {
            console.log(error)
            return res.sendStatus(500);
        }
    },
    async add(req, res) {
        const { user_id = '' } = req.headers;
        const { user, points } = req.body;
        try {
            const userType = await connection('users').select('account_type').where('id', user_id).first();
            if (userType && userType.account_type == "admin" && points) {
                let pontuation = await connection('users').where('id', user).select('points').first();
                if (!pontuation) return res.json(false);
                var sumPoints = pontuation.points + points;
                await connection('users').where('id', user).update({ points: sumPoints });
                res.json(true);
            }
            res.json(false);
        } catch (error) {
            res.sendStatus(500)
        }
    },
    async remove(req, res) {
        const { user_id = '' } = req.headers;
        const { user, points } = req.body;
        try {
            const userType = await connection('users').select('account_type').where('id', user_id).first();
            if (userType && userType.account_type == "admin" && points) {
                let pontuation = await connection('users').where('id', user).select('points').first();
                if (!pontuation) return res.json(false);
                if (pontuation.points == 0) res.json(true);
                let sumPoints = pontuation.points - points;
                if (sumPoints < 0) sumPoints = 0;
                await connection('users').where('id', user).update({ points: sumPoints })
                res.json(true);
            }
            res.json(false);
        } catch (error) {
            res.sendStatus(500)
        }
    },
    async reset(req, res) {
        const { user_id = '' } = req.headers;
        const { user } = req.body;
        try {
            const userType = await connection('users').select('account_type').where('id', user_id).first();
            if (userType && userType.account_type == "admin") {
                await connection('users').where('id', user).update({ points: 0 })
                res.json(true);
            }
            res.json(false);
        } catch (error) {
            res.sendStatus(500)
        }
    }
}