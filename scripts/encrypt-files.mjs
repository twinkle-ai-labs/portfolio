/**
 * PDF 를 암호화해 배포물에 싣는다.
 *
 *   FILES_KEY='비밀구절' node scripts/encrypt-files.mjs
 *   node scripts/encrypt-files.mjs            # .files-key 파일에서 읽는다
 *
 * 원본은 src/assets/pdf/ 에 산다 — git 이 추적하지 않는다(.gitignore). 저장소가 공개라
 * 원본을 올리면 암호화는 뜻이 없다. 추적되는 것은 src/assets/files/ 의 .enc 뿐이고,
 * 웹팩이 그 폴더를 files/ 로 복사한다. 키가 없으면 어디서도 열리지 않는다.
 *
 * 한 키로 전부 연다(2026-10-06 Founder). 키는 저장소에 적지 않는다 — .files-key 도 ignore 다.
 *
 * 컨테이너 꼴 (src/utils/crypto.ts 가 같은 꼴을 읽는다 — 한쪽을 바꾸면 다른 쪽도):
 *   0..3   "TWKF"           마법 글자
 *   4      1                판
 *   5..8   iterations       PBKDF2 반복 수, uint32 BE
 *   9..24  salt             16 바이트
 *   25..36 iv               12 바이트
 *   37..   ciphertext‖tag   AES-256-GCM
 */
import {createHash, webcrypto} from 'node:crypto';
import {mkdir, readdir, readFile, stat, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'src/assets/pdf');
const target = resolve(root, 'src/assets/files');
const keyFile = resolve(root, '.files-key');

const MAGIC = new TextEncoder().encode('TWKF');
const VERSION = 1;
// OWASP 2023 의 PBKDF2-HMAC-SHA256 권고(600,000). 브라우저에서 1초 안팎이라 한 번 치르는 값으로 둔다.
const ITERATIONS = 600_000;

const readKey = async () => {
    if (process.env.FILES_KEY) return process.env.FILES_KEY;
    try {
        return (await readFile(keyFile, 'utf8')).trim();
    } catch {
        throw new Error(`키가 없다 — FILES_KEY 환경변수를 주거나 ${keyFile} 에 한 줄로 둔다`);
    }
};

const deriveKey = async (passphrase, salt) => {
    const material = await webcrypto.subtle.importKey(
        'raw', new TextEncoder().encode(passphrase.normalize('NFKC')), 'PBKDF2', false, ['deriveKey'],
    );
    return webcrypto.subtle.deriveKey(
        {name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ITERATIONS},
        material, {name: 'AES-GCM', length: 256}, false, ['encrypt'],
    );
};

const encrypt = async (plain, passphrase) => {
    const salt = webcrypto.getRandomValues(new Uint8Array(16));
    const iv = webcrypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(passphrase, salt);
    const cipher = new Uint8Array(await webcrypto.subtle.encrypt({name: 'AES-GCM', iv}, key, plain));

    const header = new Uint8Array(37);
    header.set(MAGIC, 0);
    header[4] = VERSION;
    new DataView(header.buffer).setUint32(5, ITERATIONS);
    header.set(salt, 9);
    header.set(iv, 25);

    const out = new Uint8Array(header.length + cipher.length);
    out.set(header, 0);
    out.set(cipher, header.length);
    return out;
};

const passphrase = await readKey();
if (passphrase.length < 8) throw new Error('키가 너무 짧다 — 8자 이상');

await mkdir(target, {recursive: true});
const pdfs = (await readdir(source)).filter((name) => name.toLowerCase().endsWith('.pdf')).sort();
if (pdfs.length === 0) throw new Error(`${source} 에 PDF 가 없다`);

const manifest = [];
for (const name of pdfs) {
    const plain = await readFile(resolve(source, name));
    const {mtime} = await stat(resolve(source, name));
    const sealed = await encrypt(plain, passphrase);
    await writeFile(resolve(target, `${name}.enc`), sealed);
    manifest.push({
        file: name,
        bytes: plain.length,
        // 원본 내용의 지문 — 같은 PDF 를 다시 돌려도 .enc 는 매번 달라지므로(salt·iv) «바뀌었나»는 이걸로 본다.
        sha256: createHash('sha256').update(plain).digest('hex').slice(0, 16),
        updated: mtime.toISOString().slice(0, 10),
    });
    console.log(`sealed ${name} (${plain.length} → ${sealed.length} bytes)`);
}
await writeFile(resolve(target, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`manifest: ${manifest.length} files`);
