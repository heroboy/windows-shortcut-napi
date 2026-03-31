const { CreateShortcut } = require('./lib/bindings.node');
exports.SW_SHOWNORMAL = 1;
exports.SW_SHOWMAXIMIZED = 3;
exports.SW_SHOWMINNOACTIVE = 2;

exports.ShortcutCreateError = class ShortcutCreateError extends Error
{
	constructor(reason, status, hr)
	{
		super('Failed to create shortcut: ' + reason);
		this.name = 'ShortcutCreateError';
		this.reason = reason;
		this.status = status;
		this.hr = hr;
	}
};

exports.create = function create(path, targetOrOptions)
{
	if (typeof path !== 'string')
		throw new TypeError('path must be a string');

	if (typeof targetOrOptions === 'string')
	{
		const ret = CreateShortcut(path, targetOrOptions);
		if (ret !== undefined)
		{
			throw new exports.ShortcutCreateError(ret.reason, ret.status, ret.hr);
		}
		return;
	}

	if (typeof targetOrOptions !== 'object' || targetOrOptions === null)
		throw new TypeError('targetOrOptions must be a string or an object');

	if (typeof targetOrOptions.target !== 'string')
		throw new TypeError('targetOrOptions.target must be a string');

	if (targetOrOptions.args != null && typeof targetOrOptions.args !== 'string')
		throw new TypeError('targetOrOptions.args must be a string');

	if (targetOrOptions.workingDir != null && typeof targetOrOptions.workingDir !== 'string')
		throw new TypeError('targetOrOptions.workingDir must be a string');

	if (targetOrOptions.runStyle != null && typeof targetOrOptions.runStyle !== 'number')
		throw new TypeError('targetOrOptions.runStyle must be a number');

	if (targetOrOptions.icon != null && typeof targetOrOptions.icon !== 'string')
		throw new TypeError('targetOrOptions.icon must be a string');

	if (targetOrOptions.iconIndex != null && typeof targetOrOptions.iconIndex !== 'number')
		throw new TypeError('targetOrOptions.iconIndex must be a number');

	if (targetOrOptions.hotkey != null && typeof targetOrOptions.hotkey !== 'number')
		throw new TypeError('targetOrOptions.hotkey must be a number');

	if (targetOrOptions.desc != null && typeof targetOrOptions.desc !== 'string')
		throw new TypeError('targetOrOptions.desc must be a string');
	
	const ret = CreateShortcut(path, 
		targetOrOptions.target,
		targetOrOptions.args,
		targetOrOptions.workingDir,
		targetOrOptions.runStyle,
		targetOrOptions.icon,
		targetOrOptions.iconIndex,
		targetOrOptions.hotkey,
		targetOrOptions.desc
	);
	if (ret !== undefined)
	{
		throw new exports.ShortcutCreateError(ret.reason, ret.status, ret.hr);
	}
};