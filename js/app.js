console.log("sanity");

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
  // if its an image or gif

  if (link.post_hint === "image") {
    let newMedia = document.createElement("img");
    newMedia.className = myClass;
    parent.appendChild(newMedia);

    let theLink = link.url.substring(0, link.url.length);
    let x = link.url.substring(link.url.length - 4);
    if (x === "gifv") {
      theLink = link.url.substring(0, link.url.length - 1);
    }
    // console.log("link: ", theLink);

    newMedia.src = theLink;

    // if its a video
  } else if (link.post_hint === "hosted: video") {
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
  } else if (
    link.post_hint === "link" &&
    link.url.substring(0, link.url.length - 4 === ".com")
  ) {
    let newMedia = document.createElement("img");
    newMedia.className = myClass;
    parent.appendChild(newMedia);
    let theLink = link.url.substring(0, link.url.length);
    let x = link.url.substring(link.url.length - 4);
    if (x === "gifv") {
      theLink = link.url.substring(0, link.url.length - 1);
      newMedia.src = theLink;
    } else {
      newMedia.src = link.thumbnail;
    }
  } else {
    let newMedia = document.createElement("img");
    newMedia.className = myClass;
    parent.appendChild(newMedia);
    let theLink = link.url.substring(0, link.url.length);
    let x = link.url.substring(link.url.length - 4);
    if (x === "gifv") {
      theLink = link.url.substring(0, link.url.length - 1);
      newMedia.src = theLink;
    } else {
      newMedia.src = link.thumbnail;
    }
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
    // console.log(posts[i]);
    // console.log(posts[i].data.title);

    let redditItem = elementCreator("div", "redPost", postIt);
    let postMedia = mediaCreator("postMedia", redditItem, posts[i].data);
    let infoDiv = elementCreator("div", "infoDiv", redditItem);
    let postTitle = elementCreator(
      "h2",
      "redTitle",
      infoDiv,
      posts[i].data.title
    );
    let postInfo = elementCreator(
      "div",
      "postInfo",
      infoDiv,
      "by: " +
        posts[i].data.author +
        " • " +
        posts[i].data.num_comments +
        " Comments"
      // + " • " +
      // posts[i].data.subreddit_name_prefixed
    );
  }
  console.log;

  let titleDiv = document.getElementsByClassName("redTitle");
  for (i = 0; i < titleDiv.length; i++) {
    console.log("char: " + [i], titleDiv[i].innerHTML.length);
    if (titleDiv[i].innerHTML.length > 65) {
      console.log("****");
      titleDiv[i].innerHTML = titleDiv[i].innerHTML.substring(0, 65) + "...";
    } else {
      titleDiv[i].innerHTML;
    }
    console.log("title: ", titleDiv[i].innerHTML);
  }
});
