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
			flag: null,
			columns: {}
		}

		Object.assign(defaultOpts, opts);
		this.options = defaultOpts;

		let json = this.toJSON();
		
		json = _.map(json, (line) => {			
			return this.formatColumns(line);
		});
		json = this.mergeMutiLine(json);
		
		this.exportFile(json);
	}

	formatColumns(line) {
		let columnsFun = this.options.columns;

		return _.mapValues(line, (val, key) => {
			return (columnsFun[key] && val) ? columnsFun[key](val) : val; 
		});
	}

	toJSON(url) {
		let excel = url ? xlsx.readFile(url) : xlsx.readFile(this.options.src);

		let sheet = this.getSheet(this.options.sheet, excel);
		return xlsx.utils.sheet_to_json(sheet);
	}

	getSheet(sheet, excel) {
		if(typeof sheet == 'number') {
			return excel.Sheets[excel.SheetNames[sheet]];
		}else if(typeof sheet == 'string') {
			return excel.Sheets[sheet]
		}else {
			console.error('Sheet only support number and string!');
		}
	}

	render(json) {
		let template = fs.readFileSync(this.options.template, 'utf8');

		let res = EJS.render(template, {
			result: json
		});

		return res;
	}

	formatFileName(filename, srcname) {
		filename = filename.indexOf('{src}') != -1 ? filename.replace(/{src}/g, this.getFileName(srcname)) : filename;
		
		return filename;
	}

	exportFile(result, url) {
		let filename = this.formatFileName(this.options.filename, this.options.src);
		let file = fs.createWriteStream(path.join(this.options.dist + '/' + filename));
		file.write(this.render(result));
		file.end();
	}

	mergeMutiLine(data) {
		if(this.options.flag) {
			let result = [];
			_.forEach(data, (line, index) => {
				if(!line[this.options.flag] && result.length) {
					let prev = _.last(result);

					_.forEach(line, (item, key) => {
						prev[key] = item === undefined ? prev[key] : this.mergeToPrev(prev[key], item);
					});
				}else {
					result.push(line);
				}
			});

			return result;
		}else {
			return data;
		}
	}

	mergeToPrev(prev, next) {
		if(prev === undefined) {
			prev = next;
		}else if(Array.isArray(prev)) {
			prev.push(next);
		}else {
			prev = [prev, next];
		}

		return prev;
	}

	fillUndefined(val) {
		return '';
	}

	getFileName(url) {
		return path.basename(url, path.extname(url));
	}

	replaceStr(str, from, to) {
		from = from instanceof RegExp ? from : new RegExp(from, 'g');

		return str.replace(from, to);
	}
}

module.exports = Generator;