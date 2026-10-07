/**
 * scripts/encrypt-files.mjs 가 봉한 파일을 브라우저에서 연다. 컨테이너 꼴은 그 파일 머리에
 * 적혀 있다 — 한쪽을 바꾸면 다른 쪽도 바꾼다.
 *
 * 키는 사람이 입력한 비밀구절이고, 서버는 없다. 복호화는 전부 WebCrypto 로 이 기기 안에서
 * 끝나며 비밀구절은 어디로도 가지 않는다.
 */
const MAGIC = 'TWKF';
const VERSION = 1;
const HEADER = 37;

export class SealedFileError extends Error {
    constructor(readonly reason: 'format' | 'key', message: string) {
        super(message);
        this.name = 'SealedFileError';
    }
}

interface Container {
    iterations: number;
    salt: Uint8Array;
    iv: Uint8Array;
    cipher: Uint8Array;
}

const parse = (bytes: Uint8Array): Container => {
    const magic = new TextDecoder().decode(bytes.subarray(0, 4));
    if (bytes.length < HEADER || magic !== MAGIC || bytes[4] !== VERSION) {
        throw new SealedFileError('format', 'not a sealed file');
    }
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    return {
        iterations: view.getUint32(5),
        salt: bytes.subarray(9, 25),
        iv: bytes.subarray(25, 37),
        cipher: bytes.subarray(HEADER),
    };
};

const deriveKey = async (passphrase: string, salt: Uint8Array, iterations: number) => {
    // NFKC — 한글 자모가 조합형·완성형 어느 쪽으로 들어와도 같은 키가 나오게 한다.
    const material = await crypto.subtle.importKey(
        'raw', new TextEncoder().encode(passphrase.normalize('NFKC')), 'PBKDF2', false, ['deriveKey'],
    );
    return crypto.subtle.deriveKey(
        {name: 'PBKDF2', hash: 'SHA-256', salt: salt as BufferSource, iterations},
        material, {name: 'AES-GCM', length: 256}, false, ['decrypt'],
    );
};

/** 봉한 바이트를 비밀구절로 연다. 키가 틀리면 GCM 태그 검증이 실패하므로 `reason: 'key'` 로 던진다. */
export const unseal = async (bytes: Uint8Array, passphrase: string): Promise<ArrayBuffer> => {
    const {iterations, salt, iv, cipher} = parse(bytes);
    const key = await deriveKey(passphrase, salt, iterations);
    try {
        return await crypto.subtle.decrypt({name: 'AES-GCM', iv: iv as BufferSource}, key, cipher as BufferSource);
    } catch {
        throw new SealedFileError('key', 'wrong passphrase');
    }
};
