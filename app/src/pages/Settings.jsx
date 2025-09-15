import { useState } from 'react';

export default function Settings() {
    const [keys, setKeys] = useState({ clore: '', hiveos: '', github: '' });

    return (
        <div style={{ padding: 12 }}>
            <h2>Settings</h2>
            <input
                placeholder="Clore API Key"
                value={keys.clore}
                onChange={(e) => setKeys({ ...keys, clore: e.target.value })}
            />
            <input
                placeholder="HiveOS API Key"
                value={keys.hiveos}
                onChange={(e) => setKeys({ ...keys, hiveos: e.target.value })}
            />
            <input
                placeholder="GitHub Token"
                value={keys.github}
                onChange={(e) => setKeys({ ...keys, github: e.target.value })}
            />
            <p>Сохранение/валидация ключей → позже добавим API /api/keys</p>
        </div>
    );
}