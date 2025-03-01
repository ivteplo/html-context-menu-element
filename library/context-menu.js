//
// Copyright (c) 2024-2025 Ivan Teplov
// Licensed under the Apache license 2.0
//

import { getNextChildToFocusOnInsideOf } from "./helpers.js"
import { startObserver } from "./click-observer.js"
import "./context-menu.scss"

/**
 * A context menu itself
 * @example <caption>Define a context menu</caption>
 * <context-menu id="my-context-menu">
 *   <button type="button">Cut</button>
 *   <button type="button">Copy</button>
 *   <button type="button">Paste</button>
 * </context-menu>
 *
 * @example <caption>Apply the context menu to an element</caption>
 * <div data-context-menu="my-context-menu">
 *   This element is using a custom context menu.
 * </div>
 */
export class ContextMenuElement extends HTMLElement {
	/**
	 * Function to define the context menu element in the HTML Custom Element Registry
	 * @param {string} tag - the tag name for the context menu element
	 * @example
	 * import { ContextMenuElement } from "@ivteplo/html-context-menu-element"
	 * ContextMenuElement.defineAs("context-menu")
	 */
	static defineAs(tag) {
		customElements.define(tag, this)
	}

	/** @type {HTMLElement | null} */
	#currentTarget = null

	/** @type {HTMLElement | null} */
	#target = null

	/**
	 * Container that has `data-context-menu` set
	 * and that has been right clicked on.
	 * @returns {HTMLElement|null}
	 */
	get currentTarget() {
		return this.#currentTarget
	}

	/**
	 * Object that has been right clicked on.
	 * Can be a child of a container that has the `data-context-menu` set.
	 * @returns {HTMLElement|null}
	 */
	get target() {
		return this.#target
	}

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
			onKeyDown: this.#onKeyDown.bind(this),
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
		this.style.top = ""
		this.style.left = ""
	}

	/**
	 * Displays the context menu near the specified location
	 * @param {number} x - horizontal click location
	 * @param {number} y - vertical click location
	 * @param {{
	 *   currentTarget?: HTMLElement,
	 *   target?: HTMLElement
	 * }} - objects that triggered the context menu (optional)
	 */
	show(x, y, { target, currentTarget } = {}) {
		if (typeof x !== "number" || typeof y !== "number") {
			return console.warn(
				"Invalid coordinates passed to the %s#show(x, y) method: (%s, %s).",
				this.constructor.name, x, y
			)
		}

		if (currentTarget instanceof HTMLElement) {
			this.#currentTarget = currentTarget
		}

		if (target instanceof HTMLElement) {
			this.#target = target
		}

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
	 * Gets called when the right button is clicked inside the context menu
	 * @param {PointerEvent} event
	 */
	#onContextMenuCall(event) {
		event.preventDefault()
		event.stopImmediatePropagation()

		// Make the right click work like the left click
		// when performing it on a button inside the context menu.
		if (event.target instanceof HTMLButtonElement) {
			event.target.click()
		}
	}

	/**
	 * Gets called when a click inside of the context menu has been performed.
	 * @param {PointerEvent} event
	 */
	#onClick(event) {
		// By default we want to close the context menu once a button has been clicked.
		if (!event.defaultPrevented && event.target instanceof HTMLButtonElement) {
			this.hide()
		}
	}

	/** @ignore */
	connectedCallback() {
		this.hide()
		this.addEventListener("contextmenu", this.#onContextMenuCall)
		this.addEventListener("click", this.#onClick)
		startObserver()
	}

	/**
	 * @ignore
	 */
	disconnectedCallback() {}
}

