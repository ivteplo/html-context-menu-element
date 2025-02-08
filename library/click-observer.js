//
// Copyright (c) 2025 Ivan Teplov
// Licensed under the Apache license 2.0
//

import { ContextMenuElement } from "./context-menu.js"

export const contextMenuAttribute = "data-context-menu"

export const observer = new MutationObserver(mutations => {
	mutations.forEach(handleMutation)
})

export const startObserver = () => {
	const alreadyInDOM = document.querySelectorAll(`[${contextMenuAttribute}]`)

	alreadyInDOM.forEach(item => {
		item.addEventListener("contextmenu", openContextMenuOnClick)
	})

	window.addEventListener("mousedown", onMenuCollapsingEvent)
	window.addEventListener("contextmenu", onMenuCollapsingEvent)
	window.addEventListener("scroll", onMenuCollapsingEvent)
	window.addEventListener("blur", onMenuCollapsingEvent)
	window.addEventListener("resize", onMenuCollapsingEvent)

	observer.observe(document.body, {
		attributes: true,
		subtree: true,
		attributeFilter: [contextMenuAttribute],
		childList: true,
	})
}

/**
 * @param {MutationRecord} mutation
 */
function handleMutation(mutation) {
	if (!(mutation.target instanceof HTMLElement)) return

	if (mutation.type === "attributes") {
		return handleElement(mutation.target)
	}

	mutation.addedNodes.forEach(node => {
		if (!(node instanceof HTMLElement)) return

		handleElement(node)

		const childrenWithCustomContextMenu = node.querySelectorAll(`[${contextMenuAttribute}]`)
		childrenWithCustomContextMenu.forEach(handleElement)
	})
}

/**
 * @param {HTMLElement} element
 */
function handleElement(element) {
	element.removeEventListener("contextmenu", openContextMenuOnClick)

	if (element.getAttribute(contextMenuAttribute) !== "") {
		element.addEventListener("contextmenu", openContextMenuOnClick)
	}
}

/**
 * Handler for the context menu opening event.
 * Binded to the elements that have data-context-menu specified.
 * @param {PointerEvent} event
 */
function openContextMenuOnClick(event) {
	if (!(event.currentTarget instanceof HTMLElement)) return

	const contextMenuID = event.currentTarget.getAttribute(contextMenuAttribute)

	const contextMenu = contextMenuID
		? document.getElementById(contextMenuID)
		: null

	if (!(contextMenu instanceof ContextMenuElement)) return

	event.preventDefault()
	event.stopPropagation()

	if (contextMenu.contains(event.target)) return

	contextMenu.show(event.clientX, event.clientY, {
		currentTarget: event.currentTarget,
		target: event.target
	})
}

/**
 * Gets called whenever there is an interaction that should dismiss the current context menu
 * @param {PointerEvent} event
 */
function onMenuCollapsingEvent(event) {
	const openMenu = document.querySelector("menu[is=context-menu][open]")

	if (openMenu && (event.type !== "mousedown" || !openMenu.contains(event.target))) {
		openMenu.hide()
	}
}
