const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: false,
        },
        googleId: {
            type: String,
            required: false,
        },
        avatar: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);

UserSchema.virtual("username").get(function () {
    return this.email.split("@")[0];
});

UserSchema.set("toJSON", {
    virtuals: true,
    transform: (_doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
    },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
