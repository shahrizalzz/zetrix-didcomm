import { performECDH, deriveKey } from '../encryption/X25519EncryptionUtil.js';
import nacl from 'tweetnacl';
import encryption from 'zetrix-encryption-nodejs';
import crypto from 'crypto';
import baseX from 'base-x';

// Define the Base58 alphabet
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

// Create the Base58 encoder/decoder
const base58 = baseX(BASE58_ALPHABET);

/**
 * Unpacks an authenticated encrypted message.
 * @param {Object} jwe - The JSON Web Encryption object.
 * @param {string} receiverPrivateKeyStr - The receiver's private key as a string.
 * @param {string} senderPublicKeyBase58 - The sender's public key in Base58 format.
 * @returns {Object} - The decrypted message.
 */
export function unpackAuthCrypt(jwe, receiverPrivateKeyStr, senderPublicKeyBase58) {
    const KeyPair = encryption.keypair;

    if (senderPublicKeyBase58.startsWith("z") && senderPublicKeyBase58.length === 45) {
        senderPublicKeyBase58 = senderPublicKeyBase58.substring(1); // Remove first character "z"
    }

    let messageWrapper;

    try {
        const decodedBytes = Buffer.from(jwe.protected, 'base64');
        const authHeader = JSON.parse(decodedBytes.toString('utf8'));

        let receiverRawPrivateKeyArray = KeyPair.parsePrivateKey(receiverPrivateKeyStr);
        const receiverRawPrivateKey = Buffer.isBuffer(receiverRawPrivateKeyArray)
            ? receiverRawPrivateKeyArray
            : Buffer.from(receiverRawPrivateKeyArray);

        if (receiverRawPrivateKey.length !== 32) {
            throw new Error('Receiver Private key must be 32 bytes for X25519!');
        }

        const receiverPrivateKeyUint8Array = new Uint8Array(receiverRawPrivateKey);
        const receiverX25519KeyPair = nacl.box.keyPair.fromSecretKey(receiverPrivateKeyUint8Array);
        const receiverPrivateKey = receiverX25519KeyPair.secretKey;

        const cipherTextBytes = Buffer.from(jwe.ciphertext, 'base64');
        const tagBytes = Buffer.from(jwe.tag, 'base64');
        const ivBytes = Buffer.from(jwe.iv, 'base64');
        const ephemeralPubKeyBytes = Buffer.from(authHeader.epk.x, 'base64');
        const senderPublicKeyBytes = base58.decode(senderPublicKeyBase58);

        let combinedSharedSecret;
        if (senderPublicKeyBytes) {
            const sharedSecret1 = performECDH(receiverPrivateKey, senderPublicKeyBytes);
            const sharedSecret2 = performECDH(receiverPrivateKey, ephemeralPubKeyBytes);
            combinedSharedSecret = Buffer.concat([sharedSecret1, sharedSecret2]);
        } else {
            combinedSharedSecret = performECDH(receiverPrivateKey, ephemeralPubKeyBytes);
        }

        const ENC_AES_CBC_HMAC = 'A256CBC-HS512';
        const derivedKey = deriveKey(combinedSharedSecret, ENC_AES_CBC_HMAC, authHeader.apu, authHeader.apv);

        const encKey = derivedKey.slice(0, 32);
        const macKey = derivedKey.slice(32, 64);

        const hmac = crypto.createHmac('sha512', macKey);
        hmac.update(cipherTextBytes);
        const computedHmac = hmac.digest();

        if (!computedHmac.equals(tagBytes)) {
            throw new Error('HMAC verification failed');
        }

        const decipher = crypto.createDecipheriv('aes-256-cbc', encKey, ivBytes);
        let decryptedMessage = decipher.update(cipherTextBytes, null, 'utf8');
        decryptedMessage += decipher.final('utf8');

        messageWrapper = JSON.parse(decryptedMessage);
        return messageWrapper;
    } catch (error) {
        console.error('Error during unpacking:', error);
        throw new Error('Decryption failed: ' + error.message);
    }
}

/**
 * Unpacks an anonymous encrypted message.
 * @param {Object} jwe - The JSON Web Encryption object.
 * @param {string} receiverPrivateKeyStr - The receiver's private key as a string.
 * @returns {Object} - The decrypted message.
 */
export function unpackAnonCrypt(jwe, receiverPrivateKeyStr) {
    const KeyPair = encryption.keypair;

    let messageWrapper;

    try {
        const decodedBytes = Buffer.from(jwe.protected, 'base64');
        const anonHeader = JSON.parse(decodedBytes.toString('utf8'));

        let receiverRawPrivateKeyArray = KeyPair.parsePrivateKey(receiverPrivateKeyStr);
        const receiverRawPrivateKey = Buffer.isBuffer(receiverRawPrivateKeyArray)
            ? receiverRawPrivateKeyArray
            : Buffer.from(receiverRawPrivateKeyArray);

        if (receiverRawPrivateKey.length !== 32) {
            throw new Error('Receiver Private key must be 32 bytes for X25519!');
        }

        const receiverPrivateKeyUint8Array = new Uint8Array(receiverRawPrivateKey);
        const receiverX25519KeyPair = nacl.box.keyPair.fromSecretKey(receiverPrivateKeyUint8Array);
        const receiverPrivateKey = receiverX25519KeyPair.secretKey;

        const cipherTextBytes = Buffer.from(jwe.ciphertext, 'base64');
        const tagBytes = Buffer.from(jwe.tag, 'base64');
        const ivBytes = Buffer.from(jwe.iv, 'base64');
        const ephemeralPubKeyBytes = Buffer.from(anonHeader.epk.x, 'base64');

        const sharedSecret = performECDH(receiverPrivateKey, ephemeralPubKeyBytes);

        const ENC_AES_CBC_HMAC = 'A256CBC-HS512';
        const derivedKey = deriveKey(sharedSecret, ENC_AES_CBC_HMAC, null, anonHeader.apv);

        const encKey = derivedKey.slice(0, 32);
        const macKey = derivedKey.slice(32, 64);

        const hmac = crypto.createHmac('sha512', macKey);
        hmac.update(cipherTextBytes);
        const computedHmac = hmac.digest();

        if (!computedHmac.equals(tagBytes)) {
            throw new Error('HMAC verification failed');
        }

        const decipher = crypto.createDecipheriv('aes-256-cbc', encKey, ivBytes);
        let decryptedMessage = decipher.update(cipherTextBytes, null, 'utf8');
        decryptedMessage += decipher.final('utf8');

        messageWrapper = JSON.parse(decryptedMessage);
        return messageWrapper;
    } catch (error) {
        console.error('Error during unpacking:', error);
        throw new Error('Decryption failed: ' + error.message);
    }
}
