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
