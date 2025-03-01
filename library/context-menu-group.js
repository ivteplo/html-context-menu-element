//
// Copyright (c) 2024-2025 Ivan Teplov
// Licensed under the Apache license 2.0
//

import { getNextChildToFocusOnInsideOf } from "./helpers.js"

/**
 * Element that represents buttons hidden under a dropdown in a context menu.
 * @example
 * <details is="context-menu-group">
 *     <summary>Group name</summary>
 *     <menu>
 *         <button type="button">Item 1</button>
 *         <button type="button">Item 2</button>
 *     </menu>
 * </details>
 */
export class ContextMenuGroupElement extends HTMLDetailsElement {
	/**
	 * Function to define the context menu group element in the HTML Custom Element Registry
	 * @param {string} tag - the tag name for the context menu group element
	 * @example
	 * import { ContextMenuGroupElement } from "@ivteplo/html-context-menu-element"
	 * ContextMenuGroupElement.defineAs("context-menu-group")
	 */
	static defineAs(tag) {
		customElements.define(tag, this, { extends: "details" })
	}

	constructor() {
		super()

		// We don’t want the dropdown to close on click
		this.addEventListener("click", event => event.preventDefault())

		// We want the dropdown to open on hover
		this.addEventListener("mouseover", () => { this.open = true })
		this.addEventListener("mouseleave", () => { this.open = false })

		this.addEventListener("keydown", this.#onKeyDown.bind(this))
	}

	#_buttonWrapper

	get #buttonWrapper() {
		if (!this.#_buttonWrapper) {
			this.#_buttonWrapper = this.querySelector("menu")
		}

		return this.#_buttonWrapper
	}

	/**
	 * @ignore
	 */
	static get observedAttributes() {
		return ["open"]
	}

	/**
	 * @ignore
	 * Method that gets called whenever the 'open' attribute changes
	 * (list of observed attributes is specified in the static method `observedAttributes`)
	 * @param {string} name
	 * @param {any} _oldValue
	 * @param {any} newValue
	 */
	attributeChangedCallback(name, _oldValue, newValue) {
		if (name === "open") {
			if (newValue !== null) {
				this.#open()
			} else {
				this.#close()
			}
		}
	}

	/**
	 * Gets called whenever any keyboard button gets pressed
	 * @param {KeyboardEvent} event
	 */
	#onKeyDown(event) {
		event.preventDefault()

		if (this.open) {
			switch (event.key) {
				case "Escape":
				case "ArrowLeft":
					event.stopImmediatePropagation()
					this.open = false
					this.querySelector("summary")?.focus()
					break
				case "ArrowDown":
				case "ArrowUp":
					event.stopImmediatePropagation()
					getNextChildToFocusOnInsideOf(this.#buttonWrapper, document.activeElement, event.key === "ArrowDown")?.focus()
					break
			}
		} else {
			switch (event.key) {
				case "Enter":
				case "Space":
					event.stopImmediatePropagation()
					this.open = true
					break
				case "ArrowRight":
					event.stopImmediatePropagation()
					this.open = true
					getNextChildToFocusOnInsideOf(this.#buttonWrapper, document.activeElement, true)?.focus()
					break
			}
		}
	}

	/**
	 * Calculates in which direction the submenu should be opened
	 */
	#open() {
		const { top, left } = this.getBoundingClientRect()

		if (left + this.parentElement.clientWidth + this.clientWidth > window.innerWidth) {
			this.setAttribute("data-x-expand-to", "left")
		} else {
			this.setAttribute("data-x-expand-to", "right")
		}

		if (top + this.#buttonWrapper.clientHeight > window.innerHeight) {
			this.setAttribute("data-y-expand-to", "top")
		} else {
			this.setAttribute("data-y-expand-to", "bottom")
		}
	}

	/**
	 * Removes the no-longer-needed attributes
	 */
	#close() {
		this.removeAttribute("data-x-expand-to")
		this.removeAttribute("data-y-expand-to")
	}
}

