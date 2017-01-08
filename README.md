redux-either
============

[![build status](https://img.shields.io/travis/stoeffel/redux-either/master.svg?style=flat-square)](https://travis-ci.org/stoeffel/redux-either)
[![npm version](https://img.shields.io/npm/v/redux-either.svg?style=flat-square)](https://www.npmjs.com/package/redux-either)

[FSA](https://github.com/acdlite/flux-standard-action)-compliant either monad [middleware](https://github.com/gaearon/redux/blob/master/docs/middleware.md) for Redux.

This is based on [redux-future](https://github.com/stoeffel/redux-future).


```js
npm install --save redux-either
```

## Usage

```js
import eitherMiddleware from 'redux-either';
import { Either } from 'ramda-fantasy';
const store = createStore(
  reducer,
  initialState,
  applyMiddleware(
    eitherMiddleware(
      Either, // the Either instance
      Either.either // function to get the value from the Either
    )
  )
)()

// with data.either from folktale
import eitherMiddleware from 'redux-either';
import { Either } from 'ramda-fantasy';
const store = createStore(
  reducer,
  initialState,
  applyMiddleware(
    eitherMiddleware(
      Either, 
      (l, r, e) => e.fold(l, r)
    )
  )
)()
```


### Example

```js
import Either from 'data.either';

store.dispatch({
  type: 'ADD'
, either: Either.Right(2) // <= none FSA needs the either keyword
});

```

## Using in combination with redux-actions

Because it supports FSA actions, you can use redux-either in combination with [redux-actions](https://github.com/acdlite/redux-actions).

### Example: Action creators

```js
const action = createAction('FSA_ACTION');
store.dispatch(action(R.map(R.toUpper, Either.Right('test'))));
// => payload will be 'TEST'

store.dispatch(action(R.map(R.toUpper, Either.Left('error'))));
// => error will be 'error'
```

### Example: Future(Either)

You can use `redux-either` together with [`redux-future`](https://github.com/stoeffel/redux-future).

```js
// futureEither :: Future(Either(String))
const futureEither = new Future((reject, resolve) => {
  fetch('users', (err, res) =>
    err
      ? reject(err)
      : res.length <= 0
        ? resolve(Either.Left('no users found'))
        : resolve(Either.Right(res)));
});

const action = createAction('FSA_ACTION');
store.dispatch(action(futureEither));
```


## Related

### What's an Either?
* [mostly-adequate-guide  Chapter 8.4 Pure Error Handling](https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch8.html#pure-error-handling)

### Libraries

* [ramda-fantasy](https://github.com/ramda/ramda-fantasy)
* [folktale#data.either](https://github.com/folktale/data.either)
* [redux-io](https://github.com/stoeffel/redux-io)
* [redux-future](https://github.com/stoeffel/redux-future)
