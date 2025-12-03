import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'script.js',
    output: {
        file: 'bundle.js',
        format: 'iife',
        name: 'MyBundle',
    },
    plugins: [
        resolve(),     // <-- let Rollup load node_modules packages
        commonjs()     // <-- convert CommonJS to browser-compatible code
    ]
};
