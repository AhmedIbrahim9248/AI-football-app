import jwt from 'jsonwebtoken'
import * as DBservice from '../../DB/db.services.js'
import {roleEnum, userModel} from '../../DB/models/userModel.js'
export const tokenTypeEnum = { access: "access", refresh: "refresh" }
export const signatureLevelEnum = { bearer: "Bearer", system: "System" }


export const generateToken = ({
    payload = {},
    signature = process.env.ACCESS_USER_TOKEN_SIGNATURE,
    options = { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) }
} = {}) => {
    return jwt.sign(payload, signature, options)
}

export const verifyToken = ({
    token = "",
    signature = process.env.ACCESS_USER_TOKEN_SIGNATURE
} = {}) => {
    return jwt.verify(token, signature)
}

export const getSignatures = async ({
    signatureLevel = bearer
} = {}) => {

    let signatures = { accessSignature: undefined, refreshSignature: undefined }

    switch (signatures) {

        case signatureLevelEnum.system:
            signatures.accessSignature = process.env.ACCESS_SYSTEM_TOKEN_SIGNATURE
            signatures.refreshSignature = process.env.REFRESH_SYSTEM_TOKEN_SIGNATURE
            break;

        default:
            signatures.accessSignature = process.env.ACCESS_USER_TOKEN_SIGNATURE
            signatures.refreshSignature = process.env.REFRESH_USER_TOKEN_SIGNATURE
            break;
    }
    return signatures
}

export const decodedToken = async ({
    next,
    authorization = "",
    tokenType = tokenTypeEnum.access
} = {}) => {

    const [bearer, token] = authorization?.split(' ') || []

    if (!bearer || !token) {
        return next(new Error("missing token parts", { cause: 401 }))
    }

    let signatures=await getSignatures({
        signatureLevel:bearer
    })
    // console.log(signatures);

    const checkTokenType= tokenType ===tokenTypeEnum.access?
    signatures.accessSignature : signatures.refreshSignature

    const decoded= await verifyToken({
        token,
        signature:checkTokenType
    })

    if (!decoded?._id) {
        return next (new Error("in_valid token ",{cause:400}))

    }

    const user =await DBservice.findById({
        model:userModel,
        id:decoded._id
    })

    if (!user) {
        return next (new Error("in_valid register account"))
    }
    return user
}

export const generateLoginCredintials = async ({ user } = {}) => {

    const checkRole = user.role !== roleEnum.fan ?
     signatureLevelEnum.system : signatureLevelEnum.bearer

    let signatures = await getSignatures({
        signatureLevel: checkRole
    })

    const access_token = await generateToken({
        payload: { _id: user._id },
        signature: signatures.accessSignature
    })

    const refresh_token = await generateToken({
        payload: { _id: user._id },
        signature: signatures.refreshSignature,
        options: { expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN) }
    })
    return ({ access_token, refresh_token })
}
