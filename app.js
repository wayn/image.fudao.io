const express = require('express')
const request = require('request')
const app = express()

// Global consts
const CLIENT_ID = '4ac536f028703b3c1d540f7bf3fd611fd9b7ae5d87b9cab901caacf6f49ecdd8'
const URL_PHOTO_DAILY = 'https://api.unsplash.com/photos'


// Get daily photos api
app.get('/api/photos/daily', function (req, res, next) {

  var options = {url: URL_PHOTO_DAILY, headers: {'authorization':'Client-ID '+CLIENT_ID}}

  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var body = JSON.parse(body).map(obj => {
        delete obj.links
        delete obj.categories
        delete obj.current_user_collections
        delete obj.user
        delete obj.liked_by_user
        delete obj.sponsored
        delete obj.slug
        delete obj.likes
        delete obj.description

        return obj
      })
      res.send(body)
    }
  })
});

// Get daily collections api


// Get daily explore api


// middleware with an arity of 4 are considered
// error handling middleware. When you next(err)
// it will be passed through the defined middleware
// in order, but ONLY those with an arity of 4, ignoring
// regular middleware.
app.use(function(err, req, res, next){
  // whatever you want here, feel free to populate
  // properties on `err` to treat it differently in here.
  res.status(err.status || 500);
  res.send({ error: err.message });
});

// our custom JSON 404 middleware. Since it's placed last
// it will be the last middleware called, if all others
// invoke next() and do not respond.
app.use(function(req, res){
  res.status(404);
  res.send({ error: "Lame, can't find that" });
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
