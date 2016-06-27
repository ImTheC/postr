var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

var Posters = function () {
	return knex('posters');
};

var authorized = function(req, res, next) {
	let user_id = req.signedCookies.userID;

	if ( user_id === req.params.id ) {
		next();
	} else {
		res.status(401).redirect('/');
	}
};

/* GET All POSTERS. */
router.get('/', function (req, res) {
	Posters().then(function(posters){
		res.render('posters/index', {title: "Poster Pole Front Page Home", posters:posters });
	});
});

/* GET SPECIFIC POSTER */
router.get('/:poster_id', function (req, res) {
	Posters().where("id", req.params.poster_id).first().then(function(poster){
		res.render('posters/show', {title: "Poster Page", poster:poster });
	});
});


/* DELETE OR EDIT POSTER */
router.route('/:poster_id', authorized)

	.delete(function(req, res){
		res.send('This would have been DELETED!');
		// Posters().where('id', req.params.poster_id).delete().then(function(){
		// 	res.redirect('/');
		// });
	})

	.put(function(req, res){
		res.send('This would edit with the following values ' + req.body.poster);
		// Posters().where('id', req.params.poster_id).update(req.body.poster).then(function(){
		// 	res.redirect('posters/' + req.params.poster_id);
		// });
	});

module.exports = router;
