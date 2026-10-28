import test from 'node:test';
import assert from 'node:assert/strict';
import { introReducer, initialIntroContext, IntroContext } from './introMachine';

test('PREF_LOADED moves to intro-loading when enabled and no skip/reduced motion', () => {
  const result = introReducer(initialIntroContext, {
    type: 'PREF_LOADED',
    enabled: true,
    skip: false,
    reducedMotion: false,
  });
  assert.equal(result.state, 'intro-loading');
  assert.equal(result.hasTransitioned, false);
});

test('PREF_LOADED bypasses directly to portfolio-ready when skip is stored', () => {
  const result = introReducer(initialIntroContext, {
    type: 'PREF_LOADED',
    enabled: true,
    skip: true,
    reducedMotion: false,
  });
  assert.equal(result.state, 'portfolio-ready');
  assert.equal(result.hasTransitioned, true);
});

test('PREF_LOADED bypasses directly to portfolio-ready when reduced motion is preferred', () => {
  const result = introReducer(initialIntroContext, {
    type: 'PREF_LOADED',
    enabled: true,
    skip: false,
    reducedMotion: true,
  });
  assert.equal(result.state, 'portfolio-ready');
});

test('PREF_LOADED bypasses directly to portfolio-ready when intro is disabled in settings', () => {
  const result = introReducer(initialIntroContext, {
    type: 'PREF_LOADED',
    enabled: false,
    skip: false,
    reducedMotion: false,
  });
  assert.equal(result.state, 'portfolio-ready');
});

test('CAN_PLAY moves from intro-loading to intro-playing', () => {
  const loadingCtx: IntroContext = { ...initialIntroContext, state: 'intro-loading' };
  const result = introReducer(loadingCtx, { type: 'CAN_PLAY' });
  assert.equal(result.state, 'intro-playing');
});

test('Duplicate ENDED and SKIP in same tick only triggers transition once', () => {
  const playingCtx: IntroContext = { ...initialIntroContext, state: 'intro-playing' };
  const first = introReducer(playingCtx, { type: 'ENDED' });
  assert.equal(first.state, 'transitioning');
  assert.equal(first.hasTransitioned, true);

  // Subsequent SKIP should not reset or re-trigger
  const second = introReducer(first, { type: 'SKIP' });
  assert.equal(second.state, 'transitioning');
});

test('TIMEOUT and AUTOPLAY_BLOCKED transition to intro-fallback safely', () => {
  const loadingCtx: IntroContext = { ...initialIntroContext, state: 'intro-loading' };
  const timeoutRes = introReducer(loadingCtx, { type: 'TIMEOUT' });
  assert.equal(timeoutRes.state, 'intro-fallback');
  assert.equal(timeoutRes.isError, true);

  const blockedRes = introReducer(loadingCtx, { type: 'AUTOPLAY_BLOCKED' });
  assert.equal(blockedRes.state, 'intro-fallback');
  assert.equal(blockedRes.isAutoplayBlocked, true);
});

test('REPLAY restarts video from portfolio-ready', () => {
  const readyCtx: IntroContext = { ...initialIntroContext, state: 'portfolio-ready', hasTransitioned: true };
  const replayed = introReducer(readyCtx, { type: 'REPLAY' });
  assert.equal(replayed.state, 'intro-loading');
  assert.equal(replayed.hasTransitioned, false);
});
