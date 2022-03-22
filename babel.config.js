module.exports = {
    plugins: ['@babel/plugin-transform-modules-commonjs'],
    env: {
        test: {
            presets: [
                ['@babel/env', {
                    targets: {
                        node: 'current',
                    },
                }],
            ],
        },
    },
};
