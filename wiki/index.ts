import fetch from 'node-fetch';

/**
 * @param lang Language of the wikipedia. Example: de
 * @param domain The domain for which wikimedia to use. Example: wikipedia.org
 * @param ns the number of the namespace. Example: 0
 */
export interface WikiOptions {
    lang: string;
    domain: string;
    ns: number;
}

export async function getRandomPageId(options: WikiOptions): Promise<number> {
    const url = buildUrl(options, {action: 'query', list: 'random'});
    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        const randomData = data?.query?.random;
        if (randomData && Array.isArray(randomData) && randomData.length >= 1) {
            const randomId = (randomData as any[])[0].id;
            if (randomId !== undefined) {
                return randomId;
            }
        }
    }
    throw Error();
}

function buildUrl(options: WikiOptions, query: Record<string, any>): string {
    const additionalQueryParams = {format: 'json', rnnamespace: options.ns};
    const extendedQuery = {...query, ...additionalQueryParams};
    const queryStr = Object.entries(extendedQuery).map(entry => `${entry[0]}=${entry[1]}`).join('&');
    return `https://${options.lang}.${options.domain}/w/api.php?${queryStr}`;
}
