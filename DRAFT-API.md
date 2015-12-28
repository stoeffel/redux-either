```js
import { Either } from 'ramda-fantasy';
import eitherMiddleware from 'redux-either';

const createStoreWithMiddleware = applyMiddleware(
  eitherMiddleware(Either.Left, Either.Right)
)(createStore)

const action = createAction('FSA_ACTION');
store.dispatch(action(Either('left', 'bar')));

const future = new Future((reject, resolve) =>
  fetch(URL, (err, res) =>
    err ? reject(err)
        : resolve(Either('no user found', res.user)));

store.dispatch(action(future));
```
