function showNotification(message, type) {
  const el = document.getElementById('notification');
  el.textContent = message;
  el.className = `notification ${type}`;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 5000);
}

async function loadSelects() {
  try {
    const [users, books] = await Promise.all([get('/users'), get('/books')]);
    const userSelect = document.getElementById('user-select');
    userSelect.innerHTML = '<option value="">Selecione um usuário</option>' +
      users.map(u => `<option value="${u.id}">${u.name}</option>`).join('');
    const bookSelect = document.getElementById('book-select');
    const available = books.filter(b => b.isAvailable);
    bookSelect.innerHTML = '<option value="">Selecione um livro</option>' +
      available.map(b => `<option value="${b.id}">${b.title}</option>`).join('');
  } catch (err) {
    showNotification('Erro ao carregar dados: ' + err.message, 'error');
  }
}

async function loadLoans() {
  try {
    const loans = await get('/loans');
    const active = loans.filter(l => !l.returnedAt);
    const tbody = document.getElementById('loans-table-body');
    tbody.innerHTML = active.length === 0
      ? '<tr><td colspan="4">Nenhum empréstimo ativo.</td></tr>'
      : active.map(l => {
          const date = new Date(l.borrowedAt).toLocaleDateString('pt-BR');
          return `<tr>
            <td>${l.user ? l.user.name : l.userId}</td>
            <td>${l.book ? l.book.title : l.bookId}</td>
            <td>${date}</td>
            <td><button class="btn-danger" onclick="returnLoan('${l.id}')">Devolver</button></td>
          </tr>`;
        }).join('');
  } catch (err) {
    showNotification('Erro ao carregar empréstimos: ' + err.message, 'error');
  }
}

async function returnLoan(loanId) {
  try {
    const loan = await put(`/loans/${loanId}/return`, {});
    const fee = loan.penaltyFee ? `R$ ${loan.penaltyFee.toFixed(2)}` : 'R$ 0,00';
    showNotification(`Devolução registrada. Multa: ${fee}`, 'success');
    await Promise.all([loadLoans(), loadSelects()]);
  } catch (err) {
    showNotification(err.message, 'error');
  }
}

document.getElementById('loan-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const userId = document.getElementById('user-select').value;
  const bookId = document.getElementById('book-select').value;
  if (!userId || !bookId) return;
  try {
    await post('/loans', { userId, bookId });
    showNotification('Empréstimo realizado com sucesso!', 'success');
    await Promise.all([loadLoans(), loadSelects()]);
  } catch (err) {
    showNotification(err.message, 'error');
  }
});

loadSelects();
loadLoans();
