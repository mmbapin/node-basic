const fs = require('fs');
const http = require('http');
const url = require('url');

// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}. \nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);

// fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
// 	console.log(data);
// });

const replaceTemplate = (temp, product) => {
	let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
	output = output.replace(/{%IMAGE%}/g, product.image);
	output = output.replace(/{%PRICE%}/g, product.price);
	output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
	output = output.replace(/{%QUANTITY%}/g, product.quantity);
	output = output.replace(/{%DESCRIPTION%}/g, product.description);
	output = output.replace(/{%ID%}/g, product.id);
	if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
	return output
}


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const productData = JSON.parse(data);

const server = http.createServer((req, res) => {
	const {query, pathname} = url.parse(req.url, true);

	if (pathname === '/' || pathname === '/overview') {
		res.writeHead(200, {'Content-type': 'text/html'});

		const cardHtml = productData.map((el) => replaceTemplate(tempCard, el)).join('');
		const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);
		res.end(output);
	} else if (pathname === '/product') {
		const product = productData[query.id];
		const output = replaceTemplate(tempProduct, product)
		res.end(output);
	} else if(pathname === '/api'){
		res.writeHead(200, {'Content-type': 'application/json'})
		res.end(data);
	}else {
		res.writeHead(404, {
			'Content-type': 'text/html',
			'my-own-header': 'hello-world',
		});
		res.end('<h1>Page not found !</h1>');
	}
});

server.listen(8000, '127.0.0.1', () => {
	console.log('Listening to requests on port 8000');
});
