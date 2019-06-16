import { LightningElement, track } from 'lwc';
import d from 'data';

export default class App extends LightningElement {

  @track isLoading = true
  @track namespaces = []
  @track excludes = []
  @track moreThanOneNamespace = true
  @track selectedNamespace = null

  async getDemoJson() {
    console.log(d);
    const response = await fetch('demo.json');
    var data = await response.json();
    this.excludes = data.excludes;
    this.namespaces = data.namespaces;
    if (data.namespaces.length === 1) {
      this.moreThanOneNamespace = false;
    }
    this.selectedNamespace = data.namespaces[0];
    this.selectedNamespace.components.sort((a, b) => b.order - a.order);
  }

  async connectedCallback() {
    try {
      await this.getDemoJson();
      this.isLoading = false;
    } catch (e) {
      this.isLoading = false;
    }
  }

}
