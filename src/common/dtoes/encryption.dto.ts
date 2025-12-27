import * as crypto from 'crypto';

export class EncrytDecrypt {
    public static symEncrypt(text: string, algorithm, key): string {
        let iv = Buffer.from(crypto.randomBytes(16));
        console.log('Generated IV:', iv.toString('hex'), 'Length:', iv.length);

        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(text, 'utf8', 'base64');
        encrypted += cipher.final('base64');

        return `${iv.toString('hex')}:${encrypted}`;
    }

    public static symDecrypt(encryptedText: string, algorithm, key) {
        const [ivHex, encrypted] = encryptedText.split(':');
        const iv = Buffer.from(ivHex, 'hex');

        console.log('Received IV:', iv.toString('hex'), 'Length:', iv.length);

        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encrypted, 'base64', 'utf8');
        console.log(decrypted);
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}