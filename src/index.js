import { isFSA } from 'flux-standard-action';


const omit = attr => action => {
  const clone = { ...action };
  delete clone[attr];
  return clone;
};

const id = x => x;

export default (Either, either) => function eitherMiddleware({ dispatch }) {
  const isEither = val => val instanceof Either;

  return next => action => {
    if (!isFSA(action)) {
      return isEither(action.either)
      ? dispatch({ ...omit('either')(action), payload: either(id, id, action.either) })
      : next(action);
    }

    return isEither(action.payload)
    ?  either( leftVal  => dispatch({ ...omit('payload')(action), payload: leftVal, error: true })
             , rightVal => dispatch({ ...action, payload: rightVal })
             , action.payload)
    : next(action);
  };
}
