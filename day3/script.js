let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

// 1. Using the search function to find notes containing a specific word
function searchNotes(word){
    const searchWord =word.toLowerCase();
    return notes.filter(note=>
         note.text.toLowerCase().includes(searchWord)
);
}
// Testing the search function
console.log(searchNotes("javascript"));
// Expected: [{ id: 4, text: "Revise JavaScript arrays", category: "study" }]

console.log(searchNotes("pizza"));
// Expected: []

// 2. Finding the longest note
function longestNote() {
    if (notes.length === 0) {
        return null;
    }

    let longest = notes[0];

    for (let note of notes) {
        if (note.text.length > longest.text.length) {
            longest = note;
        }
    }

    return longest;
}

console.log(longestNote());
// Expected: { id: 3, text: "Email the project report to Grace", category: "work" }

let savedNotes = notes;
notes = [];

console.log(longestNote());
// Expected: null
notes = savedNotes;


// 3. Counting notes by category
function countByCategory() {
    const counts = {};

    for (let note of notes) {
        if (counts[note.category]) {
            counts[note.category]++;
        } else {
            counts[note.category] = 1;
        }
    }

    return counts;
}

console.log(countByCategory());
// Expected: { personal: 2, study: 2, work: 1 }

console.log(countByCategory());
// Expected: { personal: 2, study: 2, work: 1 }

// 4. Creating a summary of all notes
function getSummary() {
    const counts = countByCategory();

    const noteWord = notes.length === 1 ? "note" : "notes";

    return `${notes.length} ${noteWord}: ${counts.personal || 0} personal, ${counts.work || 0} work, ${counts.study || 0} study.`;
}

console.log(getSummary());
// Expected: 5 notes: 2 personal, 1 work, 2 study.

console.log(getSummary());
// Expected: 5 notes: 2 personal, 1 work, 2 study.

// 5. Checking whether a note is a duplicate
function isDuplicate(text) {
    const cleanedText = text.trim().toLowerCase();

    return notes.some(note =>
        note.text.trim().toLowerCase() === cleanedText
    );
}

console.log(isDuplicate("Call mum"));
// Expected: true

console.log(isDuplicate("Call dad"));
// Expected: false

// 6. Adding a new note
function addNote(text, category) {
    const cleanedText = text.trim();
    const validCategories = ["personal", "work", "study"];

    if (cleanedText.length < 1 || cleanedText.length > 200) {
        console.log("Note rejected: text must be 1-200 characters.");
        return false;
    }

    if (isDuplicate(cleanedText)) {
        console.log("Note rejected: duplicate note.");
        return false;
    }

    if (!validCategories.includes(category)) {
        console.log("Note rejected: invalid category.");
        return false;
    }

    const newNote = {
        id: Date.now(),
        text: cleanedText,
        category: category
    };

    notes.push(newNote);

    console.log(`Note added successfully: "${newNote.text}"`);
    return true;
}

console.log(addNote("Read JavaScript notes", "study"));
// Expected: true

console.log(addNote("Call mum", "personal"));
// Expected: false