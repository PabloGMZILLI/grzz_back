const connection = require('../database/connection');
const crypto = require('crypto');
const otherEncrypt = require('bcrypt');
// Encrypt passwords marcao method https://www.npmjs.com/package/bcrypt

function generateSalt(length) {
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex')
            .slice(0,16); 
};

function sha512(password, salt){
    var hash = crypto.createHmac('sha512', salt); // Algoritmo de cripto sha512
    hash.update(password);
    var hash = hash.digest('hex');
    return {
        salt,
        hash,
    };
};

function generatePassword(password) {
    var salt = generateSalt(16); // Vamos gerar o salt
    var passwordAndSalt = sha512(password, salt); // Pegamos a senha e o salt
    // A partir daqui você pode retornar a senha ou já salvar no banco o salt e a senha
    return passwordAndSalt;
}
 
function testLogin(loginPassword, salt, hash) {
    var combination = sha512(loginPassword.toString(), salt.toString())
    return hash === combination.hash;
}

module.exports = {
    async index (req, res) {
        const { user_id = '' } = req.headers;
        try {
            const user = await connection('users').select('account_type').where('id', user_id).first();
            if (user && user.account_type == "admin") {
                const users = await connection('users').select('id', 'account_type', 'name', 'phone', 'email', 'birthday');
                if (users.length == 0) {
                    return res.send('Nenhuma conta cadastrada');
                }
                return res.json(users);
            }
            return res.sendStatus(401);
        } catch (error) {
            return res.sendStatus(500);
        }
    },

    async create (req, res) {
        const { nickname, password, phone, email, birthday, account_type = 'normal' } = req.body;
        try {
            const id = crypto.randomBytes(4).toString('HEX');
            const pass = generatePassword(password);
            const password_hash = pass.hash;
            const password_salt = pass.salt;
            const name = nickname.toLowerCase();
            const points = 0;
            await connection('users').insert({
                id,
                name,
                password_hash,
                password_salt,
                phone,
                email,
                birthday,
                points,
                account_type,
            });
            return res.json({ id });
        } catch(error) {
            res.sendStatus(500);
        }
    },

    async login (req, res) {
        const { name = '', email = '', password } = req.body;
        try {
            const normalizedName = name.toLowerCase();
            const user = await connection('users').select('*').where('name', normalizedName).orWhere('email', email).first();
            if (user) {
                const result = testLogin(password, user.password_salt, user.password_hash);
                delete user.password_salt;
                delete user.password_hash;
                if (result) {
                    return res.json(user);
                }
            }
            return res.send(false);
        } catch(error) {
            res.sendStatus(500)
        }
    }
}