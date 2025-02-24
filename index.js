// Select form and input elements
const form = document.querySelector('form');
const titleInput = document.getElementById('Book Title');
const authorInput = document.getElementById('Book Author');
const publisherInput = document.getElementById('Book Publisher');

// Select the table body where books will be added
const booksTableBody = document.querySelector('#books-table tbody');

// Add event listener for form submission
form.addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const newBook = {
        title: titleInput.value,
        author: authorInput.value,
        publisher: publisherInput.value
    };

    console.log('Submitting new book:', newBook); 

    // POST request to add the new book
    try {
        const response = await fetch('https://bookstore-api-six.vercel.app/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newBook),
        });

        const data = await response.json();
        console.log('New book added:', data);
        fetchBooks(); // Reload the books list after adding a new book
    } catch (error) {
        console.error('Error adding new book:', error);
    }

    // Clear input fields after submission
    titleInput.value = '';
    authorInput.value = '';
    publisherInput.value = '';
});

// Function to fetch and display books 
async function fetchBooks() {
    console.log('Fetching books...'); // Log  message informing fetching request is loading

    try {
        const response = await fetch('https://bookstore-api-six.vercel.app/api/books');
        const books = await response.json();
        console.log('Fetched books:', books); // Log the fetched books

        // Clear the table before adding  new rows
        booksTableBody.innerHTML = '';

        // Loop through each book and create a row for it
        books.forEach(book => {
            const row = document.createElement('tr');
            row.id = book.id
            
            row.innerHTML = `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.publisher} <button class="delete-btn" data-id="${book.id}">Delete</button></td>
            `;
            
            booksTableBody.appendChild(row);
        });

        // Add event listeners to each delete button after books are loaded
        addDeleteEventListeners();
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}
// Function to add event listeners to delete buttons
function addDeleteEventListeners() {
    const deleteButtons = document.querySelectorAll('button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const bookId = button.dataset.id; // Get book ID from the button's data attribute
            console.log('Attempting to delete book with ID:', bookId);

            try {
                // DELETE request to remove the book
                const response = await fetch(`https://bookstore-api-six.vercel.app/api/books/${bookId}`, {
                    method: 'DELETE',
                });

                const data = await response.json();
                const deletebook = document.getElementById(bookId);
                deletebook.remove()

                console.log('Book deleted:', data);

                // Reload the books list after deleting the book
               
            } catch (error) {
                console.error('Error deleting book:', error);
            }
        });
    });
}

// Call fetchBooks to load books when the page loads
fetchBooks();
