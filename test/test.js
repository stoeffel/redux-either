import expect from 'expect';
import { createStore, applyMiddleware } from 'redux';
import { createAction } from 'redux-actions';
import R from 'ramda';
import { Future } from 'ramda-fantasy';
import Either from 'data.either';
import futureMiddleware from 'redux-future';

import eitherMiddleware from '../src';



describe('redux-either', () => {
  let store, unsubscribe;

  before(() => {
    const initialState =
      { counter: 0
      , fsa: 'failed'
      };

    function counter(state = initialState, action) {
      switch (action.type) {
      case 'ADD':
        return { ... state
               , counter: action.payload
               };
      case 'FSA_ACTION':
        return { ... state
               , fsa: action.error? state.fsa: action.payload
               , error: action.error
               };
      default:
        return state
      }
    }

    store = createStore(
      counter
    , initialState
    , applyMiddleware(
        futureMiddleware
      , eitherMiddleware( Either, (l, r, e) => e.fold(l, r))
      )
    );
  });


  afterEach(() => {
    unsubscribe();
  });

  it('should work with an right', done => {
    unsubscribe = store.subscribe(() => {
      expect(store.getState().counter).toEqual(1);
      done();
    });

    store.dispatch({ type: 'ADD', either: Either.Right(1) });
  });

  it('should work with an left', done => {
    unsubscribe = store.subscribe(() => {
      expect(store.getState().counter).toEqual(-1);
      done();
    });

    store.dispatch({ type: 'ADD', either: Either.Left(-1) });
  });

  it('should work with FSA and Right', done => {
    unsubscribe = store.subscribe(() => {
      expect(store.getState().fsa).toEqual('TEST');
      done();
    });

    const action = createAction('FSA_ACTION');
    store.dispatch(action(R.map(R.toUpper, Either.Right('test'))));
  });

  it('should work with FSA and Left', done => {
    unsubscribe = store.subscribe(() => {
      expect(store.getState().error).toEqual(true);
      done();
    });

    const action = createAction('FSA_ACTION');
    store.dispatch(action(R.map(R.toUpper, Either.Left('test'))));
  });

  it('should work together with futures', done => {
    unsubscribe = store.subscribe(() => {
      expect(store.getState().fsa).toEqual('back to the future');
      done();
    });
    const future = new Future((rej, res) => {
      setTimeout(() => res(Either.Right('back to the future')), 100);
    });


    const action = createAction('FSA_ACTION');
    store.dispatch(action(future));
  });
});
