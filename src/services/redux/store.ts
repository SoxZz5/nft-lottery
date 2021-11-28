import {
  createStore,
  applyMiddleware,
  Reducer,
  combineReducers,
  StoreEnhancer,
  compose,
} from "redux";
import thunk, { ThunkMiddleware } from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import minterReducer from "@/services/redux/minter/minter.reducer";
import userReducer from "@/services/redux/user/user.reducer";

const rootReducer = combineReducers({
  user: userReducer,
  minter: minterReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const middleware: ThunkMiddleware[] = [thunk];

const composeEhancers: StoreEnhancer = compose(applyMiddleware(...middleware));

const persistedReducer = persistReducer(persistConfig, rootReducer);

const configureStore = () => {
  return createStore(rootReducer, composeEhancers);
};

const store: any = configureStore();
const persistor = persistStore(store);
export { store, persistor };
