//
// Copyright (c) 2024 Ivan Teplov
// Licensed under the Apache license 2.0
//

/**
 * Tries to find a parent element that meets the specified criteria
 * @param {(parent: HTMLElement) => boolean} meetsCriteria
 * @param {HTMLElement} child
 * @returns {HTMLElement|null}
 */
export function findParentThat(meetsCriteria, child) {
	let parent = child?.parentElement

	while (parent && !meetsCriteria(parent)) {
		parent = parent?.parentElement
	}

	return parent
}

/**
 * Tells if the element is focusable
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function isFocusable(element) {
	return !element.hasAttribute("disabled") && (
		element instanceof HTMLButtonElement ||
		element instanceof HTMLAnchorElement ||
		element instanceof HTMLInputElement ||
		element instanceof HTMLTextAreaElement ||
		(element.getAttribute("tabindex") ?? "-1") !== "-1"
	)
}

/**
 * Get the next child of the context menu.
 * Returns the top or bottom element when asking for the element
 * after the last one or before the first one respectively
 * @param {HTMLElement} parent
 * @param {HTMLElement} focusedElement
 * @param {boolean} isTheOneAfterCurrent
 */
export function getNextChildToFocusOnInsideOf(parent, focusedElement, isTheOneAfterCurrent) {
	let nextToFocus

	// If the focused element is currently outside of the menu
	if (!parent.contains(focusedElement)) {
		// Simply get the first or the last element
		nextToFocus = isTheOneAfterCurrent
			? parent.firstElementChild
			: parent.lastElementChild
	} else {
		// Get the direct child of the parent instead of a probably deeply nested child
		const directChild = focusedElement.parentElement !== parent
			? findParentThat(element => element.parentElement === parent, focusedElement)
			: focusedElement

		// Get the next element after the direct child
		nextToFocus = isTheOneAfterCurrent
			? (directChild.nextElementSibling ?? parent.firstElementChild)
			: (directChild.previousElementSibling ?? parent.lastElementChild)
	}

	// If the currently selected next element is not focusable or is not a submenu
	while (!(isFocusable(nextToFocus) || nextToFocus instanceof ContextMenuGroupElement)) {
		nextToFocus = isTheOneAfterCurrent
			? (nextToFocus.nextElementSibling ?? parent.firstElementChild)
			: (nextToFocus.previousElementSibling ?? parent.lastElementChild)
	}

	if (nextToFocus instanceof ContextMenuGroupElement) {
		return nextToFocus.querySelector("summary")
	}

	return nextToFocus
}

