import encryption from 'zetrix-encryption-nodejs';
import nacl from 'tweetnacl';
// Import utilities from the local X25519EncryptionUtil file
import {
    computeApv,
    performECDH,
    concatenate,
    deriveKey,
    generateIV,
    encryptAES_CBC_HMAC_SHA512,
    base64UrlEncode,
    createAuthProtectedHeader,
    createAnonProtectedHeader,
    aesKeyWrap
} from '../encryption/X25519EncryptionUtil.js'; // Add .js if running in Node.js with ESM
import baseX from 'base-x';

// Define the Base58 alphabet
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

// Create the Base58 encoder/decoder
const base58 = baseX(BASE58_ALPHABET);

export function packAuthCrypt(senderPrivKeyStr, recipientPubKeyBase58, skid, kid, message) {
    const KeyPair = encryption.keypair;

    if (recipientPubKeyBase58.startsWith("z") && recipientPubKeyBase58.length === 45) {
        recipientPubKeyBase58 = recipientPubKeyBase58.substring(1); // Remove first character "z"
    }

    // Parse the raw private key
    const senderRawPrivateKeyArray = KeyPair.parsePrivateKey(senderPrivKeyStr);
    // Convert the array to a Buffer if necessary
    const senderRawPrivateKey = Buffer.isBuffer(senderRawPrivateKeyArray) ? senderRawPrivateKeyArray : Buffer.from(senderRawPrivateKeyArray);
    // Ensure the private key is 32 bytes for X25519 compatibility
    if (senderRawPrivateKey.length !== 32) {
        throw new Error('Sender Private key must be 32 bytes for X25519!');
    }
    // Convert the Buffer to a Uint8Array for tweetnacl
    const senderPrivateKeyUint8Array = new Uint8Array(senderRawPrivateKey);
    // Generate the X25519 key pair with tweetnacl
    const senderX25519KeyPair = nacl.box.keyPair.fromSecretKey(senderPrivateKeyUint8Array);
    const ephemeralX25519KeyPair = nacl.box.keyPair(); // Generate an ephemeral X25519 key pair (randomly generated)
    const recipientPublicKeyBytes = base58.decode(recipientPubKeyBase58);

    // Define apu and apv
    const apu = skid; // Sender's DID
    const apv = [kid]; // Recipient's DID as an array

    const apuEncoded = Buffer.from(apu, 'utf-8') // Encode apu using Base64URL without padding
        .toString('base64') // Standard Base64 encoding
        .replace(/\+/g, '-') // Convert '+' to '-'
        .replace(/\//g, '_') // Convert '/' to '_'
        .replace(/=+$/, '');
    const apvEncoded = computeApv(apv);

    const sharedSecret1 = performECDH(senderX25519KeyPair.secretKey, recipientPublicKeyBytes);
    const sharedSecret2 = performECDH(ephemeralX25519KeyPair.secretKey, recipientPublicKeyBytes);

    const combinedSharedSecret = concatenate(sharedSecret1, sharedSecret2);
    const encMethod = 'A256CBC-HS512';
    const derivedKey = deriveKey(combinedSharedSecret, encMethod, apuEncoded, apvEncoded);

    const iv = generateIV();

    const ciphertextWithHMAC = encryptAES_CBC_HMAC_SHA512(Buffer.from(message, 'utf8'), derivedKey, iv);

    const tagLength = 64; // 512 bits / 8 = 64 bytes
    const ciphertext = ciphertextWithHMAC.slice(0, ciphertextWithHMAC.length - tagLength); // Split the ciphertext
    const tag = ciphertextWithHMAC.slice(ciphertextWithHMAC.length - tagLength); // Extract the tag

    const protectedHeader = createAuthProtectedHeader(
        'X25519',
        'OKP',
        apuEncoded,
        apvEncoded,
        ephemeralX25519KeyPair.publicKey,
        skid,
        'application/didcomm-encrypted+json',
        'ECDH-1PU+A256KW',
        'A256CBC-HS512'
    );
    const protectedHeaderEncoded = base64UrlEncode(protectedHeader);

    const kek = derivedKey.slice(0, 32); // 256-bit KEK
    const cek = derivedKey.slice(0, 32); // 256-bit CEK

    const wrappedKey = aesKeyWrap(kek, cek);
    const encryptedKey = base64UrlEncode(wrappedKey);

    return {
        protected: protectedHeaderEncoded,
        recipients: [
            {
                encrypted_key: encryptedKey,
                header: {
                    kid: kid
                }
            }
        ],
        iv: base64UrlEncode(iv),
        ciphertext: base64UrlEncode(ciphertext),
        tag: base64UrlEncode(tag)
    };
}

export function packAnonCrypt(recipientPubKeyBase58, kid, message) {
    if (recipientPubKeyBase58.startsWith("z") && recipientPubKeyBase58.length === 45) {
        recipientPubKeyBase58 = recipientPubKeyBase58.substring(1); // Remove first character "z"
    }

    const ephemeralX25519KeyPair = nacl.box.keyPair(); // Generate an ephemeral X25519 key pair
    const recipientPublicKeyBytes = base58.decode(recipientPubKeyBase58);

    const apv = [kid]; // Recipient's DID as an array
    const apvEncoded = computeApv(apv);

    const sharedSecret = performECDH(ephemeralX25519KeyPair.secretKey, recipientPublicKeyBytes);

    const encMethod = 'A256CBC-HS512';
    const derivedKey = deriveKey(sharedSecret, encMethod, null, apvEncoded);

    const iv = generateIV();

    const ciphertextWithHMAC = encryptAES_CBC_HMAC_SHA512(Buffer.from(message, 'utf8'), derivedKey, iv);

    const tagLength = 64; // 512 bits / 8 = 64 bytes
    const ciphertext = ciphertextWithHMAC.slice(0, ciphertextWithHMAC.length - tagLength); // Split the ciphertext
    const tag = ciphertextWithHMAC.slice(ciphertextWithHMAC.length - tagLength); // Extract the tag

    const protectedHeader = createAnonProtectedHeader(
        'X25519',
        'OKP',
        apvEncoded,
        ephemeralX25519KeyPair.publicKey,
        'application/didcomm-encrypted+json',
        'ECDH-ES+A256KW',
        'A256CBC-HS512'
    );
    const protectedHeaderEncoded = base64UrlEncode(protectedHeader);

    const kek = derivedKey.slice(0, 32); // 256-bit KEK
    const cek = derivedKey.slice(0, 32); // 256-bit CEK

    const wrappedKey = aesKeyWrap(kek, cek);
    const encryptedKey = base64UrlEncode(wrappedKey);

    return {
        protected: protectedHeaderEncoded,
        recipients: [
            {
                encrypted_key: encryptedKey,
                header: {
                    kid: kid
                }
            }
        ],
        iv: base64UrlEncode(iv),
        ciphertext: base64UrlEncode(ciphertext),
        tag: base64UrlEncode(tag)
    };
}
