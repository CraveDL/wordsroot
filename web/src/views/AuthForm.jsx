import { useEffect, useRef, useState } from 'react';

const netErr = ex => (ex && ex.message === 'Failed to fetch' ? '连不上服务器，请检查网络后重试' : (ex && ex.message) || '出了点问题，请重试');

// Sign-in forms. With the server: email + emailed code. Without one: username accounts in this browser.
export default function AuthForm({ store, tab, setTab, onSignedIn }) {
  const [f, setF] = useState({ account: '', email: '', code: '', name: '', password: '' });
  const [err, setErr] = useState('');
  const [hint, setHint] = useState('');
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(0);
  const timer = useRef(null);
  useEffect(() => () => clearInterval(timer.current), []);
  useEffect(() => { setErr(''); setHint(''); }, [tab]);
  const set = k => e => setF(v => ({ ...v, [k]: e.target.value }));
  const email = store.email;

  async function sendCode() {
    setErr('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) { setErr('请先填写正确的邮箱地址'); return; }
    setWait(-1);
    try {
      const j = await store.sendCode(f.email.trim(), tab === 'reset' ? 'reset' : 'register');
      setHint(j.mailReady ? `验证码已发到 ${f.email.trim()}，10 分钟内有效。没收到的话看看垃圾邮件。` : '测试模式：服务器还没配置发信，验证码打印在服务器日志里。');
      let left = 60; setWait(left);
      clearInterval(timer.current);
      timer.current = setInterval(() => { left--; setWait(left); if (left <= 0) clearInterval(timer.current); }, 1000);
    } catch (ex) { setErr(netErr(ex)); setWait(0); }
  }

  async function submit(e) {
    e.preventDefault();
    const v = { account: f.account.trim(), email: f.email.trim(), code: f.code.trim(), name: f.name.trim(), password: f.password };
    const missing = tab === 'login' ? (!v.account || !v.password) && '请填写账号和密码'
      : !email ? (!v.account || !v.password) && '请填写用户名和密码'
      : !v.email ? '请填写邮箱' : !/^\d{6}$/.test(v.code) ? '请填写邮件里的 6 位验证码'
      : tab === 'register' && !v.name ? '请填写昵称' : v.password.length < 6 ? '密码至少 6 位' : '';
    if (missing) { setErr(missing); return; }
    setBusy(true); setErr('');
    try { const session = await store[tab](v); onSignedIn(session, tab); }
    catch (ex) { setErr(netErr(ex)); setBusy(false); }
  }

  const codeRow = (
    <>
      <div className="code-row">
        <label htmlFor="ac">验证码<input id="ac" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={f.code} onChange={set('code')} /></label>
        <button type="button" className="btn ghost" onClick={sendCode} disabled={wait !== 0}>{wait > 0 ? `${wait} 秒后重发` : wait < 0 ? '发送中…' : hint ? '重新发送' : '发送验证码'}</button>
      </div>
      {hint && <p className="small muted">{hint}</p>}
    </>
  );
  let fields;
  if (!email) {
    fields = <>
      <label htmlFor="aa">用户名<input id="aa" autoComplete="username" maxLength={16} value={f.account} onChange={set('account')} /></label>
      <label htmlFor="ap">密码<input id="ap" type="password" autoComplete={tab === 'login' ? 'current-password' : 'new-password'} maxLength={72} value={f.password} onChange={set('password')} /></label>
    </>;
  } else if (tab === 'login') {
    fields = <>
      <label htmlFor="aa">邮箱<input id="aa" inputMode="email" autoComplete="username" maxLength={254} placeholder="早期注册的账号也可以填用户名" value={f.account} onChange={set('account')} /></label>
      <label htmlFor="ap">密码<input id="ap" type="password" autoComplete="current-password" maxLength={72} value={f.password} onChange={set('password')} /></label>
    </>;
  } else {
    fields = <>
      <label htmlFor="ae">邮箱<input id="ae" type="email" autoComplete="email" maxLength={254} value={f.email} onChange={set('email')} /></label>
      {codeRow}
      {tab === 'register' && <label htmlFor="an">昵称<input id="an" autoComplete="nickname" maxLength={16} value={f.name} onChange={set('name')} /></label>}
      <label htmlFor="ap">{tab === 'reset' ? '新密码' : '密码'}<input id="ap" type="password" autoComplete="new-password" maxLength={72} placeholder="至少 6 位" value={f.password} onChange={set('password')} /></label>
    </>;
  }
  const go = { login: '登录并继续闯关', register: '注册并开始闯关', reset: '重设密码并登录' }[tab];
  const switchTo = t => { setF(v => ({ ...v, email: v.email || (v.account.includes('@') ? v.account : ''), account: v.account || v.email })); setTab(t); };
  return (
    <form className="form" onSubmit={submit} noValidate>
      {tab === 'reset'
        ? <div><h2 style={{ fontSize: '1.3rem' }}>找回密码</h2><p className="small muted">输入注册时用的邮箱，收到验证码后设置新密码。</p></div>
        : <div className="seg" role="group" aria-label="注册或登录">
            <button type="button" aria-pressed={tab === 'register'} onClick={() => switchTo('register')}>注册</button>
            <button type="button" aria-pressed={tab === 'login'} onClick={() => switchTo('login')}>登录</button>
          </div>}
      {fields}
      <p className="err" role="alert">{err}</p>
      <button className="btn red" disabled={busy}>{busy ? '请稍候…' : go}</button>
      {email && tab === 'login' && <button type="button" className="link" style={{ justifySelf: 'start' }} onClick={() => switchTo('reset')}>忘记密码？</button>}
      {email && tab === 'reset' && <button type="button" className="link" style={{ justifySelf: 'start' }} onClick={() => switchTo('login')}>返回登录</button>}
      <p className="small muted">{store.note}</p>
    </form>
  );
}
