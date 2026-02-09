import jwt from 'jsonwebtoken'


export const generateToken = ({
    payload = {},
    signature = process.env.ACCESS_TOKEN_SIGNATURE,
    options = { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) }
} = {}) => {
    return jwt.sign(payload, signature, options)
}

export const verifyToken = ({
    token = "",
    signature = process.env.ACCESS_TOKEN_SIGNATURE
} = {}) => {
    return jwt.verify(token, signature)
}

export const generateLoginCredintials = async ({ user }) => {
    const Access_token = await generateToken({
        payload: ({ id: user._id }),
        signature: process.env.ACCESS_TOKEN_SIGNATURE,
        options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    })

    const Refresh_token = await generateToken({
        payload: ({ id: user._id }),
        signature: process.env.REFRESH_TOKEN_SIGNATURE,
        options: { expiresIn:process.env.REFRESH_TOKEN_EXPIRES_IN }
    })
    return ({ Access_token, Refresh_token })
}

