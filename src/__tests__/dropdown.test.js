import { screen, render } from '@testing-library/react'
import '@testing-library/jest-dom'
import DjDropdown from '../Components/Emitters/Dropdown'
import userEvent from '@testing-library/user-event'

global.fetch = jest.fn(() => {})

afterEach(() => {
    jest.restoreAllMocks()
})

// Tests that the DjDropdown component renders correctly with the expected number of options in the dropdown menu.
it('test_dropdown_renders_correctly', async () => {
    const payload = {
        'Option 1': 'option1',
        'Option 2': 'option2',
        'Option 3': 'option3'
    }
    const updatePageStore = jest.fn()
    render(
        <DjDropdown
            channel='test'
            height={100}
            payload={payload}
            updatePageStore={updatePageStore}
        />
    )
    const dropdownButton = screen.getByRole('button')
    await userEvent.click(dropdownButton)
    // screen.debug(undefined, Infinity)
    const dropdownMenu = screen.getByRole('menu')
    expect(dropdownMenu.children.length).toBe(3)
})

// Tests that the Dropdown component updates the selection and store correctly when clicked.
it('test_dropdown_updates_selection_and_store_on_click', async () => {
    const payload = {
        'Option 1': 'option1',
        'Option 2': 'option2',
        'Option 3': 'option3'
    }
    const updatePageStore = jest.fn()
    render(
        <DjDropdown
            channel='test'
            height={100}
            payload={payload}
            updatePageStore={updatePageStore}
        />
    )
    const dropdownButton = screen.getByRole('button')
    await userEvent.click(dropdownButton)
    const dropdownMenu = screen.getByRole('menu')
    const option2 = dropdownMenu.children[1]
    await userEvent.click(option2)
    expect(updatePageStore).toHaveBeenCalledWith('test', ['option2'])
    expect(dropdownButton.textContent).toBe('option2 ')
})

// Tests that the function handles a payload object with only one key-value pair correctly.
it('test_payload_object_with_one_key_value_pair', () => {
    const payload = {
        'Option 1': 'option1'
    }
    const updatePageStore = jest.fn()
    render(
        <DjDropdown
            channel='test'
            height={100}
            payload={payload}
            updatePageStore={updatePageStore}
        />
    )
    const dropdownButton = screen.getByRole('button')
    expect(dropdownButton.textContent).toBe('Option 1 ')
})
