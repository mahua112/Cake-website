// Search Box
function performSearch() {
  const query = document.getElementById("searchInput").value.trim();
  if (query === "") {
    alert("Please enter something to search 🍰");
  } else {
    alert(`You searched for: "${query}" 🔍`);
    console.log(`Search query: ${query}`);
  }
}

// Stars Rating
const stars = document.querySelectorAll(".rating .star");
let selectedRating = 0;

stars.forEach(star => {
  star.addEventListener("click", () => {
    selectedRating = star.dataset.value;
    updateStars(selectedRating);
  });

  star.addEventListener("mouseover", () => {
    updateStars(star.dataset.value);
  });

  star.addEventListener("mouseout", () => {
    updateStars(selectedRating);
  });
});

function updateStars(rating) {
  stars.forEach(star => {
    if (star.dataset.value <= rating) {
      star.textContent = "★";
      star.classList.add("selected");
    } else {
      star.textContent = "☆";
      star.classList.remove("selected");
    }
  });
}

// Contact Form Submit
const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (name && email && message) {
    alert(`Thanks ${name}! You rated us ${selectedRating}⭐ and your message was sent! 🍰`);
    contactForm.reset();
    selectedRating = 0;
    updateStars(selectedRating);
  }
});

// Quiz Logic
const quizButtons = document.querySelectorAll(".quiz-btn");
const quizFeedback = document.getElementById("quiz-feedback");

quizButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.dataset.answer === "correct") {
      quizFeedback.textContent = "🎉 Correct! You won a free cake gift or discount!";
      quizFeedback.style.color = "#d65c89";
    } else {
      quizFeedback.textContent = "❌ Wrong! Try again!";
      quizFeedback.style.color = "#6d4c4c";
    }
  });
});
