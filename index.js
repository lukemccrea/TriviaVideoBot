const puppeteer = require('puppeteer');
const axios = require("axios");
const videoshow = require('videoshow');

let title = '';

//Load trivia question from api.
let options = {
  method: 'GET',
  url: 'https://the-trivia-api.com/api/questions',
};

axios.request(options).then(async function(response) {
  title = response.data[1].question;
  
  //Set the answers variable to array of answers from api.
  let answers = response.data[1].incorrectAnswers;
  answers.push(response.data[1].correctAnswer)

  //Shuffle the answers array.
  shuffle(answers);

  //Create HTML page from Question.
  let html = `
  <div id='container'>
    <div id='question'>
      <h1>
        ${title}
      </h1>
    </div>
    <div id='answers'>
      <div>
        ${answers[0]}
      </div>
      <div>
        ${answers[1]}
      </div>
      <div>
        ${answers[2]}
      </div>
      <div>
        ${answers[3]}
      </div>
    </div>
  </div>
  <style>
  body {
    margin: 0px;
    width: 1080px;
    height: 1920px;
  }

  #container {
    width: 1000px;
    height: 1920px;
    background: rgb(21, 145, 246);
    background: linear-gradient(0deg, rgba(21, 145, 246, 1) 0%, rgba(0, 4, 161, 1) 100%);
    display: block;
    padding: 40px;
    font-family: Arial;
  }

  #question {
    background-color: white;
    display: block;
    border-radius: 20px;
    padding: 10px;
    padding-left: 40px;
    padding-right: 40px;
  }

  #question h1 {
    font-size: 80px;
  }

  #answers {
    width: 100%;
    margin-top: 160px;
  }

  #answers div {
    display: block;
    padding: 20px;
    margin: 40px;
    border-radius: 20px;
    font-size: 60px;
    background-color: #8ffff6;
  }
  </style>
  `;

  //Take a screenshot of the HTML code.
  await getScreenshot(html, 'slide1.jpg')

  //Create a new HTML page from Question where correct answer is green.
  html = `<div id='container'>
  <div id='question'>
    <h1>
      ${title}
    </h1>
  </div>
  <div id='answers'>
      <div style='background-color: ${answers[0] == response.data[1].correctAnswer ? '#5afa62' : '#8ffff6'}'>
        ${answers[0]}
      </div>
      <div style='background-color: ${answers[1] == response.data[1].correctAnswer ? '#5afa62' : '#8ffff6'}'>
        ${answers[1]}
      </div>
      <div style='background-color: ${answers[2] == response.data[1].correctAnswer ? '#5afa62' : '#8ffff6'}'>
        ${answers[2]}
      </div>
      <div style='background-color: ${answers[3] == response.data[1].correctAnswer ? '#5afa62' : '#8ffff6'}'>
        ${answers[3]}
      </div>
  </div>
  <style>
  body {
  margin: 0px;
  width: 1080px;
  height: 1920px;
  }

  #container {
  width: 1000px;
  height: 1920px;
  background: rgb(21, 145, 246);
  background: linear-gradient(0deg, rgba(21, 145, 246, 1) 0%, rgba(0, 4, 161, 1) 100%);
  display: block;
  padding: 40px;
  font-family: Arial;
  }

  #question {
  background-color: white;
  display: block;
  border-radius: 20px;
  padding: 10px;
  padding-left: 40px;
  padding-right: 40px;
  }

  #question h1 {
  font-size: 80px;
  }

  #answers {
  width: 100%;
  margin-top: 160px;
  }

  #answers div {
  display: block;
  padding: 20px;
  margin: 40px;
  border-radius: 20px;
  font-size: 60px;
  background-color: #8ffff6;
  }
  </style>
  `;

  //Take a screenshot of the new HTML code.
  await getScreenshot(html, 'slide2.jpg')
  
  //Make video from slides
  makeVideo([
    {path: 'slide1.jpg', loop: 7}, 
    {path: 'slide2.jpg', loop: 3}
  ])

}).catch(function(error) {
  console.error(error);
});

//Take a screenshot of html code and save it to a path.
async function getScreenshot(html, path){
  // Create a browser instance
  const browser = await puppeteer.launch();

  // Create a new page
  const page = await browser.newPage();

  // Set viewport width and height
  await page.setViewport({ width: 1080, height: 1920 });

  // Open URL in current page
  await page.goto('about:blank', { waitUntil: 'networkidle0' });
  await page.setContent(html)

  // Capture screenshot
  await page.screenshot({
    path: path,
  });

  // Close the browser instance
  await browser.close();
  console.log(`Successfully saved screenshot as ${path}`)
};

function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

//Create a video from images using Videoshow.
async function makeVideo(slides){
   
  var videoOptions = {
    fps: 30,
    loop: 7, // seconds
    transition: false,
    videoBitrate: 1024,
    videoCodec: 'libx264',
    size: '1080x1920?',
    audioBitrate: '128k',
    audioChannels: 2,
    format: 'mp4',
    pixelFormat: 'yuv420p'
  }
   
  videoshow(slides, videoOptions)
    .audio('music.mp3')
    .save('video.mp4')
    .on('start', function (command) {
      console.log('ffmpeg process started:', command)
    })
    .on('error', function (err, stdout, stderr) {
      console.error('Error:', err)
      console.error('ffmpeg stderr:', stderr)
    })
    .on('end', function (output) {
      console.error('Video created in:', output)
    })
}