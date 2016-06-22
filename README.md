# Generator
You can generate any format of file you want from excel (sql, php, html, etc.)

##How to use
```nodejs
	npm install excel-generator
```

```javascript
	'use strict';

	let path = require('path');
	let Generator = require('excel-generator');

	new Generator({
		src: path.join(__dirname, 'src', 'test.xlsx'),
		dist: path.join(__dirname, 'dist'),
		filename: '{src}.php',
		template: './template.ejs',
		sheet: 0
	});
```

##Options
- src: `Path`, default: `./src/demo.xlsx`, path to your source excel file(pls use absolute path).
- dist: `Path`, default: `./dist`, path to export file.
- filename: `String`, default: `{src}.php`, filename of exported(you can use `{src}` to instead of source excel file name, like `demo.xlsx` will export as `demo.extension`)
- template: `Path`, default: `./template.ejs`, template file, pls mention that template is depend on [Ejs](https://github.com/tj/ejs)
- sheet: `Number` or `String`, default: `0`, __index__ or __name__ of the sheet
- flag:  `String`, default: `null`, symbol of a single line, if this flag is `undefined`、`null` or empty in any line, keys of this line will merge to prev line as an Array
- columns: `Object`, default: `{}`, format every key as you want, in this object, key should be the title of your excel columns, value should be a `function` to format it, pls `return` the result of format, these `functions` will be triggered before `mergeToPrev()`
- formatJSON: `function`, default: `function(json) { return json; }`, you can format JSON before export, this is the final step before exported.
