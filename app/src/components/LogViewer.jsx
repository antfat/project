/**
 * Просмотр логов через WebSocket
 * ------------------------------
 * Пример:
 *   <LogViewer rentalId="123" channel="logs" />
 */

import { useEffect, useRef, useState } from 'react';
import { connect } from '@/lib/ws';

export default function LogViewer({ rentalId = '0', channel = 'logs' }) {
    const [lines, setLines] = useState([]);
    const wsRef = useRef(null);

    useEffect(() => {
        wsRef.current = connect(channel, rentalId, (msg) =>
            setLines((prev) => [...prev, JSON.stringify(msg)])
        );
        return () => wsRef.current && wsRef.current.close();
    }, [rentalId, channel]);

    return (
        <pre style={{ height: 320, overflow: 'auto', background: '#000', color: '#0f0', padding: 10 }}>
      {lines.join('\n')}
    </pre>
    );
}