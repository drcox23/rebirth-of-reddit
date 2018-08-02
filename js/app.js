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
  const newMedia = document.createElement("img");
  newMedia.className = myClass;
  parent.appendChild(newMedia);

  let theLink = link.substring(0, link.length);
  let x = link.substring(link.length - 4);
  if (x === "gifv") {
    theLink = link.substring(0, link.length - 1);
  }
  // console.log("link: ", theLink);

  newMedia.src = theLink;
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

    let redditItem = elementCreator("div", "redPost", company);
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
    let postMedia = mediaCreator("postMedia", postTitle, posts[i].data.url);
  }
});
