import { randomInt } from 'crypto';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export default function generateToken(length = 16): string {
    if (length < 1) throw new Error('length must be >= 1');
    const underscoreCount = 1;
    if (length <= underscoreCount) {
        return '_'.repeat(length);
    }

    const lettersCount = length - underscoreCount;
    const chars: string[] = new Array<string>(lettersCount);

    for (let i = 0; i < lettersCount; i++) {
        chars[i] = ALPHABET[randomInt(0, ALPHABET.length)];
    }

    const underscorePosition = randomInt(0, length);
    chars.splice(underscorePosition, 0, '_');

    return chars.join('');
}
