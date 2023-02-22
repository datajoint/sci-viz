import { configureStore, combineReducers } from '@reduxjs/toolkit'
import hiddenPageReducer from './Slices/hiddenPageSlice'
import pageStoreReducer from './Slices/pageStoreSlice'

const rootReducer = combineReducers({
    hiddenPage: hiddenPageReducer,
    pageStore: pageStoreReducer
})

const store = configureStore({
    reducer: rootReducer
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export default store
