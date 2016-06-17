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
```
