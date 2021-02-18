
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined' ? window : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.20.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe,
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function regexparam (str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules/svelte-spa-router/Router.svelte generated by Svelte v3.20.1 */

    const { Error: Error_1, Object: Object_1, console: console_1 } = globals;

    // (209:0) {:else}
    function create_else_block(ctx) {
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[10]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[10]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(209:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (207:0) {#if componentParams}
    function create_if_block(ctx) {
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		return {
    			props: { params: /*componentParams*/ ctx[1] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[9]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*componentParams*/ 2) switch_instance_changes.params = /*componentParams*/ ctx[1];

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[9]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(207:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(route, userData, ...conditions) {
    	// Check if we don't have userData
    	if (userData && typeof userData == "function") {
    		conditions = conditions && conditions.length ? conditions : [];
    		conditions.unshift(userData);
    		userData = undefined;
    	}

    	// Parameter route and each item of conditions must be functions
    	if (!route || typeof route != "function") {
    		throw Error("Invalid parameter route");
    	}

    	if (conditions && conditions.length) {
    		for (let i = 0; i < conditions.length; i++) {
    			if (!conditions[i] || typeof conditions[i] != "function") {
    				throw Error("Invalid parameter conditions[" + i + "]");
    			}
    		}
    	}

    	// Returns an object that contains all the functions to execute too
    	const obj = { route, userData };

    	if (conditions && conditions.length) {
    		obj.conditions = conditions;
    	}

    	// The _sveltesparouter flag is to confirm the object was created by this router
    	Object.defineProperty(obj, "_sveltesparouter", { value: true });

    	return obj;
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf("#/");

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: "/";

    	// Check if there's a querystring
    	const qsPosition = location.indexOf("?");

    	let querystring = "";

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(getLocation(), // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener("hashchange", update, false);

    	return function stop() {
    		window.removeEventListener("hashchange", update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);

    function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	return nextTickPromise(() => {
    		window.location.hash = (location.charAt(0) == "#" ? "" : "#") + location;
    	});
    }

    function pop() {
    	// Execute this code when the current call stack is complete
    	return nextTickPromise(() => {
    		window.history.back();
    	});
    }

    function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	return nextTickPromise(() => {
    		const dest = (location.charAt(0) == "#" ? "" : "#") + location;

    		try {
    			window.history.replaceState(undefined, undefined, dest);
    		} catch(e) {
    			// eslint-disable-next-line no-console
    			console.warn("Caught exception while replacing the current page. If you're running this in the Svelte REPL, please note that the `replace` method might not work in this environment.");
    		}

    		// The method above doesn't trigger the hashchange event, so let's do that manually
    		window.dispatchEvent(new Event("hashchange"));
    	});
    }

    function link(node) {
    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != "a") {
    		throw Error("Action \"link\" can only be used with <a> tags");
    	}

    	// Destination must start with '/'
    	const href = node.getAttribute("href");

    	if (!href || href.length < 1 || href.charAt(0) != "/") {
    		throw Error("Invalid value for \"href\" attribute");
    	}

    	// Add # to every href attribute
    	node.setAttribute("href", "#" + href);
    }

    function nextTickPromise(cb) {
    	return new Promise(resolve => {
    			setTimeout(
    				() => {
    					resolve(cb());
    				},
    				0
    			);
    		});
    }

    function instance($$self, $$props, $$invalidate) {
    	let $loc,
    		$$unsubscribe_loc = noop;

    	validate_store(loc, "loc");
    	component_subscribe($$self, loc, $$value => $$invalidate(4, $loc = $$value));
    	$$self.$$.on_destroy.push(() => $$unsubscribe_loc());
    	let { routes = {} } = $$props;
    	let { prefix = "" } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent} component - Svelte component for the route
     */
    		constructor(path, component) {
    			if (!component || typeof component != "function" && (typeof component != "object" || component._sveltesparouter !== true)) {
    				throw Error("Invalid component object");
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == "string" && (path.length < 1 || path.charAt(0) != "/" && path.charAt(0) != "*") || typeof path == "object" && !(path instanceof RegExp)) {
    				throw Error("Invalid value for \"path\" argument");
    			}

    			const { pattern, keys } = regexparam(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == "object" && component._sveltesparouter === true) {
    				this.component = component.route;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    			} else {
    				this.component = component;
    				this.conditions = [];
    				this.userData = undefined;
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, remove it before we run the matching
    			if (prefix && path.startsWith(prefix)) {
    				path = path.substr(prefix.length) || "/";
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				out[this._keys[i]] = matches[++i] || null;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {SvelteComponent} component - Svelte component
     * @property {string} name - Name of the Svelte component
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {Object} [userData] - Custom data passed by the user
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {bool} Returns true if all the conditions succeeded
     */
    		checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	const dispatchNextTick = (name, detail) => {
    		// Execute this code when the current call stack is complete
    		setTimeout(
    			() => {
    				dispatch(name, detail);
    			},
    			0
    		);
    	};

    	const writable_props = ["routes", "prefix"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Router", $$slots, []);

    	function routeEvent_handler(event) {
    		bubble($$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ("routes" in $$props) $$invalidate(2, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(3, prefix = $$props.prefix);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		derived,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		push,
    		pop,
    		replace,
    		link,
    		nextTickPromise,
    		createEventDispatcher,
    		regexparam,
    		routes,
    		prefix,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		dispatch,
    		dispatchNextTick,
    		$loc
    	});

    	$$self.$inject_state = $$props => {
    		if ("routes" in $$props) $$invalidate(2, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(3, prefix = $$props.prefix);
    		if ("component" in $$props) $$invalidate(0, component = $$props.component);
    		if ("componentParams" in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*component, $loc*/ 17) {
    			// Handle hash change events
    			// Listen to changes in the $loc store and update the page
    			 {
    				// Find a route matching the location
    				$$invalidate(0, component = null);

    				let i = 0;

    				while (!component && i < routesList.length) {
    					const match = routesList[i].match($loc.location);

    					if (match) {
    						const detail = {
    							component: routesList[i].component,
    							name: routesList[i].component.name,
    							location: $loc.location,
    							querystring: $loc.querystring,
    							userData: routesList[i].userData
    						};

    						// Check if the route can be loaded - if all conditions succeed
    						if (!routesList[i].checkConditions(detail)) {
    							// Trigger an event to notify the user
    							dispatchNextTick("conditionsFailed", detail);

    							break;
    						}

    						$$invalidate(0, component = routesList[i].component);

    						// Set componentParams onloy if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    						// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    						if (match && typeof match == "object" && Object.keys(match).length) {
    							$$invalidate(1, componentParams = match);
    						} else {
    							$$invalidate(1, componentParams = null);
    						}

    						dispatchNextTick("routeLoaded", detail);
    					}

    					i++;
    				}
    			}
    		}
    	};

    	return [
    		component,
    		componentParams,
    		routes,
    		prefix,
    		$loc,
    		RouteItem,
    		routesList,
    		dispatch,
    		dispatchNextTick,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { routes: 2, prefix: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-feather-icons/src/icons/ChevronDownIcon.svelte generated by Svelte v3.20.1 */

    const file = "node_modules/svelte-feather-icons/src/icons/ChevronDownIcon.svelte";

    function create_fragment$1(ctx) {
    	let svg;
    	let polyline;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			polyline = svg_element("polyline");
    			attr_dev(polyline, "points", "6 9 12 15 18 9");
    			add_location(polyline, file, 12, 237, 493);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "class", svg_class_value = "feather feather-chevron-down " + /*customClass*/ ctx[1]);
    			add_location(svg, file, 12, 0, 256);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, polyline);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*customClass*/ 2 && svg_class_value !== (svg_class_value = "feather feather-chevron-down " + /*customClass*/ ctx[1])) {
    				attr_dev(svg, "class", svg_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { size = "100%" } = $$props;
    	let { class: customClass = "" } = $$props;

    	if (size !== "100%") {
    		size = size.slice(-1) === "x"
    		? size.slice(0, size.length - 1) + "em"
    		: parseInt(size) + "px";
    	}

    	const writable_props = ["size", "class"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ChevronDownIcon> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("ChevronDownIcon", $$slots, []);

    	$$self.$set = $$props => {
    		if ("size" in $$props) $$invalidate(0, size = $$props.size);
    		if ("class" in $$props) $$invalidate(1, customClass = $$props.class);
    	};

    	$$self.$capture_state = () => ({ size, customClass });

    	$$self.$inject_state = $$props => {
    		if ("size" in $$props) $$invalidate(0, size = $$props.size);
    		if ("customClass" in $$props) $$invalidate(1, customClass = $$props.customClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, customClass];
    }

    class ChevronDownIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { size: 0, class: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChevronDownIcon",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get size() {
    		throw new Error("<ChevronDownIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ChevronDownIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<ChevronDownIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ChevronDownIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-feather-icons/src/icons/DownloadIcon.svelte generated by Svelte v3.20.1 */

    const file$1 = "node_modules/svelte-feather-icons/src/icons/DownloadIcon.svelte";

    function create_fragment$2(ctx) {
    	let svg;
    	let path;
    	let polyline;
    	let line;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			polyline = svg_element("polyline");
    			line = svg_element("line");
    			attr_dev(path, "d", "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4");
    			add_location(path, file$1, 12, 233, 489);
    			attr_dev(polyline, "points", "7 10 12 15 17 10");
    			add_location(polyline, file$1, 12, 292, 548);
    			attr_dev(line, "x1", "12");
    			attr_dev(line, "y1", "15");
    			attr_dev(line, "x2", "12");
    			attr_dev(line, "y2", "3");
    			add_location(line, file$1, 12, 339, 595);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "class", svg_class_value = "feather feather-download " + /*customClass*/ ctx[1]);
    			add_location(svg, file$1, 12, 0, 256);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    			append_dev(svg, polyline);
    			append_dev(svg, line);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*customClass*/ 2 && svg_class_value !== (svg_class_value = "feather feather-download " + /*customClass*/ ctx[1])) {
    				attr_dev(svg, "class", svg_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { size = "100%" } = $$props;
    	let { class: customClass = "" } = $$props;

    	if (size !== "100%") {
    		size = size.slice(-1) === "x"
    		? size.slice(0, size.length - 1) + "em"
    		: parseInt(size) + "px";
    	}

    	const writable_props = ["size", "class"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<DownloadIcon> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("DownloadIcon", $$slots, []);

    	$$self.$set = $$props => {
    		if ("size" in $$props) $$invalidate(0, size = $$props.size);
    		if ("class" in $$props) $$invalidate(1, customClass = $$props.class);
    	};

    	$$self.$capture_state = () => ({ size, customClass });

    	$$self.$inject_state = $$props => {
    		if ("size" in $$props) $$invalidate(0, size = $$props.size);
    		if ("customClass" in $$props) $$invalidate(1, customClass = $$props.customClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, customClass];
    }

    class DownloadIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { size: 0, class: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DownloadIcon",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get size() {
    		throw new Error("<DownloadIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<DownloadIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<DownloadIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<DownloadIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-feather-icons/src/icons/GithubIcon.svelte generated by Svelte v3.20.1 */

    const file$2 = "node_modules/svelte-feather-icons/src/icons/GithubIcon.svelte";

    function create_fragment$3(ctx) {
    	let svg;
    	let path;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22");
    			add_location(path, file$2, 12, 231, 487);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "class", svg_class_value = "feather feather-github " + /*customClass*/ ctx[1]);
    			add_location(svg, file$2, 12, 0, 256);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*customClass*/ 2 && svg_class_value !== (svg_class_value = "feather feather-github " + /*customClass*/ ctx[1])) {
    				attr_dev(svg, "class", svg_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { size = "100%" } = $$props;
    	let { class: customClass = "" } = $$props;

    	if (size !== "100%") {
    		size = size.slice(-1) === "x"
    		? size.slice(0, size.length - 1) + "em"
    		: parseInt(size) + "px";
    	}

    	const writable_props = ["size", "class"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<GithubIcon> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("GithubIcon", $$slots, []);

    	$$self.$set = $$props => {
    		if ("size" in $$props) $$invalidate(0, size = $$props.size);
    		if ("class" in $$props) $$invalidate(1, customClass = $$props.class);
    	};

    	$$self.$capture_state = () => ({ size, customClass });

    	$$self.$inject_state = $$props => {
    		if ("size" in $$props) $$invalidate(0, size = $$props.size);
    		if ("customClass" in $$props) $$invalidate(1, customClass = $$props.customClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, customClass];
    }

    class GithubIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { size: 0, class: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GithubIcon",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get size() {
    		throw new Error("<GithubIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<GithubIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<GithubIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<GithubIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-feather-icons/src/icons/LinkedinIcon.svelte generated by Svelte v3.20.1 */

    const file$3 = "node_modules/svelte-feather-icons/src/icons/LinkedinIcon.svelte";

    function create_fragment$4(ctx) {
    	let svg;
    	let path;
    	let rect;
    	let circle;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			rect = svg_element("rect");
    			circle = svg_element("circle");
    			attr_dev(path, "d", "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z");
    			add_location(path, file$3, 12, 233, 489);
    			attr_dev(rect, "x", "2");
    			attr_dev(rect, "y", "9");
    			attr_dev(rect, "width", "4");
    			attr_dev(rect, "height", "12");
    			add_location(rect, file$3, 12, 329, 585);
    			attr_dev(circle, "cx", "4");
    			attr_dev(circle, "cy", "4");
    			attr_dev(circle, "r", "2");
    			add_location(circle, file$3, 12, 376, 632);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "class", svg_class_value = "feather feather-linkedin " + /*customClass*/ ctx[1]);
    			add_location(svg, file$3, 12, 0, 256);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    			append_dev(svg, rect);
    			append_dev(svg, circle);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*customClass*/ 2 && svg_class_value !== (svg_class_value = "feather feather-linkedin " + /*customClass*/ ctx[1])) {
    				attr_dev(svg, "class", svg_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { size = "100%" } = $$props;
    	let { class: customClass = "" } = $$props;

    	if (size !== "100%") {
    		size = size.slice(-1) === "x"
    		? size.slice(0, size.length - 1) + "em"
    		: parseInt(size) + "px";
    	}

    	const writable_props = ["size", "class"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LinkedinIcon> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("LinkedinIcon", $$slots, []);

    	$$self.$set = $$props => {
    		if ("size" in $$props) $$invalidate(0, size = $$props.size);
    		if ("class" in $$props) $$invalidate(1, customClass = $$props.class);
    	};

    	$$self.$capture_state = () => ({ size, customClass });

    	$$self.$inject_state = $$props => {
    		if ("size" in $$props) $$invalidate(0, size = $$props.size);
    		if ("customClass" in $$props) $$invalidate(1, customClass = $$props.customClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, customClass];
    }

    class LinkedinIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { size: 0, class: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LinkedinIcon",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get size() {
    		throw new Error("<LinkedinIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<LinkedinIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<LinkedinIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<LinkedinIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-feather-icons/src/icons/MailIcon.svelte generated by Svelte v3.20.1 */

    const file$4 = "node_modules/svelte-feather-icons/src/icons/MailIcon.svelte";

    function create_fragment$5(ctx) {
    	let svg;
    	let path;
    	let polyline;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			polyline = svg_element("polyline");
    			attr_dev(path, "d", "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z");
    			add_location(path, file$4, 12, 229, 485);
    			attr_dev(polyline, "points", "22,6 12,13 2,6");
    			add_location(polyline, file$4, 12, 322, 578);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "class", svg_class_value = "feather feather-mail " + /*customClass*/ ctx[1]);
    			add_location(svg, file$4, 12, 0, 256);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    			append_dev(svg, polyline);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*customClass*/ 2 && svg_class_value !== (svg_class_value = "feather feather-mail " + /*customClass*/ ctx[1])) {
    				attr_dev(svg, "class", svg_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { size = "100%" } = $$props;
    	let { class: customClass = "" } = $$props;

    	if (size !== "100%") {
    		size = size.slice(-1) === "x"
    		? size.slice(0, size.length - 1) + "em"
    		: parseInt(size) + "px";
    	}

    	const writable_props = ["size", "class"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MailIcon> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("MailIcon", $$slots, []);

    	$$self.$set = $$props => {
    		if ("size" in $$props) $$invalidate(0, size = $$props.size);
    		if ("class" in $$props) $$invalidate(1, customClass = $$props.class);
    	};

    	$$self.$capture_state = () => ({ size, customClass });

    	$$self.$inject_state = $$props => {
    		if ("size" in $$props) $$invalidate(0, size = $$props.size);
    		if ("customClass" in $$props) $$invalidate(1, customClass = $$props.customClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, customClass];
    }

    class MailIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { size: 0, class: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MailIcon",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get size() {
    		throw new Error("<MailIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<MailIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<MailIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<MailIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-feather-icons/src/icons/SendIcon.svelte generated by Svelte v3.20.1 */

    const file$5 = "node_modules/svelte-feather-icons/src/icons/SendIcon.svelte";

    function create_fragment$6(ctx) {
    	let svg;
    	let line;
    	let polygon;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			line = svg_element("line");
    			polygon = svg_element("polygon");
    			attr_dev(line, "x1", "22");
    			attr_dev(line, "y1", "2");
    			attr_dev(line, "x2", "11");
    			attr_dev(line, "y2", "13");
    			add_location(line, file$5, 12, 229, 485);
    			attr_dev(polygon, "points", "22 2 15 22 11 13 2 9 22 2");
    			add_location(polygon, file$5, 12, 273, 529);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", /*size*/ ctx[0]);
    			attr_dev(svg, "height", /*size*/ ctx[0]);
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "class", svg_class_value = "feather feather-send " + /*customClass*/ ctx[1]);
    			add_location(svg, file$5, 12, 0, 256);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, line);
    			append_dev(svg, polygon);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				attr_dev(svg, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*customClass*/ 2 && svg_class_value !== (svg_class_value = "feather feather-send " + /*customClass*/ ctx[1])) {
    				attr_dev(svg, "class", svg_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { size = "100%" } = $$props;
    	let { class: customClass = "" } = $$props;

    	if (size !== "100%") {
    		size = size.slice(-1) === "x"
    		? size.slice(0, size.length - 1) + "em"
    		: parseInt(size) + "px";
    	}

    	const writable_props = ["size", "class"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SendIcon> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("SendIcon", $$slots, []);

    	$$self.$set = $$props => {
    		if ("size" in $$props) $$invalidate(0, size = $$props.size);
    		if ("class" in $$props) $$invalidate(1, customClass = $$props.class);
    	};

    	$$self.$capture_state = () => ({ size, customClass });

    	$$self.$inject_state = $$props => {
    		if ("size" in $$props) $$invalidate(0, size = $$props.size);
    		if ("customClass" in $$props) $$invalidate(1, customClass = $$props.customClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, customClass];
    }

    class SendIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { size: 0, class: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SendIcon",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get size() {
    		throw new Error("<SendIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<SendIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<SendIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<SendIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* app/src/components/Sidebar/SidebarLink.svelte generated by Svelte v3.20.1 */

    const file$6 = "app/src/components/Sidebar/SidebarLink.svelte";

    function create_fragment$7(ctx) {
    	let button;
    	let button_class_value;
    	let current;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*getClasses*/ ctx[1]()) + " svelte-2qnbhx"));
    			add_location(button, file$6, 48, 0, 969);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*click_handler*/ ctx[7], false, false, false);
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 32) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[5], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null));
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { color = "white" } = $$props;
    	let { width = "full-width" } = $$props;
    	let { link } = $$props;

    	const getClasses = () => {
    		return ["sidebar-link", `sidebar-link--${color}`, `sidebar-link--${width}`].join(" ");
    	};

    	const navigate = slug => {
    		document.location.href = `${document.location.href.split("#")[0]}#${slug}`;
    	};

    	const writable_props = ["color", "width", "link"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SidebarLink> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("SidebarLink", $$slots, ['default']);
    	const click_handler = () => navigate(link);

    	$$self.$set = $$props => {
    		if ("color" in $$props) $$invalidate(3, color = $$props.color);
    		if ("width" in $$props) $$invalidate(4, width = $$props.width);
    		if ("link" in $$props) $$invalidate(0, link = $$props.link);
    		if ("$$scope" in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ color, width, link, getClasses, navigate });

    	$$self.$inject_state = $$props => {
    		if ("color" in $$props) $$invalidate(3, color = $$props.color);
    		if ("width" in $$props) $$invalidate(4, width = $$props.width);
    		if ("link" in $$props) $$invalidate(0, link = $$props.link);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [link, getClasses, navigate, color, width, $$scope, $$slots, click_handler];
    }

    class SidebarLink extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { color: 3, width: 4, link: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SidebarLink",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*link*/ ctx[0] === undefined && !("link" in props)) {
    			console.warn("<SidebarLink> was created without expected prop 'link'");
    		}
    	}

    	get color() {
    		throw new Error("<SidebarLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<SidebarLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<SidebarLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<SidebarLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get link() {
    		throw new Error("<SidebarLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set link(value) {
    		throw new Error("<SidebarLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* app/src/components/Sidebar/SidebarIcon.svelte generated by Svelte v3.20.1 */

    const file$7 = "app/src/components/Sidebar/SidebarIcon.svelte";

    function create_fragment$8(ctx) {
    	let button;
    	let current;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "class", "sidebar-icon svelte-jocztv");
    			add_location(button, file$7, 30, 0, 567);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*click_handler*/ ctx[4], false, false, false);
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[2], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null));
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { link } = $$props;

    	const navigate = url => {
    		document.location.href = url;
    	};

    	const writable_props = ["link"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SidebarIcon> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("SidebarIcon", $$slots, ['default']);
    	const click_handler = () => navigate(link);

    	$$self.$set = $$props => {
    		if ("link" in $$props) $$invalidate(0, link = $$props.link);
    		if ("$$scope" in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ link, navigate });

    	$$self.$inject_state = $$props => {
    		if ("link" in $$props) $$invalidate(0, link = $$props.link);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [link, navigate, $$scope, $$slots, click_handler];
    }

    class SidebarIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { link: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SidebarIcon",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*link*/ ctx[0] === undefined && !("link" in props)) {
    			console.warn("<SidebarIcon> was created without expected prop 'link'");
    		}
    	}

    	get link() {
    		throw new Error("<SidebarIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set link(value) {
    		throw new Error("<SidebarIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* app/src/components/Sidebar/Sidebar.svelte generated by Svelte v3.20.1 */
    const file$8 = "app/src/components/Sidebar/Sidebar.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (86:3) <SidebarLink color="white" width="full-width" link={navItem.toLowerCase()}>
    function create_default_slot_1(ctx) {
    	let t0_value = /*navItem*/ ctx[5] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(86:3) <SidebarLink color=\\\"white\\\" width=\\\"full-width\\\" link={navItem.toLowerCase()}>",
    		ctx
    	});

    	return block;
    }

    // (85:2) {#each navigationLinks as navItem}
    function create_each_block_1(ctx) {
    	let current;

    	const sidebarlink = new SidebarLink({
    			props: {
    				color: "white",
    				width: "full-width",
    				link: /*navItem*/ ctx[5].toLowerCase(),
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sidebarlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sidebarlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sidebarlink_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				sidebarlink_changes.$$scope = { dirty, ctx };
    			}

    			sidebarlink.$set(sidebarlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidebarlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidebarlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sidebarlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(85:2) {#each navigationLinks as navItem}",
    		ctx
    	});

    	return block;
    }

    // (94:4) <SidebarIcon link="{icon.link}">
    function create_default_slot(ctx) {
    	let t;
    	let current;
    	var switch_value = /*icon*/ ctx[2].icon;

    	function switch_props(ctx) {
    		return { props: { size: "20" }, $$inline: true };
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*icon*/ ctx[2].icon)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, t.parentNode, t);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (switch_instance) destroy_component(switch_instance, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(94:4) <SidebarIcon link=\\\"{icon.link}\\\">",
    		ctx
    	});

    	return block;
    }

    // (93:3) {#each iconLinks as icon}
    function create_each_block(ctx) {
    	let current;

    	const sidebaricon = new SidebarIcon({
    			props: {
    				link: /*icon*/ ctx[2].link,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sidebaricon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sidebaricon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sidebaricon_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				sidebaricon_changes.$$scope = { dirty, ctx };
    			}

    			sidebaricon.$set(sidebaricon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidebaricon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidebaricon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sidebaricon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(93:3) {#each iconLinks as icon}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let aside;
    	let div0;
    	let h2;
    	let t0;
    	let br0;
    	let t1;
    	let t2;
    	let p;
    	let t3;
    	let br1;
    	let t4;
    	let t5;
    	let div1;
    	let t6;
    	let div3;
    	let div2;
    	let current;
    	let each_value_1 = /*navigationLinks*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*iconLinks*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			aside = element("aside");
    			div0 = element("div");
    			h2 = element("h2");
    			t0 = text("Preston");
    			br0 = element("br");
    			t1 = text("\n\t\t\tWang-Stosur-Bassett");
    			t2 = space();
    			p = element("p");
    			t3 = text("Software Engineer");
    			br1 = element("br");
    			t4 = text("\n            & Experience Architect");
    			t5 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t6 = space();
    			div3 = element("div");
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(br0, file$8, 75, 10, 1291);
    			attr_dev(h2, "class", "sidebar--brand-name svelte-16pf9g6");
    			add_location(h2, file$8, 74, 2, 1248);
    			add_location(br1, file$8, 79, 20, 1386);
    			attr_dev(p, "class", "sidebar--brand-subtitle svelte-16pf9g6");
    			add_location(p, file$8, 78, 2, 1330);
    			attr_dev(div0, "class", "sidebar--brand svelte-16pf9g6");
    			add_location(div0, file$8, 73, 1, 1217);
    			attr_dev(div1, "class", "sidebar--links");
    			add_location(div1, file$8, 83, 1, 1444);
    			attr_dev(div2, "class", "sidebar--icons svelte-16pf9g6");
    			add_location(div2, file$8, 91, 2, 1685);
    			attr_dev(div3, "class", "sidebar--icons--container svelte-16pf9g6");
    			add_location(div3, file$8, 90, 1, 1643);
    			attr_dev(aside, "class", "sidebar svelte-16pf9g6");
    			add_location(aside, file$8, 72, 0, 1192);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, aside, anchor);
    			append_dev(aside, div0);
    			append_dev(div0, h2);
    			append_dev(h2, t0);
    			append_dev(h2, br0);
    			append_dev(h2, t1);
    			append_dev(div0, t2);
    			append_dev(div0, p);
    			append_dev(p, t3);
    			append_dev(p, br1);
    			append_dev(p, t4);
    			append_dev(aside, t5);
    			append_dev(aside, div1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div1, null);
    			}

    			append_dev(aside, t6);
    			append_dev(aside, div3);
    			append_dev(div3, div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*navigationLinks*/ 1) {
    				each_value_1 = /*navigationLinks*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*iconLinks*/ 2) {
    				each_value = /*iconLinks*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div2, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(aside);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	const navigationLinks = [
    		"About",
    		"Projects",
    		"Experience",
    		"Education",
    		// 'Skills',
    		"Contact"
    	];

    	const iconLinks = [
    		{
    			icon: GithubIcon,
    			link: "https://github.com/sotch-pr35mac"
    		},
    		/*
    	{
    		icon: LinkedinIcon,
    		link: ''
    	},
    */
    		{
    			icon: MailIcon,
    			link: "mailto:p.wanstobas@gmail.com"
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Sidebar> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Sidebar", $$slots, []);

    	$$self.$capture_state = () => ({
    		GithubIcon,
    		LinkedinIcon,
    		MailIcon,
    		SidebarLink,
    		SidebarIcon,
    		navigationLinks,
    		iconLinks
    	});

    	return [navigationLinks, iconLinks];
    }

    class Sidebar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sidebar",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* app/src/components/Landing/Landing.svelte generated by Svelte v3.20.1 */
    const file$9 = "app/src/components/Landing/Landing.svelte";

    function create_fragment$a(ctx) {
    	let section;
    	let div3;
    	let div1;
    	let div0;
    	let t;
    	let div2;
    	let current;
    	let dispose;
    	const chevrondownicon = new ChevronDownIcon({ props: { size: "24" }, $$inline: true });

    	const block = {
    		c: function create() {
    			section = element("section");
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t = space();
    			div2 = element("div");
    			create_component(chevrondownicon.$$.fragment);
    			attr_dev(div0, "class", "landing--profile-photo svelte-1r9jbpa");
    			add_location(div0, file$9, 58, 3, 1227);
    			attr_dev(div1, "class", "landing--profile-frame svelte-1r9jbpa");
    			add_location(div1, file$9, 57, 2, 1187);
    			attr_dev(div2, "class", "landing--chevron svelte-1r9jbpa");
    			add_location(div2, file$9, 60, 2, 1281);
    			attr_dev(div3, "class", "landing--image-mask svelte-1r9jbpa");
    			add_location(div3, file$9, 56, 1, 1151);
    			attr_dev(section, "class", "landing-content svelte-1r9jbpa");
    			add_location(section, file$9, 55, 0, 1116);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div3);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			append_dev(div3, t);
    			append_dev(div3, div2);
    			mount_component(chevrondownicon, div2, null);
    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(div2, "click", /*click_handler*/ ctx[1], false, false, false);
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chevrondownicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chevrondownicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(chevrondownicon);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	const navigate = slug => {
    		document.location.href = `${document.location.href.split("#")[0]}#${slug}`;
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Landing> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Landing", $$slots, []);
    	const click_handler = () => navigate("about");
    	$$self.$capture_state = () => ({ ChevronDownIcon, navigate });
    	return [navigate, click_handler];
    }

    class Landing extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Landing",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* app/src/components/Landing/BrandingBar.svelte generated by Svelte v3.20.1 */

    const file$a = "app/src/components/Landing/BrandingBar.svelte";

    function create_fragment$b(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "branding-bar svelte-11bqh8j");
    			add_location(div, file$a, 11, 0, 150);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<BrandingBar> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("BrandingBar", $$slots, []);
    	return [];
    }

    class BrandingBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BrandingBar",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* app/src/components/SectionContent/SectionContent.svelte generated by Svelte v3.20.1 */

    const file$b = "app/src/components/SectionContent/SectionContent.svelte";

    function create_fragment$c(ctx) {
    	let section;
    	let section_class_value;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			section = element("section");
    			if (default_slot) default_slot.c();
    			attr_dev(section, "class", section_class_value = "" + (null_to_empty(/*getClasses*/ ctx[0]()) + " svelte-ua724w"));
    			add_location(section, file$b, 24, 0, 441);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);

    			if (default_slot) {
    				default_slot.m(section, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[2], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null));
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { color = "light" } = $$props;

    	const getClasses = () => {
    		return ["section-content", `section-content--${color}`].join(" ");
    	};

    	const writable_props = ["color"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SectionContent> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("SectionContent", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("color" in $$props) $$invalidate(1, color = $$props.color);
    		if ("$$scope" in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ color, getClasses });

    	$$self.$inject_state = $$props => {
    		if ("color" in $$props) $$invalidate(1, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [getClasses, color, $$scope, $$slots];
    }

    class SectionContent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SectionContent",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get color() {
    		throw new Error("<SectionContent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<SectionContent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* app/src/components/SectionTitle/SectionTitle.svelte generated by Svelte v3.20.1 */

    const file$c = "app/src/components/SectionTitle/SectionTitle.svelte";

    function create_fragment$d(ctx) {
    	let span;
    	let div;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			div = element("div");
    			attr_dev(div, "class", "section-title--bar svelte-1gqdy4t");
    			add_location(div, file$c, 17, 14, 343);
    			attr_dev(span, "class", "section-title svelte-1gqdy4t");
    			add_location(span, file$c, 16, 0, 300);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			append_dev(span, div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[0], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null));
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SectionTitle> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("SectionTitle", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, $$slots];
    }

    class SectionTitle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SectionTitle",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* app/src/components/Clickable/Clickable.svelte generated by Svelte v3.20.1 */
    const file$d = "app/src/components/Clickable/Clickable.svelte";

    function create_fragment$e(ctx) {
    	let button;
    	let current;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "class", "clickable-button svelte-1sv86ld");
    			add_location(button, file$d, 27, 0, 602);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*click_handler*/ ctx[3], false, false, false);
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 2) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[1], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null));
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Clickable> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Clickable", $$slots, ['default']);
    	const click_handler = () => dispatch("click");

    	$$self.$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ createEventDispatcher, dispatch });
    	return [dispatch, $$scope, $$slots, click_handler];
    }

    class Clickable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Clickable",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* app/src/components/Profile/Profile.svelte generated by Svelte v3.20.1 */
    const file$e = "app/src/components/Profile/Profile.svelte";

    // (40:1) <SectionTitle>
    function create_default_slot_3(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "About";
    			attr_dev(h1, "id", "about");
    			add_location(h1, file$e, 40, 2, 1035);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(40:1) <SectionTitle>",
    		ctx
    	});

    	return block;
    }

    // (57:4) <Clickable on:click={() => navigate(resumeLink, true)}>
    function create_default_slot_2(ctx) {
    	let t;
    	let current;
    	const downloadicon = new DownloadIcon({ props: { size: "16" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(downloadicon.$$.fragment);
    			t = text("\n\t\t\t\t\t \n\t\t\t\t\tDownload Resume");
    		},
    		m: function mount(target, anchor) {
    			mount_component(downloadicon, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(downloadicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(downloadicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(downloadicon, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(57:4) <Clickable on:click={() => navigate(resumeLink, true)}>",
    		ctx
    	});

    	return block;
    }

    // (62:4) <Clickable on:click={() => navigate(emailLink, false)}>
    function create_default_slot_1$1(ctx) {
    	let t;
    	let current;
    	const sendicon = new SendIcon({ props: { size: "16" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(sendicon.$$.fragment);
    			t = text("\n\t\t\t\t\t \n\t\t\t\t\tHire Me!");
    		},
    		m: function mount(target, anchor) {
    			mount_component(sendicon, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sendicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sendicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sendicon, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(62:4) <Clickable on:click={() => navigate(emailLink, false)}>",
    		ctx
    	});

    	return block;
    }

    // (39:0) <SectionContent color="dark">
    function create_default_slot$1(ctx) {
    	let t0;
    	let div2;
    	let img;
    	let img_src_value;
    	let t1;
    	let div1;
    	let h3;
    	let t3;
    	let p0;
    	let t5;
    	let p1;
    	let t7;
    	let p2;
    	let t9;
    	let div0;
    	let t10;
    	let current;

    	const sectiontitle = new SectionTitle({
    			props: {
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const clickable0 = new Clickable({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	clickable0.$on("click", /*click_handler*/ ctx[2]);

    	const clickable1 = new Clickable({
    			props: {
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	clickable1.$on("click", /*click_handler_1*/ ctx[3]);

    	const block = {
    		c: function create() {
    			create_component(sectiontitle.$$.fragment);
    			t0 = space();
    			div2 = element("div");
    			img = element("img");
    			t1 = space();
    			div1 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Hi, I'm Preston.";
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "I am a senior software engineer and conversational experience architect who is passionate and dedicated to his work. I excel at building beautiful software and robust conversations in fast-paced environments. I am experienced in building products, delivering for clients, and managing a team.";
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "I work at the intersection of people and technology. Passionate about bringing sustainability and morale to work, I am self-motivated and can effectively explain complex situations in easy to understand terms.";
    			t7 = space();
    			p2 = element("p");
    			p2.textContent = "Seeking a company to grow with where I can meaningfully contribute to company culture, mentor team members, and build robust software experiences.";
    			t9 = space();
    			div0 = element("div");
    			create_component(clickable0.$$.fragment);
    			t10 = space();
    			create_component(clickable1.$$.fragment);
    			if (img.src !== (img_src_value = "img/author.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "about-section--image svelte-t5kowz");
    			add_location(img, file$e, 43, 2, 1118);
    			add_location(h3, file$e, 45, 3, 1215);
    			add_location(p0, file$e, 46, 12, 1253);
    			add_location(p1, file$e, 49, 12, 1595);
    			add_location(p2, file$e, 52, 12, 1854);
    			attr_dev(div0, "class", "about-button-group svelte-t5kowz");
    			add_location(div0, file$e, 55, 3, 2041);
    			attr_dev(div1, "class", "about-section--text svelte-t5kowz");
    			add_location(div1, file$e, 44, 2, 1178);
    			attr_dev(div2, "class", "about-section--content svelte-t5kowz");
    			add_location(div2, file$e, 42, 1, 1079);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sectiontitle, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, img);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, h3);
    			append_dev(div1, t3);
    			append_dev(div1, p0);
    			append_dev(div1, t5);
    			append_dev(div1, p1);
    			append_dev(div1, t7);
    			append_dev(div1, p2);
    			append_dev(div1, t9);
    			append_dev(div1, div0);
    			mount_component(clickable0, div0, null);
    			append_dev(div0, t10);
    			mount_component(clickable1, div0, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sectiontitle_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				sectiontitle_changes.$$scope = { dirty, ctx };
    			}

    			sectiontitle.$set(sectiontitle_changes);
    			const clickable0_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				clickable0_changes.$$scope = { dirty, ctx };
    			}

    			clickable0.$set(clickable0_changes);
    			const clickable1_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				clickable1_changes.$$scope = { dirty, ctx };
    			}

    			clickable1.$set(clickable1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sectiontitle.$$.fragment, local);
    			transition_in(clickable0.$$.fragment, local);
    			transition_in(clickable1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sectiontitle.$$.fragment, local);
    			transition_out(clickable0.$$.fragment, local);
    			transition_out(clickable1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sectiontitle, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			destroy_component(clickable0);
    			destroy_component(clickable1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(39:0) <SectionContent color=\\\"dark\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let current;

    	const sectioncontent = new SectionContent({
    			props: {
    				color: "dark",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sectioncontent.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(sectioncontent, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const sectioncontent_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				sectioncontent_changes.$$scope = { dirty, ctx };
    			}

    			sectioncontent.$set(sectioncontent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sectioncontent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sectioncontent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sectioncontent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const resumeLink = "../Preston_Wang-Stosur-Bassett.pdf";
    const emailLink = "mailto:p.wanstobas@gmail.com";

    function instance$f($$self, $$props, $$invalidate) {
    	const constructLocalUrl = partialPath => `${document.location.protocol}//${document.location.host}/${partialPath}`;

    	const navigate = (url, localLink) => {
    		document.location.href = localLink ? constructLocalUrl(url) : url;
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Profile> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Profile", $$slots, []);
    	const click_handler = () => navigate(resumeLink, true);
    	const click_handler_1 = () => navigate(emailLink, false);

    	$$self.$capture_state = () => ({
    		SectionContent,
    		SectionTitle,
    		Clickable,
    		DownloadIcon,
    		SendIcon,
    		resumeLink,
    		emailLink,
    		constructLocalUrl,
    		navigate
    	});

    	return [navigate, constructLocalUrl, click_handler, click_handler_1];
    }

    class Profile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Profile",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* app/src/components/ListItemDescription/ListItemDescription.svelte generated by Svelte v3.20.1 */
    const file$f = "app/src/components/ListItemDescription/ListItemDescription.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	child_ctx[12] = i;
    	return child_ctx;
    }

    // (75:3) <SidebarLink color="grey" width="full-width">
    function create_default_slot$2(ctx) {
    	let span;
    	let t_value = /*itemName*/ ctx[10] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "svelte-12ih0ud");
    			toggle_class(span, "list-item-description--list-item--active", /*i*/ ctx[12] == /*activeIndex*/ ctx[2]);
    			add_location(span, file$f, 75, 4, 1908);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*activeIndex*/ 4) {
    				toggle_class(span, "list-item-description--list-item--active", /*i*/ ctx[12] == /*activeIndex*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(75:3) <SidebarLink color=\\\"grey\\\" width=\\\"full-width\\\">",
    		ctx
    	});

    	return block;
    }

    // (73:2) {#each getItemList() as itemName, i}
    function create_each_block_1$1(ctx) {
    	let li;
    	let t;
    	let current;
    	let dispose;

    	const sidebarlink = new SidebarLink({
    			props: {
    				color: "grey",
    				width: "full-width",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[6](/*i*/ ctx[12], ...args);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			create_component(sidebarlink.$$.fragment);
    			t = space();
    			attr_dev(li, "class", "list-item-description--list-item svelte-12ih0ud");
    			add_location(li, file$f, 73, 3, 1769);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, li, anchor);
    			mount_component(sidebarlink, li, null);
    			append_dev(li, t);
    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(li, "click", click_handler, false, false, false);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const sidebarlink_changes = {};

    			if (dirty & /*$$scope, activeIndex*/ 8196) {
    				sidebarlink_changes.$$scope = { dirty, ctx };
    			}

    			sidebarlink.$set(sidebarlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidebarlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidebarlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(sidebarlink);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(73:2) {#each getItemList() as itemName, i}",
    		ctx
    	});

    	return block;
    }

    // (84:3) {#if showLink}
    function create_if_block$1(ctx) {
    	let t0;
    	let a;
    	let t1_value = /*items*/ ctx[0][/*activeIndex*/ ctx[2]].name + "";
    	let t1;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			t0 = text("@ ");
    			a = element("a");
    			t1 = text(t1_value);
    			attr_dev(a, "class", "list-item-description--detail--link svelte-12ih0ud");
    			attr_dev(a, "href", a_href_value = /*items*/ ctx[0][/*activeIndex*/ ctx[2]].link);
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$f, 84, 11, 2202);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, a, anchor);
    			append_dev(a, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*items, activeIndex*/ 5 && t1_value !== (t1_value = /*items*/ ctx[0][/*activeIndex*/ ctx[2]].name + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*items, activeIndex*/ 5 && a_href_value !== (a_href_value = /*items*/ ctx[0][/*activeIndex*/ ctx[2]].link)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(84:3) {#if showLink}",
    		ctx
    	});

    	return block;
    }

    // (90:3) {#each splitDescription(items[activeIndex].description) as sentence}
    function create_each_block$1(ctx) {
    	let li;
    	let t_value = /*sentence*/ ctx[7] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "list-item-description--detail--description-item svelte-12ih0ud");
    			add_location(li, file$f, 90, 4, 2614);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*items, activeIndex*/ 5 && t_value !== (t_value = /*sentence*/ ctx[7] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(90:3) {#each splitDescription(items[activeIndex].description) as sentence}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div2;
    	let div1;
    	let ul0;
    	let t0;
    	let div0;
    	let h1;
    	let t1_value = /*items*/ ctx[0][/*activeIndex*/ ctx[2]].title + "";
    	let t1;
    	let t2;
    	let t3;
    	let h3;
    	let t4_value = /*items*/ ctx[0][/*activeIndex*/ ctx[2]].startDate + "";
    	let t4;
    	let t5;
    	let t6_value = /*items*/ ctx[0][/*activeIndex*/ ctx[2]].endDate + "";
    	let t6;
    	let t7;
    	let ul1;
    	let current;
    	let each_value_1 = /*getItemList*/ ctx[3]();
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let if_block = /*showLink*/ ctx[1] && create_if_block$1(ctx);
    	let each_value = /*splitDescription*/ ctx[5](/*items*/ ctx[0][/*activeIndex*/ ctx[2]].description);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			ul0 = element("ul");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t0 = space();
    			div0 = element("div");
    			h1 = element("h1");
    			t1 = text(t1_value);
    			t2 = space();
    			if (if_block) if_block.c();
    			t3 = space();
    			h3 = element("h3");
    			t4 = text(t4_value);
    			t5 = text(" - ");
    			t6 = text(t6_value);
    			t7 = space();
    			ul1 = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul0, "class", "list-item-description--list svelte-12ih0ud");
    			add_location(ul0, file$f, 71, 1, 1686);
    			attr_dev(h1, "class", "list-item-description--detail--title svelte-12ih0ud");
    			add_location(h1, file$f, 81, 2, 2091);
    			attr_dev(h3, "class", "list-item-description--detail--subtitle svelte-12ih0ud");
    			add_location(h3, file$f, 87, 2, 2347);
    			attr_dev(ul1, "class", "list-item-description--detail--description svelte-12ih0ud");
    			add_location(ul1, file$f, 88, 2, 2482);
    			attr_dev(div0, "class", "list-item-description--detail svelte-12ih0ud");
    			add_location(div0, file$f, 80, 1, 2045);
    			attr_dev(div1, "class", "list-item-description svelte-12ih0ud");
    			add_location(div1, file$f, 70, 0, 1649);
    			attr_dev(div2, "class", "list-item-description--container svelte-12ih0ud");
    			add_location(div2, file$f, 69, 0, 1602);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, ul0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(ul0, null);
    			}

    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			if (if_block) if_block.m(h1, null);
    			append_dev(div0, t3);
    			append_dev(div0, h3);
    			append_dev(h3, t4);
    			append_dev(h3, t5);
    			append_dev(h3, t6);
    			append_dev(div0, t7);
    			append_dev(div0, ul1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*changeActiveIndex, activeIndex, getItemList*/ 28) {
    				each_value_1 = /*getItemList*/ ctx[3]();
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1$1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(ul0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if ((!current || dirty & /*items, activeIndex*/ 5) && t1_value !== (t1_value = /*items*/ ctx[0][/*activeIndex*/ ctx[2]].title + "")) set_data_dev(t1, t1_value);

    			if (/*showLink*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(h1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if ((!current || dirty & /*items, activeIndex*/ 5) && t4_value !== (t4_value = /*items*/ ctx[0][/*activeIndex*/ ctx[2]].startDate + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty & /*items, activeIndex*/ 5) && t6_value !== (t6_value = /*items*/ ctx[0][/*activeIndex*/ ctx[2]].endDate + "")) set_data_dev(t6, t6_value);

    			if (dirty & /*splitDescription, items, activeIndex*/ 37) {
    				each_value = /*splitDescription*/ ctx[5](/*items*/ ctx[0][/*activeIndex*/ ctx[2]].description);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks_1, detaching);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { items } = $$props;
    	let { showLink = false } = $$props;
    	let activeIndex = 0;
    	const getItemList = () => items.map(i => i.name);

    	const changeActiveIndex = index => {
    		$$invalidate(2, activeIndex = index);
    	};

    	const splitDescription = paragraph => paragraph.split(". ");
    	const writable_props = ["items", "showLink"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ListItemDescription> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("ListItemDescription", $$slots, []);
    	const click_handler = i => changeActiveIndex(i);

    	$$self.$set = $$props => {
    		if ("items" in $$props) $$invalidate(0, items = $$props.items);
    		if ("showLink" in $$props) $$invalidate(1, showLink = $$props.showLink);
    	};

    	$$self.$capture_state = () => ({
    		SidebarLink,
    		items,
    		showLink,
    		activeIndex,
    		getItemList,
    		changeActiveIndex,
    		splitDescription
    	});

    	$$self.$inject_state = $$props => {
    		if ("items" in $$props) $$invalidate(0, items = $$props.items);
    		if ("showLink" in $$props) $$invalidate(1, showLink = $$props.showLink);
    		if ("activeIndex" in $$props) $$invalidate(2, activeIndex = $$props.activeIndex);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		items,
    		showLink,
    		activeIndex,
    		getItemList,
    		changeActiveIndex,
    		splitDescription,
    		click_handler
    	];
    }

    class ListItemDescription extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { items: 0, showLink: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ListItemDescription",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*items*/ ctx[0] === undefined && !("items" in props)) {
    			console.warn("<ListItemDescription> was created without expected prop 'items'");
    		}
    	}

    	get items() {
    		throw new Error("<ListItemDescription>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<ListItemDescription>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showLink() {
    		throw new Error("<ListItemDescription>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showLink(value) {
    		throw new Error("<ListItemDescription>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* app/src/components/Experience/Experience.svelte generated by Svelte v3.20.1 */
    const file$g = "app/src/components/Experience/Experience.svelte";

    // (51:1) <SectionTitle>
    function create_default_slot_1$2(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Experience";
    			attr_dev(h1, "id", "experience");
    			add_location(h1, file$g, 51, 2, 1804);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(51:1) <SectionTitle>",
    		ctx
    	});

    	return block;
    }

    // (50:0) <SectionContent color="dark">
    function create_default_slot$3(ctx) {
    	let t;
    	let current;

    	const sectiontitle = new SectionTitle({
    			props: {
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const listitemdescription = new ListItemDescription({
    			props: {
    				items: /*experiences*/ ctx[0],
    				showLink: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sectiontitle.$$.fragment);
    			t = space();
    			create_component(listitemdescription.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sectiontitle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(listitemdescription, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sectiontitle_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				sectiontitle_changes.$$scope = { dirty, ctx };
    			}

    			sectiontitle.$set(sectiontitle_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sectiontitle.$$.fragment, local);
    			transition_in(listitemdescription.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sectiontitle.$$.fragment, local);
    			transition_out(listitemdescription.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sectiontitle, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(listitemdescription, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(50:0) <SectionContent color=\\\"dark\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let current;

    	const sectioncontent = new SectionContent({
    			props: {
    				color: "dark",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sectioncontent.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(sectioncontent, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const sectioncontent_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				sectioncontent_changes.$$scope = { dirty, ctx };
    			}

    			sectioncontent.$set(sectioncontent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sectioncontent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sectioncontent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sectioncontent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	const experiences = [
    		{
    			id: 1,
    			display: true,
    			startDate: "2018",
    			endDate: "Present",
    			title: "Senior Software Engineer",
    			name: "Clinc",
    			description: "Developed features and resolved issues on the Product Engineering team building a conversational AI web platform. Architected conversational AI for clients. Grew a team from zero to six and mentored junior engineers as the engineering manager of AI Experience Development.",
    			link: "https://clinc.com/"
    		},
    		{
    			id: 2,
    			display: true,
    			startDate: "2016",
    			endDate: "2016",
    			title: "Front-End Developer",
    			name: "MCON Beijing",
    			description: "Developed WeChat apps for corporate clients in China using Angular and WeUI. Gained insights into developing for Chinese market while working on an international team.",
    			link: "https://www.mcon-group.com/"
    		},
    		{
    			id: 3,
    			display: true,
    			startDate: "2015",
    			endDate: "2016",
    			title: "Manager",
    			name: "CPR Cell Phone Repair",
    			description: "Managed the Kalamazoo franchise location of five people, repaired a variety of mobile electronics, and increased sales with a \"no-pressure\" sales style.",
    			link: "https://www.cellphonerepair.com/"
    		},
    		{
    			id: 4,
    			display: true,
    			startDate: "2010",
    			endDate: "2013",
    			title: "Junior Software Engineer",
    			name: "Floydware, LLC",
    			description: "Internationalized software for use in other languages and developed Android mobile app for cloud scheduling software company.",
    			link: "https://www.rosysalonsoftware.com/"
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Experience> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Experience", $$slots, []);

    	$$self.$capture_state = () => ({
    		SectionContent,
    		SectionTitle,
    		ListItemDescription,
    		experiences
    	});

    	return [experiences];
    }

    class Experience extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Experience",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* app/src/components/Education/Education.svelte generated by Svelte v3.20.1 */
    const file$h = "app/src/components/Education/Education.svelte";

    // (29:1) <SectionTitle>
    function create_default_slot_1$3(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Education";
    			attr_dev(h1, "id", "education");
    			add_location(h1, file$h, 29, 2, 903);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(29:1) <SectionTitle>",
    		ctx
    	});

    	return block;
    }

    // (28:0) <SectionContent color="light">
    function create_default_slot$4(ctx) {
    	let t;
    	let current;

    	const sectiontitle = new SectionTitle({
    			props: {
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const listitemdescription = new ListItemDescription({
    			props: {
    				items: /*education*/ ctx[0],
    				showLink: false
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sectiontitle.$$.fragment);
    			t = space();
    			create_component(listitemdescription.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sectiontitle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(listitemdescription, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sectiontitle_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				sectiontitle_changes.$$scope = { dirty, ctx };
    			}

    			sectiontitle.$set(sectiontitle_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sectiontitle.$$.fragment, local);
    			transition_in(listitemdescription.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sectiontitle.$$.fragment, local);
    			transition_out(listitemdescription.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sectiontitle, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(listitemdescription, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(28:0) <SectionContent color=\\\"light\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let current;

    	const sectioncontent = new SectionContent({
    			props: {
    				color: "light",
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sectioncontent.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(sectioncontent, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const sectioncontent_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				sectioncontent_changes.$$scope = { dirty, ctx };
    			}

    			sectioncontent.$set(sectioncontent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sectioncontent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sectioncontent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sectioncontent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	const education = [
    		{
    			id: 1,
    			display: true,
    			startDate: "2014",
    			endDate: "2018",
    			title: "B.S. Computer Science",
    			name: "Kalamazoo College",
    			description: "Studied computer science and Chinese with a 3.6 GPA. Studied abroad one year in Beijing at Capital Normal University and Harbin Institute of Technology in Harbin."
    		},
    		{
    			id: 2,
    			display: true,
    			startDate: "2011",
    			endDate: "2014",
    			title: "High School",
    			name: "Glenbard West",
    			description: "Enrolled in all honors and AP classes. On high honor roll with a weighted 5.3 GPA. Vice President Chinese National Honors Society."
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Education> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Education", $$slots, []);

    	$$self.$capture_state = () => ({
    		SectionContent,
    		SectionTitle,
    		ListItemDescription,
    		education
    	});

    	return [education];
    }

    class Education extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Education",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* app/src/components/Skills/Skills.svelte generated by Svelte v3.20.1 */
    const file$i = "app/src/components/Skills/Skills.svelte";

    // (7:1) <SectionTitle>
    function create_default_slot_1$4(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Skills";
    			attr_dev(h1, "id", "skills");
    			add_location(h1, file$i, 7, 2, 202);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(7:1) <SectionTitle>",
    		ctx
    	});

    	return block;
    }

    // (6:0) <SectionContent color="dark">
    function create_default_slot$5(ctx) {
    	let current;

    	const sectiontitle = new SectionTitle({
    			props: {
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sectiontitle.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sectiontitle, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sectiontitle_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				sectiontitle_changes.$$scope = { dirty, ctx };
    			}

    			sectiontitle.$set(sectiontitle_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sectiontitle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sectiontitle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sectiontitle, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(6:0) <SectionContent color=\\\"dark\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let current;

    	const sectioncontent = new SectionContent({
    			props: {
    				color: "dark",
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sectioncontent.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(sectioncontent, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const sectioncontent_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				sectioncontent_changes.$$scope = { dirty, ctx };
    			}

    			sectioncontent.$set(sectioncontent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sectioncontent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sectioncontent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sectioncontent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Skills> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Skills", $$slots, []);
    	$$self.$capture_state = () => ({ SectionContent, SectionTitle });
    	return [];
    }

    class Skills extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Skills",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* app/src/components/Projects/ProjectCard.svelte generated by Svelte v3.20.1 */

    const file$j = "app/src/components/Projects/ProjectCard.svelte";

    function create_fragment$k(ctx) {
    	let div1;
    	let div0;
    	let h1;
    	let t0;
    	let t1;
    	let p0;
    	let t2;
    	let t3;
    	let a;
    	let t4;
    	let t5;
    	let span;
    	let p1;
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	let p2;
    	let t10;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			t0 = text(/*name*/ ctx[0]);
    			t1 = space();
    			p0 = element("p");
    			t2 = text(/*description*/ ctx[1]);
    			t3 = space();
    			a = element("a");
    			t4 = text("More Information");
    			t5 = space();
    			span = element("span");
    			p1 = element("p");
    			t6 = text(/*start*/ ctx[3]);
    			t7 = text(" - ");
    			t8 = text(/*end*/ ctx[4]);
    			t9 = space();
    			p2 = element("p");
    			t10 = text(/*role*/ ctx[2]);
    			attr_dev(h1, "class", "project-card--title svelte-1ktmrd2");
    			add_location(h1, file$j, 71, 8, 1801);
    			attr_dev(p0, "class", "project-card--description svelte-1ktmrd2");
    			add_location(p0, file$j, 72, 8, 1853);
    			attr_dev(a, "href", /*link*/ ctx[6]);
    			attr_dev(a, "class", "project-card--link svelte-1ktmrd2");
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$j, 73, 8, 1916);
    			attr_dev(p1, "class", "project-card--date");
    			add_location(p1, file$j, 75, 12, 2053);
    			attr_dev(p2, "class", "project-card--role");
    			add_location(p2, file$j, 76, 12, 2115);
    			attr_dev(span, "class", "project-card--footer svelte-1ktmrd2");
    			add_location(span, file$j, 74, 8, 2005);
    			attr_dev(div0, "class", "project-card--content svelte-1ktmrd2");
    			add_location(div0, file$j, 70, 4, 1757);
    			attr_dev(div1, "class", "project-card--container svelte-1ktmrd2");
    			set_style(div1, "--project-image", "url(" + /*image*/ ctx[5] + ")");
    			add_location(div1, file$j, 69, 0, 1676);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t0);
    			append_dev(div0, t1);
    			append_dev(div0, p0);
    			append_dev(p0, t2);
    			append_dev(div0, t3);
    			append_dev(div0, a);
    			append_dev(a, t4);
    			append_dev(div0, t5);
    			append_dev(div0, span);
    			append_dev(span, p1);
    			append_dev(p1, t6);
    			append_dev(p1, t7);
    			append_dev(p1, t8);
    			append_dev(span, t9);
    			append_dev(span, p2);
    			append_dev(p2, t10);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 1) set_data_dev(t0, /*name*/ ctx[0]);
    			if (dirty & /*description*/ 2) set_data_dev(t2, /*description*/ ctx[1]);

    			if (dirty & /*link*/ 64) {
    				attr_dev(a, "href", /*link*/ ctx[6]);
    			}

    			if (dirty & /*start*/ 8) set_data_dev(t6, /*start*/ ctx[3]);
    			if (dirty & /*end*/ 16) set_data_dev(t8, /*end*/ ctx[4]);
    			if (dirty & /*role*/ 4) set_data_dev(t10, /*role*/ ctx[2]);

    			if (dirty & /*image*/ 32) {
    				set_style(div1, "--project-image", "url(" + /*image*/ ctx[5] + ")");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { name } = $$props;
    	let { description } = $$props;
    	let { role } = $$props;
    	let { start } = $$props;
    	let { end } = $$props;
    	let { image } = $$props;
    	let { link } = $$props;
    	const writable_props = ["name", "description", "role", "start", "end", "image", "link"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ProjectCard> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("ProjectCard", $$slots, []);

    	$$self.$set = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("description" in $$props) $$invalidate(1, description = $$props.description);
    		if ("role" in $$props) $$invalidate(2, role = $$props.role);
    		if ("start" in $$props) $$invalidate(3, start = $$props.start);
    		if ("end" in $$props) $$invalidate(4, end = $$props.end);
    		if ("image" in $$props) $$invalidate(5, image = $$props.image);
    		if ("link" in $$props) $$invalidate(6, link = $$props.link);
    	};

    	$$self.$capture_state = () => ({
    		name,
    		description,
    		role,
    		start,
    		end,
    		image,
    		link
    	});

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("description" in $$props) $$invalidate(1, description = $$props.description);
    		if ("role" in $$props) $$invalidate(2, role = $$props.role);
    		if ("start" in $$props) $$invalidate(3, start = $$props.start);
    		if ("end" in $$props) $$invalidate(4, end = $$props.end);
    		if ("image" in $$props) $$invalidate(5, image = $$props.image);
    		if ("link" in $$props) $$invalidate(6, link = $$props.link);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, description, role, start, end, image, link];
    }

    class ProjectCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {
    			name: 0,
    			description: 1,
    			role: 2,
    			start: 3,
    			end: 4,
    			image: 5,
    			link: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProjectCard",
    			options,
    			id: create_fragment$k.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !("name" in props)) {
    			console.warn("<ProjectCard> was created without expected prop 'name'");
    		}

    		if (/*description*/ ctx[1] === undefined && !("description" in props)) {
    			console.warn("<ProjectCard> was created without expected prop 'description'");
    		}

    		if (/*role*/ ctx[2] === undefined && !("role" in props)) {
    			console.warn("<ProjectCard> was created without expected prop 'role'");
    		}

    		if (/*start*/ ctx[3] === undefined && !("start" in props)) {
    			console.warn("<ProjectCard> was created without expected prop 'start'");
    		}

    		if (/*end*/ ctx[4] === undefined && !("end" in props)) {
    			console.warn("<ProjectCard> was created without expected prop 'end'");
    		}

    		if (/*image*/ ctx[5] === undefined && !("image" in props)) {
    			console.warn("<ProjectCard> was created without expected prop 'image'");
    		}

    		if (/*link*/ ctx[6] === undefined && !("link" in props)) {
    			console.warn("<ProjectCard> was created without expected prop 'link'");
    		}
    	}

    	get name() {
    		throw new Error("<ProjectCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<ProjectCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<ProjectCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<ProjectCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get role() {
    		throw new Error("<ProjectCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set role(value) {
    		throw new Error("<ProjectCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get start() {
    		throw new Error("<ProjectCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set start(value) {
    		throw new Error("<ProjectCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get end() {
    		throw new Error("<ProjectCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set end(value) {
    		throw new Error("<ProjectCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get image() {
    		throw new Error("<ProjectCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set image(value) {
    		throw new Error("<ProjectCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get link() {
    		throw new Error("<ProjectCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set link(value) {
    		throw new Error("<ProjectCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* app/src/components/Projects/Projects.svelte generated by Svelte v3.20.1 */
    const file$k = "app/src/components/Projects/Projects.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (130:1) <SectionTitle>
    function create_default_slot_1$5(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Projects";
    			attr_dev(h1, "id", "projects");
    			add_location(h1, file$k, 130, 2, 4699);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(130:1) <SectionTitle>",
    		ctx
    	});

    	return block;
    }

    // (134:8) {#each projects as project}
    function create_each_block$2(ctx) {
    	let current;

    	const projectcard = new ProjectCard({
    			props: {
    				name: /*project*/ ctx[1].name,
    				description: /*project*/ ctx[1].description,
    				role: /*project*/ ctx[1].role,
    				start: /*project*/ ctx[1].start,
    				end: /*project*/ ctx[1].end,
    				image: /*project*/ ctx[1].image,
    				link: /*project*/ ctx[1].link
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(projectcard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(projectcard, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(projectcard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(projectcard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(projectcard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(134:8) {#each projects as project}",
    		ctx
    	});

    	return block;
    }

    // (129:0) <SectionContent color="light">
    function create_default_slot$6(ctx) {
    	let t;
    	let div;
    	let current;

    	const sectiontitle = new SectionTitle({
    			props: {
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value = /*projects*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			create_component(sectiontitle.$$.fragment);
    			t = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "projects-section--content svelte-1rya24");
    			add_location(div, file$k, 132, 4, 4752);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sectiontitle, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sectiontitle_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				sectiontitle_changes.$$scope = { dirty, ctx };
    			}

    			sectiontitle.$set(sectiontitle_changes);

    			if (dirty & /*projects*/ 1) {
    				each_value = /*projects*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sectiontitle.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sectiontitle.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sectiontitle, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(129:0) <SectionContent color=\\\"light\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let current;

    	const sectioncontent = new SectionContent({
    			props: {
    				color: "light",
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sectioncontent.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(sectioncontent, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const sectioncontent_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				sectioncontent_changes.$$scope = { dirty, ctx };
    			}

    			sectioncontent.$set(sectioncontent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sectioncontent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sectioncontent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sectioncontent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	const projects = [
    		{
    			name: "Syng",
    			description: "Designed, developed, and maintain open-source, cross-platform Chinese-to-English dictionary app and study toolkit.",
    			role: "Personal Project",
    			start: "2016",
    			end: "Present",
    			image: "../img/projects/syng.png",
    			link: "http://getsyng.com/"
    		},
    		{
    			name: "AI Testing",
    			description: "Designed, developed, and maintained AI Testing feature of Conversational AI Platform. Started from requirements document and developed project scope with input from relevant stakeholders. Designed wireframes, developed front-end, and maintained project after launch.",
    			role: "Software Engineer [Clinc]",
    			start: "2018",
    			end: "2019",
    			image: "../img/projects/testing.png",
    			link: "http://clinc.com"
    		},
    		{
    			name: "Custom Banking Conversational AI",
    			description: "Scoped, developed, and maintained conversational AI solution for existing and potential banking customers. Maintained over 40 training and testing datasets. Worked closely with client to ensure successful project delivery.",
    			role: "Solutions Architect [Clinc]",
    			start: "2019",
    			end: "2020",
    			image: "../img/projects/banking.png",
    			link: "http://clinc.com"
    		},
    		{
    			name: "Finie",
    			description: `Lead team of developers to build the company's flagship conversational experience product. Conducting code and dataset reviews. Work closely with the product team to create a roadmap and deliver on milestones.`,
    			role: "Tech Lead [Clinc]",
    			start: "2020",
    			end: "Present",
    			image: "../img/projects/finie.png",
    			link: "https://clinc.com/finie/"
    		},
    		{
    			name: "chinese-dictionary",
    			description: "A searchable Chinese / English dictionary npm module with helpful utilities.",
    			role: "Package",
    			start: "2021",
    			end: "Present",
    			image: "../img/projects/chinese-dictionary.png",
    			link: "https://www.npmjs.com/package/chinese-dictionary"
    		},
    		{
    			name: "chinese_dictionary",
    			description: "A searchable Chinese / English Rust crate with helpful utilities",
    			role: "Package",
    			start: "2020",
    			end: "Present",
    			image: "../img/projects/chinese_dictionary.png",
    			link: "https://crates.io/crates/chinese_dictionary"
    		},
    		{
    			name: "character_converter",
    			description: "Turn Traditional Chinese script to Simplified Chinese script and vice-versa. Check string script to determine if string is Traditional or Simplified Chinese Characters.",
    			role: "Package",
    			start: "2020",
    			end: "Present",
    			image: "../img/projects/character_converter.png",
    			link: "https://crates.io/crates/character_converter"
    		},
    		{
    			name: "chinese_detection",
    			description: "Classify a string as either English, Chinese, or Pinyin.",
    			role: "Package",
    			start: "2020",
    			end: "Present",
    			image: "../img/projects/chinese_detection.png",
    			link: "https://crates.io/crates/chinese_detection"
    		},
    		{
    			name: "prettify_pinyin",
    			description: "Turn tone numbers into tone marks.",
    			role: "Package",
    			start: "2017",
    			end: "Present",
    			image: "../img/projects/prettify_pinyin.png",
    			link: "https://crates.io/crates/prettify_pinyin"
    		},
    		{
    			name: "hsk",
    			description: "Return HSK level for Simplified Chinese Characters",
    			role: "Package",
    			start: "2020",
    			end: "Present",
    			image: "../img/projects/hsk.png",
    			link: "https://crates.io/crates/hsk"
    		},
    		{
    			name: "chinese_segmenter",
    			description: "Segment Chinese sentences into component words using a dictionary-driven largest first matching approach.",
    			role: "Package",
    			start: "2020",
    			end: "Present",
    			image: "../img/projects/chinese_segmenter.png",
    			link: "https://crates.io/crates/chinese_segmenter"
    		}
    	].sort((a, b) => {
    		let order;

    		if (a.start < b.start) {
    			order = -1;
    		} else if (a.start > b.start) {
    			order = 1;
    		} else {
    			order = 0;
    		}

    		return order;
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Projects> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Projects", $$slots, []);

    	$$self.$capture_state = () => ({
    		SectionContent,
    		SectionTitle,
    		ProjectCard,
    		projects
    	});

    	return [projects];
    }

    class Projects extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Projects",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* app/src/components/TextBox/TextBox.svelte generated by Svelte v3.20.1 */

    const file$l = "app/src/components/TextBox/TextBox.svelte";

    // (38:4) {:else}
    function create_else_block$1(ctx) {
    	let input;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "text-box--input svelte-1oul0fm");
    			attr_dev(input, "placeholder", /*placeholder*/ ctx[2]);
    			add_location(input, file$l, 38, 8, 1115);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[0]);
    			if (remount) dispose();
    			dispose = listen_dev(input, "input", /*input_input_handler_2*/ ctx[7]);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*placeholder*/ 4) {
    				attr_dev(input, "placeholder", /*placeholder*/ ctx[2]);
    			}

    			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(38:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (36:33) 
    function create_if_block_2(ctx) {
    	let input;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "password");
    			attr_dev(input, "class", "text-box--input svelte-1oul0fm");
    			attr_dev(input, "placeholder", /*placeholder*/ ctx[2]);
    			add_location(input, file$l, 36, 8, 1006);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[0]);
    			if (remount) dispose();
    			dispose = listen_dev(input, "input", /*input_input_handler_1*/ ctx[6]);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*placeholder*/ 4) {
    				attr_dev(input, "placeholder", /*placeholder*/ ctx[2]);
    			}

    			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(36:33) ",
    		ctx
    	});

    	return block;
    }

    // (34:30) 
    function create_if_block_1(ctx) {
    	let input;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "email");
    			attr_dev(input, "class", "text-box--input svelte-1oul0fm");
    			attr_dev(input, "placeholder", /*placeholder*/ ctx[2]);
    			add_location(input, file$l, 34, 8, 878);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[0]);
    			if (remount) dispose();
    			dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[5]);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*placeholder*/ 4) {
    				attr_dev(input, "placeholder", /*placeholder*/ ctx[2]);
    			}

    			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(34:30) ",
    		ctx
    	});

    	return block;
    }

    // (32:4) {#if type == 'textarea'}
    function create_if_block$2(ctx) {
    	let textarea;
    	let dispose;

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			attr_dev(textarea, "class", "text-box--input text-box--input--textarea svelte-1oul0fm");
    			attr_dev(textarea, "placeholder", /*placeholder*/ ctx[2]);
    			add_location(textarea, file$l, 32, 8, 728);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, textarea, anchor);
    			set_input_value(textarea, /*value*/ ctx[0]);
    			if (remount) dispose();
    			dispose = listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[4]);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*placeholder*/ 4) {
    				attr_dev(textarea, "placeholder", /*placeholder*/ ctx[2]);
    			}

    			if (dirty & /*value*/ 1) {
    				set_input_value(textarea, /*value*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(32:4) {#if type == 'textarea'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let div;
    	let h5;
    	let t0;
    	let t1;

    	function select_block_type(ctx, dirty) {
    		if (/*type*/ ctx[1] == "textarea") return create_if_block$2;
    		if (/*type*/ ctx[1] == "email") return create_if_block_1;
    		if (/*type*/ ctx[1] == "password") return create_if_block_2;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h5 = element("h5");
    			t0 = text(/*label*/ ctx[3]);
    			t1 = space();
    			if_block.c();
    			attr_dev(h5, "class", "text-box--label svelte-1oul0fm");
    			add_location(h5, file$l, 30, 4, 650);
    			attr_dev(div, "class", "text-box--container svelte-1oul0fm");
    			add_location(div, file$l, 29, 0, 612);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h5);
    			append_dev(h5, t0);
    			append_dev(div, t1);
    			if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*label*/ 8) set_data_dev(t0, /*label*/ ctx[3]);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { type } = $$props;
    	let { placeholder } = $$props;
    	let { label } = $$props;
    	let { value } = $$props;
    	const writable_props = ["type", "placeholder", "label", "value"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TextBox> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("TextBox", $$slots, []);

    	function textarea_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	function input_input_handler_1() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	function input_input_handler_2() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	$$self.$set = $$props => {
    		if ("type" in $$props) $$invalidate(1, type = $$props.type);
    		if ("placeholder" in $$props) $$invalidate(2, placeholder = $$props.placeholder);
    		if ("label" in $$props) $$invalidate(3, label = $$props.label);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({ type, placeholder, label, value });

    	$$self.$inject_state = $$props => {
    		if ("type" in $$props) $$invalidate(1, type = $$props.type);
    		if ("placeholder" in $$props) $$invalidate(2, placeholder = $$props.placeholder);
    		if ("label" in $$props) $$invalidate(3, label = $$props.label);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		value,
    		type,
    		placeholder,
    		label,
    		textarea_input_handler,
    		input_input_handler,
    		input_input_handler_1,
    		input_input_handler_2
    	];
    }

    class TextBox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {
    			type: 1,
    			placeholder: 2,
    			label: 3,
    			value: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TextBox",
    			options,
    			id: create_fragment$m.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*type*/ ctx[1] === undefined && !("type" in props)) {
    			console.warn("<TextBox> was created without expected prop 'type'");
    		}

    		if (/*placeholder*/ ctx[2] === undefined && !("placeholder" in props)) {
    			console.warn("<TextBox> was created without expected prop 'placeholder'");
    		}

    		if (/*label*/ ctx[3] === undefined && !("label" in props)) {
    			console.warn("<TextBox> was created without expected prop 'label'");
    		}

    		if (/*value*/ ctx[0] === undefined && !("value" in props)) {
    			console.warn("<TextBox> was created without expected prop 'value'");
    		}
    	}

    	get type() {
    		throw new Error("<TextBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<TextBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<TextBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<TextBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<TextBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<TextBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<TextBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<TextBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* app/src/components/Contact/Contact.svelte generated by Svelte v3.20.1 */
    const file$m = "app/src/components/Contact/Contact.svelte";

    // (36:1) <SectionTitle>
    function create_default_slot_2$1(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Contact";
    			attr_dev(h1, "id", "contact");
    			add_location(h1, file$m, 36, 2, 1011);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(36:1) <SectionTitle>",
    		ctx
    	});

    	return block;
    }

    // (49:12) <Clickable on:click={() => send()}>
    function create_default_slot_1$6(ctx) {
    	let t;
    	let current;
    	const sendicon = new SendIcon({ props: { size: "16" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(sendicon.$$.fragment);
    			t = text("\n                 \n                Send Message");
    		},
    		m: function mount(target, anchor) {
    			mount_component(sendicon, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sendicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sendicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sendicon, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$6.name,
    		type: "slot",
    		source: "(49:12) <Clickable on:click={() => send()}>",
    		ctx
    	});

    	return block;
    }

    // (35:0) <SectionContent color="dark">
    function create_default_slot$7(ctx) {
    	let t0;
    	let div2;
    	let div0;
    	let h1;
    	let t2;
    	let p;
    	let t4;
    	let div1;
    	let updating_value;
    	let t5;
    	let updating_value_1;
    	let t6;
    	let updating_value_2;
    	let t7;
    	let updating_value_3;
    	let t8;
    	let current;

    	const sectiontitle = new SectionTitle({
    			props: {
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function textbox0_value_binding(value) {
    		/*textbox0_value_binding*/ ctx[8].call(null, value);
    	}

    	let textbox0_props = { type: "text", label: "Name" };

    	if (/*name*/ ctx[0] !== void 0) {
    		textbox0_props.value = /*name*/ ctx[0];
    	}

    	const textbox0 = new TextBox({ props: textbox0_props, $$inline: true });
    	binding_callbacks.push(() => bind(textbox0, "value", textbox0_value_binding));

    	function textbox1_value_binding(value) {
    		/*textbox1_value_binding*/ ctx[9].call(null, value);
    	}

    	let textbox1_props = { type: "email", label: "Email" };

    	if (/*email*/ ctx[1] !== void 0) {
    		textbox1_props.value = /*email*/ ctx[1];
    	}

    	const textbox1 = new TextBox({ props: textbox1_props, $$inline: true });
    	binding_callbacks.push(() => bind(textbox1, "value", textbox1_value_binding));

    	function textbox2_value_binding(value) {
    		/*textbox2_value_binding*/ ctx[10].call(null, value);
    	}

    	let textbox2_props = { type: "text", label: "Subject" };

    	if (/*subject*/ ctx[2] !== void 0) {
    		textbox2_props.value = /*subject*/ ctx[2];
    	}

    	const textbox2 = new TextBox({ props: textbox2_props, $$inline: true });
    	binding_callbacks.push(() => bind(textbox2, "value", textbox2_value_binding));

    	function textbox3_value_binding(value) {
    		/*textbox3_value_binding*/ ctx[11].call(null, value);
    	}

    	let textbox3_props = { type: "textarea", label: "Message" };

    	if (/*message*/ ctx[3] !== void 0) {
    		textbox3_props.value = /*message*/ ctx[3];
    	}

    	const textbox3 = new TextBox({ props: textbox3_props, $$inline: true });
    	binding_callbacks.push(() => bind(textbox3, "value", textbox3_value_binding));

    	const clickable = new Clickable({
    			props: {
    				$$slots: { default: [create_default_slot_1$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	clickable.$on("click", /*click_handler*/ ctx[12]);

    	const block = {
    		c: function create() {
    			create_component(sectiontitle.$$.fragment);
    			t0 = space();
    			div2 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Let's Build Great Things Together";
    			t2 = space();
    			p = element("p");
    			p.textContent = "Based out of Detroit, Michigan. Demos and more information on portfolio projects available upon request.";
    			t4 = space();
    			div1 = element("div");
    			create_component(textbox0.$$.fragment);
    			t5 = space();
    			create_component(textbox1.$$.fragment);
    			t6 = space();
    			create_component(textbox2.$$.fragment);
    			t7 = space();
    			create_component(textbox3.$$.fragment);
    			t8 = space();
    			create_component(clickable.$$.fragment);
    			add_location(h1, file$m, 40, 12, 1146);
    			add_location(p, file$m, 41, 12, 1201);
    			attr_dev(div0, "class", "contact--content svelte-128b2il");
    			add_location(div0, file$m, 39, 8, 1103);
    			attr_dev(div1, "class", "contact--content svelte-128b2il");
    			add_location(div1, file$m, 43, 8, 1336);
    			attr_dev(div2, "class", "contact--container svelte-128b2il");
    			add_location(div2, file$m, 38, 4, 1062);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sectiontitle, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t2);
    			append_dev(div0, p);
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			mount_component(textbox0, div1, null);
    			append_dev(div1, t5);
    			mount_component(textbox1, div1, null);
    			append_dev(div1, t6);
    			mount_component(textbox2, div1, null);
    			append_dev(div1, t7);
    			mount_component(textbox3, div1, null);
    			append_dev(div1, t8);
    			mount_component(clickable, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sectiontitle_changes = {};

    			if (dirty & /*$$scope*/ 8192) {
    				sectiontitle_changes.$$scope = { dirty, ctx };
    			}

    			sectiontitle.$set(sectiontitle_changes);
    			const textbox0_changes = {};

    			if (!updating_value && dirty & /*name*/ 1) {
    				updating_value = true;
    				textbox0_changes.value = /*name*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			textbox0.$set(textbox0_changes);
    			const textbox1_changes = {};

    			if (!updating_value_1 && dirty & /*email*/ 2) {
    				updating_value_1 = true;
    				textbox1_changes.value = /*email*/ ctx[1];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			textbox1.$set(textbox1_changes);
    			const textbox2_changes = {};

    			if (!updating_value_2 && dirty & /*subject*/ 4) {
    				updating_value_2 = true;
    				textbox2_changes.value = /*subject*/ ctx[2];
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			textbox2.$set(textbox2_changes);
    			const textbox3_changes = {};

    			if (!updating_value_3 && dirty & /*message*/ 8) {
    				updating_value_3 = true;
    				textbox3_changes.value = /*message*/ ctx[3];
    				add_flush_callback(() => updating_value_3 = false);
    			}

    			textbox3.$set(textbox3_changes);
    			const clickable_changes = {};

    			if (dirty & /*$$scope*/ 8192) {
    				clickable_changes.$$scope = { dirty, ctx };
    			}

    			clickable.$set(clickable_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sectiontitle.$$.fragment, local);
    			transition_in(textbox0.$$.fragment, local);
    			transition_in(textbox1.$$.fragment, local);
    			transition_in(textbox2.$$.fragment, local);
    			transition_in(textbox3.$$.fragment, local);
    			transition_in(clickable.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sectiontitle.$$.fragment, local);
    			transition_out(textbox0.$$.fragment, local);
    			transition_out(textbox1.$$.fragment, local);
    			transition_out(textbox2.$$.fragment, local);
    			transition_out(textbox3.$$.fragment, local);
    			transition_out(clickable.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sectiontitle, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			destroy_component(textbox0);
    			destroy_component(textbox1);
    			destroy_component(textbox2);
    			destroy_component(textbox3);
    			destroy_component(clickable);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(35:0) <SectionContent color=\\\"dark\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let current;

    	const sectioncontent = new SectionContent({
    			props: {
    				color: "dark",
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sectioncontent.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(sectioncontent, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const sectioncontent_changes = {};

    			if (dirty & /*$$scope, message, subject, email, name*/ 8207) {
    				sectioncontent_changes.$$scope = { dirty, ctx };
    			}

    			sectioncontent.$set(sectioncontent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sectioncontent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sectioncontent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sectioncontent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const sendTo = "p.wanstobas@gmail.com";

    function instance$n($$self, $$props, $$invalidate) {
    	let name;
    	let email;
    	let subject;
    	let message;
    	const getSubject = (subject, name) => `Contact Request from ${name}: ${subject}`;
    	const getBody = (email, messge) => `${message}\n\nReply to ${email}.`;
    	const urlEncode = text => encodeURI(text);

    	const send = () => {
    		document.location.href = urlEncode(`mailto:${sendTo}?subject=${getSubject(subject, name)}&body=${getBody(email)}`);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Contact", $$slots, []);

    	function textbox0_value_binding(value) {
    		name = value;
    		$$invalidate(0, name);
    	}

    	function textbox1_value_binding(value) {
    		email = value;
    		$$invalidate(1, email);
    	}

    	function textbox2_value_binding(value) {
    		subject = value;
    		$$invalidate(2, subject);
    	}

    	function textbox3_value_binding(value) {
    		message = value;
    		$$invalidate(3, message);
    	}

    	const click_handler = () => send();

    	$$self.$capture_state = () => ({
    		SectionContent,
    		SectionTitle,
    		TextBox,
    		Clickable,
    		SendIcon,
    		sendTo,
    		name,
    		email,
    		subject,
    		message,
    		getSubject,
    		getBody,
    		urlEncode,
    		send
    	});

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("email" in $$props) $$invalidate(1, email = $$props.email);
    		if ("subject" in $$props) $$invalidate(2, subject = $$props.subject);
    		if ("message" in $$props) $$invalidate(3, message = $$props.message);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		name,
    		email,
    		subject,
    		message,
    		send,
    		getSubject,
    		getBody,
    		urlEncode,
    		textbox0_value_binding,
    		textbox1_value_binding,
    		textbox2_value_binding,
    		textbox3_value_binding,
    		click_handler
    	];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* app/src/App.svelte generated by Svelte v3.20.1 */
    const file$n = "app/src/App.svelte";

    function create_fragment$o(ctx) {
    	let div3;
    	let div0;
    	let t0;
    	let div2;
    	let div1;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let current;
    	const sidebar = new Sidebar({ $$inline: true });
    	const landing = new Landing({ $$inline: true });
    	const brandingbar = new BrandingBar({ $$inline: true });
    	const profile = new Profile({ $$inline: true });
    	const projects = new Projects({ $$inline: true });
    	const experience = new Experience({ $$inline: true });
    	const education = new Education({ $$inline: true });
    	const contact = new Contact({ $$inline: true });

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			create_component(sidebar.$$.fragment);
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			create_component(landing.$$.fragment);
    			t1 = space();
    			create_component(brandingbar.$$.fragment);
    			t2 = space();
    			create_component(profile.$$.fragment);
    			t3 = space();
    			create_component(projects.$$.fragment);
    			t4 = space();
    			create_component(experience.$$.fragment);
    			t5 = space();
    			create_component(education.$$.fragment);
    			t6 = space();
    			create_component(contact.$$.fragment);
    			attr_dev(div0, "class", "sidebar-container svelte-1ifa693");
    			add_location(div0, file$n, 38, 1, 968);
    			attr_dev(div1, "class", "content svelte-1ifa693");
    			add_location(div1, file$n, 42, 2, 1056);
    			attr_dev(div2, "class", "content-container svelte-1ifa693");
    			add_location(div2, file$n, 41, 1, 1022);
    			attr_dev(div3, "class", "app-container svelte-1ifa693");
    			add_location(div3, file$n, 37, 0, 939);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			mount_component(sidebar, div0, null);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			mount_component(landing, div1, null);
    			append_dev(div1, t1);
    			mount_component(brandingbar, div1, null);
    			append_dev(div1, t2);
    			mount_component(profile, div1, null);
    			append_dev(div1, t3);
    			mount_component(projects, div1, null);
    			append_dev(div1, t4);
    			mount_component(experience, div1, null);
    			append_dev(div1, t5);
    			mount_component(education, div1, null);
    			append_dev(div1, t6);
    			mount_component(contact, div1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidebar.$$.fragment, local);
    			transition_in(landing.$$.fragment, local);
    			transition_in(brandingbar.$$.fragment, local);
    			transition_in(profile.$$.fragment, local);
    			transition_in(projects.$$.fragment, local);
    			transition_in(experience.$$.fragment, local);
    			transition_in(education.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidebar.$$.fragment, local);
    			transition_out(landing.$$.fragment, local);
    			transition_out(brandingbar.$$.fragment, local);
    			transition_out(profile.$$.fragment, local);
    			transition_out(projects.$$.fragment, local);
    			transition_out(experience.$$.fragment, local);
    			transition_out(education.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(sidebar);
    			destroy_component(landing);
    			destroy_component(brandingbar);
    			destroy_component(profile);
    			destroy_component(projects);
    			destroy_component(experience);
    			destroy_component(education);
    			destroy_component(contact);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	$$self.$capture_state = () => ({
    		Router,
    		Sidebar,
    		Landing,
    		BrandingBar,
    		Profile,
    		Experience,
    		Education,
    		Skills,
    		Projects,
    		Contact
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
