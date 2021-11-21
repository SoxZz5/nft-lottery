import {
  createStore,
  applyMiddleware,
  Reducer,
  combineReducers,
  StoreEnhancer,
  compose,
} from "redux";
import thunk, { ThunkMiddleware } from "redux-thunk";

const rootReducer = combineReducers({});

const middleware: ThunkMiddleware[] = [thunk];

const composeEhancers: StoreEnhancer = compose(applyMiddleware(...middleware));

const configureStore = () => {
  return createStore(rootReducer, composeEhancers);
};

const store = configureStore();
export default store;
