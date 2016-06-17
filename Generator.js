'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const glob = require("glob");
const EJS = require('ejs');
const xlsx = require('xlsx');

class Generator {
	constructor(opts) {
		let defaultOpts = {
			src: './src/demo.xlsx',
			dist: './dist',
			filename: '{src}.php',
			template: './template.ejs',
			sheet: 0,
			symbol: null,
			columns: {}
		}

		Object.assign(defaultOpts, opts);
		this.options = defaultOpts;

		let json = this.toJSON();
		json = _.map(json, (item) => {			
			return this.formatColumns(item);
		});

		this.exportFile(json);
	}

	formatColumns(line) {
		let columnsFun = this.options.columns;

		return _.mapValues(line, (val, key) => {
			return columnsFun[key] ? columnsFun[key](val) : val; 
		});
	}

	toJSON (url) {
		let excel = url ? xlsx.readFile(url) : xlsx.readFile(this.options.src);

		let sheet = this.getSheet(this.options.sheet, excel);

		return xlsx.utils.sheet_to_json(sheet);
	}

	getSheet (sheet, excel) {
		if(typeof sheet == 'number') {
			return excel.Sheets[excel.SheetNames[sheet]];
		}else if(typeof sheet == 'string') {
			return excel.Sheets[sheet]
		}else {
			console.error('Sheet only support number and string!');
		}
	}

	render (json) {
		let template = fs.readFileSync(this.options.template, 'utf8');

		let res = EJS.render(template, {
			result: json
		});

		return res;
	}

	formatFileName (filename, srcname) {
		filename = filename.indexOf('{src}') != -1 ? filename.replace(/{src}/g, this.getFileName(srcname)) : filename;
		
		return filename;
	}

	exportFile (result, url) {
		let filename = this.formatFileName(this.options.filename, this.options.src);
		let file = fs.createWriteStream(path.join(this.options.dist + '/' + filename));
		file.write(this.render(result));
		file.end();
	}

	fillUndefined (val) {
		return '';
	}

	getFileName (url) {
		return path.basename(url, path.extname(url));
	}

	replaceStr (str, from, to) {
		str = str instanceof RegExp ? str : new RegExp(str, 'g');

		return str.replace(from, to);
	}
}

module.exports = Generator;