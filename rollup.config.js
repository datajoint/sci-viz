import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'

export default {
    input: './src/Components/SciViz/PkgExports.tsx',
    plugins: [
        typescript({ tsconfig: './tsconfig.json' }),
        resolve(),
        commonjs(),
        postcss({
            extensions: ['.css']
        }),
        json()
    ],
    output: { dir: 'dist', format: 'es', sourcemap: true, name: 'datajoint-sciviz' }
}
