# `ContextMenuElement`

A context menu itself

<details open>
<summary><b>Example:</b> Define a context menu</summary>

```jsx
<context-menu id="my-context-menu">
  <button type="button">Cut</button>
  <button type="button">Copy</button>
  <button type="button">Paste</button>
</context-menu>
```

</details>

<details open>
<summary><b>Example:</b> Apply the context menu to an element</summary>

```jsx
<div data-context-menu="my-context-menu">
  This element is using a custom context menu.
</div>
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


## `get currentTarget(): HTMLElement|null`

Container that has `data-context-menu` set
and that has been right clicked on.


## `get target(): HTMLElement|null`

Object that has been right clicked on.
Can be a child of a container that has the `data-context-menu` set.


## `get open(): boolean`

Check whether the context menu is open.


## `hide(): void`

Hide the context menu


## `show(x: number, y: number, undefined = [UNSUPPORTED]): unknown`

Displays the context menu near the specified location

**unsupported**:



# `ContextMenuGroupElement`

Element that represents buttons hidden under a dropdown in a context menu.

<details open>
<summary><b>Example</b></summary>

```jsx
<details is="context-menu-group">
    <summary>Group name</summary>
    <menu>
        <button type="button">Item 1</button>
        <button type="button">Item 2</button>
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



# `defineElements(): void`

Helper method to define all required components in the HTML custom element registry.

<details open>
<summary><b>Example</b></summary>

```jsx
import { defineElements } from "@ivteplo/html-context-menu-element"

// will define <context-menu /> and <details is="context-menu-group" />
defineElements()
```

</details>
