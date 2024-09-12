# `ContextMenuElement`

A context menu itself

<details open>
<summary><b>Example</b></summary>

```jsx
<menu is="context-menu">
  <button is="context-menu-item">Cut</button>
  <button is="context-menu-item">Copy</button>
  <button is="context-menu-item">Paste</button>
</menu>
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



# `ContextMenuGroupElement`

<details open>
<summary><b>Example</b></summary>

```jsx
<details is="context-menu-group">
    <summary>Group name</summary>
    <button is="context-menu-item">Item 1</button>
</details>
```

</details>
