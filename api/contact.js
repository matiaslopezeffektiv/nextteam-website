const { Resend } = require('resend');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY saknas i miljövariablerna.');
    res.status(500).json({ error: 'E-postutskick är inte konfigurerat än. Kontakta oss direkt på telefon.' });
    return;
  }

  const { name, company, email, phone, service, message, startdate, type } = req.body || {};

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Namn, e-post och meddelande krävs.' });
    return;
  }

  const heading = type === 'hire'
    ? 'Ny förfrågan: Hyr personal'
    : 'Nytt meddelande från kontaktformuläret';
  const subject = 'Nytt meddelande från Next Team';

  const html = `
    <h2>${heading}</h2>
    <p><strong>Namn:</strong> ${escapeHtml(name)}</p>
    ${company ? `<p><strong>Företag:</strong> ${escapeHtml(company)}</p>` : ''}
    <p><strong>E-post:</strong> ${escapeHtml(email)}</p>
    ${phone ? `<p><strong>Telefon:</strong> ${escapeHtml(phone)}</p>` : ''}
    ${service ? `<p><strong>Tjänst:</strong> ${escapeHtml(service)}</p>` : ''}
    ${startdate ? `<p><strong>Startdatum:</strong> ${escapeHtml(startdate)}</p>` : ''}
    <p><strong>Meddelande:</strong><br>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
  `;

  try {
    const toEmails = process.env.CONTACT_TO_EMAIL
      ? process.env.CONTACT_TO_EMAIL.split(',').map((addr) => addr.trim())
      : ['info@nextteam.se', 'matias@effektivmedia.nu'];

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM || 'Next Team <no-reply@effektivmedia.nu>',
      to: toEmails,
      reply_to: email,
      subject,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      res.status(500).json({ error: 'Kunde inte skicka meddelandet. Försök igen senare.' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    res.status(500).json({ error: 'Kunde inte skicka meddelandet. Försök igen senare.' });
  }
};

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}
