import createPropProxy from './index';
import { mount } from '@vue/test-utils';

describe('lib/prop-proxies', () => {
    describe('createPropProxy', () => {
        const defaultComponent = () => ({
            template: `
                <div>
                    {{ fooProxy }}
                    {{ barProxy }}
                </div>
            `,

            props: ['foo', 'bar'],

            computed: createPropProxy([
                'foo',
                'bar',
            ]),
        });

        let wrapper;

        beforeEach(() => {
            wrapper = mount(defaultComponent(), {
                propsData: {
                    foo: 'foo value',
                    bar: 'bar value',
                },
            });
        });

        test('getters are generated with the default `Proxy` suffix', () => {
            expect(wrapper.vm.fooProxy)
                .toBeTruthy();
            expect(wrapper.vm.barProxy)
                .toBeTruthy();
        });

        test('getters return the correct prop values', () => {
            expect(wrapper.vm.fooProxy)
                .toBe('foo value');
            expect(wrapper.vm.barProxy)
                .toBe('bar value');
        });

        describe('when a proxy value is updated', () => {
            beforeEach(() => {
                wrapper.vm.fooProxy = 'updated value';
            });

            test('updating a value emits the update event', () => {
                expect(wrapper.emitted('update:foo')[0])
                    .toEqual(['updated value']);
            });
        });

        describe('when the suffix option is provided', () => {
            beforeEach(() => {
                wrapper = mount({
                    ...defaultComponent(),

                    template: `
                        <div>
                            {{ fooValue }}
                            {{ barValue }}
                        </div>
                    `,

                    computed: createPropProxy([
                        'foo',
                        'bar',
                    ], {
                        suffix: 'Value',
                    }),
                }, {
                    propsData: {
                        foo: 'foo value',
                        bar: 'bar value',
                    },
                });
            });

            test('getters are generated with the provided suffix', () => {
                expect(wrapper.vm.fooValue)
                    .toBeTruthy();
                expect(wrapper.vm.barValue)
                    .toBeTruthy();
            });
        });

        describe('when a getFormatter is provided', () => {
            const formatter = jest.fn((val) => val.toUpperCase());

            beforeEach(() => {
                wrapper = mount({
                    ...defaultComponent(),

                    computed: createPropProxy([
                        'foo',
                        'bar',
                    ], {
                        getFormatter: formatter,
                    }),
                }, {
                    propsData: {
                        foo: 'foo value',
                        bar: 'bar value',
                    },
                });
            });

            test('the formatter is called', () => {
                expect(formatter)
                    .toHaveBeenCalledWith('foo value');
                expect(formatter)
                    .toHaveBeenCalledWith('bar value');
            });

            test('the formatted data is returned', () => {
                expect(wrapper.vm.fooProxy)
                    .toBe('FOO VALUE');
                expect(wrapper.vm.barProxy)
                    .toBe('BAR VALUE');
            });
        });

        describe('when a setFormatter is provided', () => {
            const formatter = jest.fn((val) => val.toUpperCase());

            beforeEach(() => {
                wrapper = mount({
                    ...defaultComponent(),

                    computed: createPropProxy([
                        'foo',
                        'bar',
                    ], {
                        setFormatter: formatter,
                    }),
                }, {
                    propsData: {
                        foo: 'foo value',
                        bar: 'bar value',
                    },
                });
            });

            describe('and the value is updated', () => {
                beforeEach(() => {
                    wrapper.vm.fooProxy = 'updated foo value';
                    wrapper.vm.barProxy = 'updated bar value';
                });

                test('the formatter is called', () => {
                    expect(formatter)
                        .toHaveBeenCalledWith('updated foo value');
                    expect(formatter)
                        .toHaveBeenCalledWith('updated bar value');
                });

                test('the formatted data is emitted', () => {
                    expect(wrapper.emitted('update:foo')[0])
                        .toEqual(['UPDATED FOO VALUE']);
                    expect(wrapper.emitted('update:bar')[0])
                        .toEqual(['UPDATED BAR VALUE']);
                });
            });
        });

        describe('when a get function is provided', () => {
            const getFunction = jest.fn(() => 'custom');

            beforeEach(() => {
                wrapper = mount({
                    ...defaultComponent(),

                    computed: createPropProxy([
                        'foo',
                        'bar',
                    ], {
                        get: getFunction,
                    }),
                }, {
                    propsData: {
                        foo: 'foo value',
                        bar: 'bar value',
                    },
                });
            });

            test('the provided function is called with the prop name', () => {
                expect(getFunction)
                    .toHaveBeenCalledWith('foo');
                expect(getFunction)
                    .toHaveBeenCalledWith('bar');
            });

            test('the provided function value is returned', () => {
                expect(wrapper.vm.fooProxy)
                    .toBe('custom');
                expect(wrapper.vm.barProxy)
                    .toBe('custom');
            });
        });

        describe('when a set function is provided', () => {
            const setFunction = jest.fn(function(foo, val) {
                this.$emit(`custom:${ foo }`, val);
            });

            beforeEach(() => {
                wrapper = mount({
                    ...defaultComponent(),

                    computed: createPropProxy([
                        'foo',
                        'bar',
                    ], {
                        set: setFunction,
                    }),
                }, {
                    propsData: {
                        foo: 'foo value',
                        bar: 'bar value',
                    },
                });
            });

            describe('and the value is updated', () => {
                beforeEach(() => {
                    wrapper.vm.fooProxy = 'some foo value';
                    wrapper.vm.barProxy = 'some bar value';
                });

                test('the provided function is called with the prop name and the value', () => {
                    expect(setFunction)
                        .toHaveBeenCalledWith('foo', 'some foo value');
                    expect(setFunction)
                        .toHaveBeenCalledWith('bar', 'some bar value');
                });

                test('the provided function is run', () => {
                    expect(wrapper.emitted('custom:foo')[0])
                        .toEqual(['some foo value']);
                    expect(wrapper.emitted('custom:bar')[0])
                        .toEqual(['some bar value']);
                });
            });
        });

        describe('when the prop is `value`', () => {
            beforeEach(() => {
                wrapper = mount({
                    template: `
                        <div>
                            {{ valueProxy }}
                        </div>
                    `,

                    props: ['value'],

                    computed: createPropProxy([
                        'value',
                    ]),
                }, {
                    propsData: {
                        value: 'foo value',
                    },
                });
            });

            describe('and the value is updated', () => {
                beforeEach(() => {
                    wrapper.vm.valueProxy = 'test';
                });

                test('the `input` event is emitted on update', () => {
                    expect(wrapper.emitted('input')[0])
                        .toEqual(['test']);
                });
            });
        });
    });
});
