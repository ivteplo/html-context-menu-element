//
// Copyright (c) 2024-2025 Ivan Teplov
// Licensed under the Apache license 2.0
//

import { getNextChildToFocusOnInsideOf } from "./helpers.js"
import "./context-menu.scss"

/**
 * A context menu itself
 * @example
 * <menu is="context-menu" id="my-context-menu">
 *   <button is="context-menu-item">Cut</button>
 *   <button is="context-menu-item">Copy</button>
 *   <button is="context-menu-item">Paste</button>
 * </menu>
 */
export class ContextMenuElement extends HTMLMenuElement {
	/**
	 * Function to define the context menu element in the HTML Custom Element Registry
	 * @param {string} tag - the tag name for the context menu element
	 * @example
	 * import { ContextMenuElement } from "@ivteplo/html-context-menu-element"
	 * ContextMenuElement.defineAs("context-menu")
	 */
	static defineAs(tag) {
		customElements.define(tag, this, { extends: "menu" })
	}

	/**
	 * Here we are going to store the parent element once the component gets mounted
	 * so that we can remove all the event listeners once the component gets unmounted.
	 * @type {HTMLElement|null}
	 */
	#lastParent = null

	/**
	 * Object with event listeners with `this`-bindings.
	 * We need it, because binding `this` returns a new function,
	 * but we need to be able to remove an event listener
	 */
	#eventListeners

	constructor() {
		super()

		this.#eventListeners = {
			onContextMenuCall: this.#onContextMenuCall.bind(this),
			onMenuCollapsingEvent: this.#onMenuCollapsingEvent.bind(this),
			onKeyDown: this.#onKeyDown.bind(this)
		}

		this.addEventListener("keydown", this.#eventListeners.onKeyDown)
	}

	/**
	 * @ignore
	 */
	static get observedAttributes() {
		return ["open"]
	}

	/**
	 * @ignore
	 * @param {string} name
	 * @param {any} _oldValue
	 * @param {any} newValue
	 */
	attributeChangedCallback(name, _oldValue, newValue) {
		if (name === "open" && newValue !== null) {
			window.addEventListener("keydown", this.#eventListeners.onKeyDown)
			this.removeEventListener("keydown", this.#eventListeners.onKeyDown)
		} else {
			window.removeEventListener("keydown", this.#eventListeners.onKeyDown)
			this.addEventListener("keydown", this.#eventListeners.onKeyDown)
		}
	}

	/**
	 * Hide the context menu
	 */
	hide() {
		this.removeAttribute("open")
	}

	/**
	 * Displays the context menu near the specified location
	 * @param {number} x - horizontal click location
	 * @param {number} y - vertical click location
	 */
	show(x, y) {
		this.setAttribute("open", true)

		if (y + this.clientHeight > window.innerHeight) {
			this.style.top = `${y - this.clientHeight}px`
		} else {
			this.style.top = `${y}px`
		}

		if (x + this.clientWidth > window.innerWidth) {
			this.style.left = `${x - this.clientWidth}px`
		} else {
			this.style.left = `${x}px`
		}

		this.querySelector("button")?.focus()
	}

	/**
	 * Gets called whenever any key has been pressed on the keyboard
	 * @param {KeyboardEvent} event
	 */
	#onKeyDown(event) {
		if (event.key === "Tab") {
			event.preventDefault()
		} else if (event.key === "Escape") {
			this.hide()
			event.stopImmediatePropagation()
		} else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
			event.preventDefault()
			event.stopImmediatePropagation()

			const isArrowDown = event.key === "ArrowDown"
			const focusedElement = document.activeElement

			const element = getNextChildToFocusOnInsideOf(this, focusedElement, isArrowDown)
			element?.focus()
		}
	}

	/**
	 * Gets called when the right button or a context menu keyboard button is clicked inside the parent element
	 * @param {PointerEvent} event
	 */
	#onContextMenuCall(event) {
		event.preventDefault()
		event.stopImmediatePropagation()

		if (this.contains(event.target)) {
			return
		}

		this.show(event.clientX, event.clientY)
	}

	/**
	 * Gets called whenever there is an interaction that should dismiss the context menu
	 * @param {PointerEvent} event
	 */
	#onMenuCollapsingEvent(event) {
		if (event.type !== "mousedown" || !this?.contains(event.target)) {
			this.hide()
			this.style.top = ""
			this.style.left = ""
		}
	}

	/**
	 * @ignore
	 */
	connectedCallback() {
		this.hide()

		window.addEventListener("mousedown", this.#eventListeners.onMenuCollapsingEvent)
		window.addEventListener("contextmenu", this.#eventListeners.onMenuCollapsingEvent)
		window.addEventListener("scroll", this.#eventListeners.onMenuCollapsingEvent)
		window.addEventListener("blur", this.#eventListeners.onMenuCollapsingEvent)
		window.addEventListener("resize", this.#eventListeners.onMenuCollapsingEvent)

		this.parentElement.addEventListener("contextmenu", this.#eventListeners.onContextMenuCall)
		this.#lastParent = this.parentElement

		this.hide()
	}

	/**
	 * @ignore
	 */
	disconnectedCallback() {
		window.removeEventListener("mousedown", this.#eventListeners.onMenuCollapsingEvent)
		window.removeEventListener("contextmenu", this.#eventListeners.onMenuCollapsingEvent)
		window.removeEventListener("scroll", this.#eventListeners.onMenuCollapsingEvent)
		window.removeEventListener("blur", this.#eventListeners.onMenuCollapsingEvent)
		window.removeEventListener("resize", this.#eventListeners.onMenuCollapsingEvent)

		this.#lastParent?.removeEventListener("contextmenu", this.#eventListeners.onContextMenuCall)
		this.#lastParent = null
	}
}

