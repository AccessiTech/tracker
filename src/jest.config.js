import { JSDOM } from 'jsdom';

const jsdomConfig = {
  url: 'http://localhost',
  referrer: 'http://localhost',
  domain: 'localhost',
};

const dom = new JSDOM("", jsdomConfig);
global.document = dom.window.document;
global.window = dom.window;
global.location = dom.window.location;