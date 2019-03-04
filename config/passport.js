const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./dbconn');

module.exports = function(passport) {

  passport.use('local', new LocalStrategy({passReqToCallback: true},
  (req, username, password, done) => {
      // email = req.body.email;
      // console.log('##################################################################');
      // console.log("Query Started");
      // console.log('##################################################################');
      email = username;
      var username = email.split('@');
      if(!email || !password ) { return done(null, false,{ message: 'All fields are required.'}); }
      connection.query("select * from users where email ='"+email+"';",function(err,rows){
        if (err)
          return done(err);
        if (rows.length) {
          var newUserMysql = new Object();
          newUserMysql.id    = email;
          return done(null, newUserMysql);
        }
        else {
          var insertQuery = "insert into users(email,username,password) values('"+email+"','"+username[0]+"','"+password+"');";
          var newUserMysql = new Object();
          newUserMysql.id    = email;
          connection.query(insertQuery,function(err,rows){
          if (err) done(null, false, { message: err });
            // console.log(rows);
          return done(null, newUserMysql);
          });
        }
      });
    }
  ));

  passport.use('facebook', new FacebookStrategy({
      clientID: 'ENTER YOUR FACEBOOK CLIENT ID',
      clientSecret: 'ENTER YOUR FACEBOOK CLIENT SECRET',
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ['emails','displayName']
    },
    function(accessToken, refreshToken, profile, done) {
      // console.log(profile.id,profile.displayName,profile.emails[0].value);
      // console.log('##################################################################');
      // console.log();
      // console.log('##################################################################');

      var username = (profile.emails[0].value).split('@');
      connection.query("select * from users where facebookid ='"+profile.id+"';",function(err,rows){
      	if (err)
          return done(err);
        if (rows.length) {
          var newUserMysql = new Object();
          newUserMysql.id    = profile.id;
          return done(null, newUserMysql);
        }
        else {
          var insertQuery = "insert into users(name, username, password, email, facebookid) values('"+profile.displayName+"','"+username[0]+"','"+username[0]+"','"+profile.emails[0].value+"','"+profile.id+"');";
          var newUserMysql = new Object();
          newUserMysql.id    = profile.id;
          connection.query(insertQuery,function(err,rows){
          if (err) done(null, false, { message: err });
            // console.log(rows);
  				return done(null, newUserMysql);
				  });
        }
      });
    }
  ));

  passport.use('facebookupdate', new FacebookStrategy({
    clientID: 'ENTER YOUR FACEBOOK CLIENT ID',
    clientSecret: 'ENTER YOUR FACEBOOK CLIENT SECRET',
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {

      // console.log("$$$$$$$$$$$$$$$$$$$");
      // console.log(req.user);
      // console.log("$$$$$$$$$$$$$$$$$$$");
      // console.log('##################################################################');
      // console.log("Query Started");
      // console.log('##################################################################');

      var updateQuery = "update users set facebookid='"+profile.id+"' where id='"+req.user.id+"';";
      connection.query(updateQuery,function(err,rows){
      if (err)
      {
        console.log("ERROR: NOT UPDATED");
        console.log(err);
      }
      return done(null, null);
      });

    }
  ));


  passport.use('google', new GoogleStrategy({
      clientID: 'ENTER YOUR GOOGLE CLIENT ID',
      clientSecret: 'ENTER YOUR GOOGLE CLIENT SECRET',
      callbackURL: "/auth/google/callback",
      useNewUrlParser: true,
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {

      // console.log("$$$$$$$$$$$$$$$$$$$");
      // console.log(req.user);
      // console.log("$$$$$$$$$$$$$$$$$$$");
      // console.log(profile.id,profile.displayName,profile.emails[0].value);
      // console.log('##################################################################');
      // console.log("Query Started");
      // console.log('##################################################################');
      var username = (profile.emails[0].value).split('@');
      connection.query("select * from users where googleid ='"+profile.id+"';",function(err,rows){
        if (err)
          return done(err);
        if (rows.length) {
          var newUserMysql = new Object();
          newUserMysql.id    = profile.id;
          return done(null, newUserMysql);
        }
        else {
          var insertQuery = "insert into users(name, username, password, email, googleid) values('"+profile.displayName+"','"+username[0]+"','"+username[0]+"','"+profile.emails[0].value+"','"+profile.id+"');";
          var newUserMysql = new Object();
          newUserMysql.id    = profile.id;
          connection.query(insertQuery,function(err,rows){
          if (err) done(null, false, { message: err });
            // console.log(rows);
          return done(null, newUserMysql);
          });
        }
      });
    }
  ));


  passport.use('googleupdate', new GoogleStrategy({
      clientID: 'ENTER YOUR GOOGLE CLIENT ID',
      clientSecret: 'ENTER YOUR GOOGLE CLIENT SECRET',
      callbackURL: "/auth/google/callback",
      useNewUrlParser: true,
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {

      // console.log("$$$$$$$$$$$$$$$$$$$");
      // console.log(profile.emails);
      // console.log("$$$$$$$$$$$$$$$$$$$");
      // console.log('##################################################################');
      // console.log("Query Started");
      // console.log('##################################################################');

      var updateQuery = "update users set googleid='"+profile.id+"' where id='"+req.user.id+"';";
      connection.query(updateQuery,function(err,rows){
      if (err)
      {
        console.log("ERROR: NOT UPDATED");
        console.log(err);
      }
      return done(null, null);
      });

    }
  ));

  passport.serializeUser(function(user, done) {

    connection.query("select * from users where googleid ='"+user.id+"' or facebookid = '"+user.id+"' or email = '"+user.id+"';", function (err, rows){
      // console.log("#################"+rows[0].id+"##################");
      done(null, rows[0].id);
    });
  });

  passport.deserializeUser(function(id, done) {
    connection.query("select * from users where id ="+id+";", function (err, rows){
      console.log(rows);

      done(err, rows[0]);
    });
  });


};
