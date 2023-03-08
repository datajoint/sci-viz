import { createContext } from 'react'
import { ExternalContextType } from './SciVizInterfaces'

export const ExternalContext = createContext<ExternalContextType>({
    componentContext: undefined
})
