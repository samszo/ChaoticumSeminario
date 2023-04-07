import { Theme } from '../theme.js'
import { Do } from '../utils/do.js'
import { handleDrag } from '../utils/util_handle_drag.js'
import { utils } from '../utils/utils.js'
const { firstDefined, style } = utils;

/**************************/
// UIProp
/**************************/

function UIProp(config) {
	config = config || {};
	var min = config.min === undefined ? -Infinity : config.min;

	var span = document.createElement('input');

	style(span, {
		textAlign: 'left',
		fontSize: '10px',
		padding: '3px',
		cursor: 'text',
		width: '100px',
		margin: 0,
		marginLeft: '10px',
		appearance: 'none',
		outline: 'none',
		border: 0,
		background: 'none',
		borderLeft: '1px dotted '+ Theme.c,
		borderRight: '1px dotted '+ Theme.c,
		color: Theme.c
	});

	var me = this;
	var state, value = 'null', unchanged_value;

	// Allow keydown presses in inputs, don't allow parent to block them
	span.addEventListener('keydown', function(e) {
		e.stopPropagation();
	})

	this.dom = span;

	// public
	this.setValue = function(v) {
		value = v;
		span.value = value;
	};

	this.paint = function() {
		if (value && document.activeElement !== span) {
			span.value = value;
		}
	};
}

export { UIProp }
