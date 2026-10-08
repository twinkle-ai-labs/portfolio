import React, {useEffect, useState} from 'react';
import {FaDownload, FaEye, FaEyeSlash, FaKey, FaLock, FaLockOpen} from 'react-icons/fa6';
import translations from '@Data/i18n';
import {sealedFiles} from '@Data/files';
import {useLocale} from '@Utils/i18n';
import {SealedFileError, unseal} from '@Utils/crypto';

interface ManifestEntry {
    file: string;
    bytes: number;
    updated: string;
}

type Status = {kind: 'idle'} | {kind: 'working'} | {kind: 'done'} | {kind: 'error'; message: string};

const STAR_COUNT = 40;

const formatBytes = (bytes: number) =>
    bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;

/** 열어 낸 바이트를 파일로 내려준다 — 저장소에도 서버에도 평문은 없고, 이 순간 이 기기에만 있다. */
const saveAs = (data: ArrayBuffer, name: string) => {
    const url = URL.createObjectURL(new Blob([data], {type: 'application/pdf'}));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = name;
    anchor.click();
    // 클릭이 소비한 뒤에 걷는다 — 바로 걷으면 Safari 가 빈 파일을 받는다.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const FileVault = () => {
    const {language, t} = useLocale();
    const text = translations[language].files;

    const [passphrase, setPassphrase] = useState('');
    const [reveal, setReveal] = useState(false);
    const [manifest, setManifest] = useState<Record<string, ManifestEntry>>({});
    const [status, setStatus] = useState<Record<string, Status>>({});

    useEffect(() => {
        fetch('/sealed/manifest.json')
            .then((res) => (res.ok ? res.json() : []))
            .then((rows: ManifestEntry[]) =>
                setManifest(Object.fromEntries(rows.map((row) => [row.file, row]))))
            .catch(() => setManifest({}));
    }, []);

    const download = async (file: string) => {
        if (!passphrase.trim()) {
            setStatus((s) => ({...s, [file]: {kind: 'error', message: text.emptyKey}}));
            return;
        }
        setStatus((s) => ({...s, [file]: {kind: 'working'}}));
        try {
            const res = await fetch(`/sealed/${encodeURIComponent(file)}.enc`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const plain = await unseal(new Uint8Array(await res.arrayBuffer()), passphrase);
            saveAs(plain, file);
            setStatus((s) => ({...s, [file]: {kind: 'done'}}));
        } catch (error) {
            const message = error instanceof SealedFileError && error.reason === 'key' ? text.wrongKey : text.failed;
            setStatus((s) => ({...s, [file]: {kind: 'error', message}}));
        }
    };

    const unlocked = passphrase.trim().length > 0;

    return (
        <section id="s_files" className="section hero-dark">
            {/* 404 와 같은 밤하늘 — 이 집의 서브페이지는 모두 같은 하늘 아래 선다. */}
            <div className="hero-stars" aria-hidden="true">
                {[...Array(STAR_COUNT)].map((_, i) => (
                    <div
                        key={i}
                        className="hero-star"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 2 + 0.5}px`,
                            height: `${Math.random() * 2 + 0.5}px`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${Math.random() * 4 + 3}s`,
                        }}
                    />
                ))}
            </div>

            <div className="files-shell">
                <div className="files-head">
                    <div className="error-badge">
                        <span className="hero-panel-status" aria-hidden="true"></span>
                        {text.badge}
                    </div>
                    <h1 className="error-title">
                        {text.title} <em>{text.titleAccent}</em>
                    </h1>
                    <p className="error-desc">{text.desc}</p>
                </div>

                <form className="files-key" onSubmit={(event) => event.preventDefault()}>
                    <label className="files-key-label" htmlFor="files-passphrase">
                        <FaKey aria-hidden="true"/>
                        {text.keyLabel}
                    </label>
                    <div className="files-key-row">
                        <input
                            id="files-passphrase"
                            className="files-key-input"
                            type={reveal ? 'text' : 'password'}
                            autoComplete="off"
                            autoCapitalize="off"
                            spellCheck={false}
                            placeholder={text.keyPlaceholder}
                            value={passphrase}
                            onChange={(event) => setPassphrase(event.target.value)}
                        />
                        <button
                            type="button"
                            className="files-key-toggle"
                            onClick={() => setReveal((v) => !v)}
                            aria-label={reveal ? text.hide : text.show}
                            title={reveal ? text.hide : text.show}
                        >
                            {reveal ? <FaEyeSlash/> : <FaEye/>}
                        </button>
                    </div>
                    <p className="files-key-note">
                        {unlocked ? <FaLockOpen aria-hidden="true"/> : <FaLock aria-hidden="true"/>}
                        {text.note}
                    </p>
                </form>

                <ul className="files-list">
                    {sealedFiles.map((entry) => {
                        const meta = manifest[entry.file];
                        const state = status[entry.file] ?? {kind: 'idle'};
                        return (
                            <li key={entry.id} className="files-card">
                                <div className="files-card-body">
                                    <h2 className="files-card-name">{t(entry.name)}</h2>
                                    <p className="files-card-desc">{t(entry.desc)}</p>
                                    <dl className="files-card-meta">
                                        <div>
                                            <dt>{text.size}</dt>
                                            <dd>{meta ? formatBytes(meta.bytes) : '—'}</dd>
                                        </div>
                                        <div>
                                            <dt>{text.updated}</dt>
                                            <dd>{meta?.updated ?? '—'}</dd>
                                        </div>
                                    </dl>
                                </div>
                                <div className="files-card-foot">
                                    <button
                                        type="button"
                                        className={unlocked ? 'hero-primary' : 'hero-secondary'}
                                        disabled={state.kind === 'working'}
                                        onClick={() => download(entry.file)}
                                    >
                                        <FaDownload/>
                                        {state.kind === 'working' ? text.working : text.download}
                                    </button>
                                    <p className={`files-card-status ${state.kind}`} role="status" aria-live="polite">
                                        {state.kind === 'error' ? state.message : state.kind === 'done' ? text.done : ''}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
};

export default FileVault;
