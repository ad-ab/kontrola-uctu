
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
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
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
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
        input.value = value == null ? '' : value;
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

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.24.0' }, detail)));
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
        if (text.wholeText === data)
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

    /* src\components\ResultRow.svelte generated by Svelte v3.24.0 */

    const file = "src\\components\\ResultRow.svelte";

    function create_fragment(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let t2_value = (/*result*/ ctx[1] ? "Ok" : "Chyba") + "";
    	let t2;
    	let div2_class_value;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(/*account*/ ctx[0]);
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			attr_dev(div0, "class", "svelte-1xhcgi5");
    			add_location(div0, file, 28, 2, 410);
    			attr_dev(div1, "class", "center svelte-1xhcgi5");
    			add_location(div1, file, 29, 2, 434);
    			attr_dev(div2, "class", div2_class_value = "" + (null_to_empty(/*result*/ ctx[1] ? "good" : "bad") + " svelte-1xhcgi5"));
    			add_location(div2, file, 27, 0, 369);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, t2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*account*/ 1) set_data_dev(t0, /*account*/ ctx[0]);
    			if (dirty & /*result*/ 2 && t2_value !== (t2_value = (/*result*/ ctx[1] ? "Ok" : "Chyba") + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*result*/ 2 && div2_class_value !== (div2_class_value = "" + (null_to_empty(/*result*/ ctx[1] ? "good" : "bad") + " svelte-1xhcgi5"))) {
    				attr_dev(div2, "class", div2_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
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

    function instance($$self, $$props, $$invalidate) {
    	let { account } = $$props;
    	let { result } = $$props;
    	const writable_props = ["account", "result"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ResultRow> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("ResultRow", $$slots, []);

    	$$self.$set = $$props => {
    		if ("account" in $$props) $$invalidate(0, account = $$props.account);
    		if ("result" in $$props) $$invalidate(1, result = $$props.result);
    	};

    	$$self.$capture_state = () => ({ account, result });

    	$$self.$inject_state = $$props => {
    		if ("account" in $$props) $$invalidate(0, account = $$props.account);
    		if ("result" in $$props) $$invalidate(1, result = $$props.result);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [account, result];
    }

    class ResultRow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { account: 0, result: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ResultRow",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*account*/ ctx[0] === undefined && !("account" in props)) {
    			console.warn("<ResultRow> was created without expected prop 'account'");
    		}

    		if (/*result*/ ctx[1] === undefined && !("result" in props)) {
    			console.warn("<ResultRow> was created without expected prop 'result'");
    		}
    	}

    	get account() {
    		throw new Error("<ResultRow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set account(value) {
    		throw new Error("<ResultRow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get result() {
    		throw new Error("<ResultRow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set result(value) {
    		throw new Error("<ResultRow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const arrayDelimiter = ";";
    const rangeSeparator = "..";
    const regexStar = "*";
    const delimiter = "\t";

    function loadArray(arr) {
      return arr.split(arrayDelimiter);
    }

    function isRangeFn(stringItem) {
      const arr = stringItem.split(rangeSeparator);
      const [a, b] = arr.map((x) => parseInt(x));

      // param we get from the data.txt must be in between [a, b]
      return (x) => {
        return parseInt(x) >= a && parseInt(x) <= b;
      };
    }

    function isExactFn(stringItem) {
      const value = parseInt(stringItem);

      // param we get from the data.txt must be exactly the same
      return (x) => parseInt(x) === value;
    }

    function isStarFn(stringItem) {
      const chars = stringItem.split("");
      for (let i = chars.length; i < 6; i++) chars.push("[0-9]");

      const regex = chars.join("").replace(regexStar, "[0-9]");

      // param must match regex
      return (x) => x.match(regex);
    }

    function itemFunction(stringItem) {
      let testFn;
      if (stringItem.includes(rangeSeparator)) testFn = isRangeFn(stringItem);
      else if (stringItem.includes(regexStar)) testFn = isStarFn(stringItem);
      else testFn = isExactFn(stringItem);

      return testFn;
    }

    function configLineTestFn(line) {
      const [input, result] = line.split(delimiter);
      const items = loadArray(input);
      const testFns = items.map(itemFunction);

      return (x) => {
        // go trough all tests
        for (let i = 0; i < testFns.length; i++) {
          if (testFns[i](x)) return result || true;
        }
        // nothing found
        return false;
      };
    }

    function main(config, data) {
      const configFileLines = config.split(/\r?\n/);
      const dataFileLines = data.split(/\r?\n/);

      const tests = configFileLines.filter((x) => x).map(configLineTestFn);

      const results = [];
      dataFileLines
        .filter((x) => x)
        .forEach((value) => {
          let result = false;
          for (let i = 0; i < tests.length; i++) {
            result = tests[i](value);
            if (result) break;
          }

          results.push({ account: value, result });
        });

      return results;
    }

    /* src\App.svelte generated by Svelte v3.24.0 */
    const file$1 = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (105:4) {#if resultItems.length}
    function create_if_block(ctx) {
    	let form;
    	let h2;
    	let t1;
    	let div;
    	let current;
    	let each_value = /*resultItems*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			form = element("form");
    			h2 = element("h2");
    			h2.textContent = "Výsledky";
    			t1 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h2, "class", "svelte-rts9lp");
    			add_location(h2, file$1, 106, 8, 2005);
    			attr_dev(div, "class", "results svelte-rts9lp");
    			add_location(div, file$1, 107, 8, 2031);
    			attr_dev(form, "class", "svelte-rts9lp");
    			add_location(form, file$1, 105, 6, 1990);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, h2);
    			append_dev(form, t1);
    			append_dev(form, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*resultItems*/ 2) {
    				each_value = /*resultItems*/ ctx[1];
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

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(105:4) {#if resultItems.length}",
    		ctx
    	});

    	return block;
    }

    // (109:10) {#each resultItems as item}
    function create_each_block(ctx) {
    	let resultrow;
    	let current;
    	const resultrow_spread_levels = [/*item*/ ctx[7]];
    	let resultrow_props = {};

    	for (let i = 0; i < resultrow_spread_levels.length; i += 1) {
    		resultrow_props = assign(resultrow_props, resultrow_spread_levels[i]);
    	}

    	resultrow = new ResultRow({ props: resultrow_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(resultrow.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(resultrow, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const resultrow_changes = (dirty & /*resultItems*/ 2)
    			? get_spread_update(resultrow_spread_levels, [get_spread_object(/*item*/ ctx[7])])
    			: {};

    			resultrow.$set(resultrow_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(resultrow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(resultrow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(resultrow, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(109:10) {#each resultItems as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let div1;
    	let form;
    	let h20;
    	let t3;
    	let textarea0;
    	let textarea0_placeholder_value;
    	let t4;
    	let br0;
    	let t5;
    	let h21;
    	let t7;
    	let textarea1;
    	let textarea1_placeholder_value;
    	let t8;
    	let br1;
    	let t9;
    	let div0;
    	let button0;
    	let t11;
    	let button1;
    	let t13;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*resultItems*/ ctx[1].length && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Kontrola";
    			t1 = space();
    			div1 = element("div");
    			form = element("form");
    			h20 = element("h2");
    			h20.textContent = "Rozsahy";
    			t3 = space();
    			textarea0 = element("textarea");
    			t4 = space();
    			br0 = element("br");
    			t5 = space();
    			h21 = element("h2");
    			h21.textContent = "Účty";
    			t7 = space();
    			textarea1 = element("textarea");
    			t8 = space();
    			br1 = element("br");
    			t9 = space();
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "Smazat";
    			t11 = space();
    			button1 = element("button");
    			button1.textContent = "Kontrola";
    			t13 = space();
    			if (if_block) if_block.c();
    			attr_dev(h1, "class", "svelte-rts9lp");
    			add_location(h1, file$1, 88, 2, 1447);
    			attr_dev(h20, "class", "svelte-rts9lp");
    			add_location(h20, file$1, 93, 6, 1592);
    			attr_dev(textarea0, "placeholder", textarea0_placeholder_value = /*placeholder*/ ctx[2].config);
    			attr_dev(textarea0, "class", "svelte-rts9lp");
    			add_location(textarea0, file$1, 94, 6, 1615);
    			attr_dev(br0, "class", "svelte-rts9lp");
    			add_location(br0, file$1, 95, 6, 1692);
    			attr_dev(h21, "class", "svelte-rts9lp");
    			add_location(h21, file$1, 96, 6, 1705);
    			attr_dev(textarea1, "placeholder", textarea1_placeholder_value = /*placeholder*/ ctx[2].accounts);
    			attr_dev(textarea1, "class", "svelte-rts9lp");
    			add_location(textarea1, file$1, 97, 6, 1725);
    			attr_dev(br1, "class", "svelte-rts9lp");
    			add_location(br1, file$1, 98, 6, 1806);
    			attr_dev(button0, "type", "reset");
    			attr_dev(button0, "class", "svelte-rts9lp");
    			add_location(button0, file$1, 100, 8, 1845);
    			attr_dev(button1, "type", "submit");
    			attr_dev(button1, "class", "svelte-rts9lp");
    			add_location(button1, file$1, 101, 8, 1890);
    			attr_dev(div0, "class", "row svelte-rts9lp");
    			add_location(div0, file$1, 99, 6, 1819);
    			attr_dev(form, "class", "svelte-rts9lp");
    			add_location(form, file$1, 90, 4, 1489);
    			attr_dev(div1, "class", "row svelte-rts9lp");
    			add_location(div1, file$1, 89, 2, 1467);
    			attr_dev(main, "class", "svelte-rts9lp");
    			add_location(main, file$1, 87, 0, 1438);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			append_dev(main, div1);
    			append_dev(div1, form);
    			append_dev(form, h20);
    			append_dev(form, t3);
    			append_dev(form, textarea0);
    			set_input_value(textarea0, /*data*/ ctx[0].config);
    			append_dev(form, t4);
    			append_dev(form, br0);
    			append_dev(form, t5);
    			append_dev(form, h21);
    			append_dev(form, t7);
    			append_dev(form, textarea1);
    			set_input_value(textarea1, /*data*/ ctx[0].accounts);
    			append_dev(form, t8);
    			append_dev(form, br1);
    			append_dev(form, t9);
    			append_dev(form, div0);
    			append_dev(div0, button0);
    			append_dev(div0, t11);
    			append_dev(div0, button1);
    			append_dev(div1, t13);
    			if (if_block) if_block.m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea0, "input", /*textarea0_input_handler*/ ctx[5]),
    					listen_dev(textarea1, "input", /*textarea1_input_handler*/ ctx[6]),
    					listen_dev(form, "submit", prevent_default(/*handleSubmit*/ ctx[3]), false, true, false),
    					listen_dev(form, "reset", prevent_default(/*handleReset*/ ctx[4]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*data*/ 1) {
    				set_input_value(textarea0, /*data*/ ctx[0].config);
    			}

    			if (dirty & /*data*/ 1) {
    				set_input_value(textarea1, /*data*/ ctx[0].accounts);
    			}

    			if (/*resultItems*/ ctx[1].length) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*resultItems*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
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
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
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
    	let placeholder = {
    		config: "100000..110000;200000..300000\r\n4*;5*\r\n012345",
    		accounts: "100001\r\n100002"
    	};

    	let data = { config: "", accounts: "" };
    	let resultItems = [];

    	const handleSubmit = params => {
    		$$invalidate(1, resultItems = main(data.config, data.accounts));
    	};

    	const handleReset = () => {
    		$$invalidate(0, data.config = "", data);
    		$$invalidate(0, data.accounts = "", data);
    		$$invalidate(1, resultItems = []);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	function textarea0_input_handler() {
    		data.config = this.value;
    		$$invalidate(0, data);
    	}

    	function textarea1_input_handler() {
    		data.accounts = this.value;
    		$$invalidate(0, data);
    	}

    	$$self.$capture_state = () => ({
    		ResultRow,
    		checkAccounts: main,
    		placeholder,
    		data,
    		resultItems,
    		handleSubmit,
    		handleReset
    	});

    	$$self.$inject_state = $$props => {
    		if ("placeholder" in $$props) $$invalidate(2, placeholder = $$props.placeholder);
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    		if ("resultItems" in $$props) $$invalidate(1, resultItems = $$props.resultItems);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		data,
    		resultItems,
    		placeholder,
    		handleSubmit,
    		handleReset,
    		textarea0_input_handler,
    		textarea1_input_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
