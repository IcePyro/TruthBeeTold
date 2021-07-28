import { expect } from 'chai';
import {getRandomPageId, WikiOptions} from './index';

const defaultOptions: WikiOptions = {domain: 'wikipedia.org', lang: 'de', ns: 0};

describe('get random page id', () => {

    it('should return a number', async () => {
        const page = await getRandomPageId(defaultOptions);
        expect(page).to.be.a('number');
    });
});
