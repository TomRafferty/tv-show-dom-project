//globals:
const allEpisodes = getAllEpisodes();
const contentEl = document.getElementById("content");

function setup() {
  //all episodes returns an array of
  //objects found in episodes.js
  // eslint-disable-next-line no-undef
  makeCards(allEpisodes);
}

function removeElementTagsFromString(string, openingElementTag, closingElementTag) {
  //removes unwanted element tags from a string e.g "<p>Hello World</p>" = "Hello World"
  let newStr = string.replace(openingElementTag, "");
  return newStr.replace(closingElementTag, "");
}

function liveSearch(str) {
  makeCards(allEpisodes, str);
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
  if(searchTerm !== undefined){
    episodeListCopy = episodeListCopy.filter((episode) => {
      const episodeSum = removeElementTagsFromString(episode.summary, "<p>", "</p>");
      if(episodeSum.includes(searchTerm) || episode.name.includes(searchTerm)){
        console.log(`episode: ${episode.name}}`);
        return true;
      }
    });
  }
  
  //creating all the cards
  episodeListCopy.forEach((episode) => {
    //create card div
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";

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
    subHeadingEl.innerHTML = `SO${episode.season}EP${episode.number}`;
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
window.onload = setup;
