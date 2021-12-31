import fetch from 'cross-fetch';
import * as fs from "fs";
import {httprequest} from "./httprequest";

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
    constructor(private options: WikiOptions) {
    }

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
        return this.getRandomFromLocal("483975");
    }

    private async getRandomFromLocal(id) {
        const articleCollection = JSON.parse(fs.readFileSync(`../wiki/article_collections/processed/de/${id}.json`).toString())
        const randomKey = Object.keys(articleCollection)[Math.floor(Math.random() * Object.keys(articleCollection).length)]
        if (articleCollection[randomKey].id) {
            return articleCollection[randomKey]
        } else {
            console.log(articleCollection[randomKey])
        }
    }

    public async pageHTML(pageId: number): Promise<string> {
        const url = this.buildUrl({action: 'parse', pageid: pageId, prop: 'text'});
        const res = await Wiki.fetchJson(url);
        if (!res) throw Error();

        const html = Wiki.traverseJson(res, 'parse', 'text', '*');
        if (typeof html !== 'string') throw Error();
        return html;
    }

    public async pullNewCategory(title: string) {

        const idData = await httprequest(`https://de.wikipedia.org/w/api.php?action=query&prop=info&titles=${title}&format=json`)
        const id = Object.keys(idData["query"]["pages"])[0]
        if (fs.existsSync(`../wiki/article_collections/processed/de/${id}.json`)) return
        let raw = await this.continuePull(title)
        fs.writeFileSync(`../wiki/article_collections/raw/de/${id}.json`, JSON.stringify(raw))

        this.cleanupJson(`de/${id}.json`)
    }


    private async continuePull(title: string): Promise<object> {
        const url = `https://de.wikipedia.org/w/api.php?action=query&generator=links&gpllimit=500&titles=Wikipedia:Kuriositätenkabinett&prop=info&inprop=displaytitle&format=json`
        let returnObj = {}
        let continueStr = ''

        for (let i = 0; i < 5; i++) {
            console.log(continueStr)
            const continueUrl = url + '&' + continueStr

            const data = await httprequest(continueUrl)
            Object.assign(returnObj, data)

            if (typeof data === "object") {
                Object.assign(returnObj, data["query"]["pages"])
                if (data['continue']) {
                    continueStr = `gplcontinue=${data['continue']['gplcontinue']}`
                } else {
                    break
                }
            }

        }
        return await returnObj;
    }

    public async cleanupJson(fileLocation: string) {
        const raw = fs.readFileSync(`../wiki/article_collections/raw/${fileLocation}`)
        const rawJson = JSON.parse(raw.toString())
        const clean = {}
        for (let article in rawJson) {
            clean[article] = {title: rawJson[article].title, id: rawJson[article].pageid}
        }

        fs.writeFileSync(`../wiki/article_collections/processed/${fileLocation}`, JSON.stringify(clean))
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
