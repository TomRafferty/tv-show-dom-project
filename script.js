//globals:
const contentEl = document.getElementById("content");
const selectEpisodeEl = document.getElementById("select-episode");
const selectShowEl = document.getElementById("show-select");

let allEpisodes;
//no need to wrap this fetch in a function as it is needed right from the
//get go whereas episodes are fetched once a show has been chosen.
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
  return fetch(`https://api.tvmaze.com/shows/${selectedShowID}/episodes`)
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
  //most functionality relies on the show data so we await that
  await allShows;

  if (selectShowEl.childNodes.length <= 3) {
    populateSelectShow();
  }
  if (currentShowID !== "none") {
    //this code block will run when a show has been selected
    await getEpisodesForShow(currentShowID);
    await allEpisodes;
    //both below functions rely on episode data so we await it
    makeCards();
    getEpisodesForShow(currentShowID);
  }
}

function removeElementTagsFromString(
  string,
  openingElementTag,
  closingElementTag
) {
  //removes unwanted element tags from a string e.g "<p>Hello World</p>" = "Hello World"
  // let newStr = string.replaceAll(openingElementTag, "");
  // return newStr.replaceAll(closingElementTag, "");
  return string
    .replaceAll(openingElementTag, "")
    .replaceAll(closingElementTag, "");
}

function liveSearch(str) {
  //just passes a string from the livesearch input into the makeCards() function
  makeCards(str);
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
  //this doesn't need to be called as sort apparently
  //effect the original array.
  //I have to do a lot of research on sort! - this was mostly
  //from MDN.
  const sortedShows = allShows.sort(function (a, b) {
    const showA = a.name.toUpperCase();
    const showB = b.name.toUpperCase();
    if (showA < showB) {
      return -1;
    }
    if (showA > showB) {
      return 1;
    }
    return 0;
  });
  //populate select element with shows
  for (let i = 0; i < allShows.length; i++) {
    const newOption = document.createElement("option");
    //we need the ID as a value to easily identify the selected show.
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
  //clear episode list
  selectEpisodeEl.innerHTML =
    "<option value=\"\" selected>Select Episode</option>"; //making sure to add the Select Episode hint
  //jump to current selected option
  const selectedEpisode = document.getElementById(episode);
  selectedEpisode.scrollIntoView();
}

//card container section
const cardContainer = document.createElement("section");
cardContainer.id = "card-container";
contentEl.appendChild(cardContainer);

function makeCards(searchTerm) {
  //reset the cards
  cardContainer.innerHTML = "";

  //copy the array so as to not effect original list
  let episodeListCopy = allEpisodes;

  //apply search filter
  const resultCount = document.getElementById("result-count");
  if (searchTerm !== undefined) {
    //this will execute when if the user has typed in the live search
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
      //this simply decides whether to show the result count
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
/*
to do:
- add some nice css
- remove 'select show' from show selector when a show is selected
- anchor the search and filtering functions to the top of the screen.

*/
