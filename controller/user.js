const {isEmpty} = require("../public/validation");
const {success, error, missingParam, created} = require("../public/response");
const User = require("../model/user");
const bcrypt = require("bcrypt");

let users = {
    login: async (payload) =>{
        let reqFields = isEmpty(payload, ["email", "password"]);
        if (reqFields.length > 0) {
            return missingParam(reqFields);
        }
        try {
            const user = await User.findOne({ email: payload.email });
            if (!user) {
                return error(401, "Invalid email");
            }
            const isMatch = await bcrypt.compare(payload.password, user.password);
            if (!isMatch) {
                return error(401, "Invalid password");
            }
            const response = {
                id: user._id,
                email: user.email,
                userName: user.userName
            };
            return success("Login successful", response);

        } catch (err) {
            console.error("login Error:", err);
            return error(500, "Internal server error");
        }
    },
    register: async (payload) =>{
        let reqFields = isEmpty(payload, ["email", "password", "userName"]);
        if (reqFields.length > 0) {
            return missingParam(reqFields);
        }

        try {
            const existingUser = await User.findOne({ email: payload.email });
            if (existingUser) {
                return error(409, "Email already registered");
            }
            const hashedPassword = await bcrypt.hash(payload.password, 10);

            const newUser = new User({
                email: payload.email,
                password: hashedPassword,
                userName: payload.userName
            });

            const result = await newUser.save();

            const response = {
                id: result._id,
                email: result.email,
                userName: result.userName
            };

            return created("User registered successfully", response);
        } catch (err) {
            console.error("Register Error:", err);
            return error(500, "Internal server error");
        }
    }
}

module.exports = users;
