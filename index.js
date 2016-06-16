'use strict';

let Generator = require('./Generator.js');

new Generator({
	src: './test.xlsx',
	dist: './',
	filename: '{src}.php',
	template: './template.ejs',
	sheet: 0,
	symbol: null,
	columns: {
		a (str) {
			return 'test';
		}
	}
});

// console.log(Generator.fillUndefined(null))