import { Theme } from '../theme.js'
import { UINumber } from '../ui/ui_number.js'
import { Tweens } from '../utils/util_tween.js'
import { LayoutConstants } from '../layout_constants.js'
import { utils } from '../utils/utils.js'
import { UIIdObj } from '../ui/ui_idObj.js'
import { UIProp } from '../ui/ui_prop.js'
import { UIText } from '../ui/ui_text.js'
import { IconButton } from '../ui/icon_button.js'
;
var style = utils.style;
var button_styles = {
	width: '20px',
	height: '20px',
	padding: '2px',
	marginRight: '2px'
};

// TODO - tagged by index instead, work off layers.

function LayerView(layer, dispatcher) {
	var dom = document.createElement('div');

	var label = document.createElement('span');

	label.style.cssText = 'font-size: 12px; padding: 4px;';

	label.addEventListener('click', function(e) {
		//context.dispatcher.fire('label', channelName);
	});

	label.addEventListener('mouseover', function(e) {
		//context.dispatcher.fire('label', channelName);
	});
	//liste des tween
	var dropdown = document.createElement('select');
	var option;
	dropdown.style.cssText = 'font-size: 10px; width: 100px; margin: 0; float: right; text-align: right;';

	for (var k in Tweens) {
		option = document.createElement('option');
		option.text = k;
		dropdown.appendChild(option);
	}

	dropdown.addEventListener('change', function(e) {
		dispatcher.fire('ease', layer, dropdown.value);
	});

	//identifiant de l'objet
	var idObj = new UIIdObj(layer, dispatcher);
	idObj.dom.addEventListener('change', function(e) {
		dispatcher.fire('idObj.update', layer, idObj.dom.value);
	});

	//propriété de l'objet
	var prop = new UIProp(layer, dispatcher);
	prop.dom.addEventListener('change', function(e) {
		dispatcher.fire('prop.update', layer, prop.dom.value);
	});

	//valeur text de la ptopriété
	var text = new UIText(layer, dispatcher);
	text.dom.addEventListener('change', function(e) {
		dispatcher.fire('text.update', layer, text.dom.value);
	});

	var height = (LayoutConstants.LINE_HEIGHT - 1);

	var keyframe_button = document.createElement('button');
	keyframe_button.innerHTML = '&#9672;'; // '&diams;' &#9671; 9679 9670 9672
	keyframe_button.style.cssText = 'background: none; font-size: 12px; padding: 0px; font-family: monospace; float: right; width: 20px; height: ' + height + 'px; border-style:none; outline: none;'; //  border-style:inset;

	keyframe_button.addEventListener('click', function(e) {
		console.log('clicked:keyframing...', state.get('_value').value);
		dispatcher.fire('keyframe', layer, state.get('_value').value);
	});

	/*
	// Prev Keyframe
	var button = document.createElement('button');
	button.textContent = '<';
	button.style.cssText = 'font-size: 12px; padding: 1px; ';
	dom.appendChild(button);

	// Next Keyframe
	button = document.createElement('button');
	button.textContent = '>';
	button.style.cssText = 'font-size: 12px; padding: 1px; ';
	dom.appendChild(button);


	*/

	function ToggleButton(text) {
		// for css based button see http://codepen.io/mallendeo/pen/eLIiG

		var button = document.createElement('button');
		button.textContent = text;

		utils.style(button, {
			fontSize: '12px',
			padding: '1px',
			borderSize: '2px',
			outline: 'none',
			background: Theme.a,
			color: Theme.c,
		});

		this.pressed = false;

		button.onclick = () => {
			this.pressed = !this.pressed;

			utils.style(button, {
				borderStyle: this.pressed ? 'inset' : 'outset', // inset outset groove ridge
			})

			if (this.onClick) this.onClick();
		};

		this.dom = button;

	}

	// Solo
	var solo_toggle = new ToggleButton('S');
	dom.appendChild(solo_toggle.dom);

	solo_toggle.onClick = function() {
		dispatcher.fire('action:solo', layer, solo_toggle.pressed);
	}

	// Mute
	var mute_toggle = new ToggleButton('M');
	dom.appendChild(mute_toggle.dom);
	mute_toggle.onClick = function() {
		dispatcher.fire('action:mute', layer, mute_toggle.pressed);
	}

	var number = new UINumber(layer, dispatcher);
	number.onChange.do(function(value, done) {
		state.get('_value').value = value;
		dispatcher.fire('value.change', layer, value, done);
	});
	utils.style(number.dom, {
		float: 'right'
	});

	// trash
	var trash = new IconButton(12, 'trash', 'Delete layer', dispatcher);
	trash.onClick(function() {
		var ok = confirm('Are you sure you wish to delete layer ' + layer.name + ' ?');
		if (ok) {
			dispatcher.fire('layer.delete',layer);
		}
	});
	style(trash.dom, button_styles, { marginRight: '2px' });
	dom.appendChild(trash.dom);

	dom.appendChild(label);
	dom.appendChild(keyframe_button);
	dom.appendChild(number.dom);
	dom.appendChild(dropdown);
	dom.appendChild(idObj.dom);
	dom.appendChild(prop.dom);
	dom.appendChild(text.dom);

	utils.style(dom, {
		textAlign: 'left',
		margin: '0px 0px 0px 5px',
		borderBottom: '1px solid ' + Theme.b,
		top: 0,
		left: 0,
		height: (LayoutConstants.LINE_HEIGHT - 1 ) + 'px',
		color: Theme.c
	});

	this.dom = dom;

	this.repaint = repaint;
	var state;

	this.setState = function(l, s) {
		layer = l;
		state = s;

		var tmp_value = state.get('_value');
		if (tmp_value.value === undefined) {
			tmp_value.value = 0;
		}

		number.setValue(tmp_value.value);
		label.textContent = state.get('name').value;

		repaint();
	};

	function repaint(s) {

		//masque les propriétés du layer
		dropdown.style.opacity = 0;
		dropdown.disabled = true;
		keyframe_button.style.color = Theme.b;
		// keyframe_button.disabled = false;
		// keyframe_button.style.borderStyle = 'solid';

		var tween = null;
		var o = utils.timeAtLayer(layer, s);

		if (!o) return;

		if (o.can_tween) {
			dropdown.style.opacity = 1;
			dropdown.disabled = false;
			// if (o.tween)
			dropdown.value = o.tween ? o.tween : 'none';
			if (dropdown.value === 'none') dropdown.style.opacity = 0.5;
		}

		if (o.keyframe) {
			keyframe_button.style.color = Theme.c;
			// keyframe_button.disabled = true;
			// keyframe_button.style.borderStyle = 'inset';
		}

		if (o.idObj) {
			idObj.setValue(o.idObj);
			idObj.paint();
		}

		if (o.prop) {
			prop.setValue(o.prop);
			prop.paint();
		}

		if (o.text) {
			text.setValue(o.text);
			text.paint();
		}

		state.get('_value').value = o.value;
		number.setValue(o.value);
		number.paint();

		dispatcher.fire('target.notify', layer, o);
	}

}

export { LayerView }
