var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var authHelpers = require('../auth/authHelpers');
var passwordHelpers = require('../auth/passwordHelpers');

// Users function
function Users() {
  return knex('users');
}

// Posters function
function Posters() {
  return knex('posters');
}

// Get currentUser for users views
router.use(authHelpers.currentUser);
router.use(authHelpers.checkAuthentication);

/* Index, get all users. */
router.get('/', authHelpers.ensureAdmin, (req, res, next) => {
  Users().then((users) => {
    res.render('users/index', {title: 'All Users', users: users})
  })
});

// Create User, authentication route handle this now
// router.get('/new', (req, res) => {
//   res.render('users/new', {title: 'Create User'});
// })
//
// router.post('/', (req, res) => {
//   Users().insert(req.body.user).then((user) => {
//     res.redirect('/');
//   })
// })

// Read a single user
router.get('/:id', authHelpers.ensureCorrectUser, (req, res) => {
  Users().where('id', req.params.id).first().then((user) => {
		Posters().where('user_id', req.params.id).then((posters) => {
			res.render('users/show', {title: 'User Account', user: user, posters: posters});
		});
  });
});

// Update (Edit)
router.get('/:id/edit', authHelpers.ensureCorrectUser, (req, res) => {
  Users().where('id', req.params.id).first().then((user) => {
    res.render('users/edit', {title: 'Edit User', user: user});
  })
})

router.put('/:id', authHelpers.ensureCorrectUser, (req, res) => {
  passwordHelpers.editUser(req).then((user) => {
    res.redirect('/users/' + req.params.id);
  }).catch((err)=> {
    if (err.constraint === 'users_username_unique') {
      err.message = "Username is already taken."
    }
    req.flash('loginMessage', err.message)
    res.redirect(`/users/${req.user.id}/edit`);
  })
  // Users().where('id', req.params.id).update(req.body.user).then((user) => {
  //   res.redirect('/');
  // })
})

// Delete a user
router.delete('/:id', authHelpers.ensureCorrectUser, (req, res) => {
  Users().where('id', req.params.id).del().then((user) => {
    req.logout();
    res.redirect('/');
  })
})

module.exports = router;
