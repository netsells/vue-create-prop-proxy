/**
 * Create a getter/setter proxy to allow updating of props.
 *
 * @param {Array} props
 * @param {object} config
 * @param {string} config.suffix - Provide a suffix for the proxy key.
 * @param {Function|undefined} config.get - Define a custom getter.
 * @param {Function|undefined} config.set - Define a custom setter.
 * @param {Function|undefined} config.getFormatter - Format the value before it is returned.
 * @param {Function|undefined} config.setFormatter - Format the value before it is emitted.
 *
 * @returns {object}
 */
const createPropProxy = (props, {
    suffix = 'Proxy',
    get: getter = undefined,
    set: setter = undefined,
    setFormatter = (val) => val,
    getFormatter = (val) => val,
} = {}) => props.reduce((p, prop) => ({
    ...p,
    [`${ prop }${ suffix }`]: {
        get() {
            return getter
                ? getter.call(this, prop)
                : getFormatter(this[prop]);
        },

        set(val) {
            const event = prop === 'value'
                ? 'input'
                : `update:${ prop }`;

            setter
                ? setter.call(this, prop, val)
                : this.$emit(event, setFormatter(val));
        },
    },
}), {});

export default createPropProxy;
