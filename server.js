let express = require('express');
let server = require("./server");
let app = express();
let fs = require("fs")

function start(route){

	app.use(express.static('images'));

	app.get('/', function (req, res) {
		console.log("主页 GET 请求");
		res.send('Hello GET');
	})

	app.get('/homepage', (req, res) => {
		res.render('index.ejs', { gg: 133221333123111 });
	});


	// app.get('/homepage', function (req, res) {
	// 	console.log("homepage GET 请求");
	// 	//res.send('Hello GET');

	// 	fs.readFile("./public/view/index.html", function (err, data) {
	// 		if (err) {
	// 			console.log(err);
	// 			res.writeHead(404, {'Content-Type': 'text/html'});
	// 		}else{             
	// 			res.writeHead(200, {'Content-Type': 'text/html'});    

	// 			res.write(data.toString());        
	// 		}
	// 		res.end();
	// 	});

	// })

	let server = app.listen(5678, function () {

		let host = server.address().address
		let port = server.address().port

		console.log("应用实例，访问地址为 http://%s:%s", host, port)

	})

}

exports.start = start;