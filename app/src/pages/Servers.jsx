import { useEffect, useState } from 'react';
import { getOffers, addWhitelist, addBlacklist, rent } from '@/lib/api';
import ServerTable from '@/components/ServerTable';

export default function Servers() {
    const [items, setItems] = useState([]);
    const [filters, setFilters] = useState({ gpu: '', priceMax: '' });

    async function load() {
        const res = await getOffers(filters);
        setItems(res.items || []);
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <div style={{ padding: 12 }}>
            <h2>Servers</h2>
            <div style={{ marginBottom: 8 }}>
                <input
                    placeholder="GPU"
                    value={filters.gpu}
                    onChange={(e) => setFilters((f) => ({ ...f, gpu: e.target.value }))}
                />
                <input
                    placeholder="priceMax"
                    value={filters.priceMax}
                    onChange={(e) => setFilters((f) => ({ ...f, priceMax: e.target.value }))}
                />
                <button onClick={load}>Refresh</button>
            </div>

            <ServerTable
                items={items}
                onRent={async (s) =>
                    alert(
                        JSON.stringify(
                            await rent({ provider: s.source || 'clore', offerId: s.external_id }, crypto.randomUUID())
                        )
                    )
                }
                onWhitelist={async (s) =>
                    addWhitelist({ source: s.source, externalId: s.external_id, validFor: ['CLORE'], reason: 'manual approve' })
                }
                onBlacklist={async (s) =>
                    addBlacklist({ source: s.source, externalId: s.external_id, invalidFor: ['CLORE'], reason: 'manual block' })
                }
            />
        </div>
    );
}