/**
 * Checks if the current environment is Node.js., Bun, or Deno.
 */
export function isServerRuntime(): boolean {
	return (
		Object.prototype.toString.call(
			typeof process !== "undefined" ? process : 0,
		) === "[object process]" ||
		typeof Bun !== "undefined" ||
		(typeof Deno !== "undefined" && typeof Deno.version !== "undefined")
	);
}

/**
 * Checks if the current environment is a browser.
 */
export function isBrowser(): boolean {
	return (
		typeof window !== "undefined" &&
		Object.prototype.toString.call(window) === "[object Window]"
	);
}
