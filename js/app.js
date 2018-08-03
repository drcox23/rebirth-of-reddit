console.log("sanity");

// trying to fix the CORS blocker
// var express = require("express");
// var app = express();

// var cors = require("cors");
// var bodyParser = require("body-parser");

// //enables cors
// app.use(
//   cors({
//     allowedHeaders: ["sessionId", "Content-Type"],
//     exposedHeaders: ["sessionId"],
//     origin: "*",
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     preflightContinue: false
// //   })
// // );

// require("./router/index")(app);

// primary reddit URL

let redditURL = "https://www.reddit.com/r/aww.json";

elementCreator = (elem, myClass, parent, content) => {
  const newElem = document.createElement(elem);
  newElem.className = myClass;
  parent.appendChild(newElem);
  if (content) {
    newElem.innerHTML = content;
  }
  return newElem;
};

mediaCreator = (myClass, parent, link) => {
  if (!link.secure_media) {
    let newMedia = document.createElement("img");
    newMedia.className = myClass;
    parent.appendChild(newMedia);

    let theLink = link.url.substring(0, link.url.length);
    let x = link.url.substring(link.url.length - 4);
    if (x === "gifv") {
      theLink = link.url.substring(0, link.url.length - 1);
    }
    console.log("link: ", theLink);

    newMedia.src = theLink;
  } else if (link.secure_media.reddit_video) {
    let newMedia = document.createElement("video");
    // newMedia.play();
    let playPromise = newMedia.play();
    if (playPromise !== undefined) {
      playPromise
        .then(_ => {
          newMedia.pause();
        })
        .catch(error => {});
    }
    newMedia.className = myClass;
    parent.appendChild(newMedia);
    let theLink = link.secure_media.reddit_video.fallback_url;
    newMedia.src = theLink;
  } else {
    let newMedia = document.createElement("img");
    newMedia.className = myClass;
    parent.appendChild(newMedia);
    newMedia.src = link.thumbnail;
  }
};

const getRekd = (url, callback) => {
  const oReq = new XMLHttpRequest();
  oReq.addEventListener("load", callback);
  oReq.open("GET", url);
  oReq.send();
};

firstCall = getRekd(redditURL, res => {
  const callSub = JSON.parse(res.currentTarget.response);
  let posts = callSub.data.children;
  console.log("posts: ", posts);

  for (let i = 0; i < posts.length; i++) {
    console.log(posts[i]);
    console.log(posts[i].data.title);

    let redditItem = elementCreator("div", "redPost", postIt);
    let postTitle = elementCreator(
      "h2",
      "redTitle",
      redditItem,
      posts[i].data.title
    );
    let postInfo = elementCreator(
      "div",
      "postInfo",
      postTitle,
      "by: " +
        posts[i].data.author +
        " • " +
        posts[i].data.subreddit_name_prefixed
    );
    let postMedia = mediaCreator("postMedia", postTitle, posts[i].data);
  }
});
