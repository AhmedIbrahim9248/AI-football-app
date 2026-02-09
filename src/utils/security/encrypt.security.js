import cryptoJs from 'crypto-js'

export const enc = ({
    palinText = "",
    secretKey = process.env.SECRET_KEY
} = {}) => {
    return cryptoJs.AES.encrypt(palinText, secretKey).toString()
}

export const dec = ({
    cipherText = "",
    secretKey = process.env.SECRET_KEY
} = {}) => {
    return cryptoJs.AES.decrypt(cipherText, secretKey)
        .toString(cryptoJs.enc.Utf8)
}
