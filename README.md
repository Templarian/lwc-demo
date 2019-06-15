# Lightning web component Demo Generator

Focus on writing your Lightining web components and leave the documentation generation to `lwc-demo`. Features include:

- Built with LWC!
- Ideal for https://github.io
- Easy to navigte with a mobile friendly design
- JSdoc parsing
- Markdown with smart defaults

```sh
npm install lwc-demo
npm link file://your/module
```

> `link` allows you to document and see the changes real time with `npm run watch` at `localhost:3000`.

When your ready to generate the static website (perfect for github.io).

- `npm run build`
- Copy the contents of the `dist` folder.

## Documentation

This uses webpack to read everything and generate documentation from various markdown files and jsdoc comments in your code. Adding a few files shoul

### JSdoc

```text
src/modules/namespace/name/name.js   <namespace-name>
```

Using JSdoc can be a great way to document your component and various helper

#### Class

```js
/**
 * Render a name component.
 * 
 * > **Note:** Parsed with markdown!
 * 
 * @name Icon
 * @order 1
 */
```

> **Order:** Set order of component.

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

### Component Markdown File (optional)

```text
src/modules/namespace/name/name.md
```

By default we'll using the description from JSdoc above the class definition. As some find this ugly we'll override anything with the contents of the markdown if provided.

```md
# Override Component Title

We recommend docs be placed in JSdoc provide this for teams that want to keep their components simple.

[order]: 1
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

> **Icon:** Icon is an optional single pathed SVG file. We recommend using [MaterialDesignIcons.com](https://materialdesignicons.com). Defaults to `puzzle-outline`.<br/>
> **Order:** For multiple namespaces set a priority.

### Examples `__examples__` (required)

Examples are great way to explain what `@api` in your component will do. Including one example for every `@api` is recommended.

```text
src/modules/namespace/name/__examples__/
```

### Tests `__tests__` (optional)

Want to show off your components tests. Test counts if found will show to the right of the header. Clicking will navigate the user to your GitHub repo's spec file.

### WDIO `__wdio__` (optional)

Similar to tests we highly encourage integration testing. These will also appear to the right in the header if found.