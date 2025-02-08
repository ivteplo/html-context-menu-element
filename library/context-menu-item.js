//
// Copyright (c) 2024-2025 Ivan Teplov
// Licensed under the Apache license 2.0
//

/**
 * Button inside of a context menu
 * @example
 * <button is="context-menu-item">Button label</button>
 */
export class ContextMenuItemElement extends HTMLButtonElement {
	/**
	 * Function to define the context menu button element in the HTML Custom Element Registry
	 * @param {string} tag - the tag name for the context menu button element
	 * @example
	 * import { ContextMenuItemElement } from "@ivteplo/html-context-menu-element"
	 * ContextMenuItemElement.defineAs("context-menu-item")
	 */
	static defineAs(tag) {
		customElements.define(tag, this, { extends: "button" })
	}

	constructor() {
		super()
		this.type = "button"
	}
}

