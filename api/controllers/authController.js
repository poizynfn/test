const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { OAuth2Client } = require("google-auth-library");

const User = require("../models/User");
const { generateToken } = require("../utils/generateToken");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });

    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "An account with this email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword });
        const token = generateToken(user);

        return res.status(201).json({ message: "success", token, user });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong while registering" });
    }
};

const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !user.password) return res.status(400).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        const token = generateToken(user);

        return res.status(200).json({ message: "success", token, user });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong while logging in" });
    }
};

const googleAuth = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });

    try {
        const { credential } = req.body;

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) return res.status(400).json({ message: "Invalid Google credential" });

        const { email, sub: googleId, picture } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({ email, googleId, avatar: picture });
        } else if (!user.googleId) {
            user.googleId = googleId;
            user.avatar = user.avatar || picture;
            await user.save();
        }

        const token = generateToken(user);

        return res.status(200).json({ message: "success", token, user });
    } catch (err) {
        return res.status(400).json({ message: "Invalid Google credential" });
    }
};

const me = async (req, res) => {
    return res.status(200).json({ message: "success", user: req.user });
};

module.exports = { register, login, googleAuth, me };
