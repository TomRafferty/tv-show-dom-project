//globals:
const contentEl = document.getElementById("content");
const selectShowEl = document.getElementById("select-show");
const selectEpisodeEl = document.getElementById("select-episode");
let currentShow = selectShowEl.value;
console.log(currentShow);
//not using live data, just for testing on shows.
let allShows = getAllShows();
let allShowsCopy = allShows;

function setup() {
  //all episodes returns an array of
  //objects found in episodes.js
  // eslint-disable-next-line no-undef
  makeCards(allEpisodes);
  if (currentShow !== undefined && currentShow !== "" && currentShow !== null) {
    populateSelectEpisodes(currentShow);
  }
  populateShowList(allShows);
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

function populateShowList(showArray) {
  const showIds = showArray.map((show) => show.id);
  for (let i = 0; i < showIds.length; i++) {
    const newOption = document.createElement("option");
    //I use the ID just for selection
    newOption.value = showIds[i];
    newOption.textContent = showArray[i].name;
    selectShowEl.appendChild(newOption);
  }
}
function selectShow(showId) {
  currentShow = allShowsCopy.filter(x => x.id === showId);
  setup();
}

function populateSelectEpisodes(showName) {
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

//from this point down is all to do with episodes and displaying them
let allEpisodes;
if (currentShow !== null || currentShow !== undefined || currentShow !== "") {
  allEpisodes = fetch(
    //getting type error here... shouldn't be running if currentShow is undefined though
    `https://api.tvmaze.com/shows/${currentShow["id"]}/${currentShow["name"].replaceAll(" ","-")}`
  )
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
}

//card container section
const cardContainer = document.createElement("section");
cardContainer.setAttribute.id = "card-container";
contentEl.appendChild(cardContainer);
function makeCards(episodeList, searchTerm) {
  cardContainer.innerHTML = "";

  if (currentShow !== null || currentShow !== undefined) {
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
}

/*NOTE TO SELF: research why we are using this way and not just calling in the js
|
V             */
window.onload = setup();
