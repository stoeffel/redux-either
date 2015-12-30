import { isFSA } from 'flux-standard-action';


const omit = attr => action => {
  const clone = { ...action };
  delete clone[attr];
  return clone;
};

export default (isLeft, isRight, either) => function eitherMiddleware({ dispatch }) {
  const isEither = val => val && (isLeft(val) || isRight(val));

  return next => action => {
    if (!isFSA(action)) {
      return isEither(action.either)
      ? dispatch({ ...omit('either')(action), payload: either(action.either) })
      : next(action);
    }

    return isEither(action.payload)
    ? isLeft(action.payload)
      ? dispatch({ ...omit('payload')(action), error: either(action.payload) })
      : dispatch({ ...action, payload: either(action.payload) })
    : next(action);
  };
}
