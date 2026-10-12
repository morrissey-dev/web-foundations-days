# Library Books API Design

## Base URL

`https://api.example.com`

Resource: `/books`

### 1. List all books

- **Method:** GET
- **Path:** `/books`
- **Description:** Retrieves all books in the library.
- **Success status:** `200 OK`
- **Example request body:** None.

### 2. Get one book

- **Method:** GET
- **Path:** `/books/42`
- **Description:** Retrieves the book with ID 42.
- **Success status:** `200 OK`
- **Example request body:** None.

### 3. Create a book

- **Method:** POST
- **Path:** `/books`
- **Description:** Adds a new book to the library.
- **Example request body:**

```json
{
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "year": 1958
}
```

- **Success status:** `201 Created`

### 4. Replace a book

- **Method:** PUT
- **Path:** `/books/42`
- **Description:** Replaces the details of the book with ID 42.
- **Example request body:**

```json
{
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "year": 1958
}
```

- **Success status:** `200 OK`

### 5. Update part of a book

- **Method:** PATCH
- **Path:** `/books/42`
- **Description:** Updates selected details of the book with ID 42.
- **Example request body:**

```json
{
  "year": 1959
}
```

- **Success status:** `200 OK`

### 6. Delete a book

- **Method:** DELETE
- **Path:** `/books/42`
- **Description:** Removes the book with ID 42.
- **Success status:** `204 No Content`

### 7. List books by an author

- **Method:** GET
- **Path:** `/books?author=Chinua%20Achebe`
- **Description:** Retrieves books written by Chinua Achebe using a query parameter.
- **Success status:** `200 OK`
- **Example request body:** None.

## Error Responses

### 400 Bad Request

- **Meaning:** The request contains invalid data.
- **Example:** A client submits a new book without the required title.

### 404 Not Found

- **Meaning:** The requested resource does not exist.
- **Example:** A client requests `GET /books/999` when book 999 does not exist.