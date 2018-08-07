module.exports = function(app, passport, db) {

    const { Pool } = require('pg');
    const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
    });

// normal routes ===============================================================
    // const cool = require('cool-ascii-faces')
    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    app.get('/times', (req, res) => {
      let result = ''
      const times = process.env.TIMES || 5
      for (i = 0; i < times; i++) {
        result += i + ' '
      }
        res.send(result)
      })

      app.get('/db', async (req, res) => {
        try {
          const client = await pool.connect()
          const result = await client.query('SELECT * FROM test_table');
          res.render('pages/db', result);
          client.release();
        } catch (err) {
        console.error(err);
        res.send("Error " + err);
          }
        });

    // app.get('/cool', function(req, res) {
    //   res.render(cool()));}

    // barista SECTION =========================
    // app.get('/zeager', isLoggedIn, function(req, res) {
    //     db.collection('cart').find().toArray((err, result) => {
    //       if (err) return console.log(err)
    //       res.render('index.html', {
    //         user : req.user,
    //         messages: result
    //       })
    //     })
    // });

    // LOGOUT ==============================
    // app.get('/logout', function(req, res) {
    //     req.logout();
    //     res.redirect('/');
    // });


    // app.post('/barista', (req, res) => {
    //   db.collection('complete').save({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => {
    //     if (err) return console.log(err)
    //     console.log('saved to database')
    //     res.redirect('/barista')
    //   })
    // })


    // cashier SECTION =========================
    // app.get('/cashier', function(req, res) {
    //     db.collection('incomplete').find().toArray((err, result) => {
    //       if (err) return console.log(err)
    //       res.render('cashier.ejs', {
    //         user : req.user,
    //         messages: result
    //       })
    //     })
    // });

// message board routes ===============================================================
    //
    // app.post('/cashier', (req, res) => {
    //   db.collection('incomplete').save({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => {
    //     if (err) return console.log(err)
    //     console.log('saved to database')
    //     res.redirect('/cashier')
    //   })
    // })
    //
    // app.post('/cashier', (req, res) => {
    //   db.collection('cart').save({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => {
    //     if (err) return console.log(err)
    //     console.log('saved to database')
    //     res.redirect('/cashier')
    //   })
    // })


    // app.put('/cashier', (req, res) => {
    //   db.collection('incomplete')
    //   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    //     $set: {
    //       thumbUp:req.body.thumbUp + 1
    //     }
    //   }, {
    //     sort: {_id: -1},
    //     upsert: true
    //   }, (err, result) => {
    //     if (err) return res.send(err)
    //     res.send(result)
    //   })
    // })


    // app.delete('/cashier', (req, res) => {
    //   db.collection('incomplete').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    //     if (err) return res.send(500, err)
    //     res.send('Message deleted!')
    //   })
    // })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/barista', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/barista', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
