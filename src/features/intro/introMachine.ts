export type IntroState =
  | 'checking-preference'
  | 'intro-loading'
  | 'intro-playing'
  | 'transitioning'
  | 'portfolio-ready'
  | 'intro-fallback';

export type IntroEvent =
  | { type: 'PREF_LOADED'; skip: boolean; reducedMotion: boolean; enabled: boolean }
  | { type: 'CAN_PLAY' }
  | { type: 'PLAYING' }
  | { type: 'ENDED' }
  | { type: 'SKIP' }
  | { type: 'ERROR' }
  | { type: 'TIMEOUT' }
  | { type: 'AUTOPLAY_BLOCKED' }
  | { type: 'TRANSITION_DONE' }
  | { type: 'REPLAY' };

export interface IntroContext {
  state: IntroState;
  hasTransitioned: boolean;
  skipFutureVisits: boolean;
  reducedMotion: boolean;
  isAutoplayBlocked: boolean;
  isError: boolean;
}

export const initialIntroContext: IntroContext = {
  state: 'checking-preference',
  hasTransitioned: false,
  skipFutureVisits: false,
  reducedMotion: false,
  isAutoplayBlocked: false,
  isError: false,
};

export function introReducer(ctx: IntroContext, event: IntroEvent): IntroContext {
  switch (event.type) {
    case 'PREF_LOADED': {
      if (!event.enabled || event.skip || event.reducedMotion) {
        return {
          ...ctx,
          state: 'portfolio-ready',
          skipFutureVisits: event.skip,
          reducedMotion: event.reducedMotion,
          hasTransitioned: true,
        };
      }
      return {
        ...ctx,
        state: 'intro-loading',
        skipFutureVisits: event.skip,
        reducedMotion: event.reducedMotion,
      };
    }

    case 'CAN_PLAY':
    case 'PLAYING': {
      if (ctx.state === 'intro-loading' || ctx.state === 'intro-fallback') {
        return {
          ...ctx,
          state: 'intro-playing',
          isAutoplayBlocked: false,
          isError: false,
        };
      }
      return ctx;
    }

    case 'ENDED':
    case 'SKIP': {
      // Guard: do not double-transition if already transitioning or finished
      if (ctx.hasTransitioned || ctx.state === 'transitioning' || ctx.state === 'portfolio-ready') {
        return ctx;
      }
      return {
        ...ctx,
        state: 'transitioning',
        hasTransitioned: true,
      };
    }

    case 'ERROR': {
      if (ctx.state === 'portfolio-ready') return ctx;
      return {
        ...ctx,
        state: 'intro-fallback',
        isError: true,
      };
    }

    case 'TIMEOUT': {
      if (ctx.state === 'intro-loading') {
        return {
          ...ctx,
          state: 'intro-fallback',
          isError: true,
        };
      }
      return ctx;
    }

    case 'AUTOPLAY_BLOCKED': {
      if (ctx.state === 'intro-loading' || ctx.state === 'intro-playing') {
        return {
          ...ctx,
          state: 'intro-fallback',
          isAutoplayBlocked: true,
        };
      }
      return ctx;
    }

    case 'TRANSITION_DONE': {
      return {
        ...ctx,
        state: 'portfolio-ready',
      };
    }

    case 'REPLAY': {
      return {
        ...ctx,
        state: 'intro-loading',
        hasTransitioned: false,
        isAutoplayBlocked: false,
        isError: false,
      };
    }

    default:
      return ctx;
  }
}
