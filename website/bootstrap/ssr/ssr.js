var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _out, _on_destroy, _is_component_body, _parent, _Renderer_instances, collect_on_destroy_fn, traverse_components_fn, collect_ondestroy_fn, _Renderer_static, render_fn, render_async_fn, collect_content_fn, collect_content_async_fn, collect_hydratables_fn, open_render_fn, close_render_fn, hydratable_block_fn, _title, _document, _subscribe, _name, _key, _findToastIdx, _activeToasts;
import { clsx as clsx$1 } from "clsx";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faXmark, faPhone, faAddressCard, faFilePdf, faGlobe, faLink, faArrowUpRightFromSquare, faCircleInfo, faCircleExclamation, faLightbulb, faWarning, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";
import { router, getInitialPageFromDOM, setupProgress, config as config$1 } from "@inertiajs/core";
import "laravel-precognition";
import { z } from "zod";
import { FieldApi, FormApi } from "@tanstack/form-core";
import { formatDate } from "date-fns";
import createServer from "@inertiajs/core/server";
import { escape as escape$1 } from "lodash-es";
const HYDRATION_START = "[";
const HYDRATION_END = "]";
const ELEMENT_IS_NAMESPACED = 1;
const ELEMENT_PRESERVE_ATTRIBUTE_CASE = 1 << 1;
const ELEMENT_IS_INPUT = 1 << 2;
const UNINITIALIZED = Symbol();
const ATTR_REGEX = /[&"<]/g;
const CONTENT_REGEX = /[&<]/g;
function escape_html(value, is_attr) {
  const str = String(value ?? "");
  const pattern = is_attr ? ATTR_REGEX : CONTENT_REGEX;
  pattern.lastIndex = 0;
  let escaped = "";
  let last = 0;
  while (pattern.test(str)) {
    const i2 = pattern.lastIndex - 1;
    const ch = str[i2];
    escaped += str.substring(last, i2) + (ch === "&" ? "&amp;" : ch === '"' ? "&quot;" : "&lt;");
    last = i2 + 1;
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
  if (name === "hidden" && value !== "until-found") {
    is_boolean = true;
  }
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
        var a2 = 0;
        while ((a2 = classname.indexOf(key, a2)) >= 0) {
          var b2 = a2 + len;
          if ((a2 === 0 || whitespace.includes(classname[a2 - 1])) && (b2 === classname.length || whitespace.includes(classname[b2]))) {
            classname = (a2 === 0 ? "" : classname.substring(0, a2)) + classname.substring(b2 + 1);
          } else {
            a2 = b2;
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
      for (var i2 = 0; i2 < len; i2++) {
        var c2 = value[i2];
        if (in_comment) {
          if (c2 === "/" && value[i2 - 1] === "*") {
            in_comment = false;
          }
        } else if (in_str) {
          if (in_str === c2) {
            in_str = false;
          }
        } else if (c2 === "/" && value[i2 + 1] === "*") {
          in_comment = true;
        } else if (c2 === '"' || c2 === "'") {
          in_str = c2;
        } else if (c2 === "(") {
          in_apo++;
        } else if (c2 === ")") {
          in_apo--;
        }
        if (!in_comment && in_str === false && in_apo === 0) {
          if (c2 === ":" && name_index === -1) {
            name_index = i2;
          } else if (c2 === ";" || i2 === len - 1) {
            if (name_index !== -1) {
              var name = to_css_name(value.substring(start_index, name_index).trim());
              if (!reserved_names.includes(name)) {
                if (c2 !== ";") {
                  i2++;
                }
                var property = value.substring(start_index, i2).trim();
                new_style += " " + property + ";";
              }
            }
            start_index = i2 + 1;
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
function run(fn) {
  return fn();
}
function fallback(value, fallback2, lazy = false) {
  return value === void 0 ? lazy ? (
    /** @type {() => V} */
    fallback2()
  ) : (
    /** @type {V} */
    fallback2
  ) : value;
}
const STALE_REACTION = new class StaleReactionError extends Error {
  constructor() {
    super(...arguments);
    __publicField(this, "name", "StaleReactionError");
    __publicField(this, "message", "The reaction that called `getAbortSignal()` was re-run or destroyed");
  }
}();
function lifecycle_outside_component(name) {
  {
    throw new Error(`https://svelte.dev/e/lifecycle_outside_component`);
  }
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
const BLOCK_OPEN = `<!--${HYDRATION_START}-->`;
const BLOCK_CLOSE = `<!--${HYDRATION_END}-->`;
const EMPTY_COMMENT = `<!---->`;
let controller = null;
function abort() {
  controller == null ? void 0 : controller.abort(STALE_REACTION);
  controller = null;
}
function await_invalid() {
  const error = new Error(`await_invalid
Encountered asynchronous work while rendering synchronously.
https://svelte.dev/e/await_invalid`);
  error.name = "Svelte error";
  throw error;
}
function invalid_csp() {
  const error = new Error(`invalid_csp
\`csp.nonce\` was set while \`csp.hash\` was \`true\`. These options cannot be used simultaneously.
https://svelte.dev/e/invalid_csp`);
  error.name = "Svelte error";
  throw error;
}
function server_context_required() {
  const error = new Error(`server_context_required
Could not resolve \`render\` context.
https://svelte.dev/e/server_context_required`);
  error.name = "Svelte error";
  throw error;
}
var ssr_context = null;
function set_ssr_context(v2) {
  ssr_context = v2;
}
function getContext(key) {
  const context_map = get_or_init_context_map();
  const result = (
    /** @type {T} */
    context_map.get(key)
  );
  return result;
}
function setContext(key, context) {
  get_or_init_context_map().set(key, context);
  return context;
}
function hasContext(key) {
  return get_or_init_context_map().has(key);
}
function get_or_init_context_map(name) {
  if (ssr_context === null) {
    lifecycle_outside_component();
  }
  return ssr_context.c ?? (ssr_context.c = new Map(get_parent_context(ssr_context) || void 0));
}
function push(fn) {
  ssr_context = { p: ssr_context, c: null, r: null };
}
function pop() {
  ssr_context = /** @type {SSRContext} */
  ssr_context.p;
}
function get_parent_context(ssr_context2) {
  let parent = ssr_context2.p;
  while (parent !== null) {
    const context_map = parent.c;
    if (context_map !== null) {
      return context_map;
    }
    parent = parent.p;
  }
  return null;
}
function unresolved_hydratable(key, stack) {
  {
    console.warn(`https://svelte.dev/e/unresolved_hydratable`);
  }
}
function get_render_context() {
  const store = als == null ? void 0 : als.getStore();
  {
    server_context_required();
  }
  return store;
}
let als = null;
let text_encoder;
let crypto;
async function sha256(data) {
  var _a, _b;
  text_encoder ?? (text_encoder = new TextEncoder());
  crypto ?? (crypto = ((_b = (_a = globalThis.crypto) == null ? void 0 : _a.subtle) == null ? void 0 : _b.digest) ? globalThis.crypto : (
    // @ts-ignore - we don't install node types in the prod build
    (await import("node:crypto")).webcrypto
  ));
  const hash_buffer = await crypto.subtle.digest("SHA-256", text_encoder.encode(data));
  return base64_encode(hash_buffer);
}
function base64_encode(bytes) {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(bytes).toString("base64");
  }
  let binary = "";
  for (let i2 = 0; i2 < bytes.length; i2++) {
    binary += String.fromCharCode(bytes[i2]);
  }
  return btoa(binary);
}
const _Renderer = class _Renderer {
  /**
   * @param {SSRState} global
   * @param {Renderer | undefined} [parent]
   */
  constructor(global, parent) {
    __privateAdd(this, _Renderer_instances);
    /**
     * The contents of the renderer.
     * @type {RendererItem[]}
     */
    __privateAdd(this, _out, []);
    /**
     * Any `onDestroy` callbacks registered during execution of this renderer.
     * @type {(() => void)[] | undefined}
     */
    __privateAdd(this, _on_destroy);
    /**
     * Whether this renderer is a component body.
     * @type {boolean}
     */
    __privateAdd(this, _is_component_body, false);
    /**
     * The type of string content that this renderer is accumulating.
     * @type {RendererType}
     */
    __publicField(this, "type");
    /** @type {Renderer | undefined} */
    __privateAdd(this, _parent);
    /**
     * Asynchronous work associated with this renderer
     * @type {Promise<void> | undefined}
     */
    __publicField(this, "promise");
    /**
     * State which is associated with the content tree as a whole.
     * It will be re-exposed, uncopied, on all children.
     * @type {SSRState}
     * @readonly
     */
    __publicField(this, "global");
    /**
     * State that is local to the branch it is declared in.
     * It will be shallow-copied to all children.
     *
     * @type {{ select_value: string | undefined }}
     */
    __publicField(this, "local");
    __privateSet(this, _parent, parent);
    this.global = global;
    this.local = parent ? { ...parent.local } : { select_value: void 0 };
    this.type = parent ? parent.type : "body";
  }
  /**
   * @param {(renderer: Renderer) => void} fn
   */
  head(fn) {
    const head2 = new _Renderer(this.global, this);
    head2.type = "head";
    __privateGet(this, _out).push(head2);
    head2.child(fn);
  }
  /**
   * @param {Array<Promise<void>>} blockers
   * @param {(renderer: Renderer) => void} fn
   */
  async_block(blockers, fn) {
    __privateGet(this, _out).push(BLOCK_OPEN);
    this.async(blockers, fn);
    __privateGet(this, _out).push(BLOCK_CLOSE);
  }
  /**
   * @param {Array<Promise<void>>} blockers
   * @param {(renderer: Renderer) => void} fn
   */
  async(blockers, fn) {
    let callback = fn;
    if (blockers.length > 0) {
      const context = ssr_context;
      callback = (renderer) => {
        return Promise.all(blockers).then(() => {
          const previous_context = ssr_context;
          try {
            set_ssr_context(context);
            return fn(renderer);
          } finally {
            set_ssr_context(previous_context);
          }
        });
      };
    }
    this.child(callback);
  }
  /**
   * @param {Array<() => void>} thunks
   */
  run(thunks) {
    const context = ssr_context;
    let promise = Promise.resolve(thunks[0]());
    const promises = [promise];
    for (const fn of thunks.slice(1)) {
      promise = promise.then(() => {
        const previous_context = ssr_context;
        set_ssr_context(context);
        try {
          return fn();
        } finally {
          set_ssr_context(previous_context);
        }
      });
      promises.push(promise);
    }
    return promises;
  }
  /**
   * Create a child renderer. The child renderer inherits the state from the parent,
   * but has its own content.
   * @param {(renderer: Renderer) => MaybePromise<void>} fn
   */
  child(fn) {
    const child = new _Renderer(this.global, this);
    __privateGet(this, _out).push(child);
    const parent = ssr_context;
    set_ssr_context({
      ...ssr_context,
      p: parent,
      c: null,
      r: child
    });
    const result = fn(child);
    set_ssr_context(parent);
    if (result instanceof Promise) {
      if (child.global.mode === "sync") {
        await_invalid();
      }
      result.catch(() => {
      });
      child.promise = result;
    }
    return child;
  }
  /**
   * Create a component renderer. The component renderer inherits the state from the parent,
   * but has its own content. It is treated as an ordering boundary for ondestroy callbacks.
   * @param {(renderer: Renderer) => MaybePromise<void>} fn
   * @param {Function} [component_fn]
   * @returns {void}
   */
  component(fn, component_fn) {
    push();
    const child = this.child(fn);
    __privateSet(child, _is_component_body, true);
    pop();
  }
  /**
   * @param {Record<string, any>} attrs
   * @param {(renderer: Renderer) => void} fn
   * @param {string | undefined} [css_hash]
   * @param {Record<string, boolean> | undefined} [classes]
   * @param {Record<string, string> | undefined} [styles]
   * @param {number | undefined} [flags]
   * @returns {void}
   */
  select(attrs, fn, css_hash, classes, styles, flags) {
    const { value, ...select_attrs } = attrs;
    this.push(`<select${attributes(select_attrs, css_hash, classes, styles, flags)}>`);
    this.child((renderer) => {
      renderer.local.select_value = value;
      fn(renderer);
    });
    this.push("</select>");
  }
  /**
   * @param {Record<string, any>} attrs
   * @param {string | number | boolean | ((renderer: Renderer) => void)} body
   * @param {string | undefined} [css_hash]
   * @param {Record<string, boolean> | undefined} [classes]
   * @param {Record<string, string> | undefined} [styles]
   * @param {number | undefined} [flags]
   */
  option(attrs, body, css_hash, classes, styles, flags) {
    __privateGet(this, _out).push(`<option${attributes(attrs, css_hash, classes, styles, flags)}`);
    const close = (renderer, value, { head: head2, body: body2 }) => {
      if ("value" in attrs) {
        value = attrs.value;
      }
      if (value === this.local.select_value) {
        __privateGet(renderer, _out).push(" selected");
      }
      __privateGet(renderer, _out).push(`>${body2}</option>`);
      if (head2) {
        renderer.head((child) => child.push(head2));
      }
    };
    if (typeof body === "function") {
      this.child((renderer) => {
        var _a, _b;
        const r2 = new _Renderer(this.global, this);
        body(r2);
        if (this.global.mode === "async") {
          return __privateMethod(_a = r2, _Renderer_instances, collect_content_async_fn).call(_a).then((content) => {
            close(renderer, content.body.replaceAll("<!---->", ""), content);
          });
        } else {
          const content = __privateMethod(_b = r2, _Renderer_instances, collect_content_fn).call(_b);
          close(renderer, content.body.replaceAll("<!---->", ""), content);
        }
      });
    } else {
      close(this, body, { body });
    }
  }
  /**
   * @param {(renderer: Renderer) => void} fn
   */
  title(fn) {
    const path = this.get_path();
    const close = (head2) => {
      this.global.set_title(head2, path);
    };
    this.child((renderer) => {
      var _a, _b;
      const r2 = new _Renderer(renderer.global, renderer);
      fn(r2);
      if (renderer.global.mode === "async") {
        return __privateMethod(_a = r2, _Renderer_instances, collect_content_async_fn).call(_a).then((content) => {
          close(content.head);
        });
      } else {
        const content = __privateMethod(_b = r2, _Renderer_instances, collect_content_fn).call(_b);
        close(content.head);
      }
    });
  }
  /**
   * @param {string | (() => Promise<string>)} content
   */
  push(content) {
    if (typeof content === "function") {
      this.child(async (renderer) => renderer.push(await content()));
    } else {
      __privateGet(this, _out).push(content);
    }
  }
  /**
   * @param {() => void} fn
   */
  on_destroy(fn) {
    (__privateGet(this, _on_destroy) ?? __privateSet(this, _on_destroy, [])).push(fn);
  }
  /**
   * @returns {number[]}
   */
  get_path() {
    return __privateGet(this, _parent) ? [...__privateGet(this, _parent).get_path(), __privateGet(__privateGet(this, _parent), _out).indexOf(this)] : [];
  }
  /**
   * @deprecated this is needed for legacy component bindings
   */
  copy() {
    const copy = new _Renderer(this.global, __privateGet(this, _parent));
    __privateSet(copy, _out, __privateGet(this, _out).map((item) => item instanceof _Renderer ? item.copy() : item));
    copy.promise = this.promise;
    return copy;
  }
  /**
   * @param {Renderer} other
   * @deprecated this is needed for legacy component bindings
   */
  subsume(other) {
    if (this.global.mode !== other.global.mode) {
      throw new Error(
        "invariant: A renderer cannot switch modes. If you're seeing this, there's a compiler bug. File an issue!"
      );
    }
    this.local = other.local;
    __privateSet(this, _out, __privateGet(other, _out).map((item) => {
      if (item instanceof _Renderer) {
        item.subsume(item);
      }
      return item;
    }));
    this.promise = other.promise;
    this.type = other.type;
  }
  get length() {
    return __privateGet(this, _out).length;
  }
  /**
   * Only available on the server and when compiling with the `server` option.
   * Takes a component and returns an object with `body` and `head` properties on it, which you can use to populate the HTML when server-rendering your app.
   * @template {Record<string, any>} Props
   * @param {Component<Props>} component
   * @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string; csp?: Csp }} [options]
   * @returns {RenderOutput}
   */
  static render(component, options = {}) {
    let sync;
    const result = (
      /** @type {RenderOutput} */
      {}
    );
    Object.defineProperties(result, {
      html: {
        get: () => {
          var _a;
          return (sync ?? (sync = __privateMethod(_a = _Renderer, _Renderer_static, render_fn).call(_a, component, options))).body;
        }
      },
      head: {
        get: () => {
          var _a;
          return (sync ?? (sync = __privateMethod(_a = _Renderer, _Renderer_static, render_fn).call(_a, component, options))).head;
        }
      },
      body: {
        get: () => {
          var _a;
          return (sync ?? (sync = __privateMethod(_a = _Renderer, _Renderer_static, render_fn).call(_a, component, options))).body;
        }
      },
      hashes: {
        value: {
          script: ""
        }
      },
      then: {
        value: (
          /**
           * this is not type-safe, but honestly it's the best I can do right now, and it's a straightforward function.
           *
           * @template TResult1
           * @template [TResult2=never]
           * @param { (value: SyncRenderOutput) => TResult1 } onfulfilled
           * @param { (reason: unknown) => TResult2 } onrejected
           */
          (onfulfilled, onrejected) => {
            var _a;
            {
              const result2 = sync ?? (sync = __privateMethod(_a = _Renderer, _Renderer_static, render_fn).call(_a, component, options));
              const user_result = onfulfilled({
                head: result2.head,
                body: result2.body,
                html: result2.body,
                hashes: { script: [] }
              });
              return Promise.resolve(user_result);
            }
          }
        )
      }
    });
    return result;
  }
};
_out = new WeakMap();
_on_destroy = new WeakMap();
_is_component_body = new WeakMap();
_parent = new WeakMap();
_Renderer_instances = new WeakSet();
collect_on_destroy_fn = function* () {
  var _a;
  for (const component of __privateMethod(this, _Renderer_instances, traverse_components_fn).call(this)) {
    yield* __privateMethod(_a = component, _Renderer_instances, collect_ondestroy_fn).call(_a);
  }
};
traverse_components_fn = function* () {
  var _a;
  for (const child of __privateGet(this, _out)) {
    if (typeof child !== "string") {
      yield* __privateMethod(_a = child, _Renderer_instances, traverse_components_fn).call(_a);
    }
  }
  if (__privateGet(this, _is_component_body)) {
    yield this;
  }
};
collect_ondestroy_fn = function* () {
  var _a;
  if (__privateGet(this, _on_destroy)) {
    for (const fn of __privateGet(this, _on_destroy)) {
      yield fn;
    }
  }
  for (const child of __privateGet(this, _out)) {
    if (child instanceof _Renderer && !__privateGet(child, _is_component_body)) {
      yield* __privateMethod(_a = child, _Renderer_instances, collect_ondestroy_fn).call(_a);
    }
  }
};
_Renderer_static = new WeakSet();
render_fn = function(component, options) {
  var _a, _b, _c;
  var previous_context = ssr_context;
  try {
    const renderer = __privateMethod(_a = _Renderer, _Renderer_static, open_render_fn).call(_a, "sync", component, options);
    const content = __privateMethod(_b = renderer, _Renderer_instances, collect_content_fn).call(_b);
    return __privateMethod(_c = _Renderer, _Renderer_static, close_render_fn).call(_c, content, renderer);
  } finally {
    abort();
    set_ssr_context(previous_context);
  }
};
render_async_fn = async function(component, options) {
  var _a, _b, _c, _d;
  const previous_context = ssr_context;
  try {
    const renderer = __privateMethod(_a = _Renderer, _Renderer_static, open_render_fn).call(_a, "async", component, options);
    const content = await __privateMethod(_b = renderer, _Renderer_instances, collect_content_async_fn).call(_b);
    const hydratables = await __privateMethod(_c = renderer, _Renderer_instances, collect_hydratables_fn).call(_c);
    if (hydratables !== null) {
      content.head = hydratables + content.head;
    }
    return __privateMethod(_d = _Renderer, _Renderer_static, close_render_fn).call(_d, content, renderer);
  } finally {
    set_ssr_context(previous_context);
    abort();
  }
};
/**
 * Collect all of the code from the `out` array and return it as a string, or a promise resolving to a string.
 * @param {AccumulatedContent} content
 * @returns {AccumulatedContent}
 */
collect_content_fn = function(content = { head: "", body: "" }) {
  var _a;
  for (const item of __privateGet(this, _out)) {
    if (typeof item === "string") {
      content[this.type] += item;
    } else if (item instanceof _Renderer) {
      __privateMethod(_a = item, _Renderer_instances, collect_content_fn).call(_a, content);
    }
  }
  return content;
};
collect_content_async_fn = async function(content = { head: "", body: "" }) {
  var _a;
  await this.promise;
  for (const item of __privateGet(this, _out)) {
    if (typeof item === "string") {
      content[this.type] += item;
    } else if (item instanceof _Renderer) {
      await __privateMethod(_a = item, _Renderer_instances, collect_content_async_fn).call(_a, content);
    }
  }
  return content;
};
collect_hydratables_fn = async function() {
  var _a;
  const ctx = get_render_context().hydratable;
  for (const [_, key] of ctx.unresolved_promises) {
    unresolved_hydratable(key, ((_a = ctx.lookup.get(key)) == null ? void 0 : _a.stack) ?? "<missing stack trace>");
  }
  for (const comparison of ctx.comparisons) {
    await comparison;
  }
  return await __privateMethod(this, _Renderer_instances, hydratable_block_fn).call(this, ctx);
};
open_render_fn = function(mode, component, options) {
  const renderer = new _Renderer(
    new SSRState(mode, options.idPrefix ? options.idPrefix + "-" : "", options.csp)
  );
  renderer.push(BLOCK_OPEN);
  if (options.context) {
    push();
    ssr_context.c = options.context;
    ssr_context.r = renderer;
  }
  component(renderer, options.props ?? {});
  if (options.context) {
    pop();
  }
  renderer.push(BLOCK_CLOSE);
  return renderer;
};
close_render_fn = function(content, renderer) {
  var _a;
  for (const cleanup of __privateMethod(_a = renderer, _Renderer_instances, collect_on_destroy_fn).call(_a)) {
    cleanup();
  }
  let head2 = content.head + renderer.global.get_title();
  let body = content.body;
  for (const { hash, code } of renderer.global.css) {
    head2 += `<style id="${hash}">${code}</style>`;
  }
  return {
    head: head2,
    body,
    hashes: {
      script: renderer.global.csp.script_hashes
    }
  };
};
hydratable_block_fn = async function(ctx) {
  if (ctx.lookup.size === 0) {
    return null;
  }
  let entries = [];
  let has_promises = false;
  for (const [k, v2] of ctx.lookup) {
    if (v2.promises) {
      has_promises = true;
      for (const p2 of v2.promises) await p2;
    }
    entries.push(`[${JSON.stringify(k)},${v2.serialized}]`);
  }
  let prelude = `const h = (window.__svelte ??= {}).h ??= new Map();`;
  if (has_promises) {
    prelude = `const r = (v) => Promise.resolve(v);
				${prelude}`;
  }
  const body = `
			{
				${prelude}

				for (const [k, v] of [
					${entries.join(",\n					")}
				]) {
					h.set(k, v);
				}
			}
		`;
  let csp_attr = "";
  if (this.global.csp.nonce) {
    csp_attr = ` nonce="${this.global.csp.nonce}"`;
  } else if (this.global.csp.hash) {
    const hash = await sha256(body);
    this.global.csp.script_hashes.push(`sha256-${hash}`);
  }
  return `
		<script${csp_attr}>${body}<\/script>`;
};
__privateAdd(_Renderer, _Renderer_static);
let Renderer = _Renderer;
class SSRState {
  /**
   * @param {'sync' | 'async'} mode
   * @param {string} id_prefix
   * @param {Csp} csp
   */
  constructor(mode, id_prefix = "", csp = { hash: false }) {
    /** @readonly @type {Csp & { script_hashes: Sha256Source[] }} */
    __publicField(this, "csp");
    /** @readonly @type {'sync' | 'async'} */
    __publicField(this, "mode");
    /** @readonly @type {() => string} */
    __publicField(this, "uid");
    /** @readonly @type {Set<{ hash: string; code: string }>} */
    __publicField(this, "css", /* @__PURE__ */ new Set());
    /** @type {{ path: number[], value: string }} */
    __privateAdd(this, _title, { path: [], value: "" });
    this.mode = mode;
    this.csp = { ...csp, script_hashes: [] };
    let uid = 1;
    this.uid = () => `${id_prefix}s${uid++}`;
  }
  get_title() {
    return __privateGet(this, _title).value;
  }
  /**
   * Performs a depth-first (lexicographic) comparison using the path. Rejects sets
   * from earlier than or equal to the current value.
   * @param {string} value
   * @param {number[]} path
   */
  set_title(value, path) {
    const current = __privateGet(this, _title).path;
    let i2 = 0;
    let l2 = Math.min(path.length, current.length);
    while (i2 < l2 && path[i2] === current[i2]) i2 += 1;
    if (path[i2] === void 0) return;
    if (current[i2] === void 0 || path[i2] > current[i2]) {
      __privateGet(this, _title).path = path;
      __privateGet(this, _title).value = value;
    }
  }
}
_title = new WeakMap();
function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
const INVALID_ATTR_NAME_CHAR_REGEX = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
function render(component, options = {}) {
  var _a;
  if (((_a = options.csp) == null ? void 0 : _a.hash) && options.csp.nonce) {
    invalid_csp();
  }
  return Renderer.render(
    /** @type {Component<Props>} */
    component,
    options
  );
}
function head(hash, renderer, fn) {
  renderer.head((renderer2) => {
    renderer2.push(`<!--${hash}-->`);
    renderer2.child(fn);
    renderer2.push(EMPTY_COMMENT);
  });
}
function attributes(attrs, css_hash, classes, styles, flags = 0) {
  if (styles) {
    attrs.style = to_style(attrs.style, styles);
  }
  if (attrs.class) {
    attrs.class = clsx(attrs.class);
  }
  if (css_hash || classes) {
    attrs.class = to_class(attrs.class, css_hash, classes);
  }
  let attr_str = "";
  let name;
  const is_html = (flags & ELEMENT_IS_NAMESPACED) === 0;
  const lowercase = (flags & ELEMENT_PRESERVE_ATTRIBUTE_CASE) === 0;
  const is_input = (flags & ELEMENT_IS_INPUT) !== 0;
  for (name in attrs) {
    if (typeof attrs[name] === "function") continue;
    if (name[0] === "$" && name[1] === "$") continue;
    if (INVALID_ATTR_NAME_CHAR_REGEX.test(name)) continue;
    var value = attrs[name];
    if (lowercase) {
      name = name.toLowerCase();
    }
    if (is_input) {
      if (name === "defaultvalue" || name === "defaultchecked") {
        name = name === "defaultvalue" ? "value" : "checked";
        if (attrs[name]) continue;
      }
    }
    attr_str += attr(name, value, is_html && is_boolean_attribute(name));
  }
  return attr_str;
}
function spread_props(props) {
  const merged_props = {};
  let key;
  for (let i2 = 0; i2 < props.length; i2++) {
    const obj = props[i2];
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
function once(get_value) {
  let value = (
    /** @type {V} */
    UNINITIALIZED
  );
  return () => {
    if (value === UNINITIALIZED) {
      value = get_value();
    }
    return value;
  };
}
function derived(fn) {
  const get_value = once(fn);
  let updated_value;
  return function(new_value) {
    if (arguments.length === 0) {
      return updated_value ?? get_value();
    }
    updated_value = new_value;
    return updated_value;
  };
}
function BlogCard($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { post } = $$props;
    function formatDate2(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    }
    $$renderer2.push(`<a${attr("href", `/blog/${stringify(post.slug)}`)} class="block group bg-bg border border-border rounded-lg p-6 hover:border-accent/50 transition-colors"><div class="flex items-start justify-between gap-4 mb-3"><h3 class="font-semibold text-lg text-text group-hover:text-accent transition-colors line-clamp-2">${escape_html(post.title)}</h3></div> <p class="text-sm text-text-muted mb-4 line-clamp-3">${escape_html(post.blurb)}</p> <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-muted"><span>${escape_html(formatDate2(post.posted_at))}</span> <span>·</span> <span>${escape_html(post.read_time)} min read</span> `);
    if (post.author) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span>·</span> <span>by ${escape_html(post.author)}</span>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if (post.tags && post.tags.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex flex-wrap gap-2 mt-4"><!--[-->`);
      const each_array = ensure_array_like(post.tags);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let tag = each_array[$$index];
        $$renderer2.push(`<span class="inline-block px-2 py-1 text-xs bg-bg-secondary text-text-muted rounded">${escape_html(tag)}</span>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></a>`);
  });
}
function MonthGroup($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { month, posts } = $$props;
    $$renderer2.push(`<div class="border-b border-border last:border-b-0"><button type="button" class="w-full flex items-center justify-between py-4 text-left hover:bg-bg-secondary/30 transition-colors"><h2 class="text-xl font-semibold text-text">${escape_html(month)}</h2> <span class="text-sm text-text-muted">${escape_html("−")} ${escape_html(posts.length)} ${escape_html(posts.length === 1 ? "post" : "posts")}</span></button> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="grid gap-4 pb-6"><!--[-->`);
      const each_array = ensure_array_like(posts);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let post = each_array[$$index];
        BlogCard($$renderer2, { post });
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function BlogPostItem($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { post } = $$props;
    function formatDate2(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    }
    $$renderer2.push(`<a${attr("href", `/blog/${stringify(post.slug)}`)} class="block group py-3 border-b border-border last:border-b-0 hover:bg-bg-secondary/50 transition-colors"><h4 class="font-medium text-sm text-text group-hover:text-accent transition-colors line-clamp-2 mb-1">${escape_html(post.title)}</h4> <div class="flex items-center gap-2 text-xs text-text-muted"><span>${escape_html(formatDate2(post.posted_at))}</span> <span>·</span> <span>${escape_html(post.read_time)} min</span></div></a>`);
  });
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
  const y2 = `${translateY * translateTimes}${translateUnit}`;
  let output = `translate(${x},${y2}) scale(${flipX * scale},${flipY * scale})`;
  if (rotate) {
    output += ` rotate(${rotate}${rotateUnit})`;
  }
  return output;
}
function Fa($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let i2, transform;
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
    i2 = icon && icon.icon || [0, 0, "", [], ""];
    transform = getTransform(scale, translateX, translateY, rotate, flip, 512);
    if (i2[4]) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<svg${attr("id", id)}${attr_class(`svelte-fa svelte-fa-base ${stringify(clazz)}`, "svelte-q6zoq1", {
        "pulse": pulse,
        "svelte-fa-size-lg": size === "lg",
        "svelte-fa-size-sm": size === "sm",
        "svelte-fa-size-xs": size === "xs",
        "svelte-fa-fw": fw,
        "svelte-fa-pull-left": pull === "left",
        "svelte-fa-pull-right": pull === "right",
        "spin": spin
      })}${attr_style(style)}${attr("viewBox", `0 0 ${stringify(i2[0])} ${stringify(i2[1])}`)}${attr("aria-hidden", title === void 0)} role="img" xmlns="http://www.w3.org/2000/svg">`);
      if (title) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<title class="svelte-q6zoq1">${escape_html(title)}</title>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--><g${attr("transform", `translate(${stringify(i2[0] / 2)} ${stringify(i2[1] / 2)})`)}${attr("transform-origin", `${stringify(i2[0] / 4)} 0`)} class="svelte-q6zoq1"><g${attr("transform", transform)} class="svelte-q6zoq1">`);
      if (typeof i2[4] == "string") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<path${attr("d", i2[4])}${attr("fill", color || primaryColor || "currentColor")}${attr("transform", `translate(${stringify(i2[0] / -2)} ${stringify(i2[1] / -2)})`)} class="svelte-q6zoq1"></path>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<path${attr("d", i2[4][0])}${attr("fill", secondaryColor || color || "currentColor")}${attr("fill-opacity", swapOpacity != false ? primaryOpacity : secondaryOpacity)}${attr("transform", `translate(${stringify(i2[0] / -2)} ${stringify(i2[1] / -2)})`)} class="svelte-q6zoq1"></path><path${attr("d", i2[4][1])}${attr("fill", primaryColor || color || "currentColor")}${attr("fill-opacity", swapOpacity != false ? secondaryOpacity : primaryOpacity)}${attr("transform", `translate(${stringify(i2[0] / -2)} ${stringify(i2[1] / -2)})`)} class="svelte-q6zoq1"></path>`);
      }
      $$renderer2.push(`<!--]--></g></g></svg>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
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
  });
}
function cn$1(...inputs) {
  return twMerge(clsx$1(inputs));
}
const h$1 = (component, propsOrChildren, childrenOrKey, key = null) => {
  const hasProps = typeof propsOrChildren === "object" && propsOrChildren !== null && !Array.isArray(propsOrChildren);
  return {
    component,
    key: hasProps ? key : typeof childrenOrKey === "number" ? childrenOrKey : null,
    props: hasProps ? propsOrChildren : {},
    children: hasProps ? Array.isArray(childrenOrKey) ? childrenOrKey : childrenOrKey !== null ? [childrenOrKey] : [] : Array.isArray(propsOrChildren) ? propsOrChildren : propsOrChildren !== null ? [propsOrChildren] : []
  };
};
function Render($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let component = $$props["component"];
    let props = fallback($$props["props"], () => ({}), true);
    let children = fallback($$props["children"], () => [], true);
    let key = fallback($$props["key"], null);
    if (component) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<!---->`);
      {
        if (children.length > 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<!---->`);
          component == null ? void 0 : component($$renderer2, spread_props([
            props,
            {
              children: ($$renderer3) => {
                $$renderer3.push(`<!--[-->`);
                const each_array = ensure_array_like(children);
                for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                  let child = each_array[$$index];
                  Render($$renderer3, spread_props([child]));
                  $$renderer3.push(`<!---->`);
                }
                $$renderer3.push(`<!--]-->`);
              },
              $$slots: { default: true }
            }
          ]));
          $$renderer2.push(`<!---->`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<!---->`);
          component == null ? void 0 : component($$renderer2, spread_props([props]));
          $$renderer2.push(`<!---->`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { component, props, children, key });
  });
}
function App($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let initialComponent = $$props["initialComponent"];
    let initialPage = $$props["initialPage"];
    let resolveComponent = $$props["resolveComponent"];
    let component = initialComponent;
    let key = null;
    let page = { ...initialPage, flash: initialPage.flash ?? {} };
    let renderProps = resolveRenderProps(component, page, key);
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
        },
        onFlash: (flash) => {
          page = { ...page, flash };
        }
      });
    }
    function resolveRenderProps(component2, page2, key2 = null) {
      const child = h$1(component2.default, page2.props, [], key2);
      const layout = component2.layout;
      return layout ? resolveLayout(layout, child, page2.props, key2) : child;
    }
    function resolveLayout(layout, child, pageProps, key2) {
      if (isLayoutFunction(layout)) {
        return layout(h$1, child);
      }
      if (Array.isArray(layout)) {
        return layout.slice().reverse().reduce((currentRender, layoutComponent) => h$1(layoutComponent, pageProps, [currentRender], key2), child);
      }
      return h$1(layout, pageProps, child ? [child] : [], key2);
    }
    function isLayoutFunction(layout) {
      return typeof layout === "function" && layout.length === 2 && typeof layout.prototype === "undefined";
    }
    Render($$renderer2, spread_props([renderProps]));
    bind_props($$props, { initialComponent, initialPage, resolveComponent });
  });
}
async function tick() {
}
async function createInertiaApp({ id = "app", resolve, setup, progress = {}, page, defaults = {} }) {
  config.replace(defaults);
  const isServer = typeof window === "undefined";
  const useScriptElementForInitialPage = config.get("future.useScriptElementForInitialPage");
  const initialPage = page || getInitialPageFromDOM(id, useScriptElementForInitialPage);
  const resolveComponent = (name) => Promise.resolve(resolve(name));
  const svelteApp = await Promise.all([
    resolveComponent(initialPage.component),
    router.decryptHistory().catch(() => {
    })
  ]).then(([initialComponent]) => {
    return setup({
      el: isServer ? null : document.getElementById(id),
      App,
      props: { initialPage, initialComponent, resolveComponent }
    });
  });
  if (isServer && svelteApp) {
    const { html: html2, head: head2, css } = svelteApp;
    return {
      body: useScriptElementForInitialPage ? `<script data-page="${id}" type="application/json">${JSON.stringify(initialPage).replace(/\//g, "\\/")}<\/script><div data-server-rendered="true" id="${id}">${html2}</div>` : `<div data-server-rendered="true" id="${id}" data-page="${escape$1(JSON.stringify(initialPage))}">${html2}</div>`,
      head: [head2, css ? `<style data-vite-css>${css.code}</style>` : ""]
    };
  }
  if (!isServer && progress) {
    setupProgress(progress);
  }
}
const config = config$1.extend({});
function t() {
  return t = Object.assign ? Object.assign.bind() : function(t3) {
    for (var e2 = 1; e2 < arguments.length; e2++) {
      var o2 = arguments[e2];
      for (var n2 in o2) ({}).hasOwnProperty.call(o2, n2) && (t3[n2] = o2[n2]);
    }
    return t3;
  }, t.apply(null, arguments);
}
const e = String.prototype.replace, o = /%20/g, n = { RFC1738: function(t3) {
  return e.call(t3, o, "+");
}, RFC3986: function(t3) {
  return String(t3);
} };
var r = "RFC3986";
const i = Object.prototype.hasOwnProperty, s = Array.isArray, u = function() {
  const t3 = [];
  for (let e2 = 0; e2 < 256; ++e2) t3.push("%" + ((e2 < 16 ? "0" : "") + e2.toString(16)).toUpperCase());
  return t3;
}(), l = function t2(e2, o2, n2) {
  if (!o2) return e2;
  if ("object" != typeof o2) {
    if (s(e2)) e2.push(o2);
    else {
      if (!e2 || "object" != typeof e2) return [e2, o2];
      (n2 && (n2.plainObjects || n2.allowPrototypes) || !i.call(Object.prototype, o2)) && (e2[o2] = true);
    }
    return e2;
  }
  if (!e2 || "object" != typeof e2) return [e2].concat(o2);
  let r2 = e2;
  return s(e2) && !s(o2) && (r2 = function(t3, e3) {
    const o3 = e3 && e3.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
    for (let e4 = 0; e4 < t3.length; ++e4) void 0 !== t3[e4] && (o3[e4] = t3[e4]);
    return o3;
  }(e2, n2)), s(e2) && s(o2) ? (o2.forEach(function(o3, r3) {
    if (i.call(e2, r3)) {
      const i2 = e2[r3];
      i2 && "object" == typeof i2 && o3 && "object" == typeof o3 ? e2[r3] = t2(i2, o3, n2) : e2.push(o3);
    } else e2[r3] = o3;
  }), e2) : Object.keys(o2).reduce(function(e3, r3) {
    const s2 = o2[r3];
    return e3[r3] = i.call(e3, r3) ? t2(e3[r3], s2, n2) : s2, e3;
  }, r2);
}, c = 1024, a = function(t3, e2) {
  return [].concat(t3, e2);
}, f = function(t3, e2) {
  if (s(t3)) {
    const o2 = [];
    for (let n2 = 0; n2 < t3.length; n2 += 1) o2.push(e2(t3[n2]));
    return o2;
  }
  return e2(t3);
}, p = Object.prototype.hasOwnProperty, y = { brackets: function(t3) {
  return t3 + "[]";
}, comma: "comma", indices: function(t3, e2) {
  return t3 + "[" + e2 + "]";
}, repeat: function(t3) {
  return t3;
} }, d = Array.isArray, h = Array.prototype.push, b = function(t3, e2) {
  h.apply(t3, d(e2) ? e2 : [e2]);
}, m = Date.prototype.toISOString, g = { addQueryPrefix: false, allowDots: false, allowEmptyArrays: false, arrayFormat: "indices", charset: "utf-8", charsetSentinel: false, delimiter: "&", encode: true, encodeDotInKeys: false, encoder: function(t3, e2, o2, n2, r2) {
  if (0 === t3.length) return t3;
  let i2 = t3;
  if ("symbol" == typeof t3 ? i2 = Symbol.prototype.toString.call(t3) : "string" != typeof t3 && (i2 = String(t3)), "iso-8859-1" === o2) return escape(i2).replace(/%u[0-9a-f]{4}/gi, function(t4) {
    return "%26%23" + parseInt(t4.slice(2), 16) + "%3B";
  });
  let s2 = "";
  for (let t4 = 0; t4 < i2.length; t4 += c) {
    const e3 = i2.length >= c ? i2.slice(t4, t4 + c) : i2, o3 = [];
    for (let t5 = 0; t5 < e3.length; ++t5) {
      let n3 = e3.charCodeAt(t5);
      45 === n3 || 46 === n3 || 95 === n3 || 126 === n3 || n3 >= 48 && n3 <= 57 || n3 >= 65 && n3 <= 90 || n3 >= 97 && n3 <= 122 || "RFC1738" === r2 && (40 === n3 || 41 === n3) ? o3[o3.length] = e3.charAt(t5) : n3 < 128 ? o3[o3.length] = u[n3] : n3 < 2048 ? o3[o3.length] = u[192 | n3 >> 6] + u[128 | 63 & n3] : n3 < 55296 || n3 >= 57344 ? o3[o3.length] = u[224 | n3 >> 12] + u[128 | n3 >> 6 & 63] + u[128 | 63 & n3] : (t5 += 1, n3 = 65536 + ((1023 & n3) << 10 | 1023 & e3.charCodeAt(t5)), o3[o3.length] = u[240 | n3 >> 18] + u[128 | n3 >> 12 & 63] + u[128 | n3 >> 6 & 63] + u[128 | 63 & n3]);
    }
    s2 += o3.join("");
  }
  return s2;
}, encodeValuesOnly: false, format: r, formatter: n[r], indices: false, serializeDate: function(t3) {
  return m.call(t3);
}, skipNulls: false, strictNullHandling: false }, w = {}, v = function(t3, e2, o2, n2, r2, i2, s2, u2, l2, c2, a2, p2, y2, h2, m2, j2, $2, E2) {
  let O2 = t3, T2 = E2, R2 = 0, S2 = false;
  for (; void 0 !== (T2 = T2.get(w)) && !S2; ) {
    const e3 = T2.get(t3);
    if (R2 += 1, void 0 !== e3) {
      if (e3 === R2) throw new RangeError("Cyclic object value");
      S2 = true;
    }
    void 0 === T2.get(w) && (R2 = 0);
  }
  if ("function" == typeof c2 ? O2 = c2(e2, O2) : O2 instanceof Date ? O2 = y2(O2) : "comma" === o2 && d(O2) && (O2 = f(O2, function(t4) {
    return t4 instanceof Date ? y2(t4) : t4;
  })), null === O2) {
    if (i2) return l2 && !j2 ? l2(e2, g.encoder, $2, "key", h2) : e2;
    O2 = "";
  }
  if ("string" == typeof (I2 = O2) || "number" == typeof I2 || "boolean" == typeof I2 || "symbol" == typeof I2 || "bigint" == typeof I2 || function(t4) {
    return !(!t4 || "object" != typeof t4 || !(t4.constructor && t4.constructor.isBuffer && t4.constructor.isBuffer(t4)));
  }(O2)) return l2 ? [m2(j2 ? e2 : l2(e2, g.encoder, $2, "key", h2)) + "=" + m2(l2(O2, g.encoder, $2, "value", h2))] : [m2(e2) + "=" + m2(String(O2))];
  var I2;
  const A2 = [];
  if (void 0 === O2) return A2;
  let D2;
  if ("comma" === o2 && d(O2)) j2 && l2 && (O2 = f(O2, l2)), D2 = [{ value: O2.length > 0 ? O2.join(",") || null : void 0 }];
  else if (d(c2)) D2 = c2;
  else {
    const t4 = Object.keys(O2);
    D2 = a2 ? t4.sort(a2) : t4;
  }
  const _ = u2 ? e2.replace(/\./g, "%2E") : e2, k = n2 && d(O2) && 1 === O2.length ? _ + "[]" : _;
  if (r2 && d(O2) && 0 === O2.length) return k + "[]";
  for (let e3 = 0; e3 < D2.length; ++e3) {
    const f2 = D2[e3], g2 = "object" == typeof f2 && void 0 !== f2.value ? f2.value : O2[f2];
    if (s2 && null === g2) continue;
    const T3 = p2 && u2 ? f2.replace(/\./g, "%2E") : f2, S3 = d(O2) ? "function" == typeof o2 ? o2(k, T3) : k : k + (p2 ? "." + T3 : "[" + T3 + "]");
    E2.set(t3, R2);
    const I3 = /* @__PURE__ */ new WeakMap();
    I3.set(w, E2), b(A2, v(g2, S3, o2, n2, r2, i2, s2, u2, "comma" === o2 && j2 && d(O2) ? null : l2, c2, a2, p2, y2, h2, m2, j2, $2, I3));
  }
  return A2;
}, j = Object.prototype.hasOwnProperty, $ = Array.isArray, E = { allowDots: false, allowEmptyArrays: false, allowPrototypes: false, allowSparse: false, arrayLimit: 20, charset: "utf-8", charsetSentinel: false, comma: false, decodeDotInKeys: false, decoder: function(t3, e2, o2) {
  const n2 = t3.replace(/\+/g, " ");
  if ("iso-8859-1" === o2) return n2.replace(/%[0-9a-f]{2}/gi, unescape);
  try {
    return decodeURIComponent(n2);
  } catch (t4) {
    return n2;
  }
}, delimiter: "&", depth: 5, duplicates: "combine", ignoreQueryPrefix: false, interpretNumericEntities: false, parameterLimit: 1e3, parseArrays: true, plainObjects: false, strictNullHandling: false }, O = function(t3) {
  return t3.replace(/&#(\d+);/g, function(t4, e2) {
    return String.fromCharCode(parseInt(e2, 10));
  });
}, T = function(t3, e2) {
  return t3 && "string" == typeof t3 && e2.comma && t3.indexOf(",") > -1 ? t3.split(",") : t3;
}, R = function(t3, e2, o2, n2) {
  if (!t3) return;
  const r2 = o2.allowDots ? t3.replace(/\.([^.[]+)/g, "[$1]") : t3, i2 = /(\[[^[\]]*])/g;
  let s2 = o2.depth > 0 && /(\[[^[\]]*])/.exec(r2);
  const u2 = s2 ? r2.slice(0, s2.index) : r2, l2 = [];
  if (u2) {
    if (!o2.plainObjects && j.call(Object.prototype, u2) && !o2.allowPrototypes) return;
    l2.push(u2);
  }
  let c2 = 0;
  for (; o2.depth > 0 && null !== (s2 = i2.exec(r2)) && c2 < o2.depth; ) {
    if (c2 += 1, !o2.plainObjects && j.call(Object.prototype, s2[1].slice(1, -1)) && !o2.allowPrototypes) return;
    l2.push(s2[1]);
  }
  return s2 && l2.push("[" + r2.slice(s2.index) + "]"), function(t4, e3, o3, n3) {
    let r3 = n3 ? e3 : T(e3, o3);
    for (let e4 = t4.length - 1; e4 >= 0; --e4) {
      let n4;
      const i3 = t4[e4];
      if ("[]" === i3 && o3.parseArrays) n4 = o3.allowEmptyArrays && "" === r3 ? [] : [].concat(r3);
      else {
        n4 = o3.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
        const t5 = "[" === i3.charAt(0) && "]" === i3.charAt(i3.length - 1) ? i3.slice(1, -1) : i3, e5 = o3.decodeDotInKeys ? t5.replace(/%2E/g, ".") : t5, s3 = parseInt(e5, 10);
        o3.parseArrays || "" !== e5 ? !isNaN(s3) && i3 !== e5 && String(s3) === e5 && s3 >= 0 && o3.parseArrays && s3 <= o3.arrayLimit ? (n4 = [], n4[s3] = r3) : "__proto__" !== e5 && (n4[e5] = r3) : n4 = { 0: r3 };
      }
      r3 = n4;
    }
    return r3;
  }(l2, e2, o2, n2);
};
function S(t3, e2) {
  const o2 = /* @__PURE__ */ function(t4) {
    return E;
  }();
  if ("" === t3 || null == t3) return o2.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  const n2 = "string" == typeof t3 ? function(t4, e3) {
    const o3 = { __proto__: null }, n3 = (e3.ignoreQueryPrefix ? t4.replace(/^\?/, "") : t4).split(e3.delimiter, Infinity === e3.parameterLimit ? void 0 : e3.parameterLimit);
    let r3, i3 = -1, s2 = e3.charset;
    if (e3.charsetSentinel) for (r3 = 0; r3 < n3.length; ++r3) 0 === n3[r3].indexOf("utf8=") && ("utf8=%E2%9C%93" === n3[r3] ? s2 = "utf-8" : "utf8=%26%2310003%3B" === n3[r3] && (s2 = "iso-8859-1"), i3 = r3, r3 = n3.length);
    for (r3 = 0; r3 < n3.length; ++r3) {
      if (r3 === i3) continue;
      const t5 = n3[r3], u2 = t5.indexOf("]="), l2 = -1 === u2 ? t5.indexOf("=") : u2 + 1;
      let c2, p2;
      -1 === l2 ? (c2 = e3.decoder(t5, E.decoder, s2, "key"), p2 = e3.strictNullHandling ? null : "") : (c2 = e3.decoder(t5.slice(0, l2), E.decoder, s2, "key"), p2 = f(T(t5.slice(l2 + 1), e3), function(t6) {
        return e3.decoder(t6, E.decoder, s2, "value");
      })), p2 && e3.interpretNumericEntities && "iso-8859-1" === s2 && (p2 = O(p2)), t5.indexOf("[]=") > -1 && (p2 = $(p2) ? [p2] : p2);
      const y2 = j.call(o3, c2);
      y2 && "combine" === e3.duplicates ? o3[c2] = a(o3[c2], p2) : y2 && "last" !== e3.duplicates || (o3[c2] = p2);
    }
    return o3;
  }(t3, o2) : t3;
  let r2 = o2.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  const i2 = Object.keys(n2);
  for (let e3 = 0; e3 < i2.length; ++e3) {
    const s2 = i2[e3], u2 = R(s2, n2[s2], o2, "string" == typeof t3);
    r2 = l(r2, u2, o2);
  }
  return true === o2.allowSparse ? r2 : function(t4) {
    const e3 = [{ obj: { o: t4 }, prop: "o" }], o3 = [];
    for (let t5 = 0; t5 < e3.length; ++t5) {
      const n3 = e3[t5], r3 = n3.obj[n3.prop], i3 = Object.keys(r3);
      for (let t6 = 0; t6 < i3.length; ++t6) {
        const n4 = i3[t6], s2 = r3[n4];
        "object" == typeof s2 && null !== s2 && -1 === o3.indexOf(s2) && (e3.push({ obj: r3, prop: n4 }), o3.push(s2));
      }
    }
    return function(t5) {
      for (; t5.length > 1; ) {
        const e4 = t5.pop(), o4 = e4.obj[e4.prop];
        if (s(o4)) {
          const t6 = [];
          for (let e5 = 0; e5 < o4.length; ++e5) void 0 !== o4[e5] && t6.push(o4[e5]);
          e4.obj[e4.prop] = t6;
        }
      }
    }(e3), t4;
  }(r2);
}
class I {
  constructor(t3, e2, o2) {
    var n2, r2;
    this.name = t3, this.definition = e2, this.bindings = null != (n2 = e2.bindings) ? n2 : {}, this.wheres = null != (r2 = e2.wheres) ? r2 : {}, this.config = o2;
  }
  get template() {
    const t3 = `${this.origin}/${this.definition.uri}`.replace(/\/+$/, "");
    return "" === t3 ? "/" : t3;
  }
  get origin() {
    return this.config.absolute ? this.definition.domain ? `${this.config.url.match(/^\w+:\/\//)[0]}${this.definition.domain}${this.config.port ? `:${this.config.port}` : ""}` : this.config.url : "";
  }
  get parameterSegments() {
    var t3, e2;
    return null != (t3 = null == (e2 = this.template.match(/{[^}?]+\??}/g)) ? void 0 : e2.map((t4) => ({ name: t4.replace(/{|\??}/g, ""), required: !/\?}$/.test(t4) }))) ? t3 : [];
  }
  matchesUrl(t3) {
    var e2;
    if (!this.definition.methods.includes("GET")) return false;
    const o2 = this.template.replace(/[.*+$()[\]]/g, "\\$&").replace(/(\/?){([^}?]*)(\??)}/g, (t4, e3, o3, n3) => {
      var r3;
      const i3 = `(?<${o3}>${(null == (r3 = this.wheres[o3]) ? void 0 : r3.replace(/(^\^)|(\$$)/g, "")) || "[^/?]+"})`;
      return n3 ? `(${e3}${i3})?` : `${e3}${i3}`;
    }).replace(/^\w+:\/\//, ""), [n2, r2] = t3.replace(/^\w+:\/\//, "").split("?"), i2 = null != (e2 = new RegExp(`^${o2}/?$`).exec(n2)) ? e2 : new RegExp(`^${o2}/?$`).exec(decodeURI(n2));
    if (i2) {
      for (const t4 in i2.groups) i2.groups[t4] = "string" == typeof i2.groups[t4] ? decodeURIComponent(i2.groups[t4]) : i2.groups[t4];
      return { params: i2.groups, query: S(r2) };
    }
    return false;
  }
  compile(t3) {
    return this.parameterSegments.length ? this.template.replace(/{([^}?]+)(\??)}/g, (e2, o2, n2) => {
      var r2, i2;
      if (!n2 && [null, void 0].includes(t3[o2])) throw new Error(`Ziggy error: '${o2}' parameter is required for route '${this.name}'.`);
      if (this.wheres[o2] && !new RegExp(`^${n2 ? `(${this.wheres[o2]})?` : this.wheres[o2]}$`).test(null != (i2 = t3[o2]) ? i2 : "")) throw new Error(`Ziggy error: '${o2}' parameter '${t3[o2]}' does not match required format '${this.wheres[o2]}' for route '${this.name}'.`);
      return encodeURI(null != (r2 = t3[o2]) ? r2 : "").replace(/%7C/g, "|").replace(/%25/g, "%").replace(/\$/g, "%24");
    }).replace(this.config.absolute ? /(\.[^/]+?)(\/\/)/ : /(^)(\/\/)/, "$1/").replace(/\/+$/, "") : this.template;
  }
}
class A extends String {
  constructor(e2, o2, n2 = true, r2) {
    if (super(), this.t = null != r2 ? r2 : "undefined" != typeof Ziggy ? Ziggy : null == globalThis ? void 0 : globalThis.Ziggy, !this.t && "undefined" != typeof document && document.getElementById("ziggy-routes-json") && (globalThis.Ziggy = JSON.parse(document.getElementById("ziggy-routes-json").textContent), this.t = globalThis.Ziggy), this.t = t({}, this.t, { absolute: n2 }), e2) {
      if (!this.t.routes[e2]) throw new Error(`Ziggy error: route '${e2}' is not in the route list.`);
      this.i = new I(e2, this.t.routes[e2], this.t), this.u = this.l(o2);
    }
  }
  toString() {
    const e2 = Object.keys(this.u).filter((t3) => !this.i.parameterSegments.some(({ name: e3 }) => e3 === t3)).filter((t3) => "_query" !== t3).reduce((e3, o2) => t({}, e3, { [o2]: this.u[o2] }), {});
    return this.i.compile(this.u) + function(t3, e3) {
      let o2 = t3;
      const i2 = function(t4) {
        if (!t4) return g;
        if (void 0 !== t4.allowEmptyArrays && "boolean" != typeof t4.allowEmptyArrays) throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
        if (void 0 !== t4.encodeDotInKeys && "boolean" != typeof t4.encodeDotInKeys) throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
        if (null != t4.encoder && "function" != typeof t4.encoder) throw new TypeError("Encoder has to be a function.");
        const e4 = t4.charset || g.charset;
        if (void 0 !== t4.charset && "utf-8" !== t4.charset && "iso-8859-1" !== t4.charset) throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
        let o3 = r;
        if (void 0 !== t4.format) {
          if (!p.call(n, t4.format)) throw new TypeError("Unknown format option provided.");
          o3 = t4.format;
        }
        const i3 = n[o3];
        let s3, u3 = g.filter;
        if (("function" == typeof t4.filter || d(t4.filter)) && (u3 = t4.filter), s3 = t4.arrayFormat in y ? t4.arrayFormat : "indices" in t4 ? t4.indices ? "indices" : "repeat" : g.arrayFormat, "commaRoundTrip" in t4 && "boolean" != typeof t4.commaRoundTrip) throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
        return { addQueryPrefix: "boolean" == typeof t4.addQueryPrefix ? t4.addQueryPrefix : g.addQueryPrefix, allowDots: void 0 === t4.allowDots ? true === t4.encodeDotInKeys || g.allowDots : !!t4.allowDots, allowEmptyArrays: "boolean" == typeof t4.allowEmptyArrays ? !!t4.allowEmptyArrays : g.allowEmptyArrays, arrayFormat: s3, charset: e4, charsetSentinel: "boolean" == typeof t4.charsetSentinel ? t4.charsetSentinel : g.charsetSentinel, commaRoundTrip: t4.commaRoundTrip, delimiter: void 0 === t4.delimiter ? g.delimiter : t4.delimiter, encode: "boolean" == typeof t4.encode ? t4.encode : g.encode, encodeDotInKeys: "boolean" == typeof t4.encodeDotInKeys ? t4.encodeDotInKeys : g.encodeDotInKeys, encoder: "function" == typeof t4.encoder ? t4.encoder : g.encoder, encodeValuesOnly: "boolean" == typeof t4.encodeValuesOnly ? t4.encodeValuesOnly : g.encodeValuesOnly, filter: u3, format: o3, formatter: i3, serializeDate: "function" == typeof t4.serializeDate ? t4.serializeDate : g.serializeDate, skipNulls: "boolean" == typeof t4.skipNulls ? t4.skipNulls : g.skipNulls, sort: "function" == typeof t4.sort ? t4.sort : null, strictNullHandling: "boolean" == typeof t4.strictNullHandling ? t4.strictNullHandling : g.strictNullHandling };
      }(e3);
      let s2, u2;
      "function" == typeof i2.filter ? (u2 = i2.filter, o2 = u2("", o2)) : d(i2.filter) && (u2 = i2.filter, s2 = u2);
      const l2 = [];
      if ("object" != typeof o2 || null === o2) return "";
      const c2 = y[i2.arrayFormat], a2 = "comma" === c2 && i2.commaRoundTrip;
      s2 || (s2 = Object.keys(o2)), i2.sort && s2.sort(i2.sort);
      const f2 = /* @__PURE__ */ new WeakMap();
      for (let t4 = 0; t4 < s2.length; ++t4) {
        const e4 = s2[t4];
        i2.skipNulls && null === o2[e4] || b(l2, v(o2[e4], e4, c2, a2, i2.allowEmptyArrays, i2.strictNullHandling, i2.skipNulls, i2.encodeDotInKeys, i2.encode ? i2.encoder : null, i2.filter, i2.sort, i2.allowDots, i2.serializeDate, i2.format, i2.formatter, i2.encodeValuesOnly, i2.charset, f2));
      }
      const h2 = l2.join(i2.delimiter);
      let m2 = true === i2.addQueryPrefix ? "?" : "";
      return i2.charsetSentinel && (m2 += "iso-8859-1" === i2.charset ? "utf8=%26%2310003%3B&" : "utf8=%E2%9C%93&"), h2.length > 0 ? m2 + h2 : "";
    }(t({}, e2, this.u._query), { addQueryPrefix: true, arrayFormat: "indices", encodeValuesOnly: true, skipNulls: true, encoder: (t3, e3) => "boolean" == typeof t3 ? Number(t3) : e3(t3) });
  }
  p(e2) {
    e2 ? this.t.absolute && e2.startsWith("/") && (e2 = this.h().host + e2) : e2 = this.m();
    let o2 = {};
    const [n2, r2] = Object.entries(this.t.routes).find(([t3, n3]) => o2 = new I(t3, n3, this.t).matchesUrl(e2)) || [void 0, void 0];
    return t({ name: n2 }, o2, { route: r2 });
  }
  m() {
    const { host: t3, pathname: e2, search: o2 } = this.h();
    return (this.t.absolute ? t3 + e2 : e2.replace(this.t.url.replace(/^\w*:\/\/[^/]+/, ""), "").replace(/^\/+/, "/")) + o2;
  }
  current(e2, o2) {
    const { name: n2, params: r2, query: i2, route: s2 } = this.p();
    if (!e2) return n2;
    const u2 = new RegExp(`^${e2.replace(/\./g, "\\.").replace(/\*/g, ".*")}$`).test(n2);
    if ([null, void 0].includes(o2) || !u2) return u2;
    const l2 = new I(n2, s2, this.t);
    o2 = this.l(o2, l2);
    const c2 = t({}, r2, i2);
    if (Object.values(o2).every((t3) => !t3) && !Object.values(c2).some((t3) => void 0 !== t3)) return true;
    const a2 = (t3, e3) => Object.entries(t3).every(([t4, o3]) => Array.isArray(o3) && Array.isArray(e3[t4]) ? o3.every((o4) => e3[t4].includes(o4) || e3[t4].includes(decodeURIComponent(o4))) : "object" == typeof o3 && "object" == typeof e3[t4] && null !== o3 && null !== e3[t4] ? a2(o3, e3[t4]) : e3[t4] == o3 || e3[t4] == decodeURIComponent(o3));
    return a2(o2, c2);
  }
  h() {
    var t3, e2, o2, n2, r2, i2;
    const { host: s2 = "", pathname: u2 = "", search: l2 = "" } = "undefined" != typeof window ? window.location : {};
    return { host: null != (t3 = null == (e2 = this.t.location) ? void 0 : e2.host) ? t3 : s2, pathname: null != (o2 = null == (n2 = this.t.location) ? void 0 : n2.pathname) ? o2 : u2, search: null != (r2 = null == (i2 = this.t.location) ? void 0 : i2.search) ? r2 : l2 };
  }
  get params() {
    const { params: e2, query: o2 } = this.p();
    return t({}, e2, o2);
  }
  get routeParams() {
    return this.p().params;
  }
  get queryParams() {
    return this.p().query;
  }
  has(t3) {
    return this.t.routes.hasOwnProperty(t3);
  }
  l(e2 = {}, o2 = this.i) {
    null != e2 || (e2 = {}), e2 = ["string", "number"].includes(typeof e2) ? [e2] : e2;
    const n2 = o2.parameterSegments.filter(({ name: t3 }) => !this.t.defaults[t3]);
    return Array.isArray(e2) ? e2 = e2.reduce((e3, o3, r2) => t({}, e3, n2[r2] ? { [n2[r2].name]: o3 } : "object" == typeof o3 ? o3 : { [o3]: "" }), {}) : 1 !== n2.length || e2[n2[0].name] || !e2.hasOwnProperty(Object.values(o2.bindings)[0]) && !e2.hasOwnProperty("id") || (e2 = { [n2[0].name]: e2 }), t({}, this.v(o2), this.j(e2, o2));
  }
  v(e2) {
    return e2.parameterSegments.filter(({ name: t3 }) => this.t.defaults[t3]).reduce((e3, { name: o2 }, n2) => t({}, e3, { [o2]: this.t.defaults[o2] }), {});
  }
  j(e2, { bindings: o2, parameterSegments: n2 }) {
    return Object.entries(e2).reduce((e3, [r2, i2]) => {
      if (!i2 || "object" != typeof i2 || Array.isArray(i2) || !n2.some(({ name: t3 }) => t3 === r2)) return t({}, e3, { [r2]: i2 });
      if (!i2.hasOwnProperty(o2[r2])) {
        if (!i2.hasOwnProperty("id")) throw new Error(`Ziggy error: object passed as '${r2}' parameter is missing route model binding key '${o2[r2]}'.`);
        o2[r2] = "id";
      }
      return t({}, e3, { [r2]: i2[o2[r2]] });
    }, {});
  }
  valueOf() {
    return this.toString();
  }
}
function D(t3, e2, o2, n2) {
  const r2 = new A(t3, e2, o2, n2);
  return t3 ? r2.toString() : r2;
}
function Header($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      onEmailClick,
      cvDownloadUrl = null,
      showBlogLink = true,
      class: className = ""
    } = $$props;
    let showLinks = D().current("home.index") && showBlogLink || D().current("blog.*");
    $$renderer2.push(`<header${attr_class(clsx(cn$1("fixed top-0 left-0 right-0 z-40 flex justify-between items-center p-4 md:p-6", { "border-b border-border": !D().current("home.index") }, className)))}><div class="flex gap-3 sm:gap-4 text-sm font-medium">`);
    if (showLinks) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button type="button" class="text-text-muted hover:text-accent transition-colors uppercase cursor-pointer">Home</button> `);
      if (showBlogLink) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<button type="button" class="text-text-muted hover:text-accent transition-colors uppercase cursor-pointer">Blog</button>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="flex gap-4 sm:gap-5"><a${attr("href", Bio.contact.GitHub.src)} target="_blank" rel="noopener noreferrer" class="text-text-muted hover:text-accent transition-colors">`);
    Fa($$renderer2, { icon: faGithub, size: "lg" });
    $$renderer2.push(`<!----></a> <a${attr("href", Bio.contact.LinkedIn.src)} target="_blank" rel="noopener noreferrer" class="text-text-muted hover:text-accent transition-colors">`);
    Fa($$renderer2, { icon: faLinkedin, size: "lg" });
    $$renderer2.push(`<!----></a> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <button type="button" class="text-text-muted hover:text-accent transition-colors cursor-pointer">`);
    Fa($$renderer2, { icon: faEnvelope, size: "lg" });
    $$renderer2.push(`<!----></button></div></header>`);
  });
}
function Footer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let isVisible = false;
    let { cvDownloadUrl = null, class: className } = $$props;
    $$renderer2.push(`<footer${attr_class(clsx(cn$1(
      "flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-border transition-opacity duration-300 bg-bg",
      {
        "opacity-100": isVisible,
        "opacity-0 pointer-events-none": true
      },
      className
    )))}><span class="text-sm text-text-muted">${escape_html(Bio.firstname)} ${escape_html(Bio.surname)}</span> <div class="flex gap-4"><a${attr("href", Bio.contact.GitHub.src)} target="_blank" rel="noopener noreferrer" class="text-text-muted hover:text-accent transition-colors">`);
    Fa($$renderer2, { icon: faGithub, size: "lg" });
    $$renderer2.push(`<!----></a> <a${attr("href", Bio.contact.LinkedIn.src)} target="_blank" rel="noopener noreferrer" class="text-text-muted hover:text-accent transition-colors">`);
    Fa($$renderer2, { icon: faLinkedin, size: "lg" });
    $$renderer2.push(`<!----></a> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <a${attr("href", Bio.contact.Email.src)} class="text-text-muted hover:text-accent transition-colors">`);
    Fa($$renderer2, { icon: faEnvelope, size: "lg" });
    $$renderer2.push(`<!----></a></div></footer>`);
  });
}
function useStore(store, selector = (d2) => d2, options = {}) {
  options.equal ?? shallow;
  let slice = selector(store.state);
  return {
    get current() {
      return slice;
    }
  };
}
function shallow(objA, objB) {
  if (Object.is(objA, objB)) {
    return true;
  }
  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
    return false;
  }
  if (objA instanceof Map && objB instanceof Map) {
    if (objA.size !== objB.size) return false;
    for (const [k, v2] of objA) {
      if (!objB.has(k) || !Object.is(v2, objB.get(k))) return false;
    }
    return true;
  }
  if (objA instanceof Set && objB instanceof Set) {
    if (objA.size !== objB.size) return false;
    for (const v2 of objA) {
      if (!objB.has(v2)) return false;
    }
    return true;
  }
  if (objA instanceof Date && objB instanceof Date) {
    if (objA.getTime() !== objB.getTime()) return false;
    return true;
  }
  const keysA = Object.keys(objA);
  if (keysA.length !== Object.keys(objB).length) {
    return false;
  }
  for (let i2 = 0; i2 < keysA.length; i2++) {
    if (!Object.prototype.hasOwnProperty.call(objB, keysA[i2]) || !Object.is(objA[keysA[i2]], objB[keysA[i2]])) {
      return false;
    }
  }
  return true;
}
function createField(opts) {
  const options = opts();
  const api = new FieldApi(options);
  const extendedApi = api;
  extendedApi.Field = Field_1;
  const storeSub = useStore(api.store);
  Object.defineProperty(extendedApi, "state", {
    get() {
      return storeSub.current;
    }
  });
  return extendedApi;
}
function Field_1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children, $$slots, $$events, ...fieldOptions } = $$props;
    const fieldApi = createField(() => {
      return fieldOptions;
    });
    children($$renderer2, fieldApi);
    $$renderer2.push(`<!---->`);
  });
}
function Subscribe($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children, store, selector = (state) => state } = $$props;
    const value = useStore(store, selector);
    children($$renderer2, value.current);
    $$renderer2.push(`<!---->`);
  });
}
function createForm(opts) {
  const options = opts == null ? void 0 : opts();
  const api = new FormApi(options);
  const extendedApi = api;
  extendedApi.Field = (internal, props) => Field_1(internal, { ...props, form: api });
  extendedApi.createField = (props) => createField(() => {
    return { ...props(), form: api };
  });
  extendedApi.useStore = (selector) => useStore(api.store, selector);
  extendedApi.Subscribe = (internal, props) => Subscribe(internal, { ...props, store: api.store });
  noop(api.mount);
  return extendedApi;
}
const bars = Array(12).fill(0);
function Loader($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { visible, class: className } = $$props;
    $$renderer2.push(`<div${attr_class(clsx(["sonner-loading-wrapper", className].filter(Boolean).join(" ")))}${attr("data-visible", visible)}><div class="sonner-spinner"><!--[-->`);
    const each_array = ensure_array_like(bars);
    for (let i2 = 0, $$length = each_array.length; i2 < $$length; i2++) {
      each_array[i2];
      $$renderer2.push(`<div class="sonner-loading-bar"></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
const isBrowser = typeof document !== "undefined";
const defaultWindow = void 0;
function getActiveElement(document2) {
  let activeElement = document2.activeElement;
  while (activeElement == null ? void 0 : activeElement.shadowRoot) {
    const node = activeElement.shadowRoot.activeElement;
    if (node === activeElement)
      break;
    else
      activeElement = node;
  }
  return activeElement;
}
function createSubscriber(_) {
  return () => {
  };
}
class ActiveElement {
  constructor(options = {}) {
    __privateAdd(this, _document);
    __privateAdd(this, _subscribe);
    const { window: window2 = defaultWindow, document: document2 = window2 == null ? void 0 : window2.document } = options;
    if (window2 === void 0) return;
    __privateSet(this, _document, document2);
    __privateSet(this, _subscribe, createSubscriber());
  }
  get current() {
    var _a;
    (_a = __privateGet(this, _subscribe)) == null ? void 0 : _a.call(this);
    if (!__privateGet(this, _document)) return null;
    return getActiveElement(__privateGet(this, _document));
  }
}
_document = new WeakMap();
_subscribe = new WeakMap();
new ActiveElement();
class Context {
  /**
   * @param name The name of the context.
   * This is used for generating the context key and error messages.
   */
  constructor(name) {
    __privateAdd(this, _name);
    __privateAdd(this, _key);
    __privateSet(this, _name, name);
    __privateSet(this, _key, Symbol(name));
  }
  /**
   * The key used to get and set the context.
   *
   * It is not recommended to use this value directly.
   * Instead, use the methods provided by this class.
   */
  get key() {
    return __privateGet(this, _key);
  }
  /**
   * Checks whether this has been set in the context of a parent component.
   *
   * Must be called during component initialisation.
   */
  exists() {
    return hasContext(__privateGet(this, _key));
  }
  /**
   * Retrieves the context that belongs to the closest parent component.
   *
   * Must be called during component initialisation.
   *
   * @throws An error if the context does not exist.
   */
  get() {
    const context = getContext(__privateGet(this, _key));
    if (context === void 0) {
      throw new Error(`Context "${__privateGet(this, _name)}" not found`);
    }
    return context;
  }
  /**
   * Retrieves the context that belongs to the closest parent component,
   * or the given fallback value if the context does not exist.
   *
   * Must be called during component initialisation.
   */
  getOr(fallback2) {
    const context = getContext(__privateGet(this, _key));
    if (context === void 0) {
      return fallback2;
    }
    return context;
  }
  /**
   * Associates the given value with the current component and returns it.
   *
   * Must be called during component initialisation.
   */
  set(context) {
    return setContext(__privateGet(this, _key), context);
  }
}
_name = new WeakMap();
_key = new WeakMap();
const sonnerContext = new Context("<Toaster/>");
let toastsCounter = 0;
class ToastState {
  constructor() {
    __publicField(this, "toasts", []);
    __publicField(this, "heights", []);
    __privateAdd(this, _findToastIdx, (id) => {
      const idx = this.toasts.findIndex((toast2) => toast2.id === id);
      if (idx === -1) return null;
      return idx;
    });
    __publicField(this, "addToast", (data) => {
      if (!isBrowser) return;
      this.toasts.unshift(data);
    });
    __publicField(this, "updateToast", ({ id, data, type, message }) => {
      const toastIdx = this.toasts.findIndex((toast2) => toast2.id === id);
      const toastToUpdate = this.toasts[toastIdx];
      this.toasts[toastIdx] = {
        ...toastToUpdate,
        ...data,
        id,
        title: message,
        type,
        updated: true
      };
    });
    __publicField(this, "create", (data) => {
      var _a;
      const { message, ...rest } = data;
      const id = typeof (data == null ? void 0 : data.id) === "number" || data.id && ((_a = data.id) == null ? void 0 : _a.length) > 0 ? data.id : toastsCounter++;
      const dismissable = data.dismissable === void 0 ? true : data.dismissable;
      const type = data.type === void 0 ? "default" : data.type;
      run(() => {
        const alreadyExists = this.toasts.find((toast2) => toast2.id === id);
        if (alreadyExists) {
          this.updateToast({ id, data, type, message, dismissable });
        } else {
          this.addToast({ ...rest, id, title: message, dismissable, type });
        }
      });
      return id;
    });
    __publicField(this, "dismiss", (id) => {
      run(() => {
        if (id === void 0) {
          this.toasts = this.toasts.map((toast2) => ({ ...toast2, dismiss: true }));
          return;
        }
        const toastIdx = this.toasts.findIndex((toast2) => toast2.id === id);
        if (this.toasts[toastIdx]) {
          this.toasts[toastIdx] = { ...this.toasts[toastIdx], dismiss: true };
        }
      });
      return id;
    });
    __publicField(this, "remove", (id) => {
      if (id === void 0) {
        this.toasts = [];
        return;
      }
      const toastIdx = __privateGet(this, _findToastIdx).call(this, id);
      if (toastIdx === null) return;
      this.toasts.splice(toastIdx, 1);
      return id;
    });
    __publicField(this, "message", (message, data) => {
      return this.create({ ...data, type: "default", message });
    });
    __publicField(this, "error", (message, data) => {
      return this.create({ ...data, type: "error", message });
    });
    __publicField(this, "success", (message, data) => {
      return this.create({ ...data, type: "success", message });
    });
    __publicField(this, "info", (message, data) => {
      return this.create({ ...data, type: "info", message });
    });
    __publicField(this, "warning", (message, data) => {
      return this.create({ ...data, type: "warning", message });
    });
    __publicField(this, "loading", (message, data) => {
      return this.create({ ...data, type: "loading", message });
    });
    __publicField(this, "promise", (promise, data) => {
      if (!data) {
        return;
      }
      let id = void 0;
      if (data.loading !== void 0) {
        id = this.create({
          ...data,
          promise,
          type: "loading",
          message: typeof data.loading === "string" ? data.loading : data.loading()
        });
      }
      const p2 = promise instanceof Promise ? promise : promise();
      let shouldDismiss = id !== void 0;
      p2.then((response) => {
        if (typeof response === "object" && response && "ok" in response && typeof response.ok === "boolean" && !response.ok) {
          shouldDismiss = false;
          const message = constructPromiseErrorMessage(response);
          this.create({ id, type: "error", message });
        } else if (data.success !== void 0) {
          shouldDismiss = false;
          const message = typeof data.success === "function" ? data.success(response) : data.success;
          this.create({ id, type: "success", message });
        }
      }).catch((error) => {
        if (data.error !== void 0) {
          shouldDismiss = false;
          const message = typeof data.error === "function" ? data.error(error) : data.error;
          this.create({ id, type: "error", message });
        }
      }).finally(() => {
        var _a;
        if (shouldDismiss) {
          this.dismiss(id);
          id = void 0;
        }
        (_a = data.finally) == null ? void 0 : _a.call(data);
      });
      return id;
    });
    __publicField(this, "custom", (component, data) => {
      const id = (data == null ? void 0 : data.id) || toastsCounter++;
      this.create({ component, id, ...data });
      return id;
    });
    __publicField(this, "removeHeight", (id) => {
      this.heights = this.heights.filter((height) => height.toastId !== id);
    });
    __publicField(this, "setHeight", (data) => {
      const toastIdx = __privateGet(this, _findToastIdx).call(this, data.toastId);
      if (toastIdx === null) {
        this.heights.push(data);
        return;
      }
      this.heights[toastIdx] = data;
    });
    __publicField(this, "reset", () => {
      this.toasts = [];
      this.heights = [];
    });
  }
}
_findToastIdx = new WeakMap();
function constructPromiseErrorMessage(response) {
  if (response && typeof response === "object" && "status" in response) {
    return `HTTP error! Status: ${response.status}`;
  }
  return `Error! ${response}`;
}
const toastState = new ToastState();
function toastFunction(message, data) {
  return toastState.create({ message, ...data });
}
class SonnerState {
  constructor() {
    /**
     * A derived state of the toasts that are not dismissed.
     */
    __privateAdd(this, _activeToasts, derived(() => toastState.toasts.filter((toast2) => !toast2.dismiss)));
  }
  get toasts() {
    return __privateGet(this, _activeToasts).call(this);
  }
}
_activeToasts = new WeakMap();
const basicToast = toastFunction;
const toast = Object.assign(basicToast, {
  success: toastState.success,
  info: toastState.info,
  warning: toastState.warning,
  error: toastState.error,
  custom: toastState.custom,
  message: toastState.message,
  promise: toastState.promise,
  dismiss: toastState.dismiss,
  loading: toastState.loading,
  getActiveToasts: () => {
    return toastState.toasts.filter((toast2) => !toast2.dismiss);
  }
});
function isAction(action) {
  return action.label !== void 0;
}
const TOAST_LIFETIME$1 = 4e3;
const GAP$1 = 14;
const TIME_BEFORE_UNMOUNT = 200;
const DEFAULT_TOAST_CLASSES = {
  toast: "",
  title: "",
  description: "",
  loader: "",
  closeButton: "",
  cancelButton: "",
  actionButton: "",
  action: "",
  warning: "",
  error: "",
  success: "",
  default: "",
  info: "",
  loading: ""
};
function Toast($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    let {
      toast: toast2,
      index,
      expanded,
      invert: invertFromToaster,
      position,
      visibleToasts,
      expandByDefault,
      closeButton: closeButtonFromToaster,
      interacting,
      cancelButtonStyle = "",
      actionButtonStyle = "",
      duration: durationFromToaster,
      descriptionClass = "",
      classes: classesProp,
      unstyled = false,
      loadingIcon,
      successIcon,
      errorIcon,
      warningIcon,
      closeIcon,
      infoIcon,
      defaultRichColors = false,
      swipeDirections: swipeDirectionsProp,
      closeButtonAriaLabel,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const defaultClasses = { ...DEFAULT_TOAST_CLASSES };
    let mounted = false;
    let removed = false;
    let swiping = false;
    let swipeOut = false;
    let isSwiped = false;
    let offsetBeforeRemove = 0;
    let initialHeight = 0;
    toast2.duration || durationFromToaster || TOAST_LIFETIME$1;
    let swipeOutDirection = null;
    const isFront = index === 0;
    const isVisible = index + 1 <= visibleToasts;
    const toastType = toast2.type;
    const dismissable = toast2.dismissable !== false;
    const toastClass = toast2.class || "";
    const toastDescriptionClass = toast2.descriptionClass || "";
    const heightIndex = toastState.heights.findIndex((height) => height.toastId === toast2.id) || 0;
    const closeButton = toast2.closeButton ?? closeButtonFromToaster;
    toast2.duration ?? durationFromToaster ?? TOAST_LIFETIME$1;
    const coords = position.split("-");
    const toastsHeightBefore = toastState.heights.reduce(
      (prev, curr, reducerIndex) => {
        if (reducerIndex >= heightIndex) return prev;
        return prev + curr.height;
      },
      0
    );
    const invert = toast2.invert || invertFromToaster;
    const disabled = toastType === "loading";
    const classes = { ...defaultClasses, ...classesProp };
    toast2.title;
    toast2.description;
    const offset = Math.round(heightIndex * GAP$1 + toastsHeightBefore);
    function deleteToast() {
      removed = true;
      offsetBeforeRemove = offset;
      toastState.removeHeight(toast2.id);
      setTimeout(
        () => {
          toastState.remove(toast2.id);
        },
        TIME_BEFORE_UNMOUNT
      );
    }
    toast2.promise && toastType === "loading" || toast2.duration === Number.POSITIVE_INFINITY;
    const icon = (() => {
      if (toast2.icon) return toast2.icon;
      if (toastType === "success") return successIcon;
      if (toastType === "error") return errorIcon;
      if (toastType === "warning") return warningIcon;
      if (toastType === "info") return infoIcon;
      if (toastType === "loading") return loadingIcon;
      return null;
    })();
    function LoadingIcon($$renderer3) {
      var _a2, _b2;
      if (loadingIcon) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<div${attr_class(clsx(cn(classes == null ? void 0 : classes.loader, (_a2 = toast2 == null ? void 0 : toast2.classes) == null ? void 0 : _a2.loader, "sonner-loader")))}${attr("data-visible", toastType === "loading")}>`);
        loadingIcon($$renderer3);
        $$renderer3.push(`<!----></div>`);
      } else {
        $$renderer3.push("<!--[!-->");
        Loader($$renderer3, {
          class: cn(classes == null ? void 0 : classes.loader, (_b2 = toast2.classes) == null ? void 0 : _b2.loader),
          visible: toastType === "loading"
        });
      }
      $$renderer3.push(`<!--]-->`);
    }
    $$renderer2.push(`<li${attr("tabindex", 0)}${attr_class(clsx(cn(restProps.class, toastClass, classes == null ? void 0 : classes.toast, (_a = toast2 == null ? void 0 : toast2.classes) == null ? void 0 : _a.toast, classes == null ? void 0 : classes[toastType], (_b = toast2 == null ? void 0 : toast2.classes) == null ? void 0 : _b[toastType])))} data-sonner-toast=""${attr("data-rich-colors", toast2.richColors ?? defaultRichColors)}${attr("data-styled", !(toast2.component || toast2.unstyled || unstyled))}${attr("data-mounted", mounted)}${attr("data-promise", Boolean(toast2.promise))}${attr("data-swiped", isSwiped)}${attr("data-removed", removed)}${attr("data-visible", isVisible)}${attr("data-y-position", coords[0])}${attr("data-x-position", coords[1])}${attr("data-index", index)}${attr("data-front", isFront)}${attr("data-swiping", swiping)}${attr("data-dismissable", dismissable)}${attr("data-type", toastType)}${attr("data-invert", invert)}${attr("data-swipe-out", swipeOut)}${attr("data-swipe-direction", swipeOutDirection)}${attr("data-expanded", Boolean(expanded || expandByDefault && mounted))}${attr_style(`${restProps.style} ${toast2.style}`, {
      "--index": index,
      "--toasts-before": index,
      "--z-index": toastState.toasts.length - index,
      "--offset": `${removed ? offsetBeforeRemove : offset}px`,
      "--initial-height": expandByDefault ? "auto" : `${initialHeight}px`
    })}>`);
    if (closeButton && !toast2.component && toastType !== "loading" && closeIcon !== null) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button${attr("aria-label", closeButtonAriaLabel)}${attr("data-disabled", disabled)} data-close-button=""${attr_class(clsx(cn(classes == null ? void 0 : classes.closeButton, (_c = toast2 == null ? void 0 : toast2.classes) == null ? void 0 : _c.closeButton)))}>`);
      closeIcon == null ? void 0 : closeIcon($$renderer2);
      $$renderer2.push(`<!----></button>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (toast2.component) {
      $$renderer2.push("<!--[-->");
      const Component = toast2.component;
      $$renderer2.push(`<!---->`);
      Component($$renderer2, spread_props([toast2.componentProps, { closeToast: deleteToast }]));
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[!-->");
      if ((toastType || toast2.icon || toast2.promise) && toast2.icon !== null && (icon !== null || toast2.icon)) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div data-icon=""${attr_class(clsx(cn(classes == null ? void 0 : classes.icon, (_d = toast2 == null ? void 0 : toast2.classes) == null ? void 0 : _d.icon)))}>`);
        if (toast2.promise || toastType === "loading") {
          $$renderer2.push("<!--[-->");
          if (toast2.icon) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<!---->`);
            toast2.icon($$renderer2, {});
            $$renderer2.push(`<!---->`);
          } else {
            $$renderer2.push("<!--[!-->");
            LoadingIcon($$renderer2);
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (toast2.type !== "loading") {
          $$renderer2.push("<!--[-->");
          if (toast2.icon) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<!---->`);
            toast2.icon($$renderer2, {});
            $$renderer2.push(`<!---->`);
          } else {
            $$renderer2.push("<!--[!-->");
            if (toastType === "success") {
              $$renderer2.push("<!--[-->");
              successIcon == null ? void 0 : successIcon($$renderer2);
              $$renderer2.push(`<!---->`);
            } else {
              $$renderer2.push("<!--[!-->");
              if (toastType === "error") {
                $$renderer2.push("<!--[-->");
                errorIcon == null ? void 0 : errorIcon($$renderer2);
                $$renderer2.push(`<!---->`);
              } else {
                $$renderer2.push("<!--[!-->");
                if (toastType === "warning") {
                  $$renderer2.push("<!--[-->");
                  warningIcon == null ? void 0 : warningIcon($$renderer2);
                  $$renderer2.push(`<!---->`);
                } else {
                  $$renderer2.push("<!--[!-->");
                  if (toastType === "info") {
                    $$renderer2.push("<!--[-->");
                    infoIcon == null ? void 0 : infoIcon($$renderer2);
                    $$renderer2.push(`<!---->`);
                  } else {
                    $$renderer2.push("<!--[!-->");
                  }
                  $$renderer2.push(`<!--]-->`);
                }
                $$renderer2.push(`<!--]-->`);
              }
              $$renderer2.push(`<!--]-->`);
            }
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div data-content=""><div data-title=""${attr_class(clsx(cn(classes == null ? void 0 : classes.title, (_e = toast2 == null ? void 0 : toast2.classes) == null ? void 0 : _e.title)))}>`);
      if (toast2.title) {
        $$renderer2.push("<!--[-->");
        if (typeof toast2.title !== "string") {
          $$renderer2.push("<!--[-->");
          const Title = toast2.title;
          $$renderer2.push(`<!---->`);
          Title($$renderer2, spread_props([toast2.componentProps]));
          $$renderer2.push(`<!---->`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`${escape_html(toast2.title)}`);
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> `);
      if (toast2.description) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div data-description=""${attr_class(clsx(cn(descriptionClass, toastDescriptionClass, classes == null ? void 0 : classes.description, (_f = toast2.classes) == null ? void 0 : _f.description)))}>`);
        if (typeof toast2.description !== "string") {
          $$renderer2.push("<!--[-->");
          const Description = toast2.description;
          $$renderer2.push(`<!---->`);
          Description($$renderer2, spread_props([toast2.componentProps]));
          $$renderer2.push(`<!---->`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`${escape_html(toast2.description)}`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> `);
      if (toast2.cancel) {
        $$renderer2.push("<!--[-->");
        if (typeof toast2.cancel === "function") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<!---->`);
          toast2.cancel($$renderer2, {});
          $$renderer2.push(`<!---->`);
        } else {
          $$renderer2.push("<!--[!-->");
          if (isAction(toast2.cancel)) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<button data-button="" data-cancel=""${attr_style(toast2.cancelButtonStyle ?? cancelButtonStyle)}${attr_class(clsx(cn(classes == null ? void 0 : classes.cancelButton, (_g = toast2 == null ? void 0 : toast2.classes) == null ? void 0 : _g.cancelButton)))}>${escape_html(toast2.cancel.label)}</button>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (toast2.action) {
        $$renderer2.push("<!--[-->");
        if (typeof toast2.action === "function") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<!---->`);
          toast2.action($$renderer2, {});
          $$renderer2.push(`<!---->`);
        } else {
          $$renderer2.push("<!--[!-->");
          if (isAction(toast2.action)) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<button data-button=""${attr_style(toast2.actionButtonStyle ?? actionButtonStyle)}${attr_class(clsx(cn(classes == null ? void 0 : classes.actionButton, (_h = toast2 == null ? void 0 : toast2.classes) == null ? void 0 : _h.actionButton)))}>${escape_html(toast2.action.label)}</button>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></li>`);
  });
}
function SuccessIcon($$renderer) {
  $$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20" data-sonner-success-icon=""><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"></path></svg>`);
}
function ErrorIcon($$renderer) {
  $$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20" data-sonner-error-icon=""><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>`);
}
function WarningIcon($$renderer) {
  $$renderer.push(`<svg viewBox="0 0 64 64" fill="currentColor" height="20" width="20" data-sonner-warning-icon="" xmlns="http://www.w3.org/2000/svg"><path d="M32.427,7.987c2.183,0.124 4,1.165 5.096,3.281l17.936,36.208c1.739,3.66 -0.954,8.585 -5.373,8.656l-36.119,0c-4.022,-0.064 -7.322,-4.631 -5.352,-8.696l18.271,-36.207c0.342,-0.65 0.498,-0.838 0.793,-1.179c1.186,-1.375 2.483,-2.111 4.748,-2.063Zm-0.295,3.997c-0.687,0.034 -1.316,0.419 -1.659,1.017c-6.312,11.979 -12.397,24.081 -18.301,36.267c-0.546,1.225 0.391,2.797 1.762,2.863c12.06,0.195 24.125,0.195 36.185,0c1.325,-0.064 2.321,-1.584 1.769,-2.85c-5.793,-12.184 -11.765,-24.286 -17.966,-36.267c-0.366,-0.651 -0.903,-1.042 -1.79,-1.03Z"></path><path d="M33.631,40.581l-3.348,0l-0.368,-16.449l4.1,0l-0.384,16.449Zm-3.828,5.03c0,-0.609 0.197,-1.113 0.592,-1.514c0.396,-0.4 0.935,-0.601 1.618,-0.601c0.684,0 1.223,0.201 1.618,0.601c0.395,0.401 0.593,0.905 0.593,1.514c0,0.587 -0.193,1.078 -0.577,1.473c-0.385,0.395 -0.929,0.593 -1.634,0.593c-0.705,0 -1.249,-0.198 -1.634,-0.593c-0.384,-0.395 -0.576,-0.886 -0.576,-1.473Z"></path></svg>`);
}
function InfoIcon($$renderer) {
  $$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20" data-sonner-info-icon=""><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"></path></svg>`);
}
function CloseIcon($$renderer) {
  $$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-sonner-close-icon=""><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`);
}
const VISIBLE_TOASTS_AMOUNT = 3;
const VIEWPORT_OFFSET = "24px";
const MOBILE_VIEWPORT_OFFSET = "16px";
const TOAST_LIFETIME = 4e3;
const TOAST_WIDTH = 356;
const GAP = 14;
const DARK = "dark";
const LIGHT = "light";
function getOffsetObject(defaultOffset, mobileOffset) {
  const styles = {};
  [defaultOffset, mobileOffset].forEach((offset, index) => {
    const isMobile = index === 1;
    const prefix = isMobile ? "--mobile-offset" : "--offset";
    const defaultValue = isMobile ? MOBILE_VIEWPORT_OFFSET : VIEWPORT_OFFSET;
    function assignAll(offset2) {
      ["top", "right", "bottom", "left"].forEach((key) => {
        styles[`${prefix}-${key}`] = typeof offset2 === "number" ? `${offset2}px` : offset2;
      });
    }
    if (typeof offset === "number" || typeof offset === "string") {
      assignAll(offset);
    } else if (typeof offset === "object") {
      ["top", "right", "bottom", "left"].forEach((key) => {
        const value = offset[key];
        if (value === void 0) {
          styles[`${prefix}-${key}`] = defaultValue;
        } else {
          styles[`${prefix}-${key}`] = typeof value === "number" ? `${value}px` : value;
        }
      });
    } else {
      assignAll(defaultValue);
    }
  });
  return styles;
}
function Toaster($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var _a;
    function getInitialTheme(t3) {
      if (t3 !== "system") return t3;
      if (typeof window !== "undefined") {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
          return DARK;
        }
        return LIGHT;
      }
      return LIGHT;
    }
    let {
      invert = false,
      position = "bottom-right",
      hotkey = ["altKey", "KeyT"],
      expand = false,
      closeButton = false,
      offset = VIEWPORT_OFFSET,
      mobileOffset = MOBILE_VIEWPORT_OFFSET,
      theme = "light",
      richColors = false,
      duration = TOAST_LIFETIME,
      visibleToasts = VISIBLE_TOASTS_AMOUNT,
      toastOptions = {},
      dir = "auto",
      gap = GAP,
      loadingIcon: loadingIconProp,
      successIcon: successIconProp,
      errorIcon: errorIconProp,
      warningIcon: warningIconProp,
      closeIcon: closeIconProp,
      infoIcon: infoIconProp,
      containerAriaLabel = "Notifications",
      class: className,
      closeButtonAriaLabel = "Close toast",
      onblur,
      onfocus,
      onmouseenter,
      onmousemove,
      onmouseleave,
      ondragend,
      onpointerdown,
      onpointerup,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    function getDocumentDirection() {
      if (dir !== "auto") return dir;
      if (typeof window === "undefined") return "ltr";
      if (typeof document === "undefined") return "ltr";
      const dirAttribute = document.documentElement.getAttribute("dir");
      if (dirAttribute === "auto" || !dirAttribute) {
        run(() => dir = window.getComputedStyle(document.documentElement).direction ?? "ltr");
        return dir;
      }
      run(() => dir = dirAttribute);
      return dirAttribute;
    }
    const possiblePositions = Array.from(new Set([
      position,
      ...toastState.toasts.filter((toast2) => toast2.position).map((toast2) => toast2.position)
    ].filter(Boolean)));
    let expanded = false;
    let interacting = false;
    let actualTheme = getInitialTheme(theme);
    const hotkeyLabel = hotkey.join("+").replace(/Key/g, "").replace(/Digit/g, "");
    sonnerContext.set(new SonnerState());
    $$renderer2.push(`<section${attr("aria-label", `${stringify(containerAriaLabel)} ${stringify(hotkeyLabel)}`)}${attr("tabindex", -1)} aria-live="polite" aria-relevant="additions text" aria-atomic="false" class="svelte-nbs0zk">`);
    if (toastState.toasts.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(possiblePositions);
      for (let index = 0, $$length = each_array.length; index < $$length; index++) {
        let position2 = each_array[index];
        const [y2, x] = position2.split("-");
        const offsetObject = getOffsetObject(offset, mobileOffset);
        $$renderer2.push(`<ol${attributes(
          {
            tabindex: -1,
            dir: getDocumentDirection(),
            class: clsx(className),
            "data-sonner-toaster": true,
            "data-sonner-theme": actualTheme,
            "data-y-position": y2,
            "data-x-position": x,
            style: restProps.style,
            ...restProps
          },
          "svelte-nbs0zk",
          void 0,
          {
            "--front-toast-height": `${(_a = toastState.heights[0]) == null ? void 0 : _a.height}px`,
            "--width": `${TOAST_WIDTH}px`,
            "--gap": `${gap}px`,
            "--offset-top": offsetObject["--offset-top"],
            "--offset-right": offsetObject["--offset-right"],
            "--offset-bottom": offsetObject["--offset-bottom"],
            "--offset-left": offsetObject["--offset-left"],
            "--mobile-offset-top": offsetObject["--mobile-offset-top"],
            "--mobile-offset-right": offsetObject["--mobile-offset-right"],
            "--mobile-offset-bottom": offsetObject["--mobile-offset-bottom"],
            "--mobile-offset-left": offsetObject["--mobile-offset-left"]
          }
        )}><!--[-->`);
        const each_array_1 = ensure_array_like(toastState.toasts.filter((toast2) => !toast2.position && index === 0 || toast2.position === position2));
        for (let index2 = 0, $$length2 = each_array_1.length; index2 < $$length2; index2++) {
          let toast2 = each_array_1[index2];
          {
            let successIcon = function($$renderer3) {
              if (successIconProp) {
                $$renderer3.push("<!--[-->");
                successIconProp == null ? void 0 : successIconProp($$renderer3);
                $$renderer3.push(`<!---->`);
              } else {
                $$renderer3.push("<!--[!-->");
                if (successIconProp !== null) {
                  $$renderer3.push("<!--[-->");
                  SuccessIcon($$renderer3);
                } else {
                  $$renderer3.push("<!--[!-->");
                }
                $$renderer3.push(`<!--]-->`);
              }
              $$renderer3.push(`<!--]-->`);
            }, errorIcon = function($$renderer3) {
              if (errorIconProp) {
                $$renderer3.push("<!--[-->");
                errorIconProp == null ? void 0 : errorIconProp($$renderer3);
                $$renderer3.push(`<!---->`);
              } else {
                $$renderer3.push("<!--[!-->");
                if (errorIconProp !== null) {
                  $$renderer3.push("<!--[-->");
                  ErrorIcon($$renderer3);
                } else {
                  $$renderer3.push("<!--[!-->");
                }
                $$renderer3.push(`<!--]-->`);
              }
              $$renderer3.push(`<!--]-->`);
            }, warningIcon = function($$renderer3) {
              if (warningIconProp) {
                $$renderer3.push("<!--[-->");
                warningIconProp == null ? void 0 : warningIconProp($$renderer3);
                $$renderer3.push(`<!---->`);
              } else {
                $$renderer3.push("<!--[!-->");
                if (warningIconProp !== null) {
                  $$renderer3.push("<!--[-->");
                  WarningIcon($$renderer3);
                } else {
                  $$renderer3.push("<!--[!-->");
                }
                $$renderer3.push(`<!--]-->`);
              }
              $$renderer3.push(`<!--]-->`);
            }, infoIcon = function($$renderer3) {
              if (infoIconProp) {
                $$renderer3.push("<!--[-->");
                infoIconProp == null ? void 0 : infoIconProp($$renderer3);
                $$renderer3.push(`<!---->`);
              } else {
                $$renderer3.push("<!--[!-->");
                if (infoIconProp !== null) {
                  $$renderer3.push("<!--[-->");
                  InfoIcon($$renderer3);
                } else {
                  $$renderer3.push("<!--[!-->");
                }
                $$renderer3.push(`<!--]-->`);
              }
              $$renderer3.push(`<!--]-->`);
            }, closeIcon = function($$renderer3) {
              if (closeIconProp) {
                $$renderer3.push("<!--[-->");
                closeIconProp == null ? void 0 : closeIconProp($$renderer3);
                $$renderer3.push(`<!---->`);
              } else {
                $$renderer3.push("<!--[!-->");
                if (closeIconProp !== null) {
                  $$renderer3.push("<!--[-->");
                  CloseIcon($$renderer3);
                } else {
                  $$renderer3.push("<!--[!-->");
                }
                $$renderer3.push(`<!--]-->`);
              }
              $$renderer3.push(`<!--]-->`);
            };
            Toast($$renderer2, {
              index: index2,
              toast: toast2,
              defaultRichColors: richColors,
              duration: (toastOptions == null ? void 0 : toastOptions.duration) ?? duration,
              class: (toastOptions == null ? void 0 : toastOptions.class) ?? "",
              descriptionClass: (toastOptions == null ? void 0 : toastOptions.descriptionClass) || "",
              invert,
              visibleToasts,
              closeButton,
              interacting,
              position: position2,
              style: (toastOptions == null ? void 0 : toastOptions.style) ?? "",
              classes: toastOptions.classes || {},
              unstyled: toastOptions.unstyled ?? false,
              cancelButtonStyle: (toastOptions == null ? void 0 : toastOptions.cancelButtonStyle) ?? "",
              actionButtonStyle: (toastOptions == null ? void 0 : toastOptions.actionButtonStyle) ?? "",
              closeButtonAriaLabel: (toastOptions == null ? void 0 : toastOptions.closeButtonAriaLabel) ?? closeButtonAriaLabel,
              expandByDefault: expand,
              expanded,
              loadingIcon: loadingIconProp,
              successIcon,
              errorIcon,
              warningIcon,
              infoIcon,
              closeIcon,
              $$slots: {
                successIcon: true,
                errorIcon: true,
                warningIcon: true,
                infoIcon: true,
                closeIcon: true
              }
            });
          }
        }
        $$renderer2.push(`<!--]--></ol>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></section>`);
  });
}
function ContactForm($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { onClose } = $$props;
    const contactSchema = z.object({
      name: z.string().min(1, "Name is required").max(255, "Name must be 255 characters or less"),
      email: z.string().regex(/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/, "Email is required"),
      message: z.string().min(10, "Message must be at least 10 characters").max(5e3, "Message must be 5000 characters or less")
    });
    let isSubmitting = false;
    let serverErrors = {};
    const form = createForm(() => ({
      defaultValues: { name: "", email: "", message: "" },
      validators: { onChange: contactSchema, onSubmit: contactSchema },
      onSubmit: async ({ value }) => {
        isSubmitting = true;
        serverErrors = {};
        router.post(route("contact.store"), value, {
          onSuccess: () => {
            form.reset();
            toast.success("Message sent successfully! I'll get back to you soon.");
          },
          onError: (errors) => {
            if (errors && typeof errors === "object") {
              serverErrors = errors;
            }
            toast.error("Failed to send message", {
              description: "Please try again or contact me through other means."
            });
          },
          onFinish: () => {
            isSubmitting = false;
          }
        });
      }
    }));
    $$renderer2.push(`<h2 class="text-xl font-semibold text-text mb-6">Send a Message</h2> <form class="flex flex-col h-full"><div class="flex-1 flex flex-col min-h-0"><div><label for="name" class="block text-sm font-medium text-text-muted mb-1.5">Name</label> <!---->`);
    {
      let children = function($$renderer3, field) {
        var _a;
        $$renderer3.push(`<input type="text" id="name"${attr("name", field.name)}${attr("value", field.state.value)} class="w-full px-3 py-2 bg-bg border border-border rounded-md text-text placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" placeholder="Your name"/> <div class="min-h-5 mt-1 mb-3 form-hint">`);
        if (field.state.meta.isBlurred && field.state.meta.errors && field.state.meta.errors.length > 0) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<p class="text-sm text-red-400">${escape_html((_a = field.state.meta.errors[0]) == null ? void 0 : _a.message)}</p>`);
        } else {
          $$renderer3.push("<!--[!-->");
          if (serverErrors.name) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<p class="text-sm text-red-400">${escape_html(serverErrors.name)}</p>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]-->`);
        }
        $$renderer3.push(`<!--]--></div>`);
      };
      form.Field($$renderer2, { name: "name", children, $$slots: { default: true } });
    }
    $$renderer2.push(`<!----></div> <div><label for="email" class="block text-sm font-medium text-text-muted mb-1.5">Email</label> <!---->`);
    {
      let children = function($$renderer3, field) {
        var _a;
        $$renderer3.push(`<input type="email" id="email"${attr("name", field.name)}${attr("value", field.state.value)} class="w-full px-3 py-2 bg-bg border border-border rounded-md text-text placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" placeholder="you@example.com"/> <div class="min-h-5 mt-1 mb-3 form-hint">`);
        if (field.state.meta.isBlurred && field.state.meta.errors && field.state.meta.errors.length > 0) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<p class="text-sm text-red-400">${escape_html((_a = field.state.meta.errors[0]) == null ? void 0 : _a.message)}</p>`);
        } else {
          $$renderer3.push("<!--[!-->");
          if (serverErrors.email) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<p class="text-sm text-red-400">${escape_html(serverErrors.email)}</p>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]-->`);
        }
        $$renderer3.push(`<!--]--></div>`);
      };
      form.Field($$renderer2, { name: "email", children, $$slots: { default: true } });
    }
    $$renderer2.push(`<!----></div> <div class="flex-1 flex flex-col min-h-0"><label for="message" class="block text-sm font-medium text-text-muted mb-1.5">Message</label> <!---->`);
    {
      let children = function($$renderer3, field) {
        var _a;
        $$renderer3.push(`<textarea id="message"${attr("name", field.name)} rows="6" class="w-full flex-1 min-h-[120px] px-3 py-2 bg-bg border border-border rounded-md text-text placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none" placeholder="Your message...">`);
        const $$body = escape_html(field.state.value);
        if ($$body) {
          $$renderer3.push(`${$$body}`);
        }
        $$renderer3.push(`</textarea> <div class="min-h-5 mt-1 mb-3 form-hint">`);
        if (field.state.meta.isBlurred && field.state.meta.errors && field.state.meta.errors.length > 0) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<p class="text-sm text-red-400">${escape_html((_a = field.state.meta.errors[0]) == null ? void 0 : _a.message)}</p>`);
        } else {
          $$renderer3.push("<!--[!-->");
          if (serverErrors.message) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<p class="text-sm text-red-400">${escape_html(serverErrors.message)}</p>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]-->`);
        }
        $$renderer3.push(`<!--]--></div>`);
      };
      form.Field($$renderer2, { name: "message", children, $$slots: { default: true } });
    }
    $$renderer2.push(`<!----></div></div> <div class="flex gap-3 pt-2"><button type="button" class="flex-1 px-4 py-2 border border-border rounded-md text-text-muted hover:text-text hover:border-text-muted transition-colors cursor-pointer"${attr("disabled", isSubmitting, true)}>Cancel</button> <button type="submit" class="flex-1 px-4 py-2 bg-accent text-bg rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer relative"${attr("disabled", isSubmitting, true)}>`);
    if (isSubmitting) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center justify-center"><div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div> Sending</div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`Send`);
    }
    $$renderer2.push(`<!--]--></button></div></form>`);
  });
}
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ContactForm
}, Symbol.toStringTag, { value: "Module" }));
function CopyButton($$renderer, $$props) {
  let { text } = $$props;
  $$renderer.push(`<button class="ml-auto text-xs text-text-muted hover:text-accent transition-colors cursor-pointer">${escape_html("Copy")}</button>`);
}
function Blog($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      posts,
      cvDownloadUrl = null,
      contactCardQrCode = "",
      cvPdfQrCode = "",
      showBlogLink = true
    } = $$props;
    let allPosts = Object.values(posts).flat();
    let showContactForm = false;
    async function handleEmailClick(e2) {
      const target = e2.currentTarget;
      const rect = target.getBoundingClientRect();
      ({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      showContactForm = true;
      await tick();
    }
    function handleFormClose() {
      {
        showContactForm = false;
      }
    }
    head("1hes2ph", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Blog - Stefan Olivier</title>`);
      });
      $$renderer3.push(`<meta name="description" content="Read my latest blog posts about software development, programming, and technology."/>`);
    });
    Toaster($$renderer2, {
      position: "top-center",
      theme: "dark",
      richColors: true,
      closeButton: true,
      toastOptions: {
        classes: {
          success: "toast-success",
          error: "toast-error",
          warning: "toast-warning",
          info: "toast-info"
        }
      }
    });
    $$renderer2.push(`<!----> `);
    if (showContactForm) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="fixed inset-0 z-50"></div> <div class="fixed inset-0 z-[60]"><button type="button" class="absolute top-6 left-6 text-text-muted hover:text-text transition-colors cursor-pointer">`);
      Fa($$renderer2, { icon: faXmark, class: "text-3xl" });
      $$renderer2.push(`<!----></button> <div class="flex items-center justify-center h-full p-4"><div class="bg-bg border border-border rounded-lg p-6 w-full max-w-4xl shadow-xl flex flex-col"><div class="flex flex-col md:flex-row h-full gap-8"><div class="flex-1 md:flex-[2] flex flex-col">`);
      ContactForm($$renderer2, { onClose: handleFormClose });
      $$renderer2.push(`<!----></div> <div class="hidden md:flex flex-1 flex-col border-l border-border pl-8 justify-between"><div><h2 class="contact-detail text-xl font-semibold text-text mb-6">Contact</h2> <div class="space-y-4"><div class="flex items-center"><a${attr("href", Bio.contact.Phone.src)} class="contact-detail flex items-center gap-3 text-text-muted hover:text-accent transition-colors">`);
      Fa($$renderer2, { icon: faPhone, class: "text-lg w-5" });
      $$renderer2.push(`<!----> <span>${escape_html(Bio.contact.Phone.displayName)}</span></a> `);
      CopyButton($$renderer2, { text: Bio.contact.Phone.displayName });
      $$renderer2.push(`<!----></div> <div class="flex items-center"><a${attr("href", Bio.contact.Email.src)} class="contact-detail flex items-center gap-3 text-text-muted hover:text-accent transition-colors">`);
      Fa($$renderer2, { icon: faEnvelope, class: "text-lg w-5" });
      $$renderer2.push(`<!----> <span>${escape_html(Bio.contact.Email.displayName)}</span></a> `);
      CopyButton($$renderer2, { text: Bio.contact.Email.displayName });
      $$renderer2.push(`<!----></div> <div class="flex items-center"><a${attr("href", Bio.contact.GitHub.src)} target="_blank" rel="noopener noreferrer" class="contact-detail flex items-center gap-3 text-text-muted hover:text-accent transition-colors">`);
      Fa($$renderer2, { icon: faGithub, class: "text-lg w-5" });
      $$renderer2.push(`<!----> <span>${escape_html(Bio.contact.GitHub.displayName)}</span></a> `);
      CopyButton($$renderer2, { text: Bio.contact.GitHub.src });
      $$renderer2.push(`<!----></div> <div class="flex items-center"><a${attr("href", Bio.contact.LinkedIn.src)} target="_blank" rel="noopener noreferrer" class="contact-detail flex items-center gap-3 text-text-muted hover:text-accent transition-colors">`);
      Fa($$renderer2, { icon: faLinkedin, class: "text-lg w-5" });
      $$renderer2.push(`<!----> <span>${escape_html(Bio.contact.LinkedIn.displayName)}</span></a> `);
      CopyButton($$renderer2, { text: Bio.contact.LinkedIn.src });
      $$renderer2.push(`<!----></div> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (contactCardQrCode && cvPdfQrCode) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="qr-code pt-4 mt-4 border-t border-border"><div class="flex gap-2 mb-3"><button type="button"${attr_class(`qr-code flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${stringify(
          "bg-accent text-bg"
        )}`)}>`);
        Fa($$renderer2, { icon: faAddressCard, class: "text-xs" });
        $$renderer2.push(`<!----> Contact</button> <button type="button"${attr_class(`qr-code flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${stringify("bg-bg text-text-muted hover:text-text")}`)}>`);
        Fa($$renderer2, { icon: faFilePdf, class: "text-xs" });
        $$renderer2.push(`<!----> Download CV</button></div> `);
        {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<img${attr("src", contactCardQrCode)} alt="Contact QR Code" class="qr-code rounded-md border border-border w-full"/>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div></div></div></div> <div class="md:hidden flex flex-row gap-4 justify-center pt-6 mt-6 border-t border-border"><div class="flex flex-row items-center"><a${attr("href", Bio.contact.Phone.src)} class="contact-detail text-text-muted hover:text-accent transition-colors text-sm">${escape_html(Bio.contact.Phone.displayName)}</a></div> <div class="flex flex-row items-center"><a${attr("href", Bio.contact.Email.src)} class="contact-detail text-text-muted hover:text-accent transition-colors text-sm">${escape_html(Bio.contact.Email.displayName)}</a></div> <div class="flex flex-row items-center"><a${attr("href", Bio.contact.GitHub.src)} target="_blank" rel="noopener noreferrer" class="contact-detail text-text-muted hover:text-accent transition-colors">`);
      Fa($$renderer2, { icon: faGithub, class: "text-lg" });
      $$renderer2.push(`<!----></a></div> <div class="flex flex-row items-center"><a${attr("href", Bio.contact.LinkedIn.src)} target="_blank" rel="noopener noreferrer" class="contact-detail text-text-muted hover:text-accent transition-colors">`);
      Fa($$renderer2, { icon: faLinkedin, class: "text-lg" });
      $$renderer2.push(`<!----></a></div> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div></div></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="min-h-screen bg-bg flex flex-col">`);
    Header($$renderer2, { onEmailClick: handleEmailClick, cvDownloadUrl, showBlogLink });
    $$renderer2.push(`<!----> <main class="flex-1 pt-20 h-full"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">`);
    if (Object.keys(posts).length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<header class="mb-12"><h1 class="text-4xl font-bold text-text mb-4">Blog</h1> <p class="text-lg text-text-muted">Thoughts on software development, programming, and technology.</p></header>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="lg:grid lg:grid-cols-12 lg:gap-8"><main${attr_class(Object.keys(posts).length === 0 ? "lg:col-span-12" : "lg:col-span-8")}>`);
    if (Object.keys(posts).length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex flex-col items-center justify-center py-16 text-center"><div class="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center mb-4"><span class="text-3xl">📝</span></div> <h3 class="text-lg font-medium text-text mb-2">No blog posts yet</h3> <p class="text-text-muted max-w-md">Nothing interesting here, yet. Check back soon for thoughts on software development, programming, and technology.</p></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(Object.entries(posts));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let [month, monthPosts] = each_array[$$index];
        MonthGroup($$renderer2, { month, posts: monthPosts });
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></main> `);
    if (Object.keys(posts).length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<aside class="hidden lg:block lg:col-span-4 lg:pl-8"><div class="sticky top-24"><div class="bg-bg border border-border rounded-lg p-4"><h3 class="font-semibold text-text mb-4">Recent Posts</h3> <div class="divide-y divide-border"><!--[-->`);
      const each_array_1 = ensure_array_like(allPosts.slice(0, 5));
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let post = each_array_1[$$index_1];
        BlogPostItem($$renderer2, { post });
      }
      $$renderer2.push(`<!--]--></div></div></div></aside>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div></main> `);
    Footer($$renderer2, { class: "mx-4 md:mx-6 lg:mx-12", cvDownloadUrl });
    $$renderer2.push(`<!----></div>`);
  });
}
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Blog
}, Symbol.toStringTag, { value: "Module" }));
function CoverImage($$renderer, $$props) {
  const gridSize = 32;
  const { html: html$1, width, height } = $$props;
  const verticalLines = Array.from({ length: Math.floor(width / gridSize) + 1 }, (_, i2) => i2 * gridSize);
  const horizontalLines = Array.from({ length: Math.floor(height / gridSize) + 1 }, (_, i2) => i2 * gridSize);
  $$renderer.push(`<main class="absolute top-0 left-0 w-full h-full bg-radial from-[#2a352a] to-[#1f2a1f]"><div class="relative flex w-full h-full justify-center items-center gap-2 text-[#e8e8e8] text-[96px] font-bold"><svg class="absolute top-0 left-0"${attr("width", width)}${attr("height", height)} xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="radial-mask" cx="50%" cy="50%" r="50%"><stop offset="50%" stop-color="#1a1f1a" stop-opacity="1"></stop><stop offset="100%" stop-color="#1a1f1a" stop-opacity="0"></stop></radialGradient><mask id="mask"><rect${attr("width", width)}${attr("height", height)} fill="url(#radial-mask)"></rect></mask></defs><g mask="url(#mask)"><!--[-->`);
  const each_array = ensure_array_like(verticalLines);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let x = each_array[$$index];
    $$renderer.push(`<line${attr("x1", x)}${attr("y1", 0)}${attr("x2", x)}${attr("y2", height)} stroke="#ccc" stroke-width="0.5"></line>`);
  }
  $$renderer.push(`<!--]--><!--[-->`);
  const each_array_1 = ensure_array_like(horizontalLines);
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let y2 = each_array_1[$$index_1];
    $$renderer.push(`<line${attr("x1", 0)}${attr("y1", y2)}${attr("x2", width)}${attr("y2", y2)} stroke="#ccc" stroke-width="0.5"></line>`);
  }
  $$renderer.push(`<!--]--></g></svg> ${html(html$1)}</div></main>`);
}
const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CoverImage
}, Symbol.toStringTag, { value: "Module" }));
function CoverLetter($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { coverLetter } = $$props;
    function getValue(key) {
      return coverLetter.content[key];
    }
    function getString(key) {
      const val = getValue(key);
      return typeof val === "string" ? val : "";
    }
    function getArray(key) {
      const val = getValue(key);
      return Array.isArray(val) ? val : [];
    }
    $$renderer2.push(`<div class="min-h-screen bg-white text-gray-900 print:p-0"><div class="max-w-[210mm] mx-auto p-8 print:p-6 print:max-w-none">`);
    if (getValue("date")) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="text-sm text-gray-600 mb-6 print:mb-4">${escape_html(getString("date"))}</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (getValue("recipient_name") || getValue("recipient_title") || getValue("recipient_company")) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<header class="border-b border-gray-300 print:pb-4 print:mb-4">`);
      if (getValue("recipient_name")) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-lg font-medium text-gray-900">${escape_html(getString("recipient_name"))}</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (getValue("recipient_title")) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-sm text-gray-600">${escape_html(getString("recipient_title"))}</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (getValue("recipient_company")) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-sm text-gray-600">${escape_html(getString("recipient_company"))}</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (getValue("recipient_address")) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-sm text-gray-600">${escape_html(getString("recipient_address"))}</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></header>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (getValue("salutation")) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="mb-6 print:mb-4"><p class="print:text-xs text-gray-700">Dear ${escape_html(getString("salutation"))},</p></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      if (getValue("recipient_name")) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="mb-6 print:mb-4"><p class="print:text-xs text-gray-700">Dear ${escape_html(getString("recipient_name"))},</p></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--> `);
    if (getArray("paragraphs").length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="space-y-6 print:space-y-4"><!--[-->`);
      const each_array = ensure_array_like(getArray("paragraphs"));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let paragraph = each_array[$$index];
        $$renderer2.push(`<p class="text-gray-700 leading-relaxed text-sm print:text-xs">${escape_html(paragraph)}</p>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      if (getArray("body").length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="space-y-6 print:space-y-4"><!--[-->`);
        const each_array_1 = ensure_array_like(getArray("body"));
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let paragraph = each_array_1[$$index_1];
          $$renderer2.push(`<p class="text-gray-700 leading-relaxed text-sm print:text-xs">${escape_html(paragraph)}</p>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--> `);
    if (getValue("closing") || getValue("sender_name")) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="print:text-xs mt-10 print:mt-8">`);
      if (getValue("closing")) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-gray-700">${escape_html(getString("closing"))},</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (getValue("sender_name")) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-gray-700 mt-2">${escape_html(getString("sender_name"))}</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (getValue("sender_title")) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-gray-700">${escape_html(getString("sender_title"))}</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (getValue("sender_phone")) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-gray-700">${escape_html(getString("sender_phone"))}</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (getValue("sender_email")) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-gray-700"><a${attr("href", `mailto:${stringify(getString("sender_email"))}`)} class="hover:text-gray-900 print:text-gray-700">${escape_html(getString("sender_email"))}</a></p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
const __vite_glob_0_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CoverLetter
}, Symbol.toStringTag, { value: "Module" }));
function Cv($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { cv } = $$props;
    function formatRange(start, end) {
      const startFormatted = formatDate(start, "MMM y");
      const endFormatted = end ? formatDate(end, "MMM y") : "Present";
      return `${startFormatted} - ${endFormatted}`;
    }
    function getExternalLinkIcon(iconKey) {
      switch (iconKey.toLowerCase()) {
        case "linkedin":
          return faLinkedin;
        case "github":
          return faGithub;
        case "globe":
          return faGlobe;
        default:
          return faLink;
      }
    }
    $$renderer2.push(`<div class="min-h-screen bg-white text-gray-900 print:p-0"><div class="max-w-[210mm] mx-auto p-8 print:p-6 print:max-w-none"><header class="border-b border-gray-300 pb-6 mb-6 print:pb-4 print:mb-4"><div class="flex justify-between"><div><h1 class="text-3xl font-bold text-gray-900 print:text-2xl">${escape_html(cv.content.name)}</h1> `);
    if (cv.content.title) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="text-xl text-gray-600 mt-1 print:text-lg">${escape_html(cv.content.title)}</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="flex flex-wrap gap-4 mt-3 text-sm text-gray-600 print:gap-3 print:text-xs">`);
    if (cv.content.email) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<a${attr("href", `mailto:${stringify(cv.content.email)}`)} class="hover:text-gray-900 print:text-gray-600">${escape_html(cv.content.email)}</a>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (cv.content.phone) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<a${attr("href", `tel:${stringify(cv.content.phone)}`)} class="hover:text-gray-900 print:text-gray-600">${escape_html(cv.content.phone)}</a>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (cv.content.location) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="print:text-gray-600">${escape_html(cv.content.location)}</span>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if (cv.content.status && cv.content.status.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex flex-wrap gap-2 mt-2"><!--[-->`);
      const each_array = ensure_array_like(cv.content.status);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let status = each_array[$$index];
        $$renderer2.push(`<span class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary print:bg-primary/5 print:text-primary">${escape_html(status)}</span>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (cv.content.externalLinks && cv.content.externalLinks.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 print:gap-3 print:text-xs"><!--[-->`);
      const each_array_1 = ensure_array_like(cv.content.externalLinks);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let link = each_array_1[$$index_1];
        $$renderer2.push(`<a${attr("href", link.url)} target="_blank" rel="noopener noreferrer" class="flex items-center gap-1 hover:text-gray-900 print:text-gray-600">`);
        Fa($$renderer2, { icon: getExternalLinkIcon(link.icon), class: "w-4 h-4" });
        $$renderer2.push(`<!----> <span>${escape_html(link.label)}</span></a>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (cv.content.auxiliaryItems && cv.content.auxiliaryItems.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex flex-wrap gap-2 mt-4"><!--[-->`);
      const each_array_2 = ensure_array_like(cv.content.auxiliaryItems);
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let item = each_array_2[$$index_2];
        $$renderer2.push(`<span class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700 print:bg-gray-50 print:text-gray-600">${escape_html(item)}</span>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <img${attr("src", Bio.portraitUrl)} class="rounded-full w-40 h-40 object-cover" alt="portrait image"/></div></header> `);
    if (cv.content.summary) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<section class="mb-6 print:mb-4"><h2 class="text-lg font-semibold text-gray-900 mb-2 print:text-base">Summary</h2> <p class="text-gray-700 text-sm leading-relaxed print:text-xs">${escape_html(cv.content.summary)}</p></section>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (cv.content.experience.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<section class="mb-6 print:mb-4"><h2 class="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1 print:text-base print:mb-2">Experience</h2> <div class="space-y-4 print:space-y-3"><!--[-->`);
      const each_array_3 = ensure_array_like(cv.content.experience);
      for (let $$index_4 = 0, $$length = each_array_3.length; $$index_4 < $$length; $$index_4++) {
        let exp = each_array_3[$$index_4];
        $$renderer2.push(`<div class="print:break-inside-avoid"><div class="flex justify-between items-start"><div><h3 class="font-semibold text-gray-900 print:text-sm">${escape_html(exp.position)}</h3> <p class="text-gray-600 text-sm print:text-xs">${escape_html(exp.company)}</p></div> <span class="text-sm text-gray-500 print:text-xs">${escape_html(formatRange(exp.startDate, exp.endDate))}</span></div> <p class="text-gray-700 text-sm mt-2 print:text-xs">${escape_html(exp.description)}</p> `);
        if (exp.highlights && exp.highlights.length > 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<ul class="list-disc pl-2 ml-4 text-sm text-gray-700 mt-2 print:text-xs"><!--[-->`);
          const each_array_4 = ensure_array_like(exp.highlights);
          for (let $$index_3 = 0, $$length2 = each_array_4.length; $$index_3 < $$length2; $$index_3++) {
            let highlight = each_array_4[$$index_3];
            $$renderer2.push(`<li class="print:my-0.5">${escape_html(highlight)}</li>`);
          }
          $$renderer2.push(`<!--]--></ul>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--></div></section>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (cv.content.education.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<section class="mb-6 print:mb-4"><h2 class="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1 print:text-base print:mb-2">Education</h2> <div class="space-y-3 print:space-y-2"><!--[-->`);
      const each_array_5 = ensure_array_like(cv.content.education);
      for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
        let edu = each_array_5[$$index_5];
        $$renderer2.push(`<div class="print:break-inside-avoid"><div class="flex justify-between items-start"><div><h3 class="font-semibold text-gray-900 print:text-sm">${escape_html(edu.degree)}</h3> <p class="text-gray-600 text-sm print:text-xs">${escape_html(edu.institution)} - ${escape_html(edu.field)}</p></div> <span class="text-sm text-gray-500 print:text-xs">${escape_html(formatRange(edu.startDate, edu.endDate))}</span></div></div>`);
      }
      $$renderer2.push(`<!--]--></div></section>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (cv.content.skills.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<section class="print:break-inside-avoid"><h2 class="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1 print:text-base print:mb-2">Skills</h2> <div class="flex flex-wrap gap-2"><!--[-->`);
      const each_array_6 = ensure_array_like(cv.content.skills);
      for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
        let skill = each_array_6[$$index_6];
        $$renderer2.push(`<span class="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded print:text-xs print:px-1.5 print:py-0.5">${escape_html(skill)}</span>`);
      }
      $$renderer2.push(`<!--]--></div></section>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (cv.content.projects && cv.content.projects.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<section class="mb-6 print:mb-4"><h2 class="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1 print:text-base print:mb-2">Projects</h2> <div class="space-y-4 print:space-y-3"><!--[-->`);
      const each_array_7 = ensure_array_like(cv.content.projects);
      for (let $$index_8 = 0, $$length = each_array_7.length; $$index_8 < $$length; $$index_8++) {
        let project = each_array_7[$$index_8];
        $$renderer2.push(`<div class="print:break-inside-avoid"><h3 class="font-semibold text-gray-900 print:text-sm">${escape_html(project.name)}</h3> `);
        if (project.description) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<p class="text-gray-700 text-sm mt-1 print:text-xs">${escape_html(project.description)}</p>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (project.technologies && project.technologies.length > 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="flex flex-wrap gap-1 mt-2 print:mt-1"><!--[-->`);
          const each_array_8 = ensure_array_like(project.technologies);
          for (let $$index_7 = 0, $$length2 = each_array_8.length; $$index_7 < $$length2; $$index_7++) {
            let tech = each_array_8[$$index_7];
            $$renderer2.push(`<span class="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded print:text-xs print:px-1 print:py-0.5">${escape_html(tech)}</span>`);
          }
          $$renderer2.push(`<!--]--></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (project.link) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<a${attr("href", project.link)} target="_blank" rel="noopener noreferrer" class="mt-2 inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-500 print:text-xs print:mt-1">`);
          Fa($$renderer2, { icon: faGlobe, class: "w-3 h-3" });
          $$renderer2.push(`<!----> View Project</a>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (project.startDate || project.endDate) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<p class="mt-2 text-sm text-gray-500 print:text-xs print:mt-1">`);
          if (project.startDate) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`${escape_html(formatDate(project.startDate, "MMM y"))}`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--> `);
          if (project.startDate && project.endDate) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`-`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--> `);
          if (project.endDate) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`${escape_html(project.endDate ? formatDate(project.endDate, "MMM y") : "Present")}`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></p>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--></div></section>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
const __vite_glob_0_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Cv
}, Symbol.toStringTag, { value: "Module" }));
function FeaturedItemCard($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { item } = $$props;
    function getSourceIcon(sourceType) {
      switch (sourceType) {
        case "github":
          return faGithub;
        default:
          return faArrowUpRightFromSquare;
      }
    }
    $$renderer2.push(`<a${attr("href", item.linkUrl)} target="_blank" rel="noopener noreferrer" class="block group bg-bg border border-border rounded-lg overflow-hidden hover:border-accent/50 transition-colors">`);
    if (item.imageUrl) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="aspect-video bg-border overflow-hidden"><img${attr("src", item.imageUrl)}${attr("alt", item.title)} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="aspect-video bg-border flex items-center justify-center">`);
      Fa($$renderer2, {
        icon: getSourceIcon(item.sourceType),
        class: "text-4xl text-text-muted/50"
      });
      $$renderer2.push(`<!----></div>`);
    }
    $$renderer2.push(`<!--]--> <div class="p-4"><h3 class="font-semibold text-lg text-text mb-1 line-clamp-1">${escape_html(item.title)}</h3> <p class="text-sm text-text-muted mb-3 line-clamp-2">${escape_html(item.description)}</p> <span class="inline-flex items-center gap-2 text-sm text-accent"><span>${escape_html(item.linkText)}</span> `);
    Fa($$renderer2, { icon: faArrowUpRightFromSquare, class: "text-xs" });
    $$renderer2.push(`<!----></span></div></a>`);
  });
}
function SocialLinks($$renderer, $$props) {
  let {
    variant,
    class: className = ""
  } = $$props;
  const baseClasses = "flex gap-4 sm:gap-5 transition-opacity duration-300";
  const variantClasses = {
    "sticky-top": "fixed top-6 right-6 z-40",
    "bottom": "justify-end relative z-30"
  };
  $$renderer.push(`<div${attr_class(`${stringify(baseClasses)} ${stringify(variantClasses[variant])} ${stringify(className)}`)}><a${attr("href", Bio.contact.GitHub.src)} target="_blank" rel="noopener noreferrer" class="text-text-muted hover:text-accent transition-colors">`);
  Fa($$renderer, { icon: faGithub, size: "lg" });
  $$renderer.push(`<!----></a> <a${attr("href", Bio.contact.LinkedIn.src)} target="_blank" rel="noopener noreferrer" class="text-text-muted hover:text-accent transition-colors">`);
  Fa($$renderer, { icon: faLinkedin, size: "lg" });
  $$renderer.push(`<!----></a> `);
  {
    $$renderer.push("<!--[!-->");
  }
  $$renderer.push(`<!--]--> <button type="button" class="text-text-muted hover:text-accent transition-colors cursor-pointer">`);
  Fa($$renderer, { icon: faEnvelope, size: "lg" });
  $$renderer.push(`<!----></button></div>`);
}
function Homepage($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      featuredItems = [],
      cvDownloadUrl = null,
      contactCardQrCode = "",
      cvPdfQrCode = "",
      showBlogLink = true
    } = $$props;
    let showContactForm = false;
    async function handleEmailClick(e2) {
      const target = e2.currentTarget;
      const rect = target.getBoundingClientRect();
      ({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      showContactForm = true;
      await tick();
    }
    function handleFormClose() {
      {
        showContactForm = false;
      }
    }
    head("1pj6qmx", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Stefan Olivier</title>`);
      });
    });
    $$renderer2.push(`<div class="min-h-screen flex flex-col px-6 md:px-8 lg:px-12">`);
    if (featuredItems.length > 0) {
      $$renderer2.push("<!--[-->");
      Header($$renderer2, { onEmailClick: handleEmailClick, cvDownloadUrl, showBlogLink });
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <main class="flex-1 flex flex-col items-center justify-center mt-6 md:mt-8 lg:mt-12"><div class="flex flex-col items-center text-center justify-center"><div${attr_class(clsx(cn$1("flex flex-col sm:flex-row items-center gap-6 sm:gap-8 lg:gap-10", { "my-12 md:my-24": featuredItems.length > 0 })))}><div class="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-border flex-shrink-0 ring-2 ring-border z-10"><img src="https://stefanolivier.imgix.net/img/owlsh.jpg" alt="Avatar" class="w-full h-full object-cover"/></div> <div class="flex flex-col items-center sm:items-start text-center sm:text-left z-10"><h1 class="font-semibold text-4xl sm:text-5xl lg:text-6xl text-text tracking-tight">${escape_html(Bio.name)}</h1> <p class="text-base sm:text-lg lg:text-xl text-text-muted mt-1 sm:mt-1.5">${escape_html(Bio.occupation)}</p></div></div> `);
    if (featuredItems.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<section class="w-full max-w-4xl"><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`);
      const each_array = ensure_array_like(featuredItems);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let item = each_array[$$index];
        FeaturedItemCard($$renderer2, { item });
      }
      $$renderer2.push(`<!--]--></div></section>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></main> `);
    if (featuredItems.length > 0) {
      $$renderer2.push("<!--[-->");
      Footer($$renderer2, { class: "mt-16", cvDownloadUrl });
    } else {
      $$renderer2.push("<!--[!-->");
      SocialLinks($$renderer2, {
        class: "mb-8",
        variant: "bottom"
      });
    }
    $$renderer2.push(`<!--]--></div> `);
    if (showContactForm) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="fixed inset-0 z-50"></div> <div class="fixed inset-0 z-[60]"><button type="button" class="absolute top-6 left-6 text-text-muted hover:text-text transition-colors cursor-pointer">`);
      Fa($$renderer2, { icon: faXmark, class: "text-3xl" });
      $$renderer2.push(`<!----></button> <div class="flex items-center justify-center h-full p-4"><div class="bg-bg border border-border rounded-lg p-6 w-full max-w-4xl shadow-xl flex flex-col"><div class="flex flex-col md:flex-row h-full gap-8"><div class="flex-1 md:flex-[2] flex flex-col">`);
      ContactForm($$renderer2, { onClose: handleFormClose });
      $$renderer2.push(`<!----></div> <div class="hidden md:flex flex-1 flex-col border-l border-border pl-8 justify-between"><div><h2 class="contact-detail text-xl font-semibold text-text mb-6">Contact</h2> <div class="space-y-4"><div class="flex items-center"><a${attr("href", Bio.contact.Phone.src)} class="contact-detail flex items-center gap-3 text-text-muted hover:text-accent transition-colors">`);
      Fa($$renderer2, { icon: Bio.contact.Phone.icon, class: "text-lg w-5" });
      $$renderer2.push(`<!----> <span>${escape_html(Bio.contact.Phone.displayName)}</span></a> `);
      CopyButton($$renderer2, { text: Bio.contact.Phone.displayName });
      $$renderer2.push(`<!----></div> <div class="flex items-center"><a${attr("href", Bio.contact.Email.src)} class="contact-detail flex items-center gap-3 text-text-muted hover:text-accent transition-colors">`);
      Fa($$renderer2, { icon: Bio.contact.Email.icon, class: "text-lg w-5" });
      $$renderer2.push(`<!----> <span>${escape_html(Bio.contact.Email.displayName)}</span></a> `);
      CopyButton($$renderer2, { text: Bio.contact.Email.displayName });
      $$renderer2.push(`<!----></div> <div class="flex items-center"><a${attr("href", Bio.contact.GitHub.src)} target="_blank" rel="noopener noreferrer" class="contact-detail flex items-center gap-3 text-text-muted hover:text-accent transition-colors">`);
      Fa($$renderer2, { icon: Bio.contact.GitHub.icon, class: "text-lg w-5" });
      $$renderer2.push(`<!----> <span>${escape_html(Bio.contact.GitHub.displayName)}</span></a> `);
      CopyButton($$renderer2, { text: Bio.contact.GitHub.src });
      $$renderer2.push(`<!----></div> <div class="flex items-center"><a${attr("href", Bio.contact.LinkedIn.src)} target="_blank" rel="noopener noreferrer" class="contact-detail flex items-center gap-3 text-text-muted hover:text-accent transition-colors">`);
      Fa($$renderer2, { icon: Bio.contact.LinkedIn.icon, class: "text-lg w-5" });
      $$renderer2.push(`<!----> <span>${escape_html(Bio.contact.LinkedIn.displayName)}</span></a> `);
      CopyButton($$renderer2, { text: Bio.contact.LinkedIn.src });
      $$renderer2.push(`<!----></div> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (contactCardQrCode && cvPdfQrCode) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="qr-code pt-4 mt-4 border-t border-border"><div class="flex gap-2 mb-3"><button type="button"${attr_class(`qr-code flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${stringify(
          "bg-accent text-bg"
        )}`)}>`);
        Fa($$renderer2, { icon: faAddressCard, class: "text-xs" });
        $$renderer2.push(`<!----> Contact</button> `);
        {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div> `);
        {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<img${attr("src", contactCardQrCode)} alt="Contact QR Code" class="qr-code rounded-md border border-border w-full"/>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div></div></div></div> <div class="md:hidden flex flex-row gap-4 justify-center pt-6 mt-6 border-t border-border"><div class="flex flex-row items-center"><a${attr("href", Bio.contact.Phone.src)} class="contact-detail text-text-muted hover:text-accent transition-colors text-sm">${escape_html(Bio.contact.Phone.displayName)}</a></div> <div class="flex flex-row items-center"><a${attr("href", Bio.contact.Email.src)} class="contact-detail text-text-muted hover:text-accent transition-colors text-sm">${escape_html(Bio.contact.Email.displayName)}</a></div> <div class="flex flex-row items-center"><a${attr("href", Bio.contact.GitHub.src)} target="_blank" rel="noopener noreferrer" class="contact-detail text-text-muted hover:text-accent transition-colors">`);
      Fa($$renderer2, { icon: Bio.contact.GitHub.icon, class: "text-lg" });
      $$renderer2.push(`<!----></a></div> <div class="flex flex-row items-center"><a${attr("href", Bio.contact.LinkedIn.src)} target="_blank" rel="noopener noreferrer" class="contact-detail text-text-muted hover:text-accent transition-colors">`);
      Fa($$renderer2, { icon: Bio.contact.LinkedIn.icon, class: "text-lg" });
      $$renderer2.push(`<!----></a></div> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div></div></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    Toaster($$renderer2, {
      position: "top-center",
      theme: "dark",
      richColors: true,
      closeButton: true,
      toastOptions: {
        classes: {
          success: "toast-success",
          error: "toast-error",
          warning: "toast-warning",
          info: "toast-info"
        }
      }
    });
    $$renderer2.push(`<!---->`);
  });
}
const __vite_glob_0_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Homepage
}, Symbol.toStringTag, { value: "Module" }));
function BlogContentRenderer($$renderer, $$props) {
  let { content } = $$props;
  function getCalloutIcon(icon) {
    switch (icon) {
      case "question":
        return faQuestion;
      case "warning":
        return faWarning;
      case "hint":
        return faLightbulb;
      case "error":
        return faCircleExclamation;
      case "info":
        return faCircleInfo;
      default:
        return faCircleInfo;
    }
  }
  function getCalloutClass(icon) {
    switch (icon) {
      case "question":
        return "bg-blue-500/10 border-blue-500 text-blue-500";
      case "warning":
        return "bg-yellow-500/10 border-yellow-500 text-yellow-500";
      case "hint":
        return "bg-green-500/10 border-green-500 text-green-500";
      case "error":
        return "bg-red-500/10 border-red-500 text-red-500";
      case "info":
        return "bg-blue-500/10 border-blue-500 text-blue-500";
      default:
        return "bg-blue-500/10 border-blue-500 text-blue-500";
    }
  }
  $$renderer.push(`<div class="space-y-6"><!--[-->`);
  const each_array = ensure_array_like(content);
  for (let $$index_2 = 0, $$length = each_array.length; $$index_2 < $$length; $$index_2++) {
    let section = each_array[$$index_2];
    if (section.kind === "section" && section.children) {
      $$renderer.push("<!--[-->");
      $$renderer.push(`<!--[-->`);
      const each_array_1 = ensure_array_like(section.children);
      for (let $$index_1 = 0, $$length2 = each_array_1.length; $$index_1 < $$length2; $$index_1++) {
        let child = each_array_1[$$index_1];
        if (child.kind === "heading") {
          $$renderer.push("<!--[-->");
          $$renderer.push(`<h2 class="text-2xl font-bold text-text mt-8 mb-4">${escape_html(child.content)}</h2>`);
        } else {
          $$renderer.push("<!--[!-->");
          if (child.kind === "paragraph") {
            $$renderer.push("<!--[-->");
            $$renderer.push(`<p class="text-text-muted leading-relaxed">${escape_html(child.content)}</p>`);
          } else {
            $$renderer.push("<!--[!-->");
            if (child.kind === "code") {
              $$renderer.push("<!--[-->");
              $$renderer.push(`<pre class="bg-bg-secondary border border-border rounded-lg p-4 overflow-x-auto"><code class="text-sm text-text-muted font-mono">${escape_html(child.content)}</code></pre>`);
            } else {
              $$renderer.push("<!--[!-->");
              if (child.kind === "image") {
                $$renderer.push("<!--[-->");
                $$renderer.push(`<figure class="my-6"><img${attr("src", child.source)}${attr("alt", child.caption || "")} class="w-full rounded-lg"${attr_style(`height: ${stringify(child.height || 300)}px`)}/> `);
                if (child.caption) {
                  $$renderer.push("<!--[-->");
                  $$renderer.push(`<figcaption class="text-center text-sm text-text-muted mt-2">${escape_html(child.caption)}</figcaption>`);
                } else {
                  $$renderer.push("<!--[!-->");
                }
                $$renderer.push(`<!--]--></figure>`);
              } else {
                $$renderer.push("<!--[!-->");
                if (child.kind === "callout") {
                  $$renderer.push("<!--[-->");
                  $$renderer.push(`<div${attr_class(`flex gap-3 p-4 rounded-lg border ${stringify(getCalloutClass(child.icon))}`)}>`);
                  Fa($$renderer, {
                    icon: getCalloutIcon(child.icon),
                    class: "flex-shrink-0 mt-0.5"
                  });
                  $$renderer.push(`<!----> <div class="text-text-muted">`);
                  if (child.content) {
                    $$renderer.push("<!--[-->");
                    $$renderer.push(`<p class="font-medium mb-2">${escape_html(child.content)}</p>`);
                  } else {
                    $$renderer.push("<!--[!-->");
                  }
                  $$renderer.push(`<!--]--> `);
                  if (child.children) {
                    $$renderer.push("<!--[-->");
                    $$renderer.push(`<!--[-->`);
                    const each_array_2 = ensure_array_like(child.children);
                    for (let $$index = 0, $$length3 = each_array_2.length; $$index < $$length3; $$index++) {
                      let childContent = each_array_2[$$index];
                      $$renderer.push(`<p class="text-sm">${escape_html(childContent.content)}</p>`);
                    }
                    $$renderer.push(`<!--]-->`);
                  } else {
                    $$renderer.push("<!--[!-->");
                  }
                  $$renderer.push(`<!--]--></div></div>`);
                } else {
                  $$renderer.push("<!--[!-->");
                  if (child.kind === "divider") {
                    $$renderer.push("<!--[-->");
                    $$renderer.push(`<hr class="border-border my-8"/>`);
                  } else {
                    $$renderer.push("<!--[!-->");
                  }
                  $$renderer.push(`<!--]-->`);
                }
                $$renderer.push(`<!--]-->`);
              }
              $$renderer.push(`<!--]-->`);
            }
            $$renderer.push(`<!--]-->`);
          }
          $$renderer.push(`<!--]-->`);
        }
        $$renderer.push(`<!--]-->`);
      }
      $$renderer.push(`<!--]-->`);
    } else {
      $$renderer.push("<!--[!-->");
    }
    $$renderer.push(`<!--]-->`);
  }
  $$renderer.push(`<!--]--></div>`);
}
function SingleBlogPost($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      post,
      cvDownloadUrl = null,
      contactCardQrCode = "",
      cvPdfQrCode = "",
      showBlogLink = true
    } = $$props;
    let showContactForm = false;
    async function handleEmailClick(e2) {
      const target = e2.currentTarget;
      const rect = target.getBoundingClientRect();
      ({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      showContactForm = true;
      await tick();
    }
    function handleFormClose() {
      {
        showContactForm = false;
      }
    }
    function formatDate2(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    }
    head("10nv4yn", $$renderer2, ($$renderer3) => {
      var _a;
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(post.title)} - Stefan Olivier</title>`);
      });
      $$renderer3.push(`<meta name="description"${attr("content", ((_a = post.content) == null ? void 0 : _a.slice(0, 160)) || "")}/>`);
    });
    Toaster($$renderer2, {
      position: "top-center",
      theme: "dark",
      richColors: true,
      closeButton: true,
      toastOptions: {
        classes: {
          success: "toast-success",
          error: "toast-error",
          warning: "toast-warning",
          info: "toast-info"
        }
      }
    });
    $$renderer2.push(`<!----> `);
    if (showContactForm) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="fixed inset-0 z-50"></div> <div class="fixed inset-0 z-[60]"><button type="button" class="absolute top-6 left-6 text-text-muted hover:text-text transition-colors cursor-pointer">`);
      Fa($$renderer2, { icon: faXmark, class: "text-3xl" });
      $$renderer2.push(`<!----></button> <div class="flex items-center justify-center h-full p-4"><div class="bg-bg border border-border rounded-lg p-6 w-full max-w-4xl shadow-xl flex flex-col"><div class="flex flex-col md:flex-row h-full gap-8"><div class="flex-1 md:flex-[2] flex flex-col">`);
      ContactForm($$renderer2, { onClose: handleFormClose });
      $$renderer2.push(`<!----></div> <div class="hidden md:flex flex-1 flex-col border-l border-border pl-8 justify-between"><div><h2 class="contact-detail text-xl font-semibold text-text mb-6">Contact</h2> <div class="space-y-4"><div class="flex items-center"><a${attr("href", Bio.contact.Phone.src)} class="contact-detail flex items-center gap-3 text-text-muted hover:text-accent transition-colors">`);
      Fa($$renderer2, { icon: faPhone, class: "text-lg w-5" });
      $$renderer2.push(`<!----> <span>${escape_html(Bio.contact.Phone.displayName)}</span></a> `);
      CopyButton($$renderer2, { text: Bio.contact.Phone.displayName });
      $$renderer2.push(`<!----></div> <div class="flex items-center"><a${attr("href", Bio.contact.Email.src)} class="contact-detail flex items-center gap-3 text-text-muted hover:text-accent transition-colors">`);
      Fa($$renderer2, { icon: faEnvelope, class: "text-lg w-5" });
      $$renderer2.push(`<!----> <span>${escape_html(Bio.contact.Email.displayName)}</span></a> `);
      CopyButton($$renderer2, { text: Bio.contact.Email.displayName });
      $$renderer2.push(`<!----></div> <div class="flex items-center"><a${attr("href", Bio.contact.GitHub.src)} target="_blank" rel="noopener noreferrer" class="contact-detail flex items-center gap-3 text-text-muted hover:text-accent transition-colors">`);
      Fa($$renderer2, { icon: faGithub, class: "text-lg w-5" });
      $$renderer2.push(`<!----> <span>${escape_html(Bio.contact.GitHub.displayName)}</span></a> `);
      CopyButton($$renderer2, { text: Bio.contact.GitHub.src });
      $$renderer2.push(`<!----></div> <div class="flex items-center"><a${attr("href", Bio.contact.LinkedIn.src)} target="_blank" rel="noopener noreferrer" class="contact-detail flex items-center gap-3 text-text-muted hover:text-accent transition-colors">`);
      Fa($$renderer2, { icon: faLinkedin, class: "text-lg w-5" });
      $$renderer2.push(`<!----> <span>${escape_html(Bio.contact.LinkedIn.displayName)}</span></a> `);
      CopyButton($$renderer2, { text: Bio.contact.LinkedIn.src });
      $$renderer2.push(`<!----></div> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (contactCardQrCode && cvPdfQrCode) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="qr-code pt-4 mt-4 border-t border-border"><div class="flex gap-2 mb-3"><button type="button"${attr_class(`qr-code flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${stringify(
          "bg-accent text-bg"
        )}`)}>`);
        Fa($$renderer2, { icon: faAddressCard, class: "text-xs" });
        $$renderer2.push(`<!----> Contact</button> <button type="button"${attr_class(`qr-code flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${stringify("bg-bg text-text-muted hover:text-text")}`)}>`);
        Fa($$renderer2, { icon: faFilePdf, class: "text-xs" });
        $$renderer2.push(`<!----> Download CV</button></div> `);
        {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<img${attr("src", contactCardQrCode)} alt="Contact QR Code" class="qr-code rounded-md border border-border w-full"/>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div></div></div></div> <div class="md:hidden flex flex-row gap-4 justify-center pt-6 mt-6 border-t border-border"><div class="flex flex-row items-center"><a${attr("href", Bio.contact.Phone.src)} class="contact-detail text-text-muted hover:text-accent transition-colors text-sm">${escape_html(Bio.contact.Phone.displayName)}</a></div> <div class="flex flex-row items-center"><a${attr("href", Bio.contact.Email.src)} class="contact-detail text-text-muted hover:text-accent transition-colors text-sm">${escape_html(Bio.contact.Email.displayName)}</a></div> <div class="flex flex-row items-center"><a${attr("href", Bio.contact.GitHub.src)} target="_blank" rel="noopener noreferrer" class="contact-detail text-text-muted hover:text-accent transition-colors">`);
      Fa($$renderer2, { icon: faGithub, class: "text-lg" });
      $$renderer2.push(`<!----></a></div> <div class="flex flex-row items-center"><a${attr("href", Bio.contact.LinkedIn.src)} target="_blank" rel="noopener noreferrer" class="contact-detail text-text-muted hover:text-accent transition-colors">`);
      Fa($$renderer2, { icon: faLinkedin, class: "text-lg" });
      $$renderer2.push(`<!----></a></div> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div></div></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="min-h-screen bg-bg flex flex-col">`);
    Header($$renderer2, { onEmailClick: handleEmailClick, cvDownloadUrl, showBlogLink });
    $$renderer2.push(`<!----> <main class="flex-1 pt-20"><article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><header class="mb-12"><a href="/blog" class="inline-flex items-center text-sm text-text-muted hover:text-accent transition-colors mb-8">← Back to Blog</a> <h1 class="text-4xl sm:text-5xl font-bold text-text mb-6">${escape_html(post.title)}</h1> <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-muted mb-6">`);
    if (post.author) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="font-medium text-text">by ${escape_html(post.author)}</span> <span>·</span>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <time${attr("datetime", post.posted_at)}>${escape_html(formatDate2(post.posted_at))}</time> <span>·</span> <span>${escape_html(post.read_time)} min read</span></div> `);
    if (post.tags && post.tags.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex flex-wrap gap-2"><!--[-->`);
      const each_array = ensure_array_like(post.tags);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let tag = each_array[$$index];
        $$renderer2.push(`<span class="inline-block px-3 py-1 text-sm bg-bg-secondary text-text-muted rounded-full">${escape_html(tag)}</span>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></header> <div class="prose prose-lg max-w-none">`);
    if (post.structured_content) {
      $$renderer2.push("<!--[-->");
      BlogContentRenderer($$renderer2, { content: post.structured_content });
    } else {
      $$renderer2.push("<!--[!-->");
      if (post.content) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="text-text-muted whitespace-pre-wrap">${escape_html(post.content)}</div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div> <footer class="mt-16 pt-8 border-t border-border"><a href="/blog" class="inline-flex items-center text-sm text-text-muted hover:text-accent transition-colors">← Back to Blog</a></footer></article></main> `);
    Footer($$renderer2, { class: "mx-4 md:mx-6 lg:mx-12", cvDownloadUrl });
    $$renderer2.push(`<!----></div>`);
  });
}
const __vite_glob_0_6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SingleBlogPost
}, Symbol.toStringTag, { value: "Module" }));
globalThis.Bio = {
  firstname: "Stefan",
  surname: "Olivier",
  about: "I make websites and applications that have the happiest bits, nibbles, and bytes.",
  occupation: "Software Engineer",
  avatarUrl: "https://stefanolivier.imgix.net/img/owlsh.jpg",
  portraitUrl: "https://stefanolivier.imgix.net/stefan.jpg",
  contact: {
    Phone: {
      icon: faPhone,
      src: "tel:+27761855537",
      displayName: "+27 76 185 5537"
    },
    Email: {
      icon: faEnvelope,
      src: "mailto:hello@stefanolivier.com",
      displayName: "hello@stefanolivier.com"
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
    }
  }
};
Object.defineProperty(globalThis.Bio, "name", {
  get() {
    return [this.firstname, this.surname].join(" ");
  }
});
async function resolvePageComponent(path, pages) {
  for (const p2 of Array.isArray(path) ? path : [path]) {
    const page = pages[p2];
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
      return resolvePageComponent(`./Pages/${name}`, /* @__PURE__ */ Object.assign({ "./Pages/Blog.svelte": __vite_glob_0_0, "./Pages/ContactForm.svelte": __vite_glob_0_1, "./Pages/CoverImage.svelte": __vite_glob_0_2, "./Pages/CoverLetter.svelte": __vite_glob_0_3, "./Pages/Cv.svelte": __vite_glob_0_4, "./Pages/Homepage.svelte": __vite_glob_0_5, "./Pages/SingleBlogPost.svelte": __vite_glob_0_6 }));
    },
    setup({ App: App2, props }) {
      return render(App2, { props });
    }
  })
);
