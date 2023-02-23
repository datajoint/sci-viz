import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'
const packageJson = require('./package.json')
export default {
    input: 'src/Components/SciViz/index.tsx',
    plugins: [
        peerDepsExternal(),
        resolve(),
        commonjs(),
        typescript({ useTsconfigDeclarationDir: true }),
        postcss({
            extensions: ['.css']
        }),
        json({
            compact: true
        })
    ]
}
