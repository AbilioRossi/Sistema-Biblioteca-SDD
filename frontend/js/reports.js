function showNotification(message, type) {
  const el = document.getElementById('notification');
  el.textContent = message;
  el.className = `notification ${type}`;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 4000);
}

document.getElementById('btn-overdue').addEventListener('click', async () => {
  const btn = document.getElementById('btn-overdue');
  btn.textContent = 'Carregando...';
  btn.disabled = true;
  try {
    const data = await get('/reports/overdue');
    const tbody = document.getElementById('overdue-table-body');
    tbody.innerHTML = data.length === 0
      ? '<tr><td colspan="4">Nenhum inadimplente encontrado.</td></tr>'
      : data.map(r =>
          `<tr>
            <td>${r.userName}</td>
            <td>${r.bookTitle}</td>
            <td>${r.daysOverdue}</td>
            <td>R$ ${r.estimatedPenaltyFee.toFixed(2)}</td>
          </tr>`
        ).join('');
  } catch (err) {
    showNotification('Erro: ' + err.message, 'error');
  } finally {
    btn.textContent = 'Ver Inadimplentes';
    btn.disabled = false;
  }
});

document.getElementById('btn-popular').addEventListener('click', async () => {
  const btn = document.getElementById('btn-popular');
  btn.textContent = 'Carregando...';
  btn.disabled = true;
  try {
    const data = await get('/reports/popular-books');
    const tbody = document.getElementById('popular-table-body');
    tbody.innerHTML = data.length === 0
      ? '<tr><td colspan="2">Nenhum empréstimo registrado.</td></tr>'
      : data.map(r =>
          `<tr><td>${r.bookTitle}</td><td>${r.totalBorrows}</td></tr>`
        ).join('');
  } catch (err) {
    showNotification('Erro: ' + err.message, 'error');
  } finally {
    btn.textContent = 'Livros Populares';
    btn.disabled = false;
  }
});
