const express = require('express');
const moment = require('moment');
//const server = require("./server");
const app = express();
//const fs = require("fs")
const mysql = require('mysql');
//const util = require('util');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

function start(route){

	//setting static sources
	app.use(express.static('images'));

	let connection = mysql.createConnection({
		host: 'localhost',
		user: 'test',
		password: 'test1234',
		database: 'test'
	});

	// app.get('/', function (req, res) {
	// 	console.log("主页 GET 请求");
	// 	res.send('Hello GET');
	// })

	app.get('/homepage', (req, res) => {
		res.render('index.ejs', { gg: '澳門首家線上賭場上線辣' });
	});

	//query function
	let data = {};
	let promiseQuery = (sFrom) => {
		return new Promise((resolve, reject) => {
			connection.query(sFrom, (err, rows, fields) => {
				if (err) {
					//throw err;
					reject(err);
				} else {
					data.article = rows;
					console.log("asyquery....");
					resolve();
				}
			});
		})
	};
	//query function


	//display a list of all articls[Index]
	app.get('/articles', async(req, res) => {
		console.log("before await~");
		await promiseQuery('select * from table_article_list');
		console.log("after await~");
		res.render('article_list.ejs', { gg: '留言板列表', data: data.article });			
	});

	//show form to make new blogs[New]
	app.get('/article/new', function(req, res) {
		res.render('article_add.ejs',{title: 'Add Article'});
	});

	//add new article to database[Create]
	app.use(express.urlencoded());
	app.use(bodyParser.json());
	app.post('/articles', function(req, res, next){
		let data_add = {
			title: req.body.title,
			timeStamp: moment().utc().format('YYYY-MM-DD HH:mm:ss')
		};
		console.log('title: ' ,req.body.title);
		connection.query('INSERT INTO table_article_list SET ?',data_add,function(err,rows){
			if(err){
				console.log(err);
			}
			res.setHeader('Content-Type', 'application/json');
			res.redirect('/articles')
		})
	});

	//show edit form of one article
	app.get('/articles/:articleId/edit', async(req,res) => {
		console.log("show edit form of one article");
		let sql = 'SELECT * FROM table_article_list WHERE id =' + req.params.articleId + '';
		console.log("id: ", req.params.articleId);
		await promiseQuery(sql);
		console.log("data: ", data.article[0]);
		res.render('article_edit.ejs', { data: data.article[0] });
	});

	//update a particular blog
	app.use(methodOverride('_method'));
	app.put('/articles/:articleId', function(req,res){
		let data_edit = {
			title : req.body.title,
			timeStamp: moment().utc().format('YYYY-MM-DD HH:mm:ss')
		}
		connection.query('UPDATE table_article_list SET ? WHERE id = ?', [data_edit, req.params.articleId], function (err, rows) {
			if (err) {
				console.log(err);
			}
			res.setHeader('Content-Type', 'application/json');
			res.redirect('/homepage');
		});
	});

	app.get('/articleDelete', function (req, res, next) {
		let id = req.query.id;
		connection.query('DELETE FROM table_article_list WHERE id = ?', id, (err) => {
			if (err) {
				console.log(err);
			}
			res.redirect('/article_list');
		})
	});
	
	let server = app.listen(1234, function () {
		let host = server.address().address;
		let port = server.address().port;
		console.log("应用实例，访问地址为 http://%s:%s", host, port);
	})

}

exports.start = start;