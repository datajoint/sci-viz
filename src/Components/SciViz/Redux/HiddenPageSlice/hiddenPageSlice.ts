import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UpdateHiddenPageState {
    /**
     * A callback function to display a SciViz hidden page.
     * Replaces the current tab bar with a new temporary one with just the hidden page and the previous page
     * @param route - The route of the hidden page
     * @param queryParams - The query params to restrict the components of the page by
     */
    updateHiddenPage: ((route: string, queryParams: string) => void) | undefined
}

// Define the initial state of the updateHiddenPage
const initialState: UpdateHiddenPageState = {
    updateHiddenPage: undefined
}

// Define a slice of the state with a name, initial state, and reducers
const updateHiddenPageSlice = createSlice({
    name: 'updateHiddenPage',
    initialState,
    reducers: {
        setUpdateHiddenPage(
            state,
            action: PayloadAction<(route: string, queryParams: string) => void>
        ) {
            state.updateHiddenPage = action.payload
        }
    }
})

// Export the actions and reducer from the slice
export const { setUpdateHiddenPage } = updateHiddenPageSlice.actions
export default updateHiddenPageSlice.reducer
