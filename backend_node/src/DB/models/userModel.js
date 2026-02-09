import mongoose from "mongoose";


export let getGender = { male: "male", female: "female" }
export let roleEnum = { fan: "fan", coatch: "coach" }

export const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        minLength: [2, "the minimum length is 2 chars"],
        maxLength: [20, "the maximum length is 20  chars"],
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        minLength: [2, "the minimum length is 2 chars"],
        maxLength: [20, "the maximum length is 20  chars"],
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/,
        trim: true
    },

    password: {
        type: String,
        required: true,

        minlength: [6, "password must be 6 chars at least"]

    },
    gender: {
        type: String,
        enum: { values: Object.values(getGender), message: `gender only allow ${Object.values(getGender)}` },
        default: getGender.male
    },
    phone: {
        type: String,
        required: true,

    },
    confirmEmail: Date,
    picture: String,
    confirmOtp: String,
    role: {
        type: String,
        enum: { values: Object.values(roleEnum) },
        default: roleEnum.fan
    }
},
    {
        //options

        timestamps: true,           //created at ,updateda at
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

userSchema.virtual("fullName")
    .set(function (value) {
        const [first, last] = value.split(" ");
        this.firstName = first;
        this.lastName = last;
    })
    .get(function () {
        return `${this.firstName} ${this.lastName}`;
    });


export const userModel =
    mongoose.models.user || mongoose.model("user", userSchema);

userModel.syncIndexes()    //update the index automatically
