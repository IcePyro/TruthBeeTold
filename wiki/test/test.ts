import { expect } from 'chai';
import {wiki, WikiOptions} from '../src';

const defaultOptions: WikiOptions = {domain: 'wikipedia.org', lang: 'de', ns: 0};

describe('wiki-api', () => {
    describe('randomPage', () => {
        it('should return an info object', async () => {
            const page = await wiki(defaultOptions).randomPage();
            expect(page).to.not.be.undefined;
            expect(page.id).to.be.a('number');
            expect(page.title).to.be.a('string');
            expect(page.title).to.be.not.empty;
            console.log(page);
        });
    });

    describe('pageInfo', () => {
        it('should return the same id and title of the page', async () => {
            const id = 7776115;
            const page = await wiki(defaultOptions).pageInfo(id);
            expect(page).to.not.be.undefined;
            expect(page.id).to.equal(id);
            expect(page.title).to.equal('Liste der Baudenkmale in Cromwell');
            console.log(page);
        });
    });

    describe('pageHtml', () => {
        it('it should not throw an error', async () => {
            const id = 7776115;
            const html = await wiki(defaultOptions).pageHTML(id);
            expect(html).to.not.be.undefined;
        });
    });
});
