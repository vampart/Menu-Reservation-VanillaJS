window.addEventListener("DOMContentLoaded", loadIngredientsFromExternalSource);

    const orderList = document.getElementById("orderList");
    const totalPrice = document.getElementById("totalPrice");
    const addOrderButton = document.getElementById("addOrder");
    const favoriteDrinkButton = document.getElementById("favoriteDrink");
    const placeOrderButton = document.getElementById("placeOrder");
    const typeSelect = document.getElementById("type");
    const baseSelect = document.getElementById("base");
    const currentDrinkDetails = document.getElementById("currentDrinkDetails");
    const currentDrinkPrice = document.getElementById("currentDrinkPrice");
    const extrasContainer = document.getElementById("extras");

    const orders = [];
    let currentDrink = null;

    typeSelect.addEventListener("change", updateBaseOptions);
    addOrderButton.addEventListener("click", addOrder);
    favoriteDrinkButton.addEventListener("click", addFavoriteDrink);
    placeOrderButton.addEventListener("click", placeOrder);
    document.getElementById("size").addEventListener("change", updateCurrentDrink);
    document.getElementById("ingredients").addEventListener("change", updateCurrentDrink);
    baseSelect.addEventListener("change", updateCurrentDrink);
    const extrasCheckboxes = document.querySelectorAll("#extras input[type='checkbox']");
    extrasCheckboxes.forEach(checkbox => checkbox.addEventListener("change", updateCurrentDrink));

    function updateBaseOptions() {
      const type = typeSelect.value;
      const baseSelect = document.getElementById("base");
      baseSelect.innerHTML = "";
      extrasContainer.style.display = "none";

      if (type === "Smoothie") {
        addBaseOption("Apple Juice", true);
        addBaseOption("Orange Juice");
      } else if (type === "Milkshake") {
        addBaseOption("Whole Milk");
        addBaseOption("Semi-Skimmed Milk", true);
        addBaseOption("Skimmed Milk");
        addBaseOption("Soya Milk");
        addBaseOption("Oat Milk");
        extrasContainer.style.display = "block";
      } else
      addBaseOption("Select Type Drink First", true);
      displayCurrentDrink();
    }

    function addBaseOption(value, selected = false) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      option.selected = selected;
      baseSelect.appendChild(option);
    }

    function addOrder() {
      if (!currentDrink) {
        alert("Choose your drink first");
        return;
      }

      const order = { ...currentDrink };
      order.extras = Array.from(
        document.querySelectorAll("#extras input[type='checkbox']:checked"),
        checkbox => checkbox.value
      );
      orders.push(order);

      resetCurrentDrink();
      displayCurrentOrder();
    }

    function addFavoriteDrink() {
      const favoriteDrink = {
        size: "Medium",
        type: "Smoothie",
        ingredients: ["Banana", "Raspberries"],
        base: "Apple Juice",
        extras: []
      }

      orders.push(favoriteDrink);

      resetCurrentDrink();
      displayCurrentOrder();
    }

    function placeOrder() {
      if (orders.length === 0) {
        alert("Add your order first.");
        return;
      }

      alert("Succes place your order.");
      orders.length = 0;
      displayCurrentOrder();
    }

    function resetCurrentDrink() {
      currentDrink = null;
      currentDrinkDetails.textContent = "";
      currentDrinkPrice.textContent = "";
      extrasCheckboxes.forEach(checkbox => checkbox.checked = false);
    }

    function calculatePrice(size, ingredients, base, extras) {
      let basePrice = 0.0;

      switch (size) {
        case "Small":
          basePrice += 2.50;
          break;
        case "Medium":
          basePrice += 3.00;
          break;
        case "Large":
          basePrice += 3.55;
          break;
        case "Extra Large":
          basePrice += 4.20;
          break;
        default:
          break;
      }

      ingredients.forEach(ingredient => {
        basePrice += 0.5;
      });

      if (base === "Whole Milk" || base === "Semi-Skimmed Milk") {
        basePrice += 0.5;
      }

      if (extras.length > 0) {
        basePrice += extras.length * 0.75;
      }

      return basePrice;
    }

    function displayCurrentDrink() {
      if (!currentDrink) {
        currentDrinkDetails.textContent = "Small Cup Price Only";
        currentDrinkPrice.textContent = "$2.5";
        return;
      }

      const { size, type, ingredients, base } = currentDrink;
      const extras = Array.from(
        document.querySelectorAll("#extras input[type='checkbox']:checked"),
        checkbox => checkbox.value
      );

      const details = `${size} ${type}: ${ingredients.join(", ")} with ${base}`;
      const price = `Price: $${calculatePrice(size, ingredients, base, extras).toFixed(2)}`;

      currentDrinkDetails.textContent = details;
      currentDrinkPrice.textContent = price;
    }

    function updateCurrentDrink() {
      const size = document.getElementById("size").value;
      const type = typeSelect.value;
      const ingredients = Array.from(
        document.querySelectorAll("#ingredients option:checked"),
        option => option.value
      );
      const base = baseSelect.value;

      currentDrink = {
        size,
        type,
        ingredients,
        base,
        extras: []
      };

      displayCurrentDrink();
    }

    function displayCurrentOrder() {
      orderList.innerHTML = "";
      totalPrice.textContent = "";

      orders.forEach(order => {
        const { size, type, ingredients, base, extras } = order;
        const extrasText = extras.length > 0 ? ` with ${extras.join(", ")}` : "";
        const details = `${size} ${type}: ${ingredients.join(", ")} with ${base}`;
        const price = `Price: $${calculatePrice(size, ingredients, base, extras).toFixed()}`;
        const listItem = document.createElement("li");
        listItem.textContent = `${details}${extrasText} ${price}`;
        orderList.appendChild(listItem);
      });

      const total = orders.reduce(
        (sum, order) =>
          sum + calculatePrice(order.size, order.ingredients, order.base, order.extras),
        0
      );
      totalPrice.textContent = `Total Price: $${total.toFixed(2)}`;
    }

    
    updateBaseOptions();

const saveFavouriteButton = document.getElementById("saveFavouriteButton");
const orderFavouriteButton = document.getElementById("orderFavouriteButton");


function saveFavouriteDrink() {
  if (!currentDrink) {
  	alert("Choose your current order first");
    return;
  }

  const favouriteDrink = {
    details: currentDrink,
    price: calculatePrice(currentDrink.size, currentDrink.ingredients, currentDrink.base, currentDrink.extras)
  };

  localStorage.setItem("favouriteDrink", JSON.stringify(favouriteDrink));
}


function isFavouriteDrinkSaved() {
  return localStorage.getItem("favouriteDrink") !== null;
}


function orderFavouriteDrink() {
  const favouriteDrink = JSON.parse(localStorage.getItem("favouriteDrink"));
  if (favouriteDrink) {
    const { details, price } = favouriteDrink;
    orders.push(details);
    displayCurrentOrder();
    displayCurrentDrink();
    message.textContent = `Pesanan favourite berhasil ditambahkan ke dalam order (Price: $${price.toFixed(2)})`;
  }
}


saveFavouriteButton.addEventListener("click", saveFavouriteDrink);


orderFavouriteButton.addEventListener("click", orderFavouriteDrink);


function updateFavouriteButtonsStatus() {
  if (currentDrink && currentDrink.size && currentDrink.type && currentDrink.ingredients.length > 0) {
    saveFavouriteButton.disabled = false;
  } else {
    saveFavouriteButton.disabled = true;
  }

  if (isFavouriteDrinkSaved()) {
    orderFavouriteButton.disabled = false;
  } else {
    orderFavouriteButton.disabled = true;
  }
}

sizeSelect.addEventListener("change", updateFavouriteButtonsStatus);
typeSelect.addEventListener("change", updateFavouriteButtonsStatus);
ingredientsContainer.addEventListener("change", updateFavouriteButtonsStatus);

function loadIngredientsFromExternalSource() {
  fetch("./ingredients.json")
    .then(response => response.json())
    .then(data => {
    
      ingredients = data;

      displayIngredients();
    })
    .catch(error => {
      console.error("Error loading ingredients:", error);
    });
}

