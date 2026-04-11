document.getElementById('submit-btn').addEventListener('click', async () => {
  const name    = document.getElementById('contact-name').value.trim();
  const email   = document.getElementById('contact-email').value.trim();
  const message = document.getElementById('contact-message').value.trim();
  const note    = document.getElementById('form-note');
  const btn     = document.getElementById('submit-btn');

  // Basic client-side check
  if (!name || !email || !message) {
    note.textContent = 'Please fill in all fields.';
    note.style.color = '#c0392b';
    return;
  }

  // Disable button while sending
  btn.disabled = true;
  btn.textContent = 'Sending…';
  note.textContent = '';

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });

    const data = await res.json();

    if (res.ok) {
      note.textContent = data.message;
      note.style.color = '#888';
      // Clear the form
      document.getElementById('contact-name').value    = '';
      document.getElementById('contact-email').value   = '';
      document.getElementById('contact-message').value = '';
    } else {
      note.textContent = data.message || 'Something went wrong. Try again.';
      note.style.color = '#c0392b';
    }

  } catch (err) {
    note.textContent = 'Could not reach the server. Make sure Flask is running.';
    note.style.color = '#c0392b';
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send message';
  }
});