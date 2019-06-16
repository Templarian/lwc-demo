import { LightningElement, api } from 'lwc';

export default class Description extends LightningElement {
  @api jsdoc = [];

  get description() {
    var item = this.jsdoc.find(x => x.kind === "Class");
    return item ? item.description : "";
  }
}