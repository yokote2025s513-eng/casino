// ========================================
// 共通ユーティリティ
// ========================================

// トースト通知
function showToast(msg, type = 'success') {
  const c = document.getElementById('toast-container') || (() => {
    const el = document.createElement('div');
    el.id = 'toast-container';
    document.body.appendChild(el);
    return el;
  })();
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ゲームIDからCSSクラス
function gameClass(gameId) {
  return `game-${gameId}`;
}

// ゲームIDからラベル
function gameLabel(gameId) {
  return GAMES.find(g => g.id === gameId)?.label ?? gameId;
}

// ゲームIDからアイコン
function gameIcon(gameId) {
  return GAMES.find(g => g.id === gameId)?.icon ?? '?';
}

// ランク表示
function rankDisplay(n) {
  if (n === 1) return '👑 1st';
  if (n === 2) return '🥈 2nd';
  if (n === 3) return '🥉 3rd';
  return `${n}th`;
}

// 日時フォーマット
function fmtTime(ts) {
  if (!ts) return '-';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
}
