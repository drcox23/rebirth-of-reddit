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
  if (!link.secure_media) {
    let newMedia = document.createElement("img");
    newMedia.className = myClass;
    parent.appendChild(newMedia);

    let theLink = link.url.substring(0, link.length);
    let x = link.url.substring(link.length - 4);
    if (x === "gifv") {
      theLink = link.url.substring(0, link.length - 1);
    }
    // console.log("link: ", theLink);

    newMedia.src = theLink;
  } else if (link.secure_media.reddit_video) {
    let newMedia = document.createElement("video");
    let playPromise = newMedia.play();
    if (playPromise !== undefined) {
      playPromise
        .then(_ => {
          newMedia.pause();
        })
        .catch(erro => {});
    }
    newMedia.className = myClass;
    parent.appendChild(newMedia);

    let theLink = link.secure_media.reddit_video.dash_url;
    newMedia.src = theLink;
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
