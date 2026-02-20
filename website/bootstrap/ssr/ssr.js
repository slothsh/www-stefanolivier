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
var _out, _on_destroy, _is_component_body, _parent, _Renderer_instances, collect_on_destroy_fn, traverse_components_fn, collect_ondestroy_fn, _Renderer_static, render_fn, render_async_fn, collect_content_fn, collect_content_async_fn, collect_hydratables_fn, open_render_fn, close_render_fn, hydratable_block_fn, _title;
import { clsx as clsx$1 } from "clsx";
import { z } from "zod";
import { router, getInitialPageFromDOM, setupProgress, config as config$1 } from "@inertiajs/core";
import "laravel-precognition";
import { FieldApi, FormApi } from "@tanstack/form-core";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import createServer from "@inertiajs/core/server";
import { escape } from "lodash-es";
const HYDRATION_START = "[";
const HYDRATION_END = "]";
const ELEMENT_IS_NAMESPACED = 1;
const ELEMENT_PRESERVE_ATTRIBUTE_CASE = 1 << 1;
const ELEMENT_IS_INPUT = 1 << 2;
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
const STALE_REACTION = new class StaleReactionError extends Error {
  constructor() {
    super(...arguments);
    __publicField(this, "name", "StaleReactionError");
    __publicField(this, "message", "The reaction that called `getAbortSignal()` was re-run or destroyed");
  }
}();
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
function set_ssr_context(v) {
  ssr_context = v;
}
function push(fn) {
  ssr_context = { p: ssr_context, c: null, r: null };
}
function pop() {
  ssr_context = /** @type {SSRContext} */
  ssr_context.p;
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
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
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
        const r = new _Renderer(this.global, this);
        body(r);
        if (this.global.mode === "async") {
          return __privateMethod(_a = r, _Renderer_instances, collect_content_async_fn).call(_a).then((content) => {
            close(renderer, content.body.replaceAll("<!---->", ""), content);
          });
        } else {
          const content = __privateMethod(_b = r, _Renderer_instances, collect_content_fn).call(_b);
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
      const r = new _Renderer(renderer.global, renderer);
      fn(r);
      if (renderer.global.mode === "async") {
        return __privateMethod(_a = r, _Renderer_instances, collect_content_async_fn).call(_a).then((content) => {
          close(content.head);
        });
      } else {
        const content = __privateMethod(_b = r, _Renderer_instances, collect_content_fn).call(_b);
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
  for (const [k, v] of ctx.lookup) {
    if (v.promises) {
      has_promises = true;
      for (const p of v.promises) await p;
    }
    entries.push(`[${JSON.stringify(k)},${v.serialized}]`);
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
    let i = 0;
    let l = Math.min(path.length, current.length);
    while (i < l && path[i] === current[i]) i += 1;
    if (path[i] === void 0) return;
    if (current[i] === void 0 || path[i] > current[i]) {
      __privateGet(this, _title).path = path;
      __privateGet(this, _title).value = value;
    }
  }
}
_title = new WeakMap();
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
function useStore(store, selector = (d) => d, options = {}) {
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
    for (const [k, v] of objA) {
      if (!objB.has(k) || !Object.is(v, objB.get(k))) return false;
    }
    return true;
  }
  if (objA instanceof Set && objB instanceof Set) {
    if (objA.size !== objB.size) return false;
    for (const v of objA) {
      if (!objB.has(v)) return false;
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
  for (let i = 0; i < keysA.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !Object.is(objA[keysA[i]], objB[keysA[i]])) {
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
const h = (component, propsOrChildren, childrenOrKey, key = null) => {
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
    Render($$renderer2, spread_props([renderProps]));
    bind_props($$props, { initialComponent, initialPage, resolveComponent });
  });
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
    const { html, head: head2, css } = svelteApp;
    return {
      body: useScriptElementForInitialPage ? `<script data-page="${id}" type="application/json">${JSON.stringify(initialPage).replace(/\//g, "\\/")}<\/script><div data-server-rendered="true" id="${id}">${html}</div>` : `<div data-server-rendered="true" id="${id}" data-page="${escape(JSON.stringify(initialPage))}">${html}</div>`,
      head: [head2, css ? `<style data-vite-css>${css.code}</style>` : ""]
    };
  }
  if (!isServer && progress) {
    setupProgress(progress);
  }
}
const config = config$1.extend({});
function ContactForm($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { onClose, isVisible } = $$props;
    const contactSchema = z.object({
      name: z.string().min(1, "Name is required").max(255, "Name must be 255 characters or less"),
      email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
      message: z.string().min(10, "Message must be at least 10 characters").max(5e3, "Message must be 5000 characters or less")
    });
    let isSubmitting = false;
    let serverErrors = {};
    const form = createForm(() => ({
      defaultValues: { name: "", email: "", message: "" },
      validators: { onChange: contactSchema },
      onSubmit: async ({ value }) => {
        isSubmitting = true;
        serverErrors = {};
        router.post(route("contact.store"), value, {
          onSuccess: () => {
          },
          onError: (errors) => {
            if (errors && typeof errors === "object") {
              serverErrors = errors;
            }
          },
          onFinish: () => {
            setTimeout(
              () => {
                isSubmitting = false;
                onClose();
              },
              2e3
            );
          }
        });
      }
    }));
    $$renderer2.push(`<h2 class="text-xl font-semibold text-text mb-6">Send a Message</h2> <form class="space-y-5"><div><label for="name" class="block text-sm font-medium text-text-muted mb-1.5">Name</label> <!---->`);
    {
      let children = function($$renderer3, field) {
        var _a;
        $$renderer3.push(`<input type="text" id="name"${attr("name", field.name)}${attr("value", field.state.value)} class="w-full px-3 py-2 bg-bg border border-border rounded-md text-text placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" placeholder="Your name"/> <div class="min-h-5 mt-1">`);
        if (field.state.meta.errors && field.state.meta.errors.length > 0) {
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
        $$renderer3.push(`<input type="email" id="email"${attr("name", field.name)}${attr("value", field.state.value)} class="w-full px-3 py-2 bg-bg border border-border rounded-md text-text placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" placeholder="you@example.com"/> <div class="min-h-5 mt-1">`);
        if (field.state.meta.errors && field.state.meta.errors.length > 0) {
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
    $$renderer2.push(`<!----></div> <div><label for="message" class="block text-sm font-medium text-text-muted mb-1.5">Message</label> <!---->`);
    {
      let children = function($$renderer3, field) {
        var _a;
        $$renderer3.push(`<textarea id="message"${attr("name", field.name)} rows="4" class="w-full px-3 py-2 bg-bg border border-border rounded-md text-text placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none" placeholder="Your message...">`);
        const $$body = escape_html(field.state.value);
        if ($$body) {
          $$renderer3.push(`${$$body}`);
        }
        $$renderer3.push(`</textarea> <div class="min-h-5 mt-1">`);
        if (field.state.meta.errors && field.state.meta.errors.length > 0) {
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
    $$renderer2.push(`<!----></div> `);
    if (Object.keys(serverErrors).length > 0 && !serverErrors.name && !serverErrors.email && !serverErrors.message) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="text-sm text-red-400">An error occurred. Please try again.</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="flex gap-3 pt-2"><button type="button" class="flex-1 px-4 py-2 border border-border rounded-md text-text-muted hover:text-text hover:border-text-muted transition-colors cursor-pointer"${attr("disabled", isSubmitting, true)}>Cancel</button> <button type="submit" class="flex-1 px-4 py-2 bg-accent text-bg rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer relative"${attr("disabled", isSubmitting, true)}>`);
    if (isSubmitting) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center justify-center"><div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div> Sending</div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`Send Message`);
    }
    $$renderer2.push(`<!--]--></button></div></form>`);
  });
}
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ContactForm
}, Symbol.toStringTag, { value: "Module" }));
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
function Fa($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
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
      })}${attr_style(style)}${attr("viewBox", `0 0 ${stringify(i[0])} ${stringify(i[1])}`)}${attr("aria-hidden", title === void 0)} role="img" xmlns="http://www.w3.org/2000/svg">`);
      if (title) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<title class="svelte-q6zoq1">${escape_html(title)}</title>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--><g${attr("transform", `translate(${stringify(i[0] / 2)} ${stringify(i[1] / 2)})`)}${attr("transform-origin", `${stringify(i[0] / 4)} 0`)} class="svelte-q6zoq1"><g${attr("transform", transform)} class="svelte-q6zoq1">`);
      if (typeof i[4] == "string") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<path${attr("d", i[4])}${attr("fill", color || primaryColor || "currentColor")}${attr("transform", `translate(${stringify(i[0] / -2)} ${stringify(i[1] / -2)})`)} class="svelte-q6zoq1"></path>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<path${attr("d", i[4][0])}${attr("fill", secondaryColor || color || "currentColor")}${attr("fill-opacity", swapOpacity != false ? primaryOpacity : secondaryOpacity)}${attr("transform", `translate(${stringify(i[0] / -2)} ${stringify(i[1] / -2)})`)} class="svelte-q6zoq1"></path><path${attr("d", i[4][1])}${attr("fill", primaryColor || color || "currentColor")}${attr("fill-opacity", swapOpacity != false ? secondaryOpacity : primaryOpacity)}${attr("transform", `translate(${stringify(i[0] / -2)} ${stringify(i[1] / -2)})`)} class="svelte-q6zoq1"></path>`);
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
function Homepage($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    head("1pj6qmx", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Stefan Olivier</title>`);
      });
    });
    $$renderer2.push(`<div class="min-h-screen bg-bg flex flex-col justify-between p-6 md:p-8 lg:p-12"><main class="flex-1 flex items-center justify-center"><div class="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 lg:gap-10"><div class="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-border flex-shrink-0 ring-2 ring-border"><img src="https://stefanolivier.imgix.net/img/owlsh.jpg" alt="Avatar" class="w-full h-full object-cover"/></div> <div class="flex flex-col items-center sm:items-start text-center sm:text-left"><h1 class="font-semibold text-4xl sm:text-5xl lg:text-6xl text-text tracking-tight">${escape_html(Bio.name)}</h1> <p class="text-base sm:text-lg lg:text-xl text-text-muted mt-1 sm:mt-1.5">${escape_html(Bio.occupation)}</p></div></div></main> <footer${attr_class("flex gap-4 sm:gap-5 justify-end relative z-[55] transition-opacity duration-300", void 0, { "opacity-0": false })}><a${attr("href", Bio.contact.GitHub.src)} target="_blank" rel="noopener noreferrer" class="text-text-muted hover:text-accent transition-colors">`);
    Fa($$renderer2, { icon: faGithub, size: "lg" });
    $$renderer2.push(`<!----></a> <a${attr("href", Bio.contact.LinkedIn.src)} target="_blank" rel="noopener noreferrer" class="text-text-muted hover:text-accent transition-colors">`);
    Fa($$renderer2, { icon: faLinkedin, size: "lg" });
    $$renderer2.push(`<!----></a> <button type="button" class="text-text-muted hover:text-accent transition-colors cursor-pointer">`);
    Fa($$renderer2, { icon: faEnvelope, size: "lg" });
    $$renderer2.push(`<!----></button></footer></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Homepage
}, Symbol.toStringTag, { value: "Module" }));
globalThis.Bio = {
  firstname: "Stefan",
  surname: "Olivier",
  about: "I make websites and applications that have the happiest bits, nibbles, and bytes.",
  occupation: "Software Engineer",
  avatarUrl: "https://stefanolivier.imgix.net/img/owlsh.jpg",
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
    }
  }
};
Object.defineProperty(globalThis.Bio, "name", {
  get() {
    return [this.firstname, this.surname].join(" ");
  }
});
(function() {
  const t = [];
  for (let e = 0; e < 256; ++e) t.push("%" + ((e < 16 ? "0" : "") + e.toString(16)).toUpperCase());
  return t;
})();
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
      return resolvePageComponent(`./Pages/${name}`, /* @__PURE__ */ Object.assign({ "./Pages/ContactForm.svelte": __vite_glob_0_0, "./Pages/Homepage.svelte": __vite_glob_0_1 }));
    },
    setup({ App: App2, props }) {
      return render(App2, { props });
    }
  })
);
