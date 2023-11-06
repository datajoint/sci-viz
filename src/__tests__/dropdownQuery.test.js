import { screen, render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import DjDropdownQuery from '../Components/Emitters/DropdownQuery'
import userEvent from '@testing-library/user-event'

global.fetch = jest.fn(() => {})

afterEach(() => {
    jest.restoreAllMocks()
})

// Tests that the Dropdown menu displays the correct items.
it('test_dropdown_menu_displays_correct_items', async () => {
    const props = {
        channel: 'test',
        height: 100,
        route: '/test',
        token: 'test_token',
        updatePageStore: jest.fn()
    }
    const records = {
        recordHeader: ['header'],
        records: [['item1'], ['item2']],
        totalCount: 2
    }
    // Mock the getRecords function to return the records object
    jest.spyOn(DjDropdownQuery.prototype, 'getRecords').mockImplementation(() => {
        return Promise.resolve(records)
    })
    render(<DjDropdownQuery {...props} />)
    await waitFor(() => expect(screen.getByText('item1')).toBeInTheDocument())
    const dropdownButton = screen.getByRole('button')
    await userEvent.click(dropdownButton)
    const dropdownMenu = screen.getByRole('menu')
    expect(dropdownMenu.children.length).toBe(2)
})
