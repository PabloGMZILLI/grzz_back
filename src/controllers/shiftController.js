const connection = require('../database/connection');

module.exports = {
    async index(req, res) {
        const { user_id } = req.params;
        try {
            let shifts = [];
            if (user_id) {
                shifts = await connection('shifts').select('*').where('user_id', user_id);
            } else {
                shifts = await connection('shifts').select('*');
            }

            if (shifts.length == 0) {
                return res.send('Nenhum turno cadastrado');
            }
            return res.json(shifts);
        } catch (error) {
            return res.sendStatus(404);
        }
    },

    async delete(req, res) {
        const { id } = req.params;
        const { user_id } = req.headers;
        const status = await connection('shifts').where('id', id).andWhere('user_id', user_id).del();
        return res.send(!!status);
    },

    async create(req, res) {
        const { weekday, start_time, end_time, date } = req.body;
        const { user_id } = req.headers;
        try {
            await connection('shifts').insert({
                weekday,
                start_time,
                end_time,
                date,
                user_id
            });
            return res.send(true);
        }
        catch (error) {
            return res.sendStatus(404)
        }
    }
}