//globals:
//TV Show data not live yet
let allShows = getAllShows();
// const allEpisodes = getAllEpisodes();
let allEpisodes = fetch("https://api.tvmaze.com/shows/82/episodes")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    allEpisodes = data;
    setup();
  })
  .catch(function (error) {
    console.log(`ERROR - ${error}`);
  });

const contentEl = document.getElementById("content");
const selectEl = document.getElementById("select-episode");

function setup() {
  //all episodes returns an array of
  //objects found in episodes.js
  // eslint-disable-next-line no-undef
  makeCards(allEpisodes);
  populateSelectEpisodes();
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

function populateSelectEpisodes() {
  //adds all the episodes to the select-episode <select> as options.
  for (let i = 0; i < allEpisodes.length; i++) {
    const newEpisode = document.createElement("option");
    //the values must = names of episodes to be filtered as a search term
    newEpisode.value = allEpisodes[i].name;
    newEpisode.text = `SE${numberFormatter(
      allEpisodes[i].season
    )}EP${numberFormatter(allEpisodes[i].number)}`;
    selectEl.appendChild(newEpisode);
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

function makeCards(episodeList, searchTerm) {
  cardContainer.innerHTML = "";

  //so as to not effect original list
  let episodeListCopy = episodeList;

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
    resultCount.innerHTML = `Results: ${episodeListCopy.length}/${episodeList.length}`;
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
