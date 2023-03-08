import { createContext } from 'react'
import { SciVizContextType } from './SciVizInterfaces'

export const SciVizContext = createContext<SciVizContextType>({
    componentContext: undefined
})
