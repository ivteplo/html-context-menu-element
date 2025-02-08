# Context Menu
An HTML custom element, designed to let you quickly create an easily-customizable context menu.

## Features
- Automatically registers all the needed event listeners.
  Simply define a `<context-menu>` element, give it an identifier
  and then set the `data-context-menu` attribute to that identifier
  for all elements that should use this custom context menu.
- Supports keyboard input.


## Installation
You can install this library from the NPM registry:
```bash
npm install @ivteplo/html-context-menu-element
```

Or you can import it dynamically from a CDN:
```javascript
const { defineElements } = await import("https://unpkg.com/@ivteplo/html-context-menu-element@1.1.0-alpha.3/build/index.js")
```


## Usage
First, we need to define the components in the custom element registry and import the default stylesheet:
```javascript
import { defineElements } from "@ivteplo/html-context-menu-element"
import "@ivteplo/html-context-menu-element/index.css"
defineElements()
```

Then you can define your context menus in the HTML the following way:
```html
<menu is="context-menu" id="my-context-menu">
	<button type="button">Button 1</button>
	<button type="button">Button 2</button>

	<!-- Separators are added using <hr> -->
	<hr>

	<!-- Dropdown section -->
	<details is="context-menu-group">
		<!-- Label of the dropdown section -->
		<summary>Dropdown</summary>
		<menu>
			<button type="button">Child button 1</button>
			<button type="button">Child button 2</button>
		</menu>
	</details>
</menu>
```

Now, if you want to apply the context menu to an element,
set that element’s attribute `data-context-menu` to the ID
of the context menu:
```html
<div data-context-menu="my-context-menu">
	This container has a custom context menu.
</div>
```
All the event listeners will be registered automatically.


## API Documentation
You can find the API documentation [in the repository](./documentation/API.md).


## Development

### Prerequisites
You need to have Git, Node.js, Deno, and any browser installed.

### Setup
1. Open your terminal.
2. Clone this repository:
	```bash
	git clone https://github.com/ivteplo/html-context-menu-element/
  ```
3. Navigate into the cloned directory:
	```bash
	cd html-context-menu-element
	```
4. Install dependencies:
	```bash
	npm install
	```
5. Start the development server:
	```bash
	npm run dev
	```
6. Build the library:
	```bash
	npm run build
	```
7. Generate the API documentation:
	```bash
	npm run docs:api
	```
8. Happy hacking! 🎉

