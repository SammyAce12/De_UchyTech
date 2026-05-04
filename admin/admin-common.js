function markActiveMenu() {
  const current = location.pathname.split('/').pop() || 'admin-dashboard.html';
  document.querySelectorAll('.menu a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === current);
  });
}

function setStatus(message, type) {
  const el = document.getElementById('status');
  if (!el) return;
  el.className = `status ${type === 'error' ? 'err' : 'ok'}`;
  el.textContent = message;
}

async function requireSeller() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'seller') {
    window.location.href = '/login.html';
    return null;
  }
  return user;
}

async function loadAdminData() {
  const [content, usersData] = await Promise.all([
    apiRequest('/api/admin/content'),
    apiRequest('/api/admin/users')
  ]);
  return { content, users: usersData.users || [] };
}

async function logoutSeller() {
  await apiRequest('/api/auth/logout', { method: 'POST' });
  window.location.href = '/login.html';
}

function bindLogout() {
  document.querySelectorAll('.logout-btn').forEach((btn) => {
    btn.addEventListener('click', logoutSeller);
  });
}

markActiveMenu();
bindLogout();