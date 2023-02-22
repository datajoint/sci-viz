import { configureStore } from '@reduxjs/toolkit'
import hiddenPageReducer from './Slices/hiddenPageSlice'

const store = configureStore({
    reducer: {
        hiddenPage: hiddenPageReducer
    }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export default store
