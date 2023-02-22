import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RestrictionStore } from '../../SciVizInterfaces'

interface PageStoreState {
    /**
     * A callback function to refresh the page store
     * @param {string} key - The key of the component that the store object belongs to
     * @param {string[]} record - The list of key-values as strings to add to the store
     */
    updatePageStore: ((key: string, record: string[]) => void) | undefined
    pageStore: RestrictionStore | undefined
}

// Define the initial state of the updatePageStore
const initialState: PageStoreState = {
    updatePageStore: undefined,
    pageStore: undefined
}

// Define a slice of the state with a name, initial state, and reducers
const pageStoreSlice = createSlice({
    name: 'PageStore',
    initialState,
    reducers: {
        setUpdatePageStore(
            state,
            action: PayloadAction<(key: string, record: string[]) => void>
        ) {
            state.updatePageStore = action.payload
        },
        setPageStore: (state, action: PayloadAction<RestrictionStore>) => {
            state.pageStore = action.payload
        }
    }
})

// Export the actions and reducer from the slice
export const { setUpdatePageStore, setPageStore } = pageStoreSlice.actions
export default pageStoreSlice.reducer
