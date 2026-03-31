declare namespace windowsShortcutNapi {
	/**
	 * Shows the target window in its normal size and position.
	 */
	const SW_SHOWNORMAL: 1;

	/**
	 * Shows the target window maximized.
	 */
	const SW_SHOWMAXIMIZED: 3;

	/**
	 * Minimizes the target window without activating it.
	 */
	const SW_SHOWMINNOACTIVE: 2;

	/**
	 * Supported show command values exported by this package.
	 */
	type ShortcutShowCommand =
		| typeof SW_SHOWNORMAL
		| typeof SW_SHOWMAXIMIZED
		| typeof SW_SHOWMINNOACTIVE;

	/**
	 * Options used to create a Windows shortcut.
	 */
	interface ShortcutCreateOptions {
		/**
		 * Absolute or relative path to the shortcut target.
		 */
		target: string;

		/**
		 * Command-line arguments passed to the target executable.
		 */
		args?: string | null;

		/**
		 * Working directory used when launching the shortcut.
		 */
		workingDir?: string | null;

		/**
		 * Path to the icon file or executable that contains the icon.
		 */
		icon?: string | null;

		/**
		 * Index of the icon resource within the icon source.
		 */
		iconIndex?: number | null;

		/**
		 * Windows shortcut hotkey value.
		 */
		hotkey?: number | null;

		/**
		 * Window show command used when launching the shortcut.
		 */
		runStyle?: ShortcutShowCommand | null;

		/**
		 * Description stored in the shortcut metadata.
		 */
		desc?: string | null;
	}

	/**
	 * Error thrown when shortcut creation fails in the wrapped native layer.
	 */
	class ShortcutCreateError extends Error {
		/**
		 * Native error reason returned by the addon.
		 */
		reason: string;

		/**
		 * Internal status code returned by the addon.
		 */
		status: number;

		/**
		 * HRESULT value returned by the Windows API.
		 */
		hr: number;

		constructor(reason: string, status: number, hr: number);
	}

	/**
	 * Creates a shortcut that points to the given target path.
	 *
	 * @param path Output `.lnk` file path.
	 * @param target Shortcut target path.
	 */
	function create(path: string, target: string): void;

	/**
	 * Creates a shortcut using an options object.
	 *
	 * @param path Output `.lnk` file path.
	 * @param targetOrOptions Shortcut creation options.
	 */
	function create(path: string, targetOrOptions: ShortcutCreateOptions): void;
}

export = windowsShortcutNapi;
