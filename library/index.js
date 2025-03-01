//
// Copyright (c) 2024-2025 Ivan Teplov
// Licensed under the Apache license 2.0
//

import { ContextMenuElement } from "./context-menu.js"
import { ContextMenuGroupElement } from "./context-menu-group.js"

export {
	ContextMenuElement,
	ContextMenuGroupElement
}

/**
 * Helper method to define all required components in the HTML custom element registry.
 * @example
 * import { defineElements } from "@ivteplo/html-context-menu-element"
 *
 * // will define <context-menu /> and <details is="context-menu-group" />
 * defineElements()
 */
export function defineElements() {
	const baseName = "context-menu"
	ContextMenuElement.defineAs(baseName)
	ContextMenuGroupElement.defineAs(`${baseName}-group`)
}

