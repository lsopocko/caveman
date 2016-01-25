'use strict';

var _helpers = require('./lib/helpers');

var helpers = _interopRequireWildcard(_helpers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var Screen = require('./lib/screen.js');

var Caveman = {
	init: function init() {
		Screen.create('screen');
		console.log('test');
	}
};

Caveman.init();