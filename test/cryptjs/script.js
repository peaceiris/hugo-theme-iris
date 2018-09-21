const fs = require('fs');
const cheerio = require('cheerio')
const $ = cheerio.load('<h2 class="title">Hello world</h2>')

$('h2.title').text('Hello there!')
$('h2').addClass('welcome')

console.log($.html())


// function readFile(path) {
//     fs.readFile(path, 'utf8', function (err, data) {

//         if (err) {
//             throw err;
//         }

//         const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
//         console.log(dom.window.document.querySelector("p").textContent); // "Hello world"
//         console.log(data);
//     });
// }

// readFile("index.html");
