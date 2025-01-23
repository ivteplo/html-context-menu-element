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
 * @example
 * import { defineElements } from "@ivteplo/html-context-menu-element"
 *
 * // will define <menu is="context-menu">,
 * //             <button is="context-menu-item">,
 * // 		      and <details is="context-menu-group">
 * defineElements()
 */
export function defineElements() {
	const baseName = "context-menu"
	ContextMenuElement.defineAs(baseName)
	ContextMenuItemElement.defineAs(`${baseName}-item`)
	ContextMenuGroupElement.defineAs(`${baseName}-group`)
}

