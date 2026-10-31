(function (root) {
  'use strict';
  const random = () => {
    if (globalThis.crypto?.getRandomValues) {
      const n = new Uint32Array(1); globalThis.crypto.getRandomValues(n);
      return n[0] / 4294967296;
    }
    return Math.random();
  };
  function shuffle(items, rng = random) {
    const out = [...items];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1)); [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }
  function draw(bank, count = 8, rng = random) {
    const pool = shuffle(bank, rng), chosen = [], used = new Set();
    const take = q => { if (q && !used.has(q.id)) { chosen.push(q); used.add(q.id); } };
    // Include an application/calculation when available, then spread topics and difficulty.
    take(pool.find(q => q.kind === 'calculation'));
    for (const level of ['basic', 'apply', 'challenge']) take(pool.find(q => q.difficulty === level && !used.has(q.id)));
    for (const q of pool) {
      if (chosen.length >= count) break;
      if (!chosen.some(x => x.topic === q.topic)) take(q);
    }
    for (const q of pool) { if (chosen.length >= count) break; take(q); }
    return shuffle(chosen.slice(0, count), rng);
  }
  function create(bank, chapter, version, count = 8, rng = random) {
    const questions = draw(bank, count, rng);
    return { chapter, version, ids: questions.map(q => q.id), orders: Object.fromEntries(questions.map(q => [q.id, shuffle(q.options.map(o => o.id), rng)])), answers: {}, cursor: 0, completed: false, createdAt: new Date().toISOString() };
  }
  function valid(state, bank, chapter, version) {
    if (!state || state.chapter !== chapter || state.version !== version || !Array.isArray(state.ids) || !state.ids.length || new Set(state.ids).size !== state.ids.length || !Number.isInteger(state.cursor) || state.cursor < 0 || state.cursor >= state.ids.length || !state.answers || !state.orders) return false;
    const byId = new Map(bank.map(q => [q.id, q]));
    return Object.keys(state.answers).every(id => state.ids.includes(id)) && state.ids.every(id => {
      const q = byId.get(id), order = state.orders[id];
      return q && Array.isArray(order) && order.length === q.options.length && new Set(order).size === order.length && order.every(oid => q.options.some(o => o.id === oid)) && (!Object.hasOwn(state.answers, id) || order.includes(state.answers[id]));
    }) && (!state.completed || state.ids.every(id => Object.hasOwn(state.answers, id)));
  }
  function grade(state, bank) {
    const selected = new Map(bank.map(q => [q.id, q]));
    const results = state.ids.map(id => ({ id, selected: state.answers[id] ?? null, correct: state.answers[id] === selected.get(id)?.answer }));
    return { total: results.length, answered: results.filter(r => r.selected !== null).length, correct: results.filter(r => r.correct).length, results };
  }
  const api = { shuffle, draw, create, valid, grade };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.CoursePracticeEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
