'use strict';

let path = require('path');
let Generator = require('excel-generator');

new Generator({
	src: path.join(__dirname, 'src', 'test.xlsx'),
	dist: path.join(__dirname, 'dist'),
	filename: '{src}.php',
	template: path.join(__dirname, 'template.ejs'),
	sheet: 0,
	symbol: null,
	columns: {
		test1(str) {
			return 'test';
		},
		test5(str) {
			this.replaceStr('\n', '');
		}
	}
});