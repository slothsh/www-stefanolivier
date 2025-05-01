var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { clsx as clsx$1 } from "clsx";
import { router, setupProgress } from "@inertiajs/core";
import escape from "html-escape";
import { faEnvelope, faLink, faPaste, faArrowUp, faExclamationCircle, faWarning, faMagnifyingGlass, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { secondsToMinutes, format, formatDate } from "date-fns";
import { faInstagram, faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import createServer from "@inertiajs/core/server";
const HYDRATION_START = "[";
const HYDRATION_END = "]";
const ELEMENT_IS_NAMESPACED = 1;
const ELEMENT_PRESERVE_ATTRIBUTE_CASE = 1 << 1;
const ATTR_REGEX = /[&"<]/g;
const CONTENT_REGEX = /[&<]/g;
function escape_html(value, is_attr) {
  const str = String(value ?? "");
  const pattern = is_attr ? ATTR_REGEX : CONTENT_REGEX;
  pattern.lastIndex = 0;
  let escaped = "";
  let last = 0;
  while (pattern.test(str)) {
    const i = pattern.lastIndex - 1;
    const ch = str[i];
    escaped += str.substring(last, i) + (ch === "&" ? "&amp;" : ch === '"' ? "&quot;" : "&lt;");
    last = i + 1;
  }
  return escaped + str.substring(last);
}
const replacements = {
  translate: /* @__PURE__ */ new Map([
    [true, "yes"],
    [false, "no"]
  ])
};
function attr(name, value, is_boolean = false) {
  if (value == null || !value && is_boolean) return "";
  const normalized = name in replacements && replacements[name].get(value) || value;
  const assignment = is_boolean ? "" : `="${escape_html(normalized, true)}"`;
  return ` ${name}${assignment}`;
}
function clsx(value) {
  if (typeof value === "object") {
    return clsx$1(value);
  } else {
    return value ?? "";
  }
}
const whitespace = [..." 	\n\r\f \v\uFEFF"];
function to_class(value, hash, directives) {
  var classname = value == null ? "" : "" + value;
  if (hash) {
    classname = classname ? classname + " " + hash : hash;
  }
  if (directives) {
    for (var key in directives) {
      if (directives[key]) {
        classname = classname ? classname + " " + key : key;
      } else if (classname.length) {
        var len = key.length;
        var a = 0;
        while ((a = classname.indexOf(key, a)) >= 0) {
          var b = a + len;
          if ((a === 0 || whitespace.includes(classname[a - 1])) && (b === classname.length || whitespace.includes(classname[b]))) {
            classname = (a === 0 ? "" : classname.substring(0, a)) + classname.substring(b + 1);
          } else {
            a = b;
          }
        }
      }
    }
  }
  return classname === "" ? null : classname;
}
function append_styles(styles, important = false) {
  var separator = important ? " !important;" : ";";
  var css = "";
  for (var key in styles) {
    var value = styles[key];
    if (value != null && value !== "") {
      css += " " + key + ": " + value + separator;
    }
  }
  return css;
}
function to_css_name(name) {
  if (name[0] !== "-" || name[1] !== "-") {
    return name.toLowerCase();
  }
  return name;
}
function to_style(value, styles) {
  if (styles) {
    var new_style = "";
    var normal_styles;
    var important_styles;
    if (Array.isArray(styles)) {
      normal_styles = styles[0];
      important_styles = styles[1];
    } else {
      normal_styles = styles;
    }
    if (value) {
      value = String(value).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
      var in_str = false;
      var in_apo = 0;
      var in_comment = false;
      var reserved_names = [];
      if (normal_styles) {
        reserved_names.push(...Object.keys(normal_styles).map(to_css_name));
      }
      if (important_styles) {
        reserved_names.push(...Object.keys(important_styles).map(to_css_name));
      }
      var start_index = 0;
      var name_index = -1;
      const len = value.length;
      for (var i = 0; i < len; i++) {
        var c = value[i];
        if (in_comment) {
          if (c === "/" && value[i - 1] === "*") {
            in_comment = false;
          }
        } else if (in_str) {
          if (in_str === c) {
            in_str = false;
          }
        } else if (c === "/" && value[i + 1] === "*") {
          in_comment = true;
        } else if (c === '"' || c === "'") {
          in_str = c;
        } else if (c === "(") {
          in_apo++;
        } else if (c === ")") {
          in_apo--;
        }
        if (!in_comment && in_str === false && in_apo === 0) {
          if (c === ":" && name_index === -1) {
            name_index = i;
          } else if (c === ";" || i === len - 1) {
            if (name_index !== -1) {
              var name = to_css_name(value.substring(start_index, name_index).trim());
              if (!reserved_names.includes(name)) {
                if (c !== ";") {
                  i++;
                }
                var property = value.substring(start_index, i).trim();
                new_style += " " + property + ";";
              }
            }
            start_index = i + 1;
            name_index = -1;
          }
        }
      }
    }
    if (normal_styles) {
      new_style += append_styles(normal_styles);
    }
    if (important_styles) {
      new_style += append_styles(important_styles, true);
    }
    new_style = new_style.trim();
    return new_style === "" ? null : new_style;
  }
  return value == null ? null : String(value);
}
const noop = () => {
};
function fallback(value, fallback2, lazy = false) {
  return value === void 0 ? lazy ? (
    /** @type {() => V} */
    fallback2()
  ) : (
    /** @type {V} */
    fallback2
  ) : value;
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
}
let untracking = false;
function untrack(fn) {
  var previous_untracking = untracking;
  try {
    untracking = true;
    return fn();
  } finally {
    untracking = previous_untracking;
  }
}
const VOID_ELEMENT_NAMES = [
  "area",
  "base",
  "br",
  "col",
  "command",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
];
function is_void(name) {
  return VOID_ELEMENT_NAMES.includes(name) || name.toLowerCase() === "!doctype";
}
const DOM_BOOLEAN_ATTRIBUTES = [
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "disabled",
  "formnovalidate",
  "hidden",
  "indeterminate",
  "inert",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "seamless",
  "selected",
  "webkitdirectory",
  "defer",
  "disablepictureinpicture",
  "disableremoteplayback"
];
function is_boolean_attribute(name) {
  return DOM_BOOLEAN_ATTRIBUTES.includes(name);
}
const RAW_TEXT_ELEMENTS = (
  /** @type {const} */
  ["textarea", "script", "style", "title"]
);
function is_raw_text_element(name) {
  return RAW_TEXT_ELEMENTS.includes(
    /** @type {RAW_TEXT_ELEMENTS[number]} */
    name
  );
}
const subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop) {
  let stop = null;
  const subscribers = /* @__PURE__ */ new Set();
  function set2(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
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
    set2(fn(
      /** @type {T} */
      value
    ));
  }
  function subscribe(run, invalidate = noop) {
    const subscriber = [run, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set2, update) || noop;
    }
    run(
      /** @type {T} */
      value
    );
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }
  return { set: set2, update, subscribe };
}
function subscribe_to_store(store, run, invalidate) {
  if (store == null) {
    run(void 0);
    return noop;
  }
  const unsub = untrack(
    () => store.subscribe(
      run,
      // @ts-expect-error
      invalidate
    )
  );
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
var current_component = null;
function push(fn) {
  current_component = { p: current_component, c: null, d: null };
}
function pop() {
  var component = (
    /** @type {Component} */
    current_component
  );
  var ondestroy = component.d;
  if (ondestroy) {
    on_destroy.push(...ondestroy);
  }
  current_component = component.p;
}
const BLOCK_OPEN = `<!--${HYDRATION_START}-->`;
const BLOCK_CLOSE = `<!--${HYDRATION_END}-->`;
const EMPTY_COMMENT = `<!---->`;
class HeadPayload {
  constructor(css = /* @__PURE__ */ new Set(), out = "", title = "", uid = () => "") {
    /** @type {Set<{ hash: string; code: string }>} */
    __publicField(this, "css", /* @__PURE__ */ new Set());
    __publicField(this, "out", "");
    __publicField(this, "uid", () => "");
    __publicField(this, "title", "");
    this.css = css;
    this.out = out;
    this.title = title;
    this.uid = uid;
  }
}
class Payload {
  constructor(id_prefix = "") {
    /** @type {Set<{ hash: string; code: string }>} */
    __publicField(this, "css", /* @__PURE__ */ new Set());
    __publicField(this, "out", "");
    __publicField(this, "uid", () => "");
    __publicField(this, "head", new HeadPayload());
    this.uid = props_id_generator(id_prefix);
    this.head.uid = this.uid;
  }
}
function props_id_generator(prefix) {
  let uid = 1;
  return () => `${prefix}s${uid++}`;
}
function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
const INVALID_ATTR_NAME_CHAR_REGEX = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
function element(payload, tag, attributes_fn = noop, children_fn = noop) {
  payload.out += "<!---->";
  if (tag) {
    payload.out += `<${tag}`;
    attributes_fn();
    payload.out += `>`;
    if (!is_void(tag)) {
      children_fn();
      if (!is_raw_text_element(tag)) {
        payload.out += EMPTY_COMMENT;
      }
      payload.out += `</${tag}>`;
    }
  }
  payload.out += "<!---->";
}
let on_destroy = [];
function render(component, options = {}) {
  const payload = new Payload(options.idPrefix ? options.idPrefix + "-" : "");
  const prev_on_destroy = on_destroy;
  on_destroy = [];
  payload.out += BLOCK_OPEN;
  if (options.context) {
    push();
    current_component.c = options.context;
  }
  component(payload, options.props ?? {}, {}, {});
  if (options.context) {
    pop();
  }
  payload.out += BLOCK_CLOSE;
  for (const cleanup of on_destroy) cleanup();
  on_destroy = prev_on_destroy;
  let head2 = payload.head.out + payload.head.title;
  for (const { hash, code } of payload.css) {
    head2 += `<style id="${hash}">${code}</style>`;
  }
  return {
    head: head2,
    html: payload.out,
    body: payload.out
  };
}
function head(payload, fn) {
  const head_payload = payload.head;
  head_payload.out += BLOCK_OPEN;
  fn(head_payload);
  head_payload.out += BLOCK_CLOSE;
}
function spread_attributes(attrs, css_hash, classes, styles, flags = 0) {
  if (attrs.class) {
    attrs.class = clsx(attrs.class);
  }
  let attr_str = "";
  let name;
  const is_html = (flags & ELEMENT_IS_NAMESPACED) === 0;
  const lowercase = (flags & ELEMENT_PRESERVE_ATTRIBUTE_CASE) === 0;
  for (name in attrs) {
    if (typeof attrs[name] === "function") continue;
    if (name[0] === "$" && name[1] === "$") continue;
    if (INVALID_ATTR_NAME_CHAR_REGEX.test(name)) continue;
    var value = attrs[name];
    if (lowercase) {
      name = name.toLowerCase();
    }
    attr_str += attr(name, value, is_html && is_boolean_attribute(name));
  }
  return attr_str;
}
function spread_props(props) {
  const merged_props = {};
  let key;
  for (let i = 0; i < props.length; i++) {
    const obj = props[i];
    for (key in obj) {
      const desc = Object.getOwnPropertyDescriptor(obj, key);
      if (desc) {
        Object.defineProperty(merged_props, key, desc);
      } else {
        merged_props[key] = obj[key];
      }
    }
  }
  return merged_props;
}
function stringify(value) {
  return typeof value === "string" ? value : value == null ? "" : value + "";
}
function attr_class(value, hash, directives) {
  var result = to_class(value, hash, directives);
  return result ? ` class="${escape_html(result, true)}"` : "";
}
function attr_style(value, directives) {
  var result = to_style(value, directives);
  return result ? ` style="${escape_html(result, true)}"` : "";
}
function store_get(store_values, store_name, store) {
  var _a;
  if (store_name in store_values && store_values[store_name][0] === store) {
    return store_values[store_name][2];
  }
  (_a = store_values[store_name]) == null ? void 0 : _a[1]();
  store_values[store_name] = [store, null, void 0];
  const unsub = subscribe_to_store(
    store,
    /** @param {any} v */
    (v) => store_values[store_name][2] = v
  );
  store_values[store_name][1] = unsub;
  return store_values[store_name][2];
}
function unsubscribe_stores(store_values) {
  for (const store_name in store_values) {
    store_values[store_name][1]();
  }
}
function slot(payload, $$props, name, slot_props, fallback_fn) {
  var _a;
  var slot_fn = (_a = $$props.$$slots) == null ? void 0 : _a[name];
  if (slot_fn === true) {
    slot_fn = $$props["children"];
  }
  if (slot_fn !== void 0) {
    slot_fn(payload, slot_props);
  }
}
function rest_props(props, rest) {
  const rest_props2 = {};
  let key;
  for (key in props) {
    if (!rest.includes(key)) {
      rest_props2[key] = props[key];
    }
  }
  return rest_props2;
}
function sanitize_props(props) {
  const { children, $$slots, ...sanitized } = props;
  return sanitized;
}
function bind_props(props_parent, props_now) {
  var _a;
  for (const key in props_now) {
    const initial_value = props_parent[key];
    const value = props_now[key];
    if (initial_value === void 0 && value !== void 0 && ((_a = Object.getOwnPropertyDescriptor(props_parent, key)) == null ? void 0 : _a.set)) {
      props_parent[key] = value;
    }
  }
}
function ensure_array_like(array_like_or_iterator) {
  if (array_like_or_iterator) {
    return array_like_or_iterator.length !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
  }
  return [];
}
function Link($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "href",
    "as",
    "data",
    "method",
    "replace",
    "preserveScroll",
    "preserveState",
    "only",
    "except",
    "headers",
    "queryStringArrayFormat",
    "async",
    "prefetch",
    "cacheFor"
  ]);
  push();
  let asProp, elProps;
  let href = fallback($$props["href"], "");
  let as = fallback($$props["as"], "a");
  let data = fallback($$props["data"], () => ({}), true);
  let method = fallback($$props["method"], "get");
  let replace = fallback($$props["replace"], false);
  let preserveScroll = fallback($$props["preserveScroll"], false);
  let preserveState = fallback($$props["preserveState"], null);
  let only = fallback($$props["only"], () => [], true);
  let except = fallback($$props["except"], () => [], true);
  let headers = fallback($$props["headers"], () => ({}), true);
  let queryStringArrayFormat = fallback($$props["queryStringArrayFormat"], "brackets");
  let async = fallback($$props["async"], false);
  let prefetch = fallback($$props["prefetch"], false);
  let cacheFor = fallback($$props["cacheFor"], 0);
  method = typeof href === "object" ? href.method : method;
  href = typeof href === "object" ? href.url : href;
  asProp = method !== "get" ? "button" : as.toLowerCase();
  elProps = { a: { href }, button: { type: "button" } }[asProp] || {};
  element(
    $$payload,
    asProp,
    () => {
      $$payload.out += `${spread_attributes({ ...$$restProps, ...elProps })}`;
    },
    () => {
      $$payload.out += `<!---->`;
      slot($$payload, $$props, "default", {});
      $$payload.out += `<!---->`;
    }
  );
  bind_props($$props, {
    href,
    as,
    data,
    method,
    replace,
    preserveScroll,
    preserveState,
    only,
    except,
    headers,
    queryStringArrayFormat,
    async,
    prefetch,
    cacheFor
  });
  pop();
}
const h = (component, propsOrChildren, childrenOrKey, key = null) => {
  const hasProps = typeof propsOrChildren === "object" && propsOrChildren !== null && !Array.isArray(propsOrChildren);
  return {
    component,
    key: hasProps ? key : typeof childrenOrKey === "number" ? childrenOrKey : null,
    props: hasProps ? propsOrChildren : {},
    children: hasProps ? Array.isArray(childrenOrKey) ? childrenOrKey : childrenOrKey !== null ? [childrenOrKey] : [] : Array.isArray(propsOrChildren) ? propsOrChildren : propsOrChildren !== null ? [propsOrChildren] : []
  };
};
function Render($$payload, $$props) {
  push();
  let component = $$props["component"];
  let props = fallback($$props["props"], () => ({}), true);
  let children = fallback($$props["children"], () => [], true);
  let key = fallback($$props["key"], null);
  if (component) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    {
      if (children.length > 0) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<!---->`;
        component == null ? void 0 : component($$payload, spread_props([
          props,
          {
            children: ($$payload2) => {
              const each_array = ensure_array_like(children);
              $$payload2.out += `<!--[-->`;
              for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                let child = each_array[$$index];
                Render($$payload2, spread_props([child]));
                $$payload2.out += `<!---->`;
              }
              $$payload2.out += `<!--]-->`;
            },
            $$slots: { default: true }
          }
        ]));
        $$payload.out += `<!---->`;
      } else {
        $$payload.out += "<!--[!-->";
        $$payload.out += `<!---->`;
        component == null ? void 0 : component($$payload, spread_props([props]));
        $$payload.out += `<!---->`;
      }
      $$payload.out += `<!--]-->`;
    }
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { component, props, children, key });
  pop();
}
const { set } = writable();
const setPage = set;
function App($$payload, $$props) {
  push();
  let initialComponent = $$props["initialComponent"];
  let initialPage = $$props["initialPage"];
  let resolveComponent = $$props["resolveComponent"];
  let component = initialComponent;
  let key = null;
  let page = initialPage;
  let renderProps = resolveRenderProps(component, page, key);
  setPage(page);
  const isServer = typeof window === "undefined";
  if (!isServer) {
    router.init({
      initialPage,
      resolveComponent,
      swapComponent: async (args) => {
        component = args.component;
        page = args.page;
        key = args.preserveState ? key : Date.now();
        renderProps = resolveRenderProps(component, page, key);
        setPage(page);
      }
    });
  }
  function resolveRenderProps(component2, page2, key2 = null) {
    const child = h(component2.default, page2.props, [], key2);
    const layout = component2.layout;
    return layout ? resolveLayout(layout, child, page2.props, key2) : child;
  }
  function resolveLayout(layout, child, pageProps, key2) {
    if (isLayoutFunction(layout)) {
      return layout(h, child);
    }
    if (Array.isArray(layout)) {
      return layout.slice().reverse().reduce((currentRender, layoutComponent) => h(layoutComponent, pageProps, [currentRender], key2), child);
    }
    return h(layout, pageProps, child ? [child] : [], key2);
  }
  function isLayoutFunction(layout) {
    return typeof layout === "function" && layout.length === 2 && typeof layout.prototype === "undefined";
  }
  Render($$payload, spread_props([renderProps]));
  bind_props($$props, {
    initialComponent,
    initialPage,
    resolveComponent
  });
  pop();
}
async function createInertiaApp({ id = "app", resolve, setup, progress = {}, page }) {
  const isServer = typeof window === "undefined";
  const el = isServer ? null : document.getElementById(id);
  const initialPage = page || JSON.parse((el == null ? void 0 : el.dataset.page) || "{}");
  const resolveComponent = (name) => Promise.resolve(resolve(name));
  const [initialComponent] = await Promise.all([
    resolveComponent(initialPage.component),
    router.decryptHistory().catch(() => {
    })
  ]);
  const props = { initialPage, initialComponent, resolveComponent };
  const svelteApp = setup({
    el,
    App,
    props
  });
  if (isServer) {
    const { html: html2, head: head2, css } = svelteApp;
    return {
      body: `<div data-server-rendered="true" id="${id}" data-page="${escape(JSON.stringify(initialPage))}">${html2}</div>`,
      head: [head2, css ? `<style data-vite-css>${css.code}</style>` : ""]
    };
  }
  if (progress) {
    setupProgress(progress);
  }
}
function NavigationLayout($$payload, $$props) {
  const { enableFooter, class: _class } = $$props;
  const enableFooterFlag = enableFooter ?? true;
  $$payload.out += `<div${attr_class(clsx(mc("", _class)))}><nav class="w-full sticky top-0 left-0 bg-primary h-(--navigation-height) border-b border-b-border flex justify-center items-center z-(--z-navigation)"><div class="w-page">`;
  Link($$payload, {
    class: "px-4",
    href: route("home.index"),
    children: ($$payload2) => {
      $$payload2.out += `<!---->Home`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----> `;
  Link($$payload, {
    class: "px-4",
    href: route("blog.index"),
    children: ($$payload2) => {
      $$payload2.out += `<!---->Blog`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----></div></nav> <!---->`;
  slot($$payload, $$props, "default", {});
  $$payload.out += `<!----> `;
  if (enableFooterFlag) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<footer class="bottom-0 left-0 w-screen h-(--footer-height) flex justify-center items-center border-t border-border bg-primary z-(--z-navigation)"><h1 class="text-sm">Copyright (c) Stefan Olivier</h1></footer>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
}
function getTransform(scale, translateX, translateY, rotate, flip, translateTimes = 1, translateUnit = "", rotateUnit = "") {
  let flipX = 1;
  let flipY = 1;
  if (flip) {
    if (flip == "horizontal") {
      flipX = -1;
    } else if (flip == "vertical") {
      flipY = -1;
    } else {
      flipX = flipY = -1;
    }
  }
  if (typeof scale === "string") {
    scale = parseFloat(scale);
  }
  if (typeof translateX === "string") {
    translateX = parseFloat(translateX);
  }
  if (typeof translateY === "string") {
    translateY = parseFloat(translateY);
  }
  const x = `${translateX * translateTimes}${translateUnit}`;
  const y = `${translateY * translateTimes}${translateUnit}`;
  let output = `translate(${x},${y}) scale(${flipX * scale},${flipY * scale})`;
  if (rotate) {
    output += ` rotate(${rotate}${rotateUnit})`;
  }
  return output;
}
function Fa($$payload, $$props) {
  push();
  let i, transform;
  let clazz = fallback($$props["class"], () => void 0, true);
  let id = fallback($$props["id"], () => void 0, true);
  let style = fallback($$props["style"], () => void 0, true);
  let icon = $$props["icon"];
  let title = fallback($$props["title"], () => void 0, true);
  let size = fallback($$props["size"], () => void 0, true);
  let color = fallback($$props["color"], () => void 0, true);
  let fw = fallback($$props["fw"], false);
  let pull = fallback($$props["pull"], () => void 0, true);
  let scale = fallback($$props["scale"], 1);
  let translateX = fallback($$props["translateX"], 0);
  let translateY = fallback($$props["translateY"], 0);
  let rotate = fallback($$props["rotate"], () => void 0, true);
  let flip = fallback($$props["flip"], () => void 0, true);
  let spin = fallback($$props["spin"], false);
  let pulse = fallback($$props["pulse"], false);
  let primaryColor = fallback($$props["primaryColor"], "");
  let secondaryColor = fallback($$props["secondaryColor"], "");
  let primaryOpacity = fallback($$props["primaryOpacity"], 1);
  let secondaryOpacity = fallback($$props["secondaryOpacity"], 0.4);
  let swapOpacity = fallback($$props["swapOpacity"], false);
  i = icon && icon.icon || [0, 0, "", [], ""];
  transform = getTransform(scale, translateX, translateY, rotate, flip, 512);
  if (i[4]) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<svg${attr("id", id)}${attr_class(`svelte-fa svelte-fa-base ${stringify(clazz)}`, "svelte-bvo74f", {
      "pulse": pulse,
      "svelte-fa-size-lg": size === "lg",
      "svelte-fa-size-sm": size === "sm",
      "svelte-fa-size-xs": size === "xs",
      "svelte-fa-fw": fw,
      "svelte-fa-pull-left": pull === "left",
      "svelte-fa-pull-right": pull === "right",
      "spin": spin
    })}${attr_style(style)}${attr("viewBox", `0 0 ${stringify(i[0])} ${stringify(i[1])}`)}${attr("aria-hidden", title === void 0)} role="img" xmlns="http://www.w3.org/2000/svg">`;
    if (title) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<title class="svelte-bvo74f">${escape_html(title)}</title>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--><g${attr("transform", `translate(${stringify(i[0] / 2)} ${stringify(i[1] / 2)})`)}${attr("transform-origin", `${stringify(i[0] / 4)} 0`)} class="svelte-bvo74f"><g${attr("transform", transform)} class="svelte-bvo74f">`;
    if (typeof i[4] == "string") {
      $$payload.out += "<!--[-->";
      $$payload.out += `<path${attr("d", i[4])}${attr("fill", color || primaryColor || "currentColor")}${attr("transform", `translate(${stringify(i[0] / -2)} ${stringify(i[1] / -2)})`)} class="svelte-bvo74f"></path>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<path${attr("d", i[4][0])}${attr("fill", secondaryColor || color || "currentColor")}${attr("fill-opacity", swapOpacity != false ? primaryOpacity : secondaryOpacity)}${attr("transform", `translate(${stringify(i[0] / -2)} ${stringify(i[1] / -2)})`)} class="svelte-bvo74f"></path><path${attr("d", i[4][1])}${attr("fill", primaryColor || color || "currentColor")}${attr("fill-opacity", swapOpacity != false ? secondaryOpacity : primaryOpacity)}${attr("transform", `translate(${stringify(i[0] / -2)} ${stringify(i[1] / -2)})`)} class="svelte-bvo74f"></path>`;
    }
    $$payload.out += `<!--]--></g></g></svg>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, {
    class: clazz,
    id,
    style,
    icon,
    title,
    size,
    color,
    fw,
    pull,
    scale,
    translateX,
    translateY,
    rotate,
    flip,
    spin,
    pulse,
    primaryColor,
    secondaryColor,
    primaryOpacity,
    secondaryOpacity,
    swapOpacity
  });
  pop();
}
function Tag($$payload, $$props) {
  let { tag } = $$props;
  $$payload.out += `<button class="text-sm py-1 px-3 bg-accent-primary hover:brightness-110 rounded border border-white/10 shadow cursor-pointer">${escape_html(tag)}</button>`;
}
function useClientWindow() {
  return readable(
    {
      width: window.innerWidth,
      height: window.innerHeight,
      scale: window.devicePixelRatio || 2
    },
    (set2) => {
      const update = () => set2({
        width: window.innerWidth,
        height: window.innerHeight,
        scale: window.devicePixelRatio || 2
      });
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }
  );
}
function useClientCursor() {
  return readable(
    {
      position: Vector.xy(0, 0),
      offset: Vector.xy(0, 0)
    },
    (set2) => {
      const update = (e) => set2({
        position: Vector.xy(e.clientX, e.clientY),
        offset: Vector.xy(e.movementX, e.movementY)
      });
      window.addEventListener("mousemove", update);
      return () => window.removeEventListener("mousemove", update);
    }
  );
}
function Canvas($$payload, $$props) {
  push();
  let {
    rect,
    class: _class,
    program,
    programArgs = {}
  } = $$props;
  useClientCursor();
  $$payload.out += `<canvas${attr("width", rect.w)}${attr("height", rect.h)}${attr_class(clsx(_class))}${attr_style("", { left: `${rect.x}px`, top: `${rect.y}px` })}></canvas>`;
  pop();
}
globalThis.Arr = {
  randomItem(items) {
    return items[Math.randomInt(0, items.length)];
  }
};
globalThis.Anim = {
  easeInOutSine(n) {
    return -(Math.cos(Math.PI * n) - 1) / 2;
  },
  easeInOutQuint(n) {
    return n < 0.5 ? 16 * n * n * n * n * n : 1 - Math.pow(-2 * n + 2, 5) / 2;
  },
  easeOutBounce(n) {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (n < 1 / d1) {
      return n1 * n * n;
    } else if (n < 2 / d1) {
      return n1 * (n -= 1.5 / d1) * n + 0.75;
    } else if (n < 2.5 / d1) {
      return n1 * (n -= 2.25 / d1) * n + 0.9375;
    } else {
      return n1 * (n -= 2.625 / d1) * n + 0.984375;
    }
  }
};
globalThis.Bio = {
  firstname: "Stefan",
  surname: "Olivier",
  about: "Et invidunt ut wisi gubergren eu. Invidunt no eos duis kasd doming. Gubergren eros facilisis tempor placerat quis augue facilisi.",
  occupation: "Software Engineer",
  contact: {
    Email: {
      icon: faEnvelope,
      src: "mailto:dev@stefanolivier.com",
      displayName: "dev@stefanolivier.com"
    },
    GitHub: {
      icon: faGithub,
      src: "https://github.com/slothsh",
      displayName: "/slothsh"
    },
    LinkedIn: {
      icon: faLinkedin,
      src: "https://linkedin.com/in/stefan-olivier-628261145",
      displayName: "Stefan Olivier"
    },
    Instagram: {
      icon: faInstagram,
      src: "https://instagram.com/@stefan_is_stevey",
      displayName: "@stefan_is_stevey"
    }
  }
};
Object.defineProperty(globalThis.Bio, "name", {
  get() {
    return [this.firstname, this.surname].join(" ");
  }
});
Object.assign(Math, {
  EPSILON: 1e-10,
  clamp(n, min, max) {
    return Math.max(min, Math.min(n, max));
  },
  randomInt(low, high) {
    return Math.clamp(
      Math.round(Math.random() * high - low),
      low,
      high - 1
    );
  },
  nmod(n, d) {
    return (n % d + d) % d;
  }
});
globalThis.Str = {
  capitalize(str) {
    if (!str) return "";
    return str.split(" ").map((s) => s.charAt(0).toUpperCase() + str.slice(1)).join(" ").split("-").map((s) => s.charAt(0).toUpperCase() + str.slice(1)).join("-");
  },
  lowerCase(str) {
    return str.toLowerCase();
  },
  slugify(str) {
    return str.trim().replaceAll(/[^A-z0-9]/g, "-").toLowerCase();
  }
};
class Rectangle {
  constructor(x, w, y, h2) {
    __publicField(this, "x");
    __publicField(this, "y");
    __publicField(this, "w");
    __publicField(this, "h");
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h2;
  }
}
class Vector2 {
  constructor(x, y) {
    __publicField(this, "x");
    __publicField(this, "y");
    this.x = x;
    this.y = y;
  }
  add(n) {
    this.x += n;
    this.y += n;
  }
  sub(n) {
    this.x -= n;
    this.y -= n;
  }
  plus(other) {
    this.x += other.x;
    this.y += other.y;
  }
  diff(other) {
    this.x -= other.x;
    this.y -= other.y;
  }
  mul(n) {
    this.x *= n;
    this.y *= n;
  }
  withMul(n) {
    return Vector.xy(this.x * n, this.y * n);
  }
  div(n) {
    if (n === 0) {
      throw new Error("divide by zero");
    }
    this.x /= n;
    this.y /= n;
  }
  withDiv(n) {
    if (n === 0) {
      throw new Error("divide by zero");
    }
    return Vector.xy(this.x / n, this.y / n);
  }
  avg() {
    return Math.sqrt(Math.pow(this.x + this.y, 2)) / 2;
  }
  distance(to) {
    return Math.sqrt(Math.pow(to.x - this.x, 2) + Math.pow(to.y - this.y, 2));
  }
}
class Vector3 {
  constructor(x, y, z) {
    __publicField(this, "x");
    __publicField(this, "y");
    __publicField(this, "z");
    this.x = x;
    this.y = y;
    this.z = z;
  }
  add(n) {
    this.x += n;
    this.y += n;
    this.z += n;
  }
  sub(n) {
    this.x -= n;
    this.y -= n;
    this.z -= n;
  }
  mul(n) {
    this.x *= n;
    this.y *= n;
    this.z *= n;
  }
  div(n) {
    if (n === 0) {
      throw new Error("divide by zero");
    }
    this.x /= n;
    this.y /= n;
    this.z /= n;
  }
  avg() {
    return (this.x + this.y + this.x) / 3;
  }
}
globalThis.Vector = {
  xy(x, y) {
    return new Vector2(x, y ?? x);
  },
  xyz(x, y, z) {
    return new Vector3(x, y ?? x, z ?? y ?? x);
  },
  xwyh(x, w, y, h2) {
    return new Rectangle(x, w, y ?? x, h2 ?? w);
  }
};
(function() {
  for (var t = [], e = 0; e < 256; ++e) t.push("%" + ((e < 16 ? "0" : "") + e.toString(16)).toUpperCase());
  return t;
})();
function _mc(defaultClasses, conditionals) {
  const uniqueClasses = new Set(defaultClasses.split(" ").filter((c) => c !== " "));
  if (typeof conditionals === "object") {
    Object.entries(conditionals).filter(([k, v]) => v).map(([k, v]) => k).forEach((c) => uniqueClasses.add(c));
  } else if (conditionals) {
    conditionals.split(" ").filter((c) => c !== " ").forEach((c) => uniqueClasses.add(c));
  }
  return Array.from(uniqueClasses).join(" ").trim();
}
globalThis.mc = _mc;
const TOTAL_LINES = 80;
function crossHatch({
  ctx,
  canvas,
  strokeColor = "rgba(32, 53, 69, 1)"
}) {
  const lineSpacing = canvas.width * 1.5 / TOTAL_LINES;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = strokeColor;
  for (let n = 0; n < TOTAL_LINES; ++n) {
    ctx.beginPath();
    ctx.moveTo(n * lineSpacing, 0);
    ctx.lineTo(0, n * lineSpacing);
    ctx.stroke();
  }
}
function userAvatar($$payload, firstname, lastname, src, alt) {
  if (src) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<img${attr("src", src)}${attr("alt", alt)} class="w-8">`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="rounded-full text-primary font-bold text-sm content-center text-center bg-secondary w-8 h-8">${escape_html(firstname.slice(0, 1).toUpperCase() + lastname.slice(0, 1).toUpperCase())}</div>`;
  }
  $$payload.out += `<!--]-->`;
}
function User($$payload, $$props) {
  push();
  let {
    firstname,
    lastname,
    avatar,
    avatar_alt,
    class: _class,
    classText
  } = $$props;
  $$payload.out += `<div${attr_class(clsx(mc("flex items-center gap-4", _class)))}>`;
  userAvatar($$payload, firstname, lastname, avatar, avatar_alt);
  $$payload.out += `<!----> <span${attr_class(clsx(classText))}>${escape_html(Str.capitalize(firstname) + " " + lastname.slice(0, 1))}</span></div>`;
  pop();
}
function BlogPostCard($$payload, $$props) {
  push();
  let { post, color, class: _class } = $$props;
  let rootRect = {
    width: 0,
    height: 0
  };
  let canvasRect = Vector.xwyh(0, rootRect.width, 0, rootRect.height);
  $$payload.out += `<div${attr("id", post.slug)}${attr_class(clsx(mc("group relative border border-border rounded-md shadow-lg overflow-hidden min-w-[640px] h-[360px] cursor-pointer", _class)), "svelte-i8cz2j")}>`;
  Link($$payload, {
    href: route("blog.show", post.slug),
    children: ($$payload2) => {
      const each_array = ensure_array_like(post.tags);
      $$payload2.out += `<div class="absolute top-0 left-0 w-full h-full bg-primary svelte-i8cz2j"></div> <div class="absolute top-0 left-0 w-[calc(100%-var(--spacing)*12)] h-[calc(100%-var(--spacing)*12)] group-hover:w-full group-hover:h-full mt-6 ml-6 group-hover:m-0 bg-primary group-hover:border-0 border border-border rounded-md group-hover:animate-(--animate-border) group-hover:shadow-xl transition-all duration-150 [transition-timing-function:ease-out] z-10 svelte-i8cz2j"></div> <div class="absolute top-0 left-0 w-1/3 h-full group-hover:scale-110 border-r border-border transition-all z-10 duration-300 [transition-timing-function:ease-out] [background-image:linear-gradient(90deg,rgba(255,255,255,0),rgba(0,0,0,0.5))] svelte-i8cz2j"${attr_style("", { "background-color": color })}><img src="https://picsum.photos/512" class="w-full h-full object-fill mix-blend-multiply z-9 svelte-i8cz2j"></div> <div class="flex flex-col justify-start w-full p-12 transition-all top svelte-i8cz2j"><div class="flex justify-between items-center mb-8 svelte-i8cz2j"><div class="flex items-center gap-4 cursor-pointer group svelte-i8cz2j">`;
      Fa($$payload2, {
        icon: faLink,
        size: "sm",
        class: "brightness-75 group-hover:brightness-100"
      });
      $$payload2.out += `<!----> <h2 class="font-bold text-2xl text-muted group-hover:text-secondary mix-blend-plus-darker brightness-125 [text-shadow:0px_0px_2px_rgba(0,0,0,1.0)] svelte-i8cz2j">${escape_html(post.title)}</h2></div> <small class="text-sm italic svelte-i8cz2j">Read Time: ${escape_html(secondsToMinutes(post.read_time))} Minutes</small></div> <div class="flex justify-between items-center mb-8 svelte-i8cz2j"><div class="flex flex-col justify-center gap-4 svelte-i8cz2j">`;
      User($$payload2, {
        firstname: Bio.firstname,
        lastname: Bio.surname,
        avatar: "https://avatar.iran.liara.run/public",
        avatar_alt: Bio.name,
        class: "w-full"
      });
      $$payload2.out += `<!----> <div class="flex items-center svelte-i8cz2j"><span class="mr-4 mix-blend-plus-darker brightness-125 [text-shadow:0px_0px_2px_rgba(0,0,0,1.0)] svelte-i8cz2j">Posted:</span>   <time class="text-sm italic mix-blend-plus-darker brightness-125 [text-shadow:0px_0px_2px_rgba(0,0,0,1.0)] svelte-i8cz2j">${escape_html(format(post.posted_at, "yyyy-MM-dd"))}</time></div></div> <div class="flex justify-end items-center gap-2 self-start svelte-i8cz2j"><!--[-->`;
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let tag = each_array[$$index];
        Tag($$payload2, { tag });
      }
      $$payload2.out += `<!--]--></div></div> <p class="mix-blend-plus-darker [text-shadow:0px_0px_2px_rgba(0,0,0,1.0)] svelte-i8cz2j">${escape_html(post.blurb)}</p></div>`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----> `;
  Canvas($$payload, {
    class: "absolute top-0 left w-full h-full",
    rect: canvasRect,
    program: crossHatch
  });
  $$payload.out += `<!----></div>`;
  pop();
}
let PROGRESS = 0;
let CURSOR_PROGRESS = 0;
let CURSOR_VELOCITY = 0;
let CURSOR_LAST = Vector.xy(0, 0);
let BULGE_RESET_DELAY = 0;
function lattice({
  ctx,
  canvas,
  singleFrameDuration,
  fps,
  deltaTime,
  clientWindow,
  clientCursor
}) {
  const gridSize = 25;
  const extraSize = 20;
  const totalColumns = Math.floor(canvas.width / gridSize) + extraSize;
  const totalRows = Math.floor(canvas.height / gridSize) + extraSize;
  const grid = Vector.xy(totalColumns, totalRows);
  const sequenceDuration = 1e4 / fps;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cursor = Vector.xy(clientCursor.position.x / clientWindow.width * canvas.width - gridSize / 2, clientCursor.position.y / clientWindow.height * canvas.height - gridSize / 2);
  const cursorMoved = CURSOR_LAST.distance(cursor) >= Math.EPSILON;
  if (cursorMoved) {
    BULGE_RESET_DELAY = 0;
    CURSOR_PROGRESS = 0;
  }
  if (BULGE_RESET_DELAY > singleFrameDuration) {
    CURSOR_VELOCITY *= Anim.easeInOutQuint(1 - CURSOR_PROGRESS);
    CURSOR_PROGRESS += 1 / (4 * fps);
    if (CURSOR_VELOCITY < Math.EPSILON) {
      CURSOR_VELOCITY = 0;
      CURSOR_PROGRESS = 0;
    }
  }
  for (let y = 0 - Math.floor(extraSize / 2); y < grid.y; ++y) {
    for (let x = 0 - Math.floor(extraSize / 2); x < grid.x; ++x) {
      const sizeFactor = Math.min(0.95, y / totalRows + 0.05);
      const halfSize = gridSize * sizeFactor / 2;
      const ox = x * gridSize;
      const oy = y * gridSize;
      const theta = Math.atan2(oy - cursor.y, ox - cursor.x);
      const tx = Math.cos(theta) * gridSize * 3 * CURSOR_VELOCITY;
      const ty = Math.sin(theta) * gridSize * 3 * CURSOR_VELOCITY;
      const srx = Math.cos(PROGRESS) * gridSize / 4;
      const sry = Math.sin(PROGRESS) * gridSize / 4;
      const oox = (x + 1) * gridSize;
      const ooy = (y + 0) * gridSize;
      const thetaNext = Math.atan2(ooy - cursor.y, oox - cursor.x);
      const ttx = Math.cos(thetaNext) * gridSize * 3 * CURSOR_VELOCITY;
      const tty = Math.sin(thetaNext) * gridSize * 3 * CURSOR_VELOCITY;
      const ooox = (x + 0) * gridSize;
      const oooy = (y + 1) * gridSize;
      const thetaNextNext = Math.atan2(oooy - cursor.y, ooox - cursor.x);
      const tttx = Math.cos(thetaNextNext) * gridSize * 3 * CURSOR_VELOCITY;
      const ttty = Math.sin(thetaNextNext) * gridSize * 3 * CURSOR_VELOCITY;
      let alphaVelocity = Math.max(0, 1 - CURSOR_VELOCITY);
      const fillOpacity = Math.max(alphaVelocity, cursor.withDiv(256).distance(Vector.xy(ox / 256, oy / 256)));
      const strokeOpacity = fillOpacity;
      ctx.fillStyle = `rgba(32, 53, 69, ${fillOpacity})`;
      ctx.strokeStyle = `rgba(21, 48, 64, ${strokeOpacity})`;
      ctx.beginPath();
      ctx.moveTo(ox + tx + srx + halfSize, oy + ty + sry + halfSize);
      ctx.lineTo(oox + ttx + srx + halfSize, ooy + tty + sry + halfSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ox + tx + srx + halfSize, oy + ty + sry + halfSize);
      ctx.lineTo(ooox + tttx + srx + halfSize, oooy + ttty + sry + halfSize);
      ctx.stroke();
      ctx.fillRect(ox + tx + srx, oy + ty + sry, gridSize * sizeFactor, gridSize * sizeFactor);
    }
  }
  CURSOR_VELOCITY = Math.min(1, CURSOR_VELOCITY + CURSOR_LAST.distance(cursor) * 0.01);
  CURSOR_LAST = cursor;
  PROGRESS += 2 * Math.PI / sequenceDuration;
  BULGE_RESET_DELAY += deltaTime;
  if (PROGRESS >= 2 * Math.PI) {
    PROGRESS -= 2 * Math.PI;
  }
}
function Blog($$payload, $$props) {
  push();
  var $$store_subs;
  let { posts } = $$props;
  const COLORS = ["#446484", "#346484", "#348484"];
  const clientWindow = useClientWindow();
  let canvasRect = Vector.xwyh(0, store_get($$store_subs ?? ($$store_subs = {}), "$clientWindow", clientWindow).width * store_get($$store_subs ?? ($$store_subs = {}), "$clientWindow", clientWindow).scale, 0, store_get($$store_subs ?? ($$store_subs = {}), "$clientWindow", clientWindow).height * store_get($$store_subs ?? ($$store_subs = {}), "$clientWindow", clientWindow).scale);
  const index = Object.groupBy(posts, (post) => formatDate(post.posted_at, "MMMM, y"));
  Object.fromEntries(posts.map((post) => [post.slug, null]));
  NavigationLayout($$payload, {
    class: "relative",
    children: ($$payload2) => {
      Canvas($$payload2, {
        class: "fixed top-0 w-full h-full z-[-1]",
        rect: canvasRect,
        program: lattice
      });
      $$payload2.out += `<!----> <div${attr_class(clsx(mc("w-screen min-h-[calc(100dvh-var(--navigation-height))] z-(--z-page)", {
        "grid grid-cols-8": posts.length > 0,
        "flex justify-center items-center": posts.length === 0
      })))}>`;
      if (posts.length === 0) {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `<div class="flex justify-start flex-col items-center gap-4"><h1 class="font-bold text-3xl">No Posts Yet</h1> <p>Please visit again soon</p></div>`;
      } else {
        $$payload2.out += "<!--[!-->";
        const each_array = ensure_array_like(Object.entries(index));
        const each_array_2 = ensure_array_like(posts);
        $$payload2.out += `<div class="sticky col-span-2 top-(--navigation-height) left-0 overflow-y-auto h-full max-h-[calc(100dvh-var(--spacing)*6)] border-r border-border bg-primary mr-16"><ul class="p-6"><!--[-->`;
        for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
          let [postedAt, postItems] = each_array[$$index_1];
          const each_array_1 = ensure_array_like(postItems ?? []);
          $$payload2.out += `<li class="text-sm not-last:not-only:mb-8"><section><h2 class="text-lg font-bold mb-4 brightness-75">${escape_html(postedAt)}</h2> <ul><!--[-->`;
          for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
            let post = each_array_1[$$index];
            $$payload2.out += `<li class="group py-2 indent-4 border-l border-border hover:border-l hover:border-secondary cursor-pointer"><button class="group-hover:brightness-125 cursor-pointer">${escape_html(post.title)}</button></li>`;
          }
          $$payload2.out += `<!--]--></ul></section></li>`;
        }
        $$payload2.out += `<!--]--></ul></div> <div class="col-span-6 mr-16 flex justify-center items-center flex-col"><h1 class="w-full my-8 font-bold text-5xl">Blog</h1> <section class="w-full min-h-[calc(100dvh-var(--footer-height)*2-var(--navigation-height)*2)]"><!--[-->`;
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let post = each_array_2[$$index_2];
          $$payload2.out += `<div${attr("id", post.slug)}>`;
          BlogPostCard($$payload2, {
            class: "mb-10 min-h-[240px]",
            post,
            color: Arr.randomItem(COLORS)
          });
          $$payload2.out += `<!----></div>`;
        }
        $$payload2.out += `<!--]--></section></div>`;
      }
      $$payload2.out += `<!--]--></div>`;
    },
    $$slots: { default: true }
  });
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Blog
}, Symbol.toStringTag, { value: "Module" }));
function SocialLinks($$payload, $$props) {
  push();
  let currentlySelected = null;
  let currentlyFocused = null;
  let lastSelected = "";
  let isLoading = false;
  let isRecentlyCopied = false;
  let arrowX = (() => {
    var _a;
    let value = 0;
    new DOMRect();
    ((_a = document.querySelector(".social-link[data-enabled]")) == null ? void 0 : _a.getBoundingClientRect()) ?? new DOMRect();
    new DOMRect();
    new DOMRect();
    return value;
  })();
  const each_array = ensure_array_like(Object.entries(Bio.contact));
  $$payload.out += `<div class="flex justify-between items-center gap-4"><!--[-->`;
  for (let i = 0, $$length = each_array.length; i < $$length; i++) {
    let [contactKey, contactValue] = each_array[i];
    $$payload.out += `<a${attr("id", `social-link-${i}`)}${attr("href", contactValue.src)} target="_blank" rel="noopener noreferrer" class="social-link bg-primary cursor-pointer"${attr("data-enabled", currentlySelected === contactValue.displayName || currentlyFocused === contactValue.displayName ? "" : null)}>`;
    Fa($$payload, {
      icon: contactValue.icon,
      size: "4x",
      class: mc("border border-border shadow rounded-md p-2 icon fill-red-200 hover:bg-accent-primary", {
        "bg-accent-primary": currentlySelected === contactValue.displayName
      }),
      color: [currentlySelected, currentlyFocused].includes(contactKey) ? "#eeffff" : "#ccddee",
      style: "width: 64px; height: 64px;"
    });
    $$payload.out += `<!----></a>`;
  }
  $$payload.out += `<!--]--></div> <div${attr_class(clsx(mc("mt-6 relative shadow", {
    "animate-in-up": currentlyFocused !== null,
    "animate-out-down": currentlyFocused === null,
    "opacity-0": currentlyFocused === null,
    "pointer-events-none": currentlyFocused === null
  })))}><svg width="64" height="24" viewBox="-4 0 64 24" xmlns="http://www.w3.org/2000/svg"${attr_class(clsx(mc("absolute w-4 h-4 -translate-y-[calc(var(--spacing)*4-1px)]", { "opacity-0": arrowX === 0 })))}${attr_style("", { left: `${arrowX}px` })}><path d="M21.5359 2C23.0755 -0.666669 26.9245 -0.666667 28.4641 2L49.2487 38C50.7883 40.6667 48.8638 44 45.7846 44H4.21539C1.13619 44 -0.788312 40.6667 0.751289 38L21.5359 2Z" fill="#102530" stroke="#203545" stroke-width="4px"></path></svg> <div class="relative w-[400px] h-16 text-md font-light border border-border rounded-md bg-primary flex justify-center items-center gap-4"><div class="absolute top-0 rounded-t left-0 w-full h-(--radius-md) bg-none"><div${attr_class(clsx(mc("bg-accent-primary h-1/2 [animation-duration:5000ms]", {
    "animate-progress": isLoading,
    "w-0": true
  })))}></div></div> <button class="absolute left-0 border-r border-border w-16 h-full flex justify-center items-center hover:bg-accent-primary cursor-pointer">`;
  Fa($$payload, {
    icon: faPaste,
    size: "sm",
    class: mc("[animation-duration:200ms]", {
      "animate-scale-out-in": isRecentlyCopied,
      "animate-scale-out-in-again": true
    })
  });
  $$payload.out += `<!----></button> <div class="block w-[calc(100%-var(--spacing)*16)] translate-x-[calc(var(--spacing)*8)]">${escape_html(lastSelected)}</div></div></div>`;
  pop();
}
function Homepage($$payload, $$props) {
  push();
  var $$store_subs;
  const clientWindow = useClientWindow();
  let canvasRect = Vector.xwyh(0, store_get($$store_subs ?? ($$store_subs = {}), "$clientWindow", clientWindow).width * store_get($$store_subs ?? ($$store_subs = {}), "$clientWindow", clientWindow).scale, 0, store_get($$store_subs ?? ($$store_subs = {}), "$clientWindow", clientWindow).height * store_get($$store_subs ?? ($$store_subs = {}), "$clientWindow", clientWindow).scale);
  NavigationLayout($$payload, {
    class: "relative overflow-hidden h-screen",
    enableFooter: false,
    children: ($$payload2) => {
      Canvas($$payload2, {
        class: "absolute w-full h-full",
        rect: canvasRect,
        program: lattice
      });
      $$payload2.out += `<!----> <div class="flex flex-row w-full items-center left-0 min-h-[768px]"><div class="relative flex flex-col justify-center items-center w-full px-16 border-border text-center"><div class="flex flex-col mb-8 max-w-page"><h1 class="w-full font-bold text-7xl">${escape_html(Bio.name)}</h1> <h1 class="w-full font-medium text-4xl">${escape_html(Bio.occupation)}</h1></div> <p class="font-normal max-w-page mb-16">${escape_html(Bio.about)}</p> `;
      SocialLinks($$payload2);
      $$payload2.out += `<!----></div></div>`;
    },
    $$slots: { default: true }
  });
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Homepage
}, Symbol.toStringTag, { value: "Module" }));
function CopyButton($$payload, $$props) {
  let { class: _class } = $$props;
  let isRecentlyCopied = false;
  $$payload.out += `<button${attr_class(clsx(mc("flex justify-center items-center hover:bg-accent-primary group-hover:bg-accent-primary cursor-pointer", _class)))}>`;
  Fa($$payload, {
    icon: faPaste,
    size: "sm",
    color: "",
    class: mc("[animation-duration:200ms]", {
      "animate-scale-out-in": isRecentlyCopied,
      "animate-scale-out-in-again": true
    })
  });
  $$payload.out += `<!----></button>`;
}
function Image($$payload, $$props) {
  let {
    src,
    alt,
    width,
    height,
    caption,
    class: _class
  } = $$props;
  $$payload.out += `<figure${attr_class(clsx(mc("relative group cursor-pointer", _class)))}>`;
  if (caption) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<figcaption class="opacity-0 group-hover:opacity-100 absolute bottom-4 right-4 text-sm font-light text-black/75 font-mono border border-white/10 bg-white/30 backdrop-blur-md shadow px-2 rounded cursor-pointer transition-opacity duration-150">${escape_html(caption)}</figcaption>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <img${attr("src", src)}${attr("width", width)}${attr("height", height)} class="object-cover"${attr("alt", alt)}></figure>`;
}
function conditionalContent($$payload, content) {
  if (content) {
    $$payload.out += "<!--[-->";
    $$payload.out += `${escape_html(content)}`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
}
function SingleBlogPost($$payload, $$props) {
  push();
  var $$store_subs;
  let { post } = $$props;
  const clientWindow = useClientWindow();
  let canvasRect = Vector.xwyh(0, store_get($$store_subs ?? ($$store_subs = {}), "$clientWindow", clientWindow).width * store_get($$store_subs ?? ($$store_subs = {}), "$clientWindow", clientWindow).scale, 0, store_get($$store_subs ?? ($$store_subs = {}), "$clientWindow", clientWindow).height * store_get($$store_subs ?? ($$store_subs = {}), "$clientWindow", clientWindow).scale);
  hljs.registerLanguage("typescript", typescript);
  const calloutColors = { "info": "#72c282" };
  const defaultAttributes = {
    section: { class: "font-bold [&>*:first-child]:mb-16" },
    heading: {
      class: "font-bold not-last:mb-8 tracking-widest uppercase text-accent-secondary"
    },
    h1: { class: "text-4xl" },
    h2: { class: "text-2xl" },
    h3: { class: "text-2xl" },
    image: {
      class: "rounded-xl shadow-[10px_10px_30px_rgba(0,0,0,0.2)] overflow-hidden [&:not(:first-child):not(:last-child)]:my-16 first:mb-16 last:mt-16"
    },
    paragraph: {
      class: "not-last:mb-8 leading-8 font-light text-muted text-[1.15rem]"
    },
    callout: {
      class: "relative bg-primary-1 border border-border rounded-md shadow-lg p-8 pl-12 [&>*:first-child]:mb-4 [&:not(:first-child):not(:last-child)]:my-16 first:mb-16 last:mt-16 overflow-hidden"
    },
    divider: {
      class: "text-border [&:not(:first-child):not(:last-child)]:my-16 first:mb-16 last:mt-16"
    },
    code: {}
  };
  const mockStructuredBody = [
    {
      kind: "section",
      content: "Section 1",
      children: [
        { kind: "heading", content: "Foo Bar Baz" },
        {
          kind: "paragraph",
          content: "Accumsan delenit amet enim imperdiet eu. Lobortis elit accumsan elitr hendrerit nobis. Ut nam sanctus kasd blandit. Sea veniam consectetuer accusam augue. Nisl consetetur takimata esse dolores. Illum aliquyam ex exerci placerat. In sed takimata sit nulla. Feugait minim nulla facilisi qui. Hendrerit congue eos nonummy exerci feugiat. Odio voluptua."
        },
        { kind: "heading", content: "Foo Bar Baz" },
        {
          kind: "code",
          content: 'const foo = "bar";\nconsole.log(foo); // bar',
          language: "typescript"
        }
      ]
    },
    { kind: "divider" },
    {
      kind: "section",
      content: "Section 2",
      children: [
        { kind: "heading", content: "Accumsan Delenit" },
        {
          kind: "paragraph",
          content: "Accumsan delenit amet enim imperdiet eu. Lobortis elit accumsan elitr hendrerit nobis. Ut nam sanctus kasd blandit. Sea veniam consectetuer accusam augue. Nisl consetetur takimata esse dolores. Illum aliquyam ex exerci placerat. In sed takimata sit nulla. Feugait minim nulla facilisi qui. Hendrerit congue eos nonummy exerci feugiat. Odio voluptua."
        },
        {
          kind: "image",
          source: "https://images.unsplash.com/photo-1523633589114-88eaf4b4f1a8?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          height: 500,
          caption: "Water"
        },
        {
          kind: "callout",
          content: "Callout 1",
          icon: "info",
          children: [
            {
              kind: "paragraph",
              content: "Nobis eleifend adipiscing tation soluta duis. Laoreet odio id dolor tincidunt rebum tincidunt consequat. Te gubergren eleifend clita option. Hendrerit."
            }
          ]
        }
      ]
    },
    { kind: "divider" }
  ];
  function mergeAttributes(...attributeObjects) {
    const merged = {};
    for (const o of attributeObjects) {
      for (const k in o) {
        switch (k) {
          case "class":
            {
              if (!("class" in merged)) {
                merged["class"] = "";
              }
              merged["class"] = [
                ...merged["class"].split(" "),
                ...o["class"].split(" ")
              ].map((s) => s.trim()).join(" ");
            }
            break;
        }
      }
    }
    return merged;
  }
  function calloutIcon(iconKind) {
    switch (iconKind) {
      case "question":
        return faQuestionCircle;
      case "warning":
        return faWarning;
      case "hint":
        return faMagnifyingGlass;
      case "error":
        return faWarning;
      case "info":
      default:
        return faExclamationCircle;
    }
  }
  function calloutTitle(iconKind) {
    switch (iconKind) {
      case "question":
        return "Question";
      case "warning":
        return "Warning";
      case "hint":
        return "Hint";
      case "error":
        return "Error";
      case "info":
      default:
        return "Info";
    }
  }
  let topOfPage = false;
  let scrollToTopButtonVisible = false;
  function dynamicHeading($$payload2, content, level, children = {}, attributes = {}) {
    if (level + 1 < 6) {
      $$payload2.out += "<!--[-->";
      const tag = `h${level + 1}`;
      element(
        $$payload2,
        tag,
        () => {
          $$payload2.out += `${spread_attributes(
            {
              id: `${Str.slugify(content)}`,
              ...mergeAttributes(defaultAttributes["heading"], defaultAttributes[tag], attributes, {
                class: "group relative cursor-pointer flex items-center"
              })
            }
          )}`;
        },
        () => {
          if (attributes.anchor) {
            $$payload2.out += "<!--[-->";
            Fa($$payload2, {
              icon: faLink,
              size: "xs",
              class: "absolute w-6 opacity-0 group-hover:opacity-100 transition-all -translate-x-[150%] self-center group-hover:cursor-pointer"
            });
          } else {
            $$payload2.out += "<!--[!-->";
          }
          $$payload2.out += `<!--]--> `;
          conditionalContent($$payload2, content);
          $$payload2.out += `<!----> `;
          structuredBlock($$payload2, children, level + 1);
          $$payload2.out += `<!---->`;
        }
      );
    } else {
      $$payload2.out += "<!--[!-->";
      const tag = `h${level + 1}`;
      $$payload2.out += `<h6${spread_attributes(
        {
          ...mergeAttributes(defaultAttributes["heading"], defaultAttributes[tag], attributes)
        }
      )}>`;
      conditionalContent($$payload2, content);
      $$payload2.out += `<!----> `;
      structuredBlock($$payload2, children, level + 1);
      $$payload2.out += `<!----></h6>`;
    }
    $$payload2.out += `<!--]-->`;
  }
  function iconTitle($$payload2, title, calloutKind, depth, attributes = {}) {
    const icon = calloutIcon(calloutKind ?? "info");
    const titleString = title ?? calloutTitle(calloutKind ?? "info");
    $$payload2.out += `<div${spread_attributes(
      {
        ...mergeAttributes(
          {
            class: "flex justify-start items-center gap-4 mb-4"
          },
          attributes
        )
      }
    )}>`;
    Fa($$payload2, { icon, size: "sm" });
    $$payload2.out += `<!----> `;
    dynamicHeading($$payload2, titleString, depth, {});
    $$payload2.out += `<!----></div>`;
  }
  function structuredBlock($$payload2, data, depth = 0) {
    const each_array = ensure_array_like(data);
    $$payload2.out += `<!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let node = each_array[$$index];
      if (node.kind === "section") {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `<section${spread_attributes({ ...defaultAttributes["section"] })}>`;
        dynamicHeading($$payload2, node.content, 0, {}, { class: "cursor-pointer", anchor: node.content });
        $$payload2.out += `<!----> `;
        structuredBlock($$payload2, node.children, depth + 1);
        $$payload2.out += `<!----></section>`;
      } else if (node.kind === "heading") {
        $$payload2.out += "<!--[1-->";
        dynamicHeading($$payload2, node.content, depth, node.children, { anchor: node.content });
      } else if (node.kind === "paragraph") {
        $$payload2.out += "<!--[2-->";
        $$payload2.out += `<p${spread_attributes({ ...defaultAttributes["paragraph"] })}>`;
        conditionalContent($$payload2, node.content);
        $$payload2.out += `<!----> `;
        structuredBlock($$payload2, node.children, depth + 1);
        $$payload2.out += `<!----></p>`;
      } else if (node.kind === "callout") {
        $$payload2.out += "<!--[3-->";
        $$payload2.out += `<div${spread_attributes({ ...defaultAttributes["callout"] })}><div class="absolute top-0 left-0 w-[16px] h-full"${attr_style("", { "background-color": calloutColors[node.icon] })}></div> `;
        iconTitle($$payload2, node.content, node.icon, depth);
        $$payload2.out += `<!----> `;
        structuredBlock($$payload2, node.children, depth + 1);
        $$payload2.out += `<!----></div>`;
      } else if (node.kind === "image") {
        $$payload2.out += "<!--[4-->";
        $$payload2.out += `<div${spread_attributes({ ...defaultAttributes["image"] })}>`;
        Image($$payload2, {
          src: node.source,
          alt: node.caption,
          caption: node.caption,
          width: node.width,
          height: node.height
        });
        $$payload2.out += `<!----></div>`;
      } else if (node.kind === "code") {
        $$payload2.out += "<!--[5-->";
        $$payload2.out += `<div${spread_attributes(
          {
            class: "border border-border rounded-md shadow-lg text-sm font-mono",
            ...defaultAttributes["code"]
          }
        )}><div class="flex justify-end items-center h-8 w-full border-b border-border"><div class="group flex justify-between items-center border-l border-border h-full"><span class="text-xs text-muted h-full pl-3 content-center group-hover:bg-accent-primary group-hover:cursor-pointer">${escape_html(Str.lowerCase(node.language))}</span> `;
        CopyButton($$payload2, {
          content: node.content,
          class: "w-8 h-full rounded-tr"
        });
        $$payload2.out += `<!----></div></div> <pre class="p-6 whitespace-pre-line bg-primary-1">                    <code>${html(hljs.highlight(node.content, { language: node.language }).value)}</code>
                </pre></div>`;
      } else if (node.kind === "divider") {
        $$payload2.out += "<!--[6-->";
        $$payload2.out += `<hr${spread_attributes({ ...defaultAttributes["divider"] })}>`;
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]-->`;
    }
    $$payload2.out += `<!--]-->`;
  }
  head($$payload, ($$payload2) => {
    $$payload2.out += `${html(nova)}`;
  });
  NavigationLayout($$payload, {
    class: "relative",
    children: ($$payload2) => {
      Canvas($$payload2, {
        class: "fixed top-0 w-full h-full z-[-1]",
        rect: canvasRect,
        program: lattice
      });
      $$payload2.out += `<!----> <div${attr_class(clsx(mc("fixed left-0 top-[calc(var(--navigation-height)+32px)] z-(--z-page) ml-48 opacity-0 transition-all", {
        "opacity-100 -translate-x-1/2": scrollToTopButtonVisible
      })))}><div class="w-12 h-12 rounded-md bg-primary border border-border flex items-center cursor-pointer shadow-lg mb-4 hover:brightness-125"><button></button> `;
      Fa($$payload2, {
        icon: faArrowUp,
        size: "sm",
        class: "w-full h-full"
      });
      $$payload2.out += `<!----></div> <div class="w-12 h-[200px] bg-primary border border-border rounded-md shadow-lg"></div></div> <main class="relative w-screen px-48 flex justify-center flex-col"><div class="relative bg-primary border-r border-l border-border"><div class="group relative w-full h-[300px] mb-16 shadow-lg border-b border-border overflow-hidden"><img src="https://picsum.photos/1000/300" alt="random image"${attr("height", 300)}${attr_class(clsx(mc("absolute top-0 left-0 object-fill object-center w-full h-[300px] mix-blend-multiply pb-px z-9 transition-transform duration-2000", { "scale-110": topOfPage })))}> <div class="absolute top-0 left-0 w-full h-full [background-image:linear-gradient(180deg,rgba(255,255,255,0),rgba(0,0,0,0.5))]"${attr_style("", { "background-color": "#72a2b2" })}></div> <div class="pt-16 mx-28 relative flex flex-col justify-start gap-4 h-full"><h1 class="text-5xl z-(--z-page) relative font-bold mix-blend-plus-lighter text-shadow-lg">${escape_html(post.title)}</h1> `;
      User($$payload2, {
        firstname: Bio.firstname,
        lastname: Bio.surname,
        avatar: "https://avatar.iran.liara.run/public",
        avatar_alt: Bio.name,
        class: "relative w-full z-(--z-page)",
        classText: "mix-blend-plus-lighter text-shadow-lg"
      });
      $$payload2.out += `<!----> <div class="mt-8 justify-self-end flex flex-col items-start"><span class="text-sm mix-blend-plus-lighter z-(--z-page) text-shadow-lg">Posted: ${escape_html(format(post.posted_at, "yyyy-MM-dd"))}</span> <span class="z-(--z-page) text-sm mix-blend-plus-lighter text-shadow-lg">Read Time: ${escape_html(secondsToMinutes(post.read_time))} Minutes</span></div></div></div> <div class="px-28">`;
      structuredBlock($$payload2, mockStructuredBody);
      $$payload2.out += `<!----></div></div></main>`;
    },
    $$slots: { default: true }
  });
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SingleBlogPost
}, Symbol.toStringTag, { value: "Module" }));
async function resolvePageComponent(path, pages) {
  for (const p of Array.isArray(path) ? path : [path]) {
    const page = pages[p];
    if (typeof page === "undefined") {
      continue;
    }
    return typeof page === "function" ? page() : page;
  }
  throw new Error(`Page not found: ${path}`);
}
createServer(
  (page) => createInertiaApp({
    page,
    resolve: (name) => {
      return resolvePageComponent(`./Pages/${name}`, /* @__PURE__ */ Object.assign({ "./Pages/Blog.svelte": __vite_glob_0_0, "./Pages/Homepage.svelte": __vite_glob_0_1, "./Pages/SingleBlogPost.svelte": __vite_glob_0_2 }));
    },
    setup({ App: App2, props }) {
      return render(App2, { props });
    }
  })
);
