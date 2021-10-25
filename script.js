const contentEl = document.getElementById("content");
function setup() {
  //all episodes returns an array of
  //objects found in episodes.js
  const allEpisodes = getAllEpisodes();
  makeCards(allEpisodes);
}

function removeElementTagsFromString(string, openingElementTag, closingElementTag){
  //removes unwanted element tags from a string e.g "<p>Hello World</p>" = "Hello World"
  let newStr = string.replace(openingElementTag, "");
  return newStr.replace(closingElementTag, "");
}

function makeCards(episodeList) {
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
  //creating the cards
  const cardContainer = document.createElement("section");
  cardContainer.id = "card-container";
  contentEl.appendChild(cardContainer);

  episodeList.forEach(episode => {
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
    paraEl.textContent = removeElementTagsFromString(episode.summary, "<p>", "</p>");
    paraEl.className = "card-para";
    cardElementsDiv.appendChild(paraEl);


    //append card
    cardDiv.appendChild(cardElementsDiv);
    cardContainer.appendChild(cardDiv);
  });
}

/*NOTE TO SELF: research why we are using this way and not just calling in the js
|
V
*/
window.onload = setup;
