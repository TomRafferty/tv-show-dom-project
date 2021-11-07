//globals:
const contentEl = document.getElementById("content");
const selectEpisodeEl = document.getElementById("select-episode");
const selectShowEl = document.getElementById("show-select");

let allEpisodes;
let allShows = fetch("https://api.tvmaze.com/shows")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    allShows = data;
  })
  .catch(function (error) {
    console.log(`ERROR - ${error}`);
  });
// const allEpisodes = getAllEpisodes();
function getEpisodesForShow(selectedShowID) {
  allEpisodes = fetch(`https://api.tvmaze.com/shows/${selectedShowID}/episodes`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      allEpisodes = data;
      populateSelectEpisodes();
    })
    .catch(function (error) {
      console.log(`ERROR - ${error}`);
    });
}

async function setup() {
  let currentShowID = selectShowEl.value;
  await allShows;
  //this just ensures that the list doesn't keep adding up
  if (selectShowEl.childNodes.length <= 3) {
    populateSelectShow();
  }
  if (currentShowID !== "none") {
    await allEpisodes;
    makeCards();
    getEpisodesForShow();
  }
}

function removeElementTagsFromString(
  string,
  openingElementTag,
  closingElementTag
) {
  //removes unwanted element tags from a string e.g "<p>Hello World</p>" = "Hello World"
  let newStr = string.replaceAll(openingElementTag, "");
  return newStr.replaceAll(closingElementTag, "");
}

function liveSearch(str) {
  makeCards(allEpisodes, str);
}

function numberFormatter(number) {
  //this is formats episode and season numbers to use
  //minimum 2 digit format
  if (number >= 10) {
    return `${number}`;
  } else {
    return `0${number}`;
  }
}

function populateSelectShow() {
  for (let i = 0; i < allShows.length; i++) {
    const newOption = document.createElement("option");
    newOption.value = allShows[i].id;
    newOption.textContent = allShows[i].name;
    selectShowEl.appendChild(newOption);
  }
}

function populateSelectEpisodes() {
  //adds all the episodes to the select-episode <select> as options.
  for (let i = 0; i < allEpisodes.length; i++) {
    const newEpisode = document.createElement("option");
    //the values must = names of episodes to be filtered as a search term
    newEpisode.value = allEpisodes[i].name;
    newEpisode.text = `SE${numberFormatter(
      allEpisodes[i].season
    )}EP${numberFormatter(allEpisodes[i].number)}`;
    selectEpisodeEl.appendChild(newEpisode);
  }
}
function jumpToEpisode(episode) {
  //this function simply jumps to the selected episode
  //clear the search
  liveSearch("");
  //jump to current selected option
  const selectedEpisode = document.getElementById(episode);
  selectedEpisode.scrollIntoView();
}

//card container section
const cardContainer = document.createElement("section");
cardContainer.id = "card-container";
contentEl.appendChild(cardContainer);

function makeCards(searchTerm) {
  cardContainer.innerHTML = "";

  //so as to not effect original list
  let episodeListCopy = allEpisodes;

  //apply search filter
  const resultCount = document.getElementById("result-count");
  if (searchTerm !== undefined) {
    episodeListCopy = episodeListCopy.filter((episode) => {
      const episodeSum = removeElementTagsFromString(
        episode.summary,
        "<p>",
        "</p>"
      );
      if (
        episodeSum.toLowerCase().includes(searchTerm.toLowerCase()) ||
        episode.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return true;
      }
    });
    //add search count
    resultCount.innerHTML = `Results: ${episodeListCopy.length}/${allEpisodes.length}`;
    if (searchTerm.length === 0) {
      resultCount.innerHTML = "";
    }
  }

  //creating all the cards
  episodeListCopy.forEach((episode) => {
    //create card div
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.id = `${episode.name}`; //this is for the select scroll to

    //create card elements div
    const cardElementsDiv = document.createElement("div");
    cardElementsDiv.className = "card-elements";

    //create heading
    const headingEl = document.createElement("h2");
    headingEl.innerHTML = `${episode.name}`;
    headingEl.className = "card-heading";
    cardElementsDiv.appendChild(headingEl);
    //create subheading (season number and episode code)
    const subHeadingEl = document.createElement("h3");
    subHeadingEl.innerHTML = `SE-${numberFormatter(
      episode.season
    )} EP-${numberFormatter(episode.number)}`;
    subHeadingEl.className = "card-sub-heading";
    cardElementsDiv.appendChild(subHeadingEl);

    //create image
    const imageEl = document.createElement("img");
    imageEl.src = episode.image.medium;
    imageEl.className = "card-image";
    cardElementsDiv.appendChild(imageEl);

    //create para
    const paraEl = document.createElement("p");
    paraEl.textContent = removeElementTagsFromString(
      episode.summary,
      "<p>",
      "</p>"
    );
    paraEl.className = "card-para";
    cardElementsDiv.appendChild(paraEl);

    //append card
    cardDiv.appendChild(cardElementsDiv);
    cardContainer.appendChild(cardDiv);
  });
}

/*NOTE TO SELF: research why we are using this way and not just calling in the js
|
V             */
// window.onload = setup;
setup();
