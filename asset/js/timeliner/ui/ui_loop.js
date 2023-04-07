import { Theme } from '../theme.js'
import { Do } from '../utils/do.js'
import { handleDrag } from '../utils/util_handle_drag.js'
import { utils } from '../utils/utils.js'
const { firstDefined, style } = utils;

/**************************/
// UILoop
/**************************/

function UILoop(config) {
	config = config || {};
	var min = config.min === undefined ? -Infinity : config.min;

	var check = document.createElement('div');
	var input = document.createElement('input');
    input.id="timeliner_loop"; 
    input.setAttribute("type","checkbox");
    //input.setAttribute("checked","false");
    check.appendChild(input);
	var label = document.createElement('label');
    label.setAttribute("for","timeliner_loop");
    label.innerHTML = "loop";
    check.appendChild(label);
	style(check, {
        float: 'left',
        padding:'4px',
		color: Theme.c
	});
	var me = this;
	var state, value = 'null', unchanged_value;

	// Allow keydown presses in inputs, don't allow parent to block them
	check.addEventListener('keydown', function(e) {
		e.stopPropagation();
	})

	this.dom = check;

	// public
	this.setValue = function(v) {
		value = v;
		input.value = value;
	};

	this.paint = function() {
		if (value && document.activeElement !== input) {
			input.value = value;
		}
	};

	this.onClick = function(e) {
		input.addEventListener('click', e);
	};

}

export { UILoop }
