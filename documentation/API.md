# `ContextMenuElement`

A context menu itself

<details open>
<summary><b>Example</b></summary>

```jsx
<menu is="context-menu" id="my-context-menu">
  <button is="context-menu-item">Cut</button>
  <button is="context-menu-item">Copy</button>
  <button is="context-menu-item">Paste</button>
</menu>
```

</details>


## `static defineAs(tag: string): void`

Function to define the context menu element in the HTML Custom Element Registry

<details open>
<summary><b>Example</b></summary>

```jsx
import { ContextMenuElement } from "@ivteplo/html-context-menu-element"
ContextMenuElement.defineAs("context-menu")
```

</details>


## `hide(): void`

Hide the context menu


## `show(x: number, y: number): void`

Displays the context menu near the specified location



# `ContextMenuItemElement`

Button inside of a context menu

<details open>
<summary><b>Example</b></summary>

```jsx
<button is="context-menu-item">Button label</button>
```

</details>


## `static defineAs(tag: string): void`

Function to define the context menu button element in the HTML Custom Element Registry

<details open>
<summary><b>Example</b></summary>

```jsx
import { ContextMenuItemElement } from "@ivteplo/html-context-menu-element"
ContextMenuItemElement.defineAs("context-menu-item")
```

</details>



# `ContextMenuGroupElement`

Element that represents buttons hidden under a dropdown in a context menu.

<details open>
<summary><b>Example</b></summary>

```jsx
<details is="context-menu-group">
    <summary>Group name</summary>
    <menu>
        <button is="context-menu-item">Item 1</button>
        <button is="context-menu-item">Item 2</button>
    </menu>
</details>
```

</details>


## `static defineAs(tag: string): void`

Function to define the context menu group element in the HTML Custom Element Registry

<details open>
<summary><b>Example</b></summary>

```jsx
import { ContextMenuGroupElement } from "@ivteplo/html-context-menu-element"
ContextMenuGroupElement.defineAs("context-menu-group")
```

</details>



# `defineElements(baseName: string): void`

Helper method to define all required components in the HTML custom element registry.

<details open>
<summary><b>Example</b></summary>

```jsx
import { defineElements } from "@ivteplo/html-context-menu-element"
// will define <menu is="context-menu">,
//             <button is="context-menu-item">,
// 		      and <details is="context-menu-group">
defineElements("context-menu")
```

</details>
