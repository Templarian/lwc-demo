import { LightningElement, api } from 'lwc';
import marked from 'marked';

export default class Markdown extends LightningElement {
    @api content;
    privateIsConnected = false;

    connectedCallback() {
        this.privateIsConnected = true;
    }

    disconnectedCallback() {
        this.privateIsConnected = false;
    }

    renderedCallback() {
        if (this.privateIsConnected) {
            const container = this.template.querySelector('div');
            // eslint-disable-next-line lwc/no-inner-html
            container.innerHTML = marked(this.content);
        }
    }
}