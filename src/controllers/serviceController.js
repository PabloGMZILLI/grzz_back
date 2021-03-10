const connection = require('../database/connection');
const { create } = require('./userController');

module.exports = {
    async index (req, res) {
        const services = await connection('services').select('*');
        if (services.length == 0) {
            return res.send('Nenhum serviço cadastrado');
        }
        return res.json(services);
    },

    async delete(req, res) {
        const { id } = req.params;
        const { user_id } = req.headers;
        const status = await connection('services').where('id', id).andWhere('user_id', user_id).del();
        return res.send(!!status);
    },

    async create(req, res) {
        const { name, price, time } = req.body;
        const { user_id } = req.headers;
        const user = await connection('users').select('account_type').where('id', user_id).first();

        if (user && user.account_type == "admin") {
            await connection('services').insert({
                name,
                price,
                time,
                user_id
            });
            return res.send(true);
        }
        return res.sendStatus(401)
    }
}