import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UpdatePageStoreState {
    /**
     * A callback function to refresh the page store
     * @param {string} key - The key of the component that the store object belongs to
     * @param {string[]} record - The list of key-values as strings to add to the store
     */
    updatePageStore: ((key: string, record: string[]) => void) | undefined
}

// Define the initial state of the updatePageStore
const initialState: UpdatePageStoreState = {
    updatePageStore: undefined
}

// Define a slice of the state with a name, initial state, and reducers
const updatePageStoreSlice = createSlice({
    name: 'updatePageStore',
    initialState,
    reducers: {
        setUpdatePageStore(
            state,
            action: PayloadAction<(key: string, record: string[]) => void>
        ) {
            state.updatePageStore = action.payload
        }
    }
})

// Export the actions and reducer from the slice
export const { setUpdatePageStore } = updatePageStoreSlice.actions
export default updatePageStoreSlice.reducer
