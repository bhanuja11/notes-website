document.addEventListener('DOMContentLoaded', () => {
    const noteTextInput = document.getElementById('note-text');
    const addNoteButton = document.getElementById('add-note-btn');
    const notesContainer = document.getElementById('notes-container');
    const noNotesMessage = document.getElementById('no-notes-message');

    // --- Functions for Local Storage ---

    /**
     * Retrieves notes from localStorage.
     * @returns {Array} An array of note objects, or an empty array if none exist.
     */
    function getNotes() {
        const notesJSON = localStorage.getItem('notes');
        return notesJSON ? JSON.parse(notesJSON) : [];
    }

    /**
     * Saves the given array of notes to localStorage.
     * @param {Array} notes - The array of note objects to save.
     */
    function saveNotes(notes) {
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    // --- Functions for UI Manipulation ---

    /**
     * Displays or hides the "No notes yet" message based on whether there are notes.
     */
    function toggleNoNotesMessage() {
        const notes = getNotes();
        if (notes.length === 0) {
            noNotesMessage.classList.remove('hidden');
        } else {
            noNotesMessage.classList.add('hidden');
        }
    }

    /**
     * Renders all notes from localStorage into the notes container.
     */
    function renderNotes() {
        notesContainer.innerHTML = ''; // Clear existing notes
        const notes = getNotes();

        if (notes.length === 0) {
            toggleNoNotesMessage();
            return;
        }

        notes.forEach(note => {
            const noteCard = document.createElement('div');
            noteCard.classList.add('note-card');
            noteCard.dataset.id = note.id; // Store ID on the card for deletion

            noteCard.innerHTML = `
                <p class="note-content">${note.text}</p>
                <div class="note-footer">
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            notesContainer.prepend(noteCard); // Add new notes to the top
        });
        toggleNoNotesMessage(); // Check message visibility after rendering
    }

    /**
     * Adds a new note to the application.
     */
    function addNote() {
        const noteText = noteTextInput.value.trim(); // Get text and remove leading/trailing whitespace

        if (noteText) { // Only add if text is not empty
            const notes = getNotes();
            const newNote = {
                id: Date.now(), // Simple unique ID using timestamp
                text: noteText
            };
            notes.push(newNote); // Add new note to the array
            saveNotes(notes);    // Save updated array to localStorage

            noteTextInput.value = ''; // Clear the textarea
            renderNotes();       // Re-render notes to show the new one
        } else {
            alert('Please write something before adding a note.');
        }
    }

    /**
     * Deletes a note from the application.
     * @param {string} id - The ID of the note to delete.
     */
    function deleteNote(id) {
        let notes = getNotes();
        // Filter out the note with the matching ID
        notes = notes.filter(note => note.id.toString() !== id.toString());
        saveNotes(notes);    // Save updated array
        renderNotes();       // Re-render notes
    }

    // --- Event Listeners ---

    // Add note on button click
    addNoteButton.addEventListener('click', addNote);

    // Allow adding note with Enter key if textarea is focused
    noteTextInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) { // Prevent new line on Shift+Enter
            event.preventDefault(); // Prevent default Enter behavior (e.g., new line)
            addNote();
        }
    });

    // Handle delete button clicks using event delegation
    notesContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) {
            // Get the parent note-card's ID
            const noteCard = event.target.closest('.note-card');
            if (noteCard) {
                const noteId = noteCard.dataset.id;
                deleteNote(noteId);
            }
        }
    });

    // Initial render of notes when the page loads
    renderNotes();
});