require('dotenv').config();

const express = require('express');
const app = express();
const Video = require('./models/video');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/wherecaniwatch", { useNewUrlParser: true, useUnifiedTopology: true });

// @route    GET /
// @desc     Get index page
// @access   Public
app.get('/', async (req, res) => {
    try {
      const contents = await Video.find().populate("sources");

      res.render("index", {title: "Where Can I Watch", contents});
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

// @route    GET /content/movies
// @desc     Get movies
// @access   Public
app.get('/content/movies', async (req, res) => {
  try {
    const movies = await Video.find({
      category: "Movie"
    }).populate("sources");

    res.render("movies", {title: "Where Can I Watch Movies", movies});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET /content/shows
// @desc     Get shows
// @access   Public
app.get('/content/shows', async (req, res) => {
  try {
    const shows = await Video.find({
      category: "Show"
    }).populate("sources");

    res.render("shows", {title: "Where Can I Watch Shows", shows});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET /content/animes
// @desc     Get animes
// @access   Public
app.get('/content/animes', async (req, res) => {
  try {
    const animes = await Video.find({
      category: "Anime"
    }).populate("sources");

    res.render("animes", {title: "Where Can I Watch Anime", animes});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET /content/:contentId
// @desc     Get content by ID
// @access   Public
app.get('/content/id/:contentId', async (req, res) => {
  try {
    const content = await Video.findOne({
      _id: req.params.contentId
    }).populate("sources");

    res.render("content", {title: content.title, content});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route    GET /create
// @desc     Get create video page
// @access   Public
app.get('/create', async (req, res) => {
  try {
      res.render("create", {title: "Create Video"});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST /create/video
// @desc     Create video
// @access   Private
app.post('/create', async (req, res) => {
  try {
    if(req.body.password === process.env.PASSWORD){
      const video = new Video({
        title: req.body.title,
        thumbnail: req.body.thumbnail,
        category: req.body.category,
        description: req.body.description,
        sources: [{
          name: req.body.sourceName,
          link: req.body.sourceLink
        }]
      });

      video.save();
      return res.redirect('/');
    } else {
      throw new Error('Incorrect password');
    }
  } catch (err) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));