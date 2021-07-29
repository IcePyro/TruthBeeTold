import fetch from 'cross-fetch';

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

export interface PageInfo {
    id: number;
    title: string;
}

class Wiki {
    constructor(private options: WikiOptions) {}

    /*
                        PUBLIC METHODS
     */

    public async pageInfo(id: number): Promise<PageInfo> {
        const url = this.buildUrl({action: 'query', prop: 'info', pageids: id});
        const res = await Wiki.fetchJson(url);
        if (!res) throw Error();

        const title = Wiki.traverseJson(res, 'query', 'pages', id.toString(), 'title');
        if (typeof title !== 'string') throw Error();
        return {id, title};
    }

    public async randomPage(): Promise<PageInfo> {
        const url = this.buildUrl({action: 'query', list: 'random', rnnamespace: this.options.ns});
        const res = await Wiki.fetchJson(url);
        if (!res) throw Error();

        const id = Wiki.traverseJson(res, 'query', 'random', 0, 'id');
        const title = Wiki.traverseJson(res, 'query', 'random', 0, 'title');
        if (typeof id !== 'number' || typeof title !== 'string') throw Error();
        return {id, title};
    }

    public async pageHTML(pageId: number): Promise<string> {
        const url = this.buildUrl({action: 'parse', pageid: pageId, prop: 'text'});
        const res = await Wiki.fetchJson(url);
        if (!res) throw Error();

        const html = Wiki.traverseJson(res, 'parse', 'text', '*');
        if (typeof html !== 'string') throw Error();
        return html;
    }

    /*
                        NON PUBLIC METHODS
     */

    private buildUrl(query: Record<string, any>, useFormat = true): string {
        const additionalQueryParams = {origin: '*'};
        if (useFormat) additionalQueryParams['format'] = 'json';
        const extendedQuery = {...query, ...additionalQueryParams};
        const queryStr = Object.entries(extendedQuery).map(entry => `${entry[0]}=${entry[1]}`).join('&');
        return `https://${this.options.lang}.${this.options.domain}/w/api.php?${queryStr}`;
    }

    private static async fetchJson(url: string): Promise<object | undefined> {
        const res = await fetch(url);
        if (res.ok) return await res.json();
    }

    private static async fetchRaw(url: string): Promise<string | undefined> {
        const res = await fetch(url);
        if (res.ok) return await res.text();
    }

    private static traverseJson(json: object, ...path: Array<string | number>): object | undefined {
        try {
            let current = json;
            for (const key of path) {
                current = current[key];
            }
            return current;
        } catch (e) {
            return undefined;
        }
    }
}

export const wiki = (options: WikiOptions) => new Wiki(options);
