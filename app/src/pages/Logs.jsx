import LogViewer from '@/components/LogViewer';

export default function Logs() {
    return (
        <div style={{ padding: 12 }}>
            <h2>Logs</h2>
            <LogViewer rentalId="demo" channel="logs" />
        </div>
    );
}