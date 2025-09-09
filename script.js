const plantsApi = "https://openapi.programming-hero.com/api/plants";
const categoriesApi = "https://openapi.programming-hero.com/api/categories";
const categoryList = document.getElementById("category-list");
const cardContainer = document.getElementById("card-container");
cardContainer.innerHTML = "<p class='block w-[100%] sm:py-15 py-5 text-center mx-auto justify-center'>Loading.....</p>";

function loadData(apiUrl) {
  const data = fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => data)
    .catch((error) => console.error("Error fetching data:", error));
  return data;
}


function createElementPlantContainer() {
  loadData(plantsApi).then((data) => {
    if (data.plants && data.plants.length > 0) {
      cardContainer.innerHTML = "";
      data.plants.forEach((plant) => {
        const card = document.createElement("div");
        card.classList.add("card", "bg-white", "p-2", "rounded-lg", "shadow-lg", "h-[410px]");
        card.innerHTML = `
          <div class="image-wrapper w-full rounded-lg">
            <img src="${plant.image}" alt="${plant.name}" class="w-full h-full">
          </div>
          <div class="flex flex-col h-full justify-between">
            <h4 class="text-lg font-bold mt-2">${plant.name}</h4>
            <p class="text-sm mb-2">${plant.description}</p>
            <div class="flex justify-between mb-2">
              <span class="text-[12px] bg-[#dcfce7] text-[#15803d] p-0.4 px-1.5 rounded-2xl">${plant.category}</span>
              <span class="text-[12px] font-bold">${plant.price}</span>            
            </div>
            <button onClick="addToCart(${plant.id})" class="btn rounded-4xl btn-secondary bg-[#15803d]">Add to Cart</button>
          </div>
        `;
        cardContainer.appendChild(card);
      });
    } else {
      cardContainer.innerHTML = "<p class='text-center'>No plants available.</p>";
    }
  });
}
createElementPlantContainer();

loadData(categoriesApi).then((data) => {
  if (data.categories && data.categories.length > 0 && data.categories[0].name !== "") {
    data.categories.forEach((category) => {
      const listItem = document.createElement("p");
      listItem.classList.add("mb-2", "px-3", "py-1", "text-[#15803d]", "rounded-md", "cursor-pointer", "align-center");
      listItem.innerText = category.category_name;
      categoryList.appendChild(listItem);

      listItem.addEventListener("click", () => {
        listItem.classList.add("bg-[#15803d]");
        listItem.classList.add("text-[#ffffff]");
        const siblings = categoryList.children;
        for (let i = 0; i < siblings.length; i++) {
          if (siblings[i] !== listItem) {
            siblings[i].classList.remove("bg-[#15803d]");
            siblings[i].classList.remove("text-[#ffffff]");
          }
        }
        if(category.category_name === "All Trees"){
          cardContainer.innerHTML = "";
          createElementPlantContainer();
        } else {
          cardContainer.innerHTML = "<p class='block w-[100%] sm:py-15 py-5 text-center mx-auto justify-center'>Loading.....</p>";
          loadData(plantsApi).then((data) => {
            if (data.plants && data.plants.length > 0 && data.plants[0].name !== "") {
              cardContainer.innerHTML = "";
              data.plants.forEach((plant) => {
                if (plant.category === category.category_name) {
                  const card = document.createElement("div");
                  card.classList.add("card", "bg-white", "p-2", "rounded-lg", "shadow-lg", "h-[410px]");
                  card.innerHTML = `
                    <div class="image-wrapper w-full">
                      <img src="${plant.image}" alt="${plant.name}" class="w-full h-full">
                    </div>
                    <div class="flex flex-col h-full justify-between">
                      <h4 class="text-lg font-bold mt-2">${plant.name}</h4>
                      <p class="text-sm mb-2">${plant.description}</p>
                      <div class="flex justify-between mb-2">
                        <span class="text-[12px] bg-[#dcfce7] p-0.4 px-1.5 text-[#15803d] rounded-2xl">${plant.category}</span>
                        <span class="text-[12px] font-bold">${plant.price}</span>            
                      </div>
                      <button  onClick="addToCart(${plant.id})" class="btn rounded-4xl btn-secondary bg-[#15803d]">Add to Cart</button>
                    </div>
                  `;
                  cardContainer.appendChild(card);
                }
              });
            } else {
              cardContainer.innerHTML = "<p>No plants available.</p>";
            }
          });
        }
      });
    });
  } else {
    categoryList.innerHTML = "<p>No categories available.</p>";
  }
});







function addToCart(plantId) {
  const cartItemsContainer = document.getElementById("cart-items");
  loadData(plantsApi).then((data) => {
    const plant = data.plants.find(p => p.id === plantId);
    if (!plant) return;
    if(plant.price){
      const currentTotal = parseFloat(document.getElementById("total-price").innerText) || 0;
      const priceNumber = parseFloat(plant.price) || 0;
      const newTotal = (currentTotal + priceNumber).toFixed();
      document.getElementById("total-price").innerText = newTotal;
    } else {
      document.getElementById("total-price").innerText += plant.price;
    }
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item", "bg-white", "mb-2", "rounded-lg");
    cartItem.innerHTML = `
      <div class="flex justify-between items-center bg-[#f0fdf4] rounded-lg p-2 border border-[#d1fae5]">
        <div>
          <p>${plant.name}</p>
          <p>৳${plant.price} x 1</p>
        </div>            
        <div class="cursor-pointer" onClick="this.parentElement.parentElement.remove()">
          <i class="fa-solid fa-xmark"></i>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(cartItem);
  });
}

const allTrees = document.getElementById("all-trees");
allTrees.addEventListener("click", () => {

  const siblings = categoryList.children;
  for (let i = 0; i < siblings.length; i++) {
    siblings[i].classList.remove("bg-[#15803d]");
    siblings[i].classList.remove("text-[#ffffff]");
    allTrees.classList.add("bg-[#15803d]");
    allTrees.classList.add("text-[#ffffff]");
  }  
  cardContainer.innerHTML = "";
  createElementPlantContainer();
});


