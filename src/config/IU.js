
const dotenv = require("dotenv");

dotenv.config();

module.exports = {

    Credentials: {
            ID: process.env.USER_ACADMIC_NUMBER_IU,
            PASSWORD: process.env.USER_PASSWORD_IU,
    },
}