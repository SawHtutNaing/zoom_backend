const fs = require('fs');
const path = require('path');
const userDB = require('../models/User');

const Helper = require('../utils/helper');

const migrate = () => {
    try {
        const filePath = path.resolve(__dirname, 'users.json');

        const data = fs.readFileSync(filePath);
        const users = JSON.parse(data)
// console.log(users);
        users.forEach(async user=> {
            user.password = await Helper.encode(user.password);

            let result = await new userDB(user).save();
            console.log("File Content:", result); // Log file content
            // console.log(user.password)

        })

    } catch (error) {
        console.error("Error reading users.json:", error.message);
        console.error("Current Directory:", process.cwd()); // Log current working directory
    }
};


module.exports = {
    migrate
}
