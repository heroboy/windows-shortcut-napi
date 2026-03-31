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
	 * Data returned by `query` for an existing shortcut.
	 */
	interface ShortcutInfo {
		/**
		 * Resolved path to the shortcut target.
		 */
		target: string;

		/**
		 * Command-line arguments configured in the shortcut.
		 */
		args: string;

		/**
		 * Working directory configured in the shortcut.
		 */
		workingDir: string;

		/**
		 * Icon source path configured in the shortcut.
		 */
		icon: string;

		/**
		 * Icon resource index configured in the shortcut.
		 */
		iconIndex: number;

		/**
		 * Windows shortcut hotkey value.
		 */
		hotkey: number;

		/**
		 * Window show command configured in the shortcut.
		 */
		runStyle: number;
	}

	/**
	 * Options used to create a Windows shortcut.
	 */
	interface ShortcutCreateOptions {
		/**
		 * Absolute path to the shortcut target.
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
	class ShortcutError extends Error {
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

	/**
	 * Reads an existing shortcut and returns its configured properties.
	 *
	 * @param path Existing `.lnk` file path.
	 */
	function query(path: string): ShortcutInfo;
}

export = windowsShortcutNapi;
