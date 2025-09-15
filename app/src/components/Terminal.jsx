/**
 * Мини-терминал (псевдо)
 * ----------------------
 * Отправляет введённые команды через onSend
 */
import { useState } from 'react';

export default function Terminal({ onSend }) {
    const [cmd, setCmd] = useState('');

    return (
        <div>
            <input value={cmd} onChange={(e) => setCmd(e.target.value)} placeholder="command..." />
            <button
                onClick={() => {
                    onSend?.(cmd);
                    setCmd('');
                }}
            >
                Send
            </button>
        </div>
    );
}