/**
 * Таблица серверов
 * ----------------
 * Показывает список доступных серверов и кнопки действий.
 */
export default function ServerTable({ items = [], onRent, onWhitelist, onBlacklist }) {
    return (
        <table>
            <thead>
            <tr>
                <th>Source</th><th>ID</th><th>GPU</th><th>CPU</th><th>Region</th><th>Price/h</th><th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {items.map((s, i) => (
                <tr key={i}>
                    <td>{s.source}</td>
                    <td>{s.external_id}</td>
                    <td>{s.gpu}</td>
                    <td>{s.cpu}</td>
                    <td>{s.region}</td>
                    <td>{s.price}</td>
                    <td>
                        <button onClick={() => onRent(s)}>Rent</button>
                        <button onClick={() => onWhitelist(s)}>WL</button>
                        <button onClick={() => onBlacklist(s)}>BL</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}