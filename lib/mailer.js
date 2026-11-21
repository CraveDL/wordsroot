// Minimal SMTP client (no dependencies) for sending verification codes.
// Configure with environment variables:
//   SMTP_HOST    e.g. smtp.qq.com / smtp.163.com / smtp.gmail.com
//   SMTP_PORT    465 (implicit TLS, default) or 587/25 with SMTP_SECURE=0 (STARTTLS when the server offers it)
//   SMTP_USER    the mailbox login
//   SMTP_PASS    the mailbox password or app "authorization code"
//   MAIL_FROM    sender address, defaults to SMTP_USER
// Without SMTP_HOST, codes are printed to the server log instead (for local testing only).
const net = require('net');
const tls = require('tls');
const os = require('os');

const cfg = {
  host: process.env.SMTP_HOST || '',
  port: Number(process.env.SMTP_PORT || 465),
  secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE !== '0' : Number(process.env.SMTP_PORT || 465) === 465,
  user: process.env.SMTP_USER || '',
  pass: process.env.SMTP_PASS || '',
  from: process.env.MAIL_FROM || process.env.SMTP_USER || '',
};
const configured = () => Boolean(cfg.host && cfg.from);

const b64 = s => Buffer.from(s, 'utf8').toString('base64');
const encWord = s => `=?UTF-8?B?${b64(s)}?=`;

// Talk to the server one command at a time; each reply may span several "250-" lines.
function session(socket) {
  let buf = '', waiting = null;
  const tryResolve = () => {
    if (!waiting) return;
    const lines = buf.split('\r\n');
    for (let i = 0; i < lines.length - 1; i++) {
      if (/^\d{3} /.test(lines[i]) || /^\d{3}$/.test(lines[i])) {
        const reply = lines.slice(0, i + 1).join('\n');
        buf = lines.slice(i + 1).join('\r\n');
        const w = waiting; waiting = null;
        return w.resolve({ code: Number(lines[i].slice(0, 3)), text: reply });
      }
    }
  };
  const attach = s => {
    s.setEncoding('utf8');
    s.on('data', d => { buf += d; tryResolve(); });
    s.on('error', e => { if (waiting) { const w = waiting; waiting = null; w.reject(e); } });
  };
  attach(socket);
  const read = () => new Promise((resolve, reject) => { waiting = { resolve, reject }; tryResolve(); });
  return {
    read,
    async cmd(line, expect) {
      socket.write(line + '\r\n');
      const r = await read();
      if (expect && !expect.includes(r.code)) throw new Error(`SMTP ${line.split(' ')[0]} failed: ${r.text}`);
      return r;
    },
    swap(next) { socket = next; attach(next); },
    get socket() { return socket; },
  };
}

async function sendMail({ to, subject, text, html }) {
  if (!configured()) {
    console.log(`[mail] 未配置 SMTP，邮件没有真正发出。收件人 ${to}，主题「${subject}」\n${text}`);
    return { logged: true };
  }
  const connect = () => new Promise((resolve, reject) => {
    const s = cfg.secure
      ? tls.connect({ host: cfg.host, port: cfg.port, servername: cfg.host }, () => resolve(s))
      : net.connect({ host: cfg.host, port: cfg.port }, () => resolve(s));
    s.setTimeout(20000, () => s.destroy(new Error('SMTP timeout')));
    s.once('error', reject);
  });
  const socket = await connect();
  const s = session(socket);
  try {
    let r = await s.read();
    if (r.code !== 220) throw new Error('SMTP greeting: ' + r.text);
    const me = os.hostname().replace(/[^\w.-]/g, '') || 'localhost';
    r = await s.cmd(`EHLO ${me}`, [250]);
    if (!cfg.secure && /STARTTLS/i.test(r.text)) {
      await s.cmd('STARTTLS', [220]);
      const secured = await new Promise((resolve, reject) => { const t = tls.connect({ socket: s.socket, servername: cfg.host }, () => resolve(t)); t.once('error', reject); });
      s.swap(secured);
      r = await s.cmd(`EHLO ${me}`, [250]);
    }
    if (cfg.user) {
      await s.cmd('AUTH LOGIN', [334]);
      await s.cmd(b64(cfg.user), [334]);
      await s.cmd(b64(cfg.pass), [235]);
    }
    await s.cmd(`MAIL FROM:<${cfg.from}>`, [250]);
    await s.cmd(`RCPT TO:<${to}>`, [250, 251]);
    await s.cmd('DATA', [354]);
    const boundary = 'rq' + Date.now().toString(36);
    const body = [
      `From: ${encWord('词根驿站')} <${cfg.from}>`,
      `To: <${to}>`,
      `Subject: ${encWord(subject)}`,
      `Date: ${new Date().toUTCString()}`,
      `Message-ID: <${Date.now()}.${Math.random().toString(36).slice(2)}@${cfg.from.split('@')[1] || 'localhost'}>`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      'Content-Type: text/plain; charset=UTF-8',
      'Content-Transfer-Encoding: base64',
      '',
      b64(text).replace(/.{76}/g, '$&\r\n'),
      `--${boundary}`,
      'Content-Type: text/html; charset=UTF-8',
      'Content-Transfer-Encoding: base64',
      '',
      b64(html || text).replace(/.{76}/g, '$&\r\n'),
      `--${boundary}--`,
      '',
    ].join('\r\n');
    await s.cmd(body + '\r\n.', [250]);
    await s.cmd('QUIT').catch(() => {});
    return { sent: true };
  } finally {
    s.socket.destroy();
  }
}

module.exports = { sendMail, mailConfigured: configured };
