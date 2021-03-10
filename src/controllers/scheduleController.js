const connection = require('../database/connection');
const { create } = require('./userController');

module.exports = {
    async index (req, res) {
        const schedules = await connection('schedules').select('*');
        if (schedules.length == 0) {
            return res.send('Nenhum agendamento cadastrado');
        }
        return res.json(schedules);
    },

    async delete(req, res) {
        const { id } = req.params;
        const { user_id } = req.headers;
        const status = await connection('schedules').where('id', id).andWhere('created_from', user_id).orWhere('id', id).andWhere('service_to_id', user_id).del();
        return res.send(!!status);
    },

    async create(req, res) {
        const { date, time, service_id, service_to_id } = req.body;
        const { user_id } = req.headers;

        const created_from = user_id;
        const user = await connection('users').select('account_type').where('id', user_id).first();
        var status = false;
        try {
            if (user && user.account_type == 'admin') {
                status = true;
            }
            
            await connection('schedules').insert({
                date,
                time,
                service_id,
                created_from,
                service_to_id,
                status
            });
            return res.send(true);
        } catch (error) {
            return res.sendStatus(404);
        } 
    }
}