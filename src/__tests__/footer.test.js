import renderer from 'react-test-renderer'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import packageJSON from '../../package.json'

import Footer from '../Components/Footer/Footer.tsx'
global.fetch = jest.fn(() => {})

afterEach(() => {
    jest.restoreAllMocks()
})

// Snapshot
it('snapshot_of_footer_component', () => {
    const tree = renderer.create(<Footer />).toJSON()
    expect(tree).toMatchSnapshot()
})

// Tests that the backend version number is set successfully.
it('test_set_backend_version_successfully', async () => {
    const mockResponse = { version: packageJSON.version }
    jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
        status: 200
    })

    const { findByText } = render(<Footer />)
    const versionNumber = await findByText(packageJSON.version)

    expect(versionNumber).toBeInTheDocument()

    global.fetch.mockRestore()
})

// Tests that the function fails to fetch the version number from the backend but gracefully handles the error and sets an appropriate message in the state.
it('test_get_version_number_failure', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        status: 500
    })

    const { findByText } = render(<Footer />)
    const versionNumber = await findByText('Unable to get version number', { exact: false })

    expect(versionNumber).toBeInTheDocument()
})
