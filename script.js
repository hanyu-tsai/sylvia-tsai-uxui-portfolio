
// =================================
// Sylvia's Cocktail Portfolio
// =================================

// Elements
const ingredients = document.querySelectorAll(".ingredient");
const glass = document.getElementById("glass");
const glassImage = document.getElementById("glass-image");
const resetButton = document.getElementById("reset-button");

const descriptionTitle = document.getElementById("description-title");
const descriptionText = document.getElementById("description-text");

// Ingredient information
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

const defaultTitle = "A little mix of me.";
const defaultText = "Drag or click an ingredient to explore!";

const addedIngredients = new Set();

const insideImages = {
    cherry: document.querySelector(".inside-cherry"),
    lemon: document.querySelector(".inside-lemon"),
    ice: document.querySelector(".inside-ice")
};

// =================================
// Description
// =================================

function showDescription(id) {
    const info = ingredientInfo[id];
    if (!info) return;

    descriptionTitle.textContent = info.title;
    descriptionText.textContent = info.text;
}

function resetDescription() {
    descriptionTitle.textContent = defaultTitle;
    descriptionText.textContent = defaultText;
}

// =================================
// Add Ingredient
// =================================

function addIngredient(id) {
    if (addedIngredients.has(id)) return;

    addedIngredients.add(id);

    if (insideImages[id]) {
        insideImages[id].classList.add("added");
    }

    if (id === "liquid") {
        glassImage.src = "images/liquid_glass.png";
    }

    const button = document.querySelector(
        `[data-ingredient="${id}"]`
    );

    button.classList.add("is-added");
    button.disabled = true;

    showDescription(id);
    if (addedIngredients.size === 4) {
        resetButton.hidden = false;
        glass.classList.add("is-complete");
        glassImage.src = "images/cocktail_final.png";

        descriptionTitle.textContent = "That's Sylvia's Mix!";
        descriptionText.textContent =
            "A little creativity, empathy, structure, and curiosity.";
    }
}

// =================================
// Pointer Drag & Drop
// =================================

let dragState = null;

const DRAG_THRESHOLD = 8;

// Check if pointer is inside glass
function isInsideGlass(x, y) {
    const rect = glass.getBoundingClientRect();

    return (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.top + rect.height * 0.65
    );
}

ingredients.forEach((ingredient) => {
    const id = ingredient.dataset.ingredient;

    // Desktop hover
    ingredient.addEventListener("mouseenter", () => {
        if (!addedIngredients.has(id)) {
            showDescription(id);
        }
    });


    ingredient.addEventListener("mouseleave", () => {
        const hasHover = window.matchMedia(
            "(hover: hover) and (pointer: fine)"
        ).matches;

        if (hasHover && !dragState && addedIngredients.size < 4) {
            resetDescription();
        }
    });


    // Keyboard focus
    ingredient.addEventListener("focus", () => {
        if (!addedIngredients.has(id)) {
            showDescription(id);
        }
    });


    ingredient.addEventListener("blur", () => {
        const hasHover = window.matchMedia(
            "(hover: hover) and (pointer: fine)"
        ).matches;

        if (hasHover && !dragState && addedIngredients.size < 4) {
            resetDescription();
        }
    });


    // Start dragging
    ingredient.addEventListener("pointerdown", (event) => {
        if (addedIngredients.has(id)) return;
        if (event.button !== 0) return;

        dragState = {
            element: ingredient,
            id: id,
            startX: event.clientX,
            startY: event.clientY,
            dragging: false
        };

        ingredient.setPointerCapture(event.pointerId);
    });

    // Move ingredient
    ingredient.addEventListener("pointermove", (event) => {
        if (!dragState || dragState.element !== ingredient) return;

        const dx = event.clientX - dragState.startX;
        const dy = event.clientY - dragState.startY;

        if (
            !dragState.dragging &&
            Math.hypot(dx, dy) > DRAG_THRESHOLD
        ) {
            dragState.dragging = true;
            ingredient.classList.add("is-dragging");
        }

        if (dragState.dragging) {
            ingredient.style.transform =
                `translate(${dx}px, ${dy}px)`;

            if (isInsideGlass(event.clientX, event.clientY)) {
                glass.classList.add("drag-over");
            } else {
                glass.classList.remove("drag-over");
            }
        }
    });

    // Drop ingredient
    ingredient.addEventListener("pointerup", (event) => {
        if (!dragState || dragState.element !== ingredient) return;

        const wasDragging = dragState.dragging;

        if (wasDragging) {
            if (isInsideGlass(event.clientX, event.clientY)) {
                addIngredient(id);
            }

            ingredient.style.transform = "";
            ingredient.classList.remove("is-dragging");
            glass.classList.remove("drag-over");
        } else {
            addIngredient(id);
        }

        dragState = null;
    });

    // Cancel dragging
    ingredient.addEventListener("pointercancel", () => {
        ingredient.style.transform = "";
        ingredient.classList.remove("is-dragging");
        glass.classList.remove("drag-over");
        dragState = null;
    });

    // Keyboard click support
    ingredient.addEventListener("click", (event) => {
        if (event.detail === 0) {
            addIngredient(id);
        }
    });
});

// Prevent native image dragging
document.querySelectorAll(".ingredient img").forEach((img) => {
    img.draggable = false;
});



// =================================
// Reset Cocktail
// =================================

resetButton.addEventListener("click", () => {
    // Reset ingredient tracking
    addedIngredients.clear();

    // Restore original glass
    glass.classList.remove("is-complete", "drag-over");
    glassImage.src = "images/glass_tinted.png";

    // Hide ingredients inside the glass
    Object.values(insideImages).forEach((image) => {
        if (image) {
            image.classList.remove("added");
        }
    });

    // Enable ingredient buttons again
    ingredients.forEach((ingredient) => {
        ingredient.disabled = false;
        ingredient.classList.remove("is-added", "is-dragging");
        ingredient.style.transform = "";
    });

    // Restore default description
    resetDescription();

    // Hide reset button
    resetButton.hidden = true;
});



/* =================================
   Selected Work Gallery
================================= */

const worksGallery = document.getElementById("works-gallery");
const workPrev = document.getElementById("work-prev");
const workNext = document.getElementById("work-next");

function updateWorkArrows() {
    const maxScroll =
        worksGallery.scrollWidth - worksGallery.clientWidth;

    workPrev.disabled = worksGallery.scrollLeft <= 2;
    workNext.disabled =
        worksGallery.scrollLeft >= maxScroll - 2;
}

function scrollWork(direction) {
    const card = worksGallery.querySelector(".project-card");
    const gap = parseFloat(getComputedStyle(worksGallery).gap) || 0;

    const distance = card.getBoundingClientRect().width + gap;

    worksGallery.scrollBy({
        left: direction * distance,
        behavior: "smooth"
    });
}

workPrev.addEventListener("click", () => scrollWork(-1));
workNext.addEventListener("click", () => scrollWork(1));

worksGallery.addEventListener("scroll", updateWorkArrows);
window.addEventListener("resize", updateWorkArrows);

updateWorkArrows();



/* =================================
   About Me - Interactive Memories
================================= */

const memoryCards = document.querySelectorAll(".memory-card");

memoryCards.forEach((card) => {
    card.setAttribute("aria-pressed", "false");

    card.addEventListener("click", () => {
        const shouldFlip = !card.classList.contains("is-flipped");

        // Close other cards
        memoryCards.forEach((otherCard) => {
            otherCard.classList.remove("is-flipped");
            otherCard.setAttribute("aria-pressed", "false");
        });

        // Flip selected card
        if (shouldFlip) {
            card.classList.add("is-flipped");
            card.setAttribute("aria-pressed", "true");
        }
    });
});

// Press Escape to close all flipped cards
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        memoryCards.forEach((card) => {
            card.classList.remove("is-flipped");
            card.setAttribute("aria-pressed", "false");
        });
    }
});


/* =================================
   Magnetic Cursor Interaction
================================= */

const magneticTargets = document.querySelectorAll(
    ".ingredient, .memory-card"
);

const magneticCursor = document.createElement("div");
magneticCursor.className = "magnetic-cursor";
magneticCursor.setAttribute("aria-hidden", "true");
document.body.appendChild(magneticCursor);

const supportsMagneticCursor = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
).matches;

if (supportsMagneticCursor) {

    let activeTarget = null;

    magneticTargets.forEach((target) => {

        target.addEventListener("pointerenter", (event) => {
            if (event.pointerType !== "mouse" || target.disabled) return;

            activeTarget = target;
            magneticCursor.classList.add("active");
        });

        target.addEventListener("pointerleave", () => {
            if (activeTarget === target) {
                activeTarget = null;
                magneticCursor.classList.remove("active");
            }
        });

    });

    document.addEventListener("pointermove", (event) => {
        if (!activeTarget || event.pointerType !== "mouse") return;

        // Hide magnetic effect while dragging
        if (activeTarget.classList.contains("is-dragging")) {
            magneticCursor.classList.remove("active");
            return;
        }

        magneticCursor.classList.add("active");

        const rect = activeTarget.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Gentle magnetic pull toward the element
        const pullX = Math.max(
            -14,
            Math.min(14, (centerX - event.clientX) * 0.4)
        );

        const pullY = Math.max(
            -14,
            Math.min(14, (centerY - event.clientY) * 0.4)
        );

        magneticCursor.style.left =
            `${event.clientX + pullX}px`;

        magneticCursor.style.top =
            `${event.clientY + pullY}px`;
    });
}
