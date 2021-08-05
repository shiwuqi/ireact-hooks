import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import typescript2 from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';

export default {
    input: 'src/index.ts',
    output: [
        {
            dir: 'lib',
            preserveModules: false,
            format: 'cjs',
        }
    ],
    plugins: [
        terser(),
        typescript2({
            tsconfig: "tsconfig.json", typescript: require("typescript")
        }),
        resolve(),
        babel({
            exclude: 'node_modules/**' // 只编译我们的源代码
        }),
        commonjs(),
        postcss({
            extensions: ['.css'],
            autoModules: false,
            modules: false,
            minimize: true,
        }),
    ],
    external: ['react']
};