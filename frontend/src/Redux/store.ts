import { combineReducers, applyMiddleware, createStore, Action } from "redux";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import thunk, { ThunkAction } from "redux-thunk";
import AuthReducer from "./Reducers/authReducer";

let reducers = combineReducers({
  AuthPage: AuthReducer,
});

const store = createStore(reducers, applyMiddleware(thunk));

(window as any).store = store;

export type ThunkActionType<AT extends Action, R = Promise<void>> = ThunkAction<
  R,
  () => RootState,
  unknown,
  AT
>;

export type ActionType<
  T extends string,
  AC extends Record<T, (...args: any) => any>
> = ReturnType<AC[T]>;

export type ActionsHandlerType<
  RT extends string,
  S extends Record<string, any>,
  AC extends Record<RT, (...args: any) => any>
> = {
  [key in RT]: (state: S, action: ActionType<key, AC>) => S;
};

export type ThunkType<
  RT extends string,
  AC extends Record<RT, (...args: any) => any>
> = ThunkActionType<ActionType<RT, AC>>;

export type RootState = ReturnType<typeof store.getState>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
