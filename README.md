# @netsells/vue-create-prop-proxy

This package allows you to easily create prop getters and setters to allow you to update props in your component.

## Installation

```sh
$ yarn add @netsells/vue-create-prop-proxy
``` 

## Usage

This package will emit `update:<prop>` events when the prop is not `value`, and `input` events when the prop is `value` to make it consistent with the default model behaviour.

### Custom suffix

By default the props provided will be suffixed with `Proxy`, e.g. `valueProxy`, `emailProxy` but this can be overridden with the `suffix` option, e.g.

```js
createPropProxy([
    'value',
], {
    suffix: 'CustomSuffix',
})
```

Would provide `valueCustomSuffix` to your component.

### Custom getter/setting

If you want your value to come from somewhere else, for instance the store, you can provide a custom getter and/or setter:

```js
createPropProxy([
    'value',
], {
    get(prop) {
        return this.$store.state.foo;
    },
    set(prop, val) {
        this.$store.commit('setFoo', val);
    },
})
```

### Custom formatters

If you want to format your data before and/or after it's updated, you can provide formatters for these:


```js
createPropProxy([
    'value',
], {
    getFormatter(prop) {
        return JSON.parse(prop);
    },
    setFormatter(prop, val) {
        return JSON.stringify(val);
    },
})
```

### Single value model

```vue
<template>
    <input type="text" v-model="valueProxy">
</template>

<script>
    import createPropProxy from '@netsells/vue-create-prop-proxy';

    export default {
        name: 'my-input',

        props: {
            value: {
                type: String,
                default: '',
            },
        },

        computed: {
            ...createPropProxy([
                'value',
            ]),
        },
    };
</script>
```

### Multiple props

```vue
<template>
    <div>
        <label for="firstname">First Name</label>
        <input 
            type="text"
            id="firstname"
            v-model="firstnameProxy"
        >
        <label for="lastname">Last Name</label>
        <input 
            type="text"
            id="lastname"
            v-model="lastnameProxy"
        >
        <label for="email">Email</label>
        <input 
            type="text"
            id="email"
            v-model="emailProxy"
        >
    </div>
</template>

<script>
    import createPropProxy from '@netsells/vue-create-prop-proxy';

    export default {
        name: 'user-fields',

        props: {
            firstname: {
                type: String,
                default: '',
            },
            
            lastname: {
                type: String,
                default: '',
            },
            
            email: {
                type: String,
                default: '',
            },
        },

        computed: {
            ...createPropProxy([
                'firstname',
                'lastname',
                'email',
            ]),
        },
    };
</script>
```
