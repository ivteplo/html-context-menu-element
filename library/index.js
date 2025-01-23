//
// Copyright (c) 2024-2025 Ivan Teplov
// Licensed under the Apache license 2.0
//

import { ContextMenuElement } from "./context-menu.js"
import { ContextMenuItemElement } from "./context-menu-item.js"
import { ContextMenuGroupElement } from "./context-menu-group.js"

export {
	ContextMenuElement,
	ContextMenuItemElement,
	ContextMenuGroupElement
}

/**
 * Helper method to define all required components in the HTML custom element registry.
 * @param {string} baseName — Base component name. It will be used to define the menu element itself and as a prefix for the child components.
 * @example
 * import { defineElements } from "@ivteplo/html-context-menu-element"
 * // will define <menu is="context-menu">,
 * //             <button is="context-menu-item">,
 * // 		      and <details is="context-menu-group">
 * defineElements("context-menu")
 */
export function defineElements(baseName) {
	ContextMenuElement.defineAs(baseName)
	ContextMenuItemElement.defineAs(`${baseName}-item`)
	ContextMenuGroupElement.defineAs(`${baseName}-group`)
}

