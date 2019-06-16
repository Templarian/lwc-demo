import { LightningElement, api } from 'lwc';

export default class ApiTable extends LightningElement {
  @api jsdoc = [];

  get items() {
    var items = this.jsdoc.filter(x => x.kind === "ClassProperty");
    return items;
  }
}