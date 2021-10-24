//You can edit ALL of the code here
function setup() {
  //all episodes returns an array of
  //objects found in episodes.js
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  //don't need this right now (not sure if I will)
  // const rootElem = document.getElementById("root");
  // rootElem.textContent = `Got ${episodeList.length} episode(s)`;

  /*
  Pseudo:
  creating the cards for each episode.

  - create a card container

  - for each element in the array:

    . create a div - the card/container

    . create heading element - season+episode+title

    . create img element - img from episode

    . create p element - blurb for episode

  */
}

window.onload = setup;
