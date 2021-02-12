import { AppStore } from './app-store';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

/* tslint:disable */
export function applyDevTools(debug) {
  // default to window query param
  let isDebug = false;
  // allow overriding with a boolean or function
  if (debug == undefined) {
    isDebug = window && !!window.location.href.match(/[?&]debug=([^&]+)\b/)
  } else {
    if (debug instanceof Function) {
      isDebug = debug();
    } else {
      isDebug = debug;
    }
  }

  // only apply is dev tools is installed
  return isDebug;
}
/* tslint:enable */

/**
 * Factory for app store
 */
export function createAppStoreFactory(reducers?, additionalMiddlewares?) {
  return createAppStoreFactoryWithOptions({
    reducers,
    additionalMiddlewares
  });
}

export function createAppStoreFactoryWithOptions({
  reducers,
  additionalMiddlewares = [],
  debug = false
}) {

  return () => {

    // Figure out reducers
    let reducer = reducers;
    if (typeof reducer === 'object') {
      // it's not a single reducer so we need to combine the reducers on the object properties
      reducer = combineReducers(reducers);
    }

    const middleware = [thunk];

    let reduxAppStore;
    debug = applyDevTools(debug);
    if (debug === undefined || !debug) {
      let createStoreWithEnhancers = applyMiddleware(...middleware)(createStore);
      reduxAppStore = createStoreWithEnhancers(reducer);
    } else {
      reduxAppStore = createStore(
        reducer,
        composeWithDevTools(
          applyMiddleware(...middleware, ...additionalMiddlewares)
        )
      );
    }

    return new AppStore(reduxAppStore);
  };
}
