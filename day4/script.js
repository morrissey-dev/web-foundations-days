// Select the elements we need

const textarea = document.querySelector("#note-text");
const charCount = document.querySelector("#char-count");
const wordCount = document.querySelector("#word-count");
const clearBtn = document.querySelector("#clear-btn");
const themeToggle = document.querySelector("#theme-toggle");

const DRAFT_KEY = "quicknotes-draft";
const THEME_KEY = "quicknotes-theme";

function updateCounts() {
  const text = textarea.value;

  const characters = text.length;

  charCount.textContent = `${characters} / 200 characters`;

  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  wordCount.textContent = `${words} words`;
  charCount.classList.remove("warning","over");

  if(characters>200){
    charCount.classList.add("over");
  }else if(characters>180){
    charCount.classList.add("warning");
  }
}

textarea.addEventListener("input", () => {
    updateCounts();
    localStorage.setItem(DRAFT_KEY,textarea.value);
});

const savedDraft =localStorage.getItem(DRAFT_KEY);

if (savedDraft !==null){
    textarea.value=savedDraft;
}
updateCounts()

clearBtn.addEventListener("click", () => {
  textarea.value = "";
  localStorage.removeItem(DRAFT_KEY);
  updateCounts();
});clearBtn.addEventListener("click", () => {
  textarea.value = "";
  localStorage.removeItem(DRAFT_KEY);
  updateCounts();
});

textarea.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    textarea.value = "";
    localStorage.removeItem(DRAFT_KEY);
    updateCounts();
  }
});

themeToggle.addEventListener("click",() =>{
    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        themeToggle.textContent="light mode";
        localStorage.setItem(THEME_KEY,"dark");
    }else{
        themeToggle.textContent="Dark mode";
        localStorage.setItem(THEME_KEY,"light");
    }
});

const savedTheme=localStorage.getItem(THEME_KEY);

if (savedTheme==="dark"){
    document.body.classList.add("dark");
    themeToggle.textContent="light mode";
}