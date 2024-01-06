//
// Copyright (c) 2024 Ivan Teplov
// Licensed under the Apache license 2.0
//

class ContextMenuElement extends HTMLElement {
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
			onMenuCollapsingEvent: this.#onMenuCollapsingEvent.bind(this)
		}
	}

	/**
	 * Hide the context menu
	 */
	hide() {
		this.style.display = "none"
	}

	/**
	 * Displays the context menu near the specified location
	 * @param {number} x - horizontal click location
	 * @param {number} y - vertical click location
	 */
	show(x, y) {
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

		this.style.display = ""
		this.focus()
	}

	/**
	 * Gets called when the right button or a context menu keyboard button is clicked inside the parent element
	 * @param {PointerEvent} event
	 */
	#onContextMenuCall(event) {
		event.preventDefault()
		event.stopPropagation()

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
		}
	}

	connectedCallback() {
		window.addEventListener("mousedown", this.#eventListeners.onMenuCollapsingEvent)
		window.addEventListener("contextmenu", this.#eventListeners.onMenuCollapsingEvent)
		window.addEventListener("scroll", this.#eventListeners.onMenuCollapsingEvent)
		window.addEventListener("blur", this.#eventListeners.onMenuCollapsingEvent)
		window.addEventListener("resize", this.#eventListeners.onMenuCollapsingEvent)

		this.parentElement.addEventListener("contextmenu", this.#eventListeners.onContextMenuCall)
		this.#lastParent = this.parentElement

		this.hide()
	}

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

/**
 * @example
 * <button is="context-menu-item">Button label</button>
 */
class ContextMenuItemElement extends HTMLButtonElement {
	constructor() {
		super()
		this.type = "button"
		this.addEventListener("contextmenu", this.#triggerNormalClickOnRightClick)
		this.addEventListener("click", this.#onClick)
	}

	#triggerNormalClickOnRightClick(event) {
		event.preventDefault()
		event.stopPropagation()
		this.click()
	}

	#onClick() {
		findParentOfType(ContextMenuElement, this)?.hide()
	}
}

customElements.define("context-menu", ContextMenuElement)
customElements.define("context-menu-item", ContextMenuItemElement, { extends: "button" })

/**
 * @template Class
 * @param {Class} ElementType
 * @param {HTMLElement} child
 * @returns {InstanceType<Class>|null}
 */
function findParentOfType(ElementType, child) {
	let parent = child?.parentElement

	while (parent && !(parent instanceof ElementType)) {
		parent = parent?.parentElement
	}

	return parent
}
