import { env } from '../config/env.js';

export async function publishScript(rentalID, content) {
    const url = `https://raw.githubusercontent.com/${env.GITHUB_REPO}/main/scripts/setup-${rentalID}.sh`;

    return {
        url,
        size: content.length,
        note: 'stub'
    };
}