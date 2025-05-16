/**
 * speakJP - 日本語音声読み上げユーティリティ
 * ---------------------------------------------
 * Web Speech API (SpeechSynthesis) を用いてブラウザに日本語をしゃべらせる関数。
 *
 * 使用例:
 *   import { speakJP } from './speakJP.js';
 *   speakJP('おはようございます。今日も安全第一で行きましょう！');
 *
 *   // グローバル関数としても利用可
 *   window.speakJP('テストテスト');
 *
 * オプション例:
 *   speakJP('テスト', { rate: 1.2, pitch: 1, volume: 0.8, onend: () => alert('完了!') });
 * -----------------------------------------------------------
 * @param {string} text  読み上げる日本語文字列
 * @param {Object} [opts] オプション
 * @param {number} [opts.rate=1]   速度 (0.1–10)
 * @param {number} [opts.pitch=1]  ピッチ (0–2)
 * @param {number} [opts.volume=1] 音量 (0–1)
 * @param {function} [opts.onend]   読み上げ終了時コールバック
 * @param {function} [opts.onerror] エラー時コールバック
 * @returns {SpeechSynthesisUtterance|null}
 */
function speakJP(text, opts = {}) {
  const synth = window.speechSynthesis;
  if (!synth) {
    console.warn('このブラウザは SpeechSynthesis に対応していません');
    return null;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';

  // 日本語ボイスを取得 (ページロード直後は空配列のことがある)
  const pickVoice = () => {
    const voices = synth.getVoices().filter(v => v.lang.startsWith('ja'));
    if (voices.length) utterance.voice = voices[0]; // 先頭を採用 (好みに応じて選択可)
  };

  pickVoice();
  if (!utterance.voice) {
    // voices がまだロードされていない場合の対処
    synth.addEventListener('voiceschanged', () => {
      if (!utterance.voice) pickVoice();
    }, { once: true });
  }

  // ユーザーオプション
  utterance.rate   = opts.rate   ?? 1;
  utterance.pitch  = opts.pitch  ?? 1;
  utterance.volume = opts.volume ?? 1;
  if (opts.onend)   utterance.addEventListener('end', opts.onend);
  if (opts.onerror) utterance.addEventListener('error', opts.onerror);

  // 既に話してる場合はキャンセルして最新を読む (必要に応じて調整)
  if (synth.speaking || synth.pending) synth.cancel();

  synth.speak(utterance);
  return utterance;
}

// ブラウザの <script type="module"> 以外でも使えるように window に公開
if (typeof window !== 'undefined') {
  window.speakJP = speakJP;
}

// ページロード直後に voices が空配列になる問題への軽い対策
// (Safari などはロード完了時点で voices が揃うため不要だが harmless)
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.addEventListener('voiceschanged', () => {}, { once: true });
    }
  });
}
