// Bring in the data object from the data.js file
const data = window.data;

// References
const bigCoffee = document.getElementById('big_coffee');
const producerContainer = document.getElementById('producer_container');

/**
 * displays the updated coffee quantity
 * @param {number} coffeeQty the updated coffee quantity
 */
function updateCoffeeView(coffeeQty) {
  const coffeeCounter = document.getElementById('coffee_counter');
  coffeeCounter.innerText = coffeeQty;
}

/**
 * increments the coffee quantity by one and render
 * @param {object} data the data object
 */
function clickCoffee(data) {
  data.coffee += 1;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**
 * unlocks producers whose coffee count is >= 1/2 the producer's price
 * @param {object[]} producers an array of objects (producers) 
 * @param {number} coffeeCount the coffee count
 */
function unlockProducers(producers, coffeeCount) {
  producers.forEach(producer => {
    if(coffeeCount >= producer.price / 2){
      producer.unlocked = true;
    }
  });
}
/**
 * filters the producers whose unlocked property is true
 * @param {object} data the data object
 * @returns an array with only the producers whose unlocked property is true
 */
function getUnlockedProducers(data) {
  return data.producers.filter(producer => producer.unlocked === true);
}

/**
 * adjusts the producer's name from its id
 * @param {string} id the producer's id
 * @returns a string holding the producer's name
 */
function makeDisplayNameFromId(id) {
  return id
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * makes an HTML string that presents the producer
 * @param {object} producer an object producer
 * @returns an HTML string presenting the producer
 */
function makeProducerDiv(producer) {
  const containerDiv = document.createElement("div");
  containerDiv.className = "producer";
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
    <div class="producer-column">
      <div class="producer-title">${displayName}</div>
      <button type="button" id="buy_${producer.id}">Buy</button>
    </div>
    <div class="producer-column">
      <div>Quantity: ${producer.qty}</div>
      <div>Coffee/second: ${producer.cps}</div>
      <div>Cost: ${currentCost} coffee</div>
    </div>
    `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

/**
 * displays the updated coffee quantity
 * @param {number} coffeeQty the updated coffee count
 * @returns a boolean value
 */
function deleteAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function renderProducers(data) {
  unlockProducers(data.producers, data.coffee);
  const producerContainer = document.getElementById('producer_container');
  
  deleteAllChildNodes(producerContainer)
  
  getUnlockedProducers(data).forEach((producer) => {
    producerContainer.appendChild(makeProducerDiv(producer));
  });

  // Event Listeners
  const buyButtons = document.querySelectorAll('.producer-column button');
  buyButtons.forEach(el => el.addEventListener('click', (event) => buyButtonClick(event,data)));
}

//////
function getProducerById(data, producerId) {
  return data.producers.find((producer) => producerId === producer.id);
}

////
function canAffordProducer(data, producerId) {
  return getProducerById(data, producerId).price <= data.coffee;
}

/////
function updateCPSView(cps) {
  const cpsDiv = document.getElementById("cps");
  cpsDiv.innerText = cps;
}

/////
function updatePrice(oldPrice) {
  return Math.floor(oldPrice * 1.25);
}

/////
function attemptToBuyProducer(data, producerId) {
  if (canAffordProducer(data, producerId)) {
    const producer = getProducerById(data, producerId);
    data.coffee -= producer.price;
    producer.qty += 1;
    producer.price = updatePrice(producer.price);
    data.totalCPS += producer.cps;
    return true;
  } else {
    return false;
  }
}

/////
function buyButtonClick(event, data) {
  if (event.target.tagName === "BUTTON") {
    const producerId = event.target.id.slice(4);
    const result = attemptToBuyProducer(data, producerId);
    if (!result) {
      window.alert("Not enough coffee!");
    } else {
      renderProducers(data);
      updateCoffeeView(data.coffee);
      updateCPSView(data.totalCPS);
    }
  }
}

function tick(data) {
  data.coffee += data.totalCPS;

  updateCoffeeView(data.coffee);

  renderProducers(data);
}

// Event Listener
bigCoffee.addEventListener('click', () => clickCoffee(data));

// Repeat every 1 second
setInterval(() => tick(data), 1000);