
const ingredients = document.querySelectorAll(".ingredient");

const descriptionTitle = document.getElementById("description-title");
const descriptionText = document.getElementById("description-text");

// Default description
const defaultTitle = "A little mix of me.";
const defaultText = "Drag or click an ingredient to explore!";

// Ingredient descriptions
const ingredientInfo = {
    cherry: {
        title: "Creativity",
        text: "I love exploring new ideas and bringing a playful perspective to design."
    },

    lemon: {
        title: "Empathy",
        text: "My psychology background helps me understand people and their needs."
    },

    ice: {
        title: "Structure",
        text: "I enjoy turning complex problems into simple, intuitive experiences."
    },

    liquid: {
        title: "Curiosity",
        text: "I love asking questions, exploring possibilities, and learning new things."
    }
};

// Show ingredient information
function showDescription(id) {
    const info = ingredientInfo[id];

    if (!info) return;

    descriptionTitle.textContent = info.title;
    descriptionText.textContent = info.text;
}

// Restore original message
function resetDescription() {
    descriptionTitle.textContent = defaultTitle;
    descriptionText.textContent = defaultText;
}

// Desktop hover and keyboard focus
ingredients.forEach((ingredient) => {
    const id = ingredient.dataset.ingredient;

    ingredient.addEventListener("mouseenter", () => {
        showDescription(id);
    });

    ingredient.addEventListener("mouseleave", () => {
        resetDescription();
    });

    ingredient.addEventListener("focus", () => {
        showDescription(id);
    });

    ingredient.addEventListener("blur", () => {
        resetDescription();
    });
});



// =================================
// Click to Add Ingredients
// =================================

const glass = document.getElementById("glass");
const glassImage = document.getElementById("glass-image");

const addedIngredients = new Set();

const insideImages = {
    cherry: document.querySelector(".inside-cherry"),
    lemon: document.querySelector(".inside-lemon"),
    ice: document.querySelector(".inside-ice")
};

function addIngredient(id) {

    // Prevent adding the same ingredient twice
    if (addedIngredients.has(id)) return;

    addedIngredients.add(id);

    // Show ingredient inside the glass
    if (insideImages[id]) {
        insideImages[id].classList.add("added");
    }

    // Liquid changes the glass image
    if (id === "liquid") {
        glassImage.src = "images/liquid_glass.png";
    }

    // Update ingredient button
    const button = document.querySelector(
        `[data-ingredient="${id}"]`
    );

    button.classList.add("is-added");
    button.disabled = true;

    // Update description
    showDescription(id);

    // Check whether cocktail is complete
    if (addedIngredients.size === 4) {
        glass.classList.add("is-complete");
        glassImage.src = "images/cocktail_final.png";

        descriptionTitle.textContent = "That's Sylvia's Mix!";
        descriptionText.textContent =
            "A little creativity, empathy, structure, and curiosity.";
    }
}

// Click ingredient to add
ingredients.forEach((ingredient) => {
    ingredient.addEventListener("click", () => {
        addIngredient(ingredient.dataset.ingredient);
    });
});
