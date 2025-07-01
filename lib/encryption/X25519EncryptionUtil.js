import nacl from 'tweetnacl';
import crypto from 'crypto';
import hkdf from 'futoin-hkdf';

export function computeApv(kidList) {
    if (!Array.isArray(kidList) || kidList.length === 0) {
        throw new Error("kidList must not be null or empty");
    }

    const sortedKidList = [...kidList].sort();
    const concatenatedKids = sortedKidList.length === 1
        ? sortedKidList[0]
        : sortedKidList.join('.');

    const hash = crypto.createHash('sha256')
        .update(concatenatedKids, 'utf-8')
        .digest();

    const apvEncoded = hash.toString('base64')
        .replace(/\+/g, '-')   // Convert '+' to '-'
        .replace(/\//g, '_')   // Convert '/' to '_'
        .replace(/=+$/, '');   // Remove padding '='

    return apvEncoded;
}

export function performECDH(privateKey, publicKey) {
    return nacl.scalarMult(privateKey, publicKey);
}

export function concatenate(a, b) {
    return Buffer.concat([a, b]);
}

export function deriveKey(combinedSharedSecret, encMethod, apuEncoded, apvEncoded) {
    let infoString = !apuEncoded || apuEncoded.length === 0
        ? apvEncoded + encMethod
        : apuEncoded + apvEncoded + encMethod;

    const info = Buffer.from(infoString, 'utf8');
    return hkdf(combinedSharedSecret, 64, { salt: null, info, hash: 'SHA-512' });
}

export function generateIV() {
    return crypto.randomBytes(16); // 128-bit IV for AES-CBC
}

export function encryptAES_CBC_HMAC_SHA512(plaintext, derivedKey, iv) {
    const encKey = derivedKey.slice(0, 32); // 256 bits
    const macKey = derivedKey.slice(32, 64); // 256 bits

    const cipher = crypto.createCipheriv('aes-256-cbc', encKey, iv);
    let ciphertext = cipher.update(plaintext, 'utf8', 'binary');
    ciphertext += cipher.final('binary');

    const hmac = crypto.createHmac('sha512', macKey);
    hmac.update(ciphertext, 'binary');
    const hmacResult = hmac.digest();

    return Buffer.concat([Buffer.from(ciphertext, 'binary'), hmacResult]);
}

export function base64UrlEncode(input) {
    return Buffer.from(input, 'utf8')
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export function createAuthProtectedHeader(crv, kty, apu, apv, ephemeralPublicKey, skid, typ, alg, enc) {
    const epk = {
        crv: crv,
        kty: kty,
        x: base64UrlEncode(ephemeralPublicKey)
    };

    return JSON.stringify({
        epk: epk,
        typ: typ,
        alg: alg,
        enc: enc,
        skid: skid,
        apu: apu,
        apv: apv
    });
}

export function createAnonProtectedHeader(crv, kty, apv, ephemeralPublicKey, typ, alg, enc) {
    const epk = {
        crv: crv,
        kty: kty,
        x: base64UrlEncode(ephemeralPublicKey)
    };

    return JSON.stringify({
        epk: epk,
        typ: typ,
        alg: alg,
        enc: enc,
        apv: apv
    });
}

export function aesKeyWrap(kek, cek) {
    const kekBuffer = Buffer.from(kek);
    const cekBuffer = Buffer.from(cek);

    if (kekBuffer.length !== 32) {
        throw new Error('KEK must be 256-bit (32 bytes)');
    }
    if (cekBuffer.length !== 32) {
        throw new Error('CEK must be 256-bit (32 bytes)');
    }

    const blockSize = 8;
    const aes = crypto.createCipheriv('aes-256-ecb', kekBuffer, '');

    let iv = Buffer.alloc(blockSize);
    iv.writeUInt32BE(0, 0);
    iv.writeUInt32BE(0x01000000, 4);

    let result = Buffer.concat([iv, cekBuffer]);

    for (let i = 0; i < 6; i++) {
        let block = result.slice(i * blockSize, (i + 1) * blockSize);
        let cipherBlock = aes.update(block);
        result = Buffer.concat([result, cipherBlock]);
    }

    return result;
}
