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
        posts[i].data.num_comments +
        " Comments" +
        " • " +
        posts[i].data.subreddit_name_prefixed
    );
  }
});
