import { userModel } from "../../DB/models/userModel.js";
import { asyncHandler, successResponse } from "../../utils/response.js";
import * as DBservice from '../../DB/db.services.js';
import * as encryptionSecurity from '../../utils/security/encrypt.security.js'
import * as hashSecurity from '../../utils/security/hash.security.js'
import { customAlphabet } from 'nanoid'
import event from '../../utils/event/event.email.js'
import { generateLoginCredintials } from "../../utils/security/token.security.js";


export const signUp = asyncHandler(
    async (req, res, next) => {

        const { fullName, email, password, gender, phone, role } = req.body

        if (await DBservice.findOne({
            model: userModel,
            filter: { email }
        })) {
            return next(new Error("Email exist", { cause: 409 }));
        }
        const encPhone = await encryptionSecurity.enc({ plainText: phone })
        const hashPassword = await hashSecurity.generateHash({
            plainText: password,
            saltRound: 12
        })
        const otp = customAlphabet('0123456789', 6)()
        const confirmOtp = await hashSecurity.generateHash({ plainText: otp })
        const [user] = await DBservice.create({
            model: userModel,
            data: [{ fullName, email, password: hashPassword, gender, phone: encPhone, role, confirmOtp }]
        });

        event.emit("confirm_email", { to: email, otp: otp })
        return successResponse({ res, status: 201, data: { user } });
    }
);

export const confirmEmail = asyncHandler(
    async (req, res, next) => {
        const { email, otp } = req.body
        const user = await DBservice.findOne({
            model: userModel,
            filter: {
                email,
                confirmOtp: { $exists: true },
                confirmEmail: { $exists: false }
            }
        })
        if (!user) {
            return next(new Error("in_valid account", { cause: 401 }))
        }
        const match = await hashSecurity.compareHash({
            plainText: otp,
            hashValue: user.confirmOtp
        })
        if (!match) {
            return next(new Error("in_valid otp", { cause: 400 }))
        }
        const updateUser = await DBservice.updateOne({
            model: userModel,
            filter: { email },
            data: {
                confirmEmail: Date.now(),
                $unset: { confirmOtp: true }
            }
        })

        return updateUser.matchedCount
            ? successResponse({ res, status: 201 })
            : next(new Error("Account not confirmed"))
    }
)

export const login = asyncHandler(
    async (req, res, next) => {
        const { email, password } = req.body;
        const user = await DBservice.findOne({
            model: userModel,
            filter: { email }
        })
        if (!user) {
            return next(new Error("in_valid email", { cause: 404 }))
        }
        const match = await hashSecurity.compareHash({
            plainText: password,
            hashValue: user.password
        })
        if (!user.confirmEmail) {
            return next(new Error("please verify your acount first"))
        }
        if (!match) {
            return next(new Error("in_valid email or password", { cause: 401 }))
        }

        const credentials = await generateLoginCredintials({ user })
        return successResponse({ res, data: { credentials } })
    }
)