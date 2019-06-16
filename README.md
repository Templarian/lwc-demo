# Lightning web component Demo Generator

Focus on writing your Lightining web components and leave the documentation generation to `lwc-demo`. Features include:

- Built with LWC!
- Ideal for https://github.io
- Easy to navigte with a mobile friendly design
- JSdoc parsing
- Markdown with smart defaults

```sh
git clone lwc-demo
cd lwc-demo
npm install
npm link ../path-to-module
npm link module-name
npm run watch
```

> Learn more about `npm link`. This will allow live reload of a local component.

When you are ready to generate the static website...

- `npm run build`
- Copy the contents of the `dist` folder.

## Documentation

This uses webpack to read everything and generate documentation from various jsdoc comments in your code and markdown files. Examples for each file and their location described below.

### JSdoc

```text
src/modules/namespace/name/name.js   <namespace-name>
```

Using JSdoc can be a great way to document your component inside of the JavaScript file.

#### Class

```js
/**
 * Render a name component.
 * 
 * > **Note:** Parsed with markdown!
 * 
 * @order 1
 */
export default class Name extends LightningElement { }
```

> **Order:** Set priority of component on the page.

#### Attribute (`@api`)

By default we only care about `@api` for documentation. Any other properties or methods will be ignored.

```js
/**
  * The path data rendered in the SVG.
  *
  * @type {string}
  * @default 'Hello World'
  */
@api foo = 'Hello World';
```

### Namespace Markdown File (recommended)

```text
src/modules/namespace/namespace.md
```

Introducing your namespace is a great way explain the relationship between the components.

```md
# Override `namespace`

This namespace contains components to help with your app.

[icon]: M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z
[order]: 1
```

> **Icon:** Icon is an optional single pathed SVG file. Use any icon from [MaterialDesignIcons.com](https://materialdesignicons.com). Defaults to `puzzle-outline`.<br/>
> **Order:** For multiple namespaces set a priority.

### Component Markdown File (optional)

```text
src/modules/namespace/name/name.md
```

By default we'll using the description from JSdoc above the class definition. As some find this ugly we'll override anything with the contents of the markdown if provided.

```md
# Override Component Title

Override the JSdoc description. Ideal for teams that do not want to clutter their files.

[order]: 1
```

### Examples `__examples__` (required)

Examples are great way to explain what `@api` in your component will do. Including one example for every `@api` is recommended.

```text
src/modules/namespace/name/__examples__/withFoo.spec.js
                                       /withFoo/withFoo.js
                                               /withFoo.html
                                               /withFoo.css
```

#### JSdoc (recommended)

JSdoc at the top of your `WithFoo` class will be used.

```js
/**
 * This example sets the foo attribute.
 *
 * @order 1
 */
export default class WithFoo extends LightningElement { }
```

> **Order:** Set example order. Useful for showing basic examples first.

#### Markdown (optional)

You can override anything in the JSdoc with a markdown file the `withFoo` folder.

### Tests `__tests__` (optional)

Want to show off your components tests. Test counts if found will show to the right of the header. Clicking will navigate the user to your GitHub repo's spec file.

### WDIO `__wdio__` (optional)

Similar to tests we highly encourage integration testing. These will also appear to the right in the header if found.