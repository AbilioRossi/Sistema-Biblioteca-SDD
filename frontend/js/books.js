function showNotification(message, type) {
  const el = document.getElementById('notification');
  el.textContent = message;
  el.className = `notification ${type}`;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 4000);
}

async function loadBooks() {
  try {
    const books = await get('/books');
    const tbody = document.getElementById('books-table-body');
    tbody.innerHTML = books.map(b =>
      `<tr><td>${b.id}</td><td>${b.title}</td><td>${b.isAvailable ? 'Sim' : 'Não'}</td></tr>`
    ).join('');
  } catch (err) {
    showNotification('Erro ao carregar livros: ' + err.message, 'error');
  }
}

document.getElementById('book-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  if (!title) return;
  try {
    await post('/books', { title });
    document.getElementById('title').value = '';
    showNotification('Livro cadastrado com sucesso!', 'success');
    await loadBooks();
  } catch (err) {
    showNotification(err.message, 'error');
  }
});

loadBooks();
