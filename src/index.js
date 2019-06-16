import { createElement } from 'lwc';
import DemoApp from 'demo/app';

const app = createElement('demo-app', { is: DemoApp });
// eslint-disable-next-line @lwc/lwc/no-document-query
document.querySelector('#main').appendChild(app);
