function showNotification(message, type) {
  const el = document.getElementById('notification');
  el.textContent = message;
  el.className = `notification ${type}`;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 4000);
}

async function loadUsers() {
  try {
    const users = await get('/users');
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = users.map(u =>
      `<tr><td>${u.id}</td><td>${u.name}</td><td>${u.activeLoansCount}</td></tr>`
    ).join('');
  } catch (err) {
    showNotification('Erro ao carregar usuários: ' + err.message, 'error');
  }
}

document.getElementById('user-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  if (!name) return;
  try {
    await post('/users', { name });
    document.getElementById('name').value = '';
    showNotification('Usuário cadastrado com sucesso!', 'success');
    await loadUsers();
  } catch (err) {
    showNotification(err.message, 'error');
  }
});

loadUsers();
