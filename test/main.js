//
// Copyright (c) 2024-2025 Ivan Teplov
// Licensed under the Apache license 2.0
//

import { ContextMenuElement, defineElements } from "../library/index.js"
defineElements("context-menu")

/** @type {ContextMenuElement} */
const contextMenu = document.querySelector("#contextMenu")

document.querySelector("#selectAll").addEventListener("click", () => {
	document.execCommand("selectAll")
})

document.querySelector("#deleteParagraph").addEventListener("click", () => {
	if (contextMenu.target) {
		contextMenu.target.parentElement.removeChild(contextMenu.target)
	}
})

document.querySelector("#disableContextMenu").addEventListener("click", () => {
	contextMenu.currentTarget.removeAttribute("data-context-menu")
})

document.querySelector("#appendContainer").addEventListener("click", () => {
	const element = document.createElement("div")
	element.setAttribute("data-context-menu", "contextMenu")
	element.textContent = "This is a new container."

	document.body.appendChild(element)
})

