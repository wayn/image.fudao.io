const express = require('express')
const request = require('request')
var Agent = require('socks5-https-client/lib/Agent');
const app = express()

// Global consts
const CLIENT_ID = '4ac536f028703b3c1d540f7bf3fd611fd9b7ae5d87b9cab901caacf6f49ecdd8'
const URL_PHOTO_DAILY = 'https://api.unsplash.com/photos'
const URL_COLLECTION_DAILY = 'https://api.unsplash.com/collections'
const URL_PHOTO_SEARCH = 'https://api.unsplash.com/search/photos'


// Get daily photos api
app.get('/api/photos/daily', function (req, res, next) {

  var page = (typeof req.query['page'] === "undefined") ? '1' : req.query['page']
  var options = {url: URL_PHOTO_DAILY+'?page='+page,
             headers: {'authorization':'Client-ID '+CLIENT_ID},
           strictSSL: true,
          agentClass: Agent,
        agentOptions: {socksHost: '127.0.0.1', socksPort: 1080}}

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

        obj.urls.raw = obj.urls.raw.replace('https://images.unsplash.com', 'https://image.fudao.io/images')
        obj.urls.full = obj.urls.full.replace('https://images.unsplash.com', 'https://image.fudao.io/images')
        obj.urls.regular = obj.urls.regular.replace('https://images.unsplash.com', 'https://image.fudao.io/images')
        obj.urls.small = obj.urls.small.replace('https://images.unsplash.com', 'https://image.fudao.io/images')
        obj.urls.thumb = obj.urls.thumb.replace('https://images.unsplash.com', 'https://image.fudao.io/images')

        return obj
      })
      res.send(body)
    }
  })
});

// Get daily collections api
app.get('/api/collections/daily', function (req, res, next) {

  var options = {url: URL_COLLECTION_DAILY,
             headers: {'authorization':'Client-ID '+CLIENT_ID},
           strictSSL: true,
          agentClass: Agent,
        agentOptions: {socksHost: '127.0.0.1', socksPort: 1080}}

  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var body = JSON.parse(body).map(obj => {
        delete obj.curated
        delete obj.private
        delete obj.tags
        delete obj.cover_photo
        delete obj.user
        delete obj.links
        delete obj.featured
        delete obj.description
        delete obj.share_key

        obj.preview_photos = obj.preview_photos.map(photo => {
          photo.urls.raw = photo.urls.raw.replace('https://images.unsplash.com', 'https://image.fudao.io/images')
          photo.urls.full = photo.urls.full.replace('https://images.unsplash.com', 'https://image.fudao.io/images')
          photo.urls.regular = photo.urls.regular.replace('https://images.unsplash.com', 'https://image.fudao.io/images')
          photo.urls.small = photo.urls.small.replace('https://images.unsplash.com', 'https://image.fudao.io/images')
          photo.urls.thumb = photo.urls.thumb.replace('https://images.unsplash.com', 'https://image.fudao.io/images')

          return photo
        })

        return obj
      })
      res.send(body)
    }
  })
});

// Get daily explore api
app.get('/api/search/photos', function (req, res, next) {

  var query = (typeof req.query['key'] === "undefined") ? '' : req.query['key']
  var page = (typeof req.query['page'] === "undefined") ? '1' : req.query['page']
  var options = {url: URL_PHOTO_SEARCH+'?query='+query+'&page='+page,
             headers: {'authorization':'Client-ID '+CLIENT_ID,'Content-type': 'application/json'},
           strictSSL: true,
          agentClass: Agent,
        agentOptions: {socksHost: '127.0.0.1', socksPort: 1080}
            }

  request(options, function(error, response, body) {
    var body = JSON.parse(body)
    if (!error && response.statusCode == 200) {
      var results = body.results.map(obj => {
        delete obj.links
        delete obj.categories
        delete obj.current_user_collections
        delete obj.user
        delete obj.liked_by_user
        delete obj.sponsored
        delete obj.slug
        delete obj.likes
        delete obj.description
        delete obj.tags
        delete obj.photo_tags

        obj.urls.raw = obj.urls.raw.replace('https://images.unsplash.com', 'https://image.fudao.io/images')
        obj.urls.full = obj.urls.full.replace('https://images.unsplash.com', 'https://image.fudao.io/images')
        obj.urls.regular = obj.urls.regular.replace('https://images.unsplash.com', 'https://image.fudao.io/images')
        obj.urls.small = obj.urls.small.replace('https://images.unsplash.com', 'https://image.fudao.io/images')
        obj.urls.thumb = obj.urls.thumb.replace('https://images.unsplash.com', 'https://image.fudao.io/images')

        return obj
      })
      body.results = results
      res.send(body)
    }
  })
});


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
