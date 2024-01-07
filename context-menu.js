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

		this.addEventListener("keyup", this.#onKeyUp.bind(this))
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
	#onKeyUp(event) {
		if (event.key === "Escape") {
			this.hide()
			event.stopPropagation()
		}
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
			this.style.top = ""
			this.style.left = ""
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

	/**
	 * Gets called when the right mouse button is clicked
	 * @param {PointerEvent} event
	 */
	#triggerNormalClickOnRightClick(event) {
		event.preventDefault()
		event.stopPropagation()
		this.click()
	}

	#onClick() {
		findParentOfType(ContextMenuElement, this)?.hide()
	}
}

/**
 * @example
 * <dialog is="context-menu-group">
 *     <summary>Group name</summary>
 *     <button is="context-menu-item">Item 1</button>
 * </dialog>
 */
class ContextMenuGroupElement extends HTMLDetailsElement {
	/**
	 * Calls a callack whenever a new child gets mounted to the element
	 * @type {MutationObserver}
	 * @todo maybe move it out of the element for optimisation purposes?
	 */
	#childMountObserver

	/**
	 * Wrapper of all submenu items
	 * @type {HTMLDivElement}
	 */
	#buttonWrapper

	constructor() {
		super()

		this.addEventListener("mouseover", () => { this.open = true })
		this.addEventListener("keyup", this.#onKeyUp.bind(this))
		this.addEventListener("mouseleave", () => { this.open = false })

		this.#buttonWrapper = document.createElement("div")
		this.appendChild(this.#buttonWrapper)

		this.#childMountObserver = new MutationObserver(this.#onMutations.bind(this))
		this.#childMountObserver.observe(this, { childList: true })
	}

	static get observedAttributes() {
		return ["open"]
	}

	/**
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
	#onKeyUp(event) {
		event.preventDefault()

		if (!this.#open && (event.key === "Enter" || event.key === "Space")) {
			event.stopPropagation()
			this.open = true
		} else if (this.#open && event.key === "Escape") {
			event.stopPropagation()
			this.open = false
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

	/**
	 * Gets called whenever a child gets mounted
	 * @param {MutationRecord[]} mutations
	 */
	#onMutations(mutations) {
		for (const mutation of mutations) {
			if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
				for (const node of mutation.addedNodes) {
					if (!(node instanceof HTMLElement)) {
						continue
					}

					if (node.tagName === "SUMMARY") {
						continue
					}

					this.removeChild(node)
					this.#buttonWrapper.appendChild(node)
				}
			}
		}
	}
}

customElements.define("context-menu", ContextMenuElement)
customElements.define("context-menu-item", ContextMenuItemElement, { extends: "button" })
customElements.define("context-menu-group", ContextMenuGroupElement, { extends: "details" })

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
