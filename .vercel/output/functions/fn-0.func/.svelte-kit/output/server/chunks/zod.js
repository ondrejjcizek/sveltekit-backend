import { U as UNDEFINED$1, N as NAN$1, P as POSITIVE_INFINITY$1, a as NEGATIVE_INFINITY$1, b as NEGATIVE_ZERO$1, H as HOLE$1, B as BROWSER, d as derived, g as get_store_value, w as writable, c as readonly } from "./index.js";
import { p as page, n as navigating } from "./stores.js";
import { A as current_component } from "./index3.js";
import { ZodFirstPartyTypeKind } from "zod";
function parse$1(serialized, revivers) {
  return unflatten$1(JSON.parse(serialized), revivers);
}
function unflatten$1(parsed, revivers) {
  if (typeof parsed === "number")
    return hydrate(parsed, true);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Invalid input");
  }
  const values = (
    /** @type {any[]} */
    parsed
  );
  const hydrated = Array(values.length);
  function hydrate(index, standalone = false) {
    if (index === UNDEFINED$1)
      return void 0;
    if (index === NAN$1)
      return NaN;
    if (index === POSITIVE_INFINITY$1)
      return Infinity;
    if (index === NEGATIVE_INFINITY$1)
      return -Infinity;
    if (index === NEGATIVE_ZERO$1)
      return -0;
    if (standalone)
      throw new Error(`Invalid input`);
    if (index in hydrated)
      return hydrated[index];
    const value = values[index];
    if (!value || typeof value !== "object") {
      hydrated[index] = value;
    } else if (Array.isArray(value)) {
      if (typeof value[0] === "string") {
        const type = value[0];
        const reviver = revivers?.[type];
        if (reviver) {
          return hydrated[index] = reviver(hydrate(value[1]));
        }
        switch (type) {
          case "Date":
            hydrated[index] = new Date(value[1]);
            break;
          case "Set":
            const set = /* @__PURE__ */ new Set();
            hydrated[index] = set;
            for (let i = 1; i < value.length; i += 1) {
              set.add(hydrate(value[i]));
            }
            break;
          case "Map":
            const map = /* @__PURE__ */ new Map();
            hydrated[index] = map;
            for (let i = 1; i < value.length; i += 2) {
              map.set(hydrate(value[i]), hydrate(value[i + 1]));
            }
            break;
          case "RegExp":
            hydrated[index] = new RegExp(value[1], value[2]);
            break;
          case "Object":
            hydrated[index] = Object(value[1]);
            break;
          case "BigInt":
            hydrated[index] = BigInt(value[1]);
            break;
          case "null":
            const obj = /* @__PURE__ */ Object.create(null);
            hydrated[index] = obj;
            for (let i = 1; i < value.length; i += 2) {
              obj[value[i]] = hydrate(value[i + 1]);
            }
            break;
          default:
            throw new Error(`Unknown type ${type}`);
        }
      } else {
        const array = new Array(value.length);
        hydrated[index] = array;
        for (let i = 0; i < value.length; i += 1) {
          const n = value[i];
          if (n === HOLE$1)
            continue;
          array[i] = hydrate(n);
        }
      }
    } else {
      const object = {};
      hydrated[index] = object;
      for (const key in value) {
        const n = value[key];
        object[key] = hydrate(n);
      }
    }
    return hydrated[index];
  }
  return hydrate(0);
}
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
function onDestroy(fn) {
  var context = (
    /** @type {import('#server').Component} */
    current_component
  );
  (context.d ??= []).push(fn);
}
async function tick() {
}
const browser = BROWSER;
function client_method(key) {
  {
    if (key === "before_navigate" || key === "after_navigate" || key === "on_navigate" || key === "push_state" || key === "replace_state") {
      return () => {
      };
    } else {
      const name_lookup = {
        disable_scroll_handling: "disableScrollHandling",
        preload_data: "preloadData",
        preload_code: "preloadCode",
        invalidate_all: "invalidateAll"
      };
      return () => {
        throw new Error(`Cannot call ${name_lookup[key] ?? key}(...) on the server`);
      };
    }
  }
}
const invalidateAll = /* @__PURE__ */ client_method("invalidate_all");
function applyAction(result) {
  {
    throw new Error("Cannot call applyAction(...) on the server");
  }
}
function deserialize(result) {
  const parsed = JSON.parse(result);
  if (parsed.data) {
    parsed.data = parse$1(parsed.data);
  }
  return parsed;
}
function clone$2(element) {
  return (
    /** @type {T} */
    HTMLElement.prototype.cloneNode.call(element)
  );
}
function enhance(form_element, submit = () => {
}) {
  const fallback_callback = async ({
    action,
    result,
    reset = true,
    invalidateAll: shouldInvalidateAll = true
  }) => {
    if (result.type === "success") {
      if (reset) {
        HTMLFormElement.prototype.reset.call(form_element);
      }
      if (shouldInvalidateAll) {
        await invalidateAll();
      }
    }
    if (location.origin + location.pathname === action.origin + action.pathname || result.type === "redirect" || result.type === "error") {
      applyAction();
    }
  };
  async function handle_submit(event) {
    const method = event.submitter?.hasAttribute("formmethod") ? (
      /** @type {HTMLButtonElement | HTMLInputElement} */
      event.submitter.formMethod
    ) : clone$2(form_element).method;
    if (method !== "post")
      return;
    event.preventDefault();
    const action = new URL(
      // We can't do submitter.formAction directly because that property is always set
      event.submitter?.hasAttribute("formaction") ? (
        /** @type {HTMLButtonElement | HTMLInputElement} */
        event.submitter.formAction
      ) : clone$2(form_element).action
    );
    const form_data = new FormData(form_element);
    const submitter_name = event.submitter?.getAttribute("name");
    if (submitter_name) {
      form_data.append(submitter_name, event.submitter?.getAttribute("value") ?? "");
    }
    const controller = new AbortController();
    let cancelled = false;
    const cancel = () => cancelled = true;
    const callback = await submit({
      action,
      cancel,
      controller,
      formData: form_data,
      formElement: form_element,
      submitter: event.submitter
    }) ?? fallback_callback;
    if (cancelled)
      return;
    let result;
    try {
      const response = await fetch(action, {
        method: "POST",
        headers: {
          accept: "application/json",
          "x-sveltekit-action": "true"
        },
        cache: "no-store",
        body: form_data,
        signal: controller.signal
      });
      result = deserialize(await response.text());
      if (result.type === "error")
        result.status = response.status;
    } catch (error) {
      if (
        /** @type {any} */
        error?.name === "AbortError"
      )
        return;
      result = { type: "error", error };
    }
    callback({
      action,
      formData: form_data,
      formElement: form_element,
      update: (opts) => fallback_callback({
        action,
        result,
        reset: opts?.reset,
        invalidateAll: opts?.invalidateAll
      }),
      // @ts-expect-error generic constraints stuff we don't care about
      result
    });
  }
  HTMLFormElement.prototype.addEventListener.call(form_element, "submit", handle_submit);
  return {
    destroy() {
      HTMLFormElement.prototype.removeEventListener.call(form_element, "submit", handle_submit);
    }
  };
}
function setPath(parent, key, value) {
  parent[key] = value;
  return "skip";
}
function isInvalidPath(originalPath, pathData) {
  return pathData.value !== void 0 && typeof pathData.value !== "object" && pathData.path.length < originalPath.length;
}
function pathExists(obj, path, options = {}) {
  if (!options.modifier) {
    options.modifier = (pathData) => isInvalidPath(path, pathData) ? void 0 : pathData.value;
  }
  const exists = traversePath(obj, path, options.modifier);
  if (!exists)
    return void 0;
  if (options.value === void 0)
    return exists;
  return options.value(exists.value) ? exists : void 0;
}
function traversePath(obj, realPath, modifier) {
  if (!realPath.length)
    return void 0;
  const path = [realPath[0]];
  let parent = obj;
  while (parent && path.length < realPath.length) {
    const key2 = path[path.length - 1];
    const value = modifier ? modifier({
      parent,
      key: String(key2),
      value: parent[key2],
      path: path.map((p) => String(p)),
      isLeaf: false,
      set: (v) => setPath(parent, key2, v)
    }) : parent[key2];
    if (value === void 0)
      return void 0;
    else
      parent = value;
    path.push(realPath[path.length]);
  }
  if (!parent)
    return void 0;
  const key = realPath[realPath.length - 1];
  return {
    parent,
    key: String(key),
    value: parent[key],
    path: realPath.map((p) => String(p)),
    isLeaf: true,
    set: (v) => setPath(parent, key, v)
  };
}
function traversePaths(parent, modifier, path = []) {
  for (const key in parent) {
    const value = parent[key];
    const isLeaf = value === null || typeof value !== "object";
    const pathData = {
      parent,
      key,
      value,
      path: path.concat([key]),
      // path.map(String).concat([key])
      isLeaf,
      set: (v) => setPath(parent, key, v)
    };
    const status = modifier(pathData);
    if (status === "abort")
      return status;
    else if (status === "skip")
      continue;
    else if (!isLeaf) {
      const status2 = traversePaths(value, modifier, pathData.path);
      if (status2 === "abort")
        return status2;
    }
  }
}
function eqSet(xs, ys) {
  return xs === ys || xs.size === ys.size && [...xs].every((x) => ys.has(x));
}
function comparePaths(newObj, oldObj) {
  const diffPaths = /* @__PURE__ */ new Map();
  function builtInDiff(one, other) {
    if (one instanceof Date && other instanceof Date && one.getTime() !== other.getTime())
      return true;
    if (one instanceof Set && other instanceof Set && !eqSet(one, other))
      return true;
    if (one instanceof File && other instanceof File && one !== other)
      return true;
    return false;
  }
  function isBuiltin(data) {
    return data instanceof Date || data instanceof Set || data instanceof File;
  }
  function checkPath(data, compareTo) {
    const otherData = compareTo ? traversePath(compareTo, data.path) : void 0;
    function addDiff() {
      diffPaths.set(data.path.join(" "), data.path);
      return "skip";
    }
    if (isBuiltin(data.value)) {
      if (!isBuiltin(otherData?.value) || builtInDiff(data.value, otherData.value)) {
        return addDiff();
      }
    }
    if (data.isLeaf) {
      if (!otherData || data.value !== otherData.value) {
        addDiff();
      }
    }
  }
  traversePaths(newObj, (data) => checkPath(data, oldObj));
  traversePaths(oldObj, (data) => checkPath(data, newObj));
  return Array.from(diffPaths.values());
}
function setPaths(obj, paths, value) {
  const isFunction = typeof value === "function";
  for (const path of paths) {
    const leaf = traversePath(obj, path, ({ parent, key, value: value2 }) => {
      if (value2 === void 0 || typeof value2 !== "object") {
        parent[key] = {};
      }
      return parent[key];
    });
    if (leaf)
      leaf.parent[leaf.key] = isFunction ? value(path, leaf) : value;
  }
}
function splitPath(path) {
  return path.toString().split(/[[\].]+/).filter((p) => p);
}
function mergePath(path) {
  return path.reduce((acc, next) => {
    const key = String(next);
    if (typeof next === "number" || /^\d+$/.test(key))
      acc += `[${key}]`;
    else if (!acc)
      acc += key;
    else
      acc += `.${key}`;
    return acc;
  }, "");
}
var collectionClone = clone$1;
function clone$1(obj) {
  let result = obj;
  var type = {}.toString.call(obj).slice(8, -1);
  if (type == "Set") {
    return new Set([...obj].map((value) => clone$1(value)));
  }
  if (type == "Map") {
    return new Map([...obj].map((kv) => [clone$1(kv[0]), clone$1(kv[1])]));
  }
  if (type == "Date") {
    return new Date(obj.getTime());
  }
  if (type == "RegExp") {
    return RegExp(obj.source, getRegExpFlags(obj));
  }
  if (type == "Array" || type == "Object") {
    result = Array.isArray(obj) ? [] : {};
    for (var key in obj) {
      result[key] = clone$1(obj[key]);
    }
  }
  return result;
}
function getRegExpFlags(regExp) {
  if (typeof regExp.source.flags == "string") {
    return regExp.source.flags;
  } else {
    var flags = [];
    regExp.global && flags.push("g");
    regExp.ignoreCase && flags.push("i");
    regExp.multiline && flags.push("m");
    regExp.sticky && flags.push("y");
    regExp.unicode && flags.push("u");
    return flags.join("");
  }
}
function clone(data) {
  return data && typeof data === "object" ? collectionClone(data) : data;
}
function assertSchema(schema, path) {
  if (typeof schema === "boolean") {
    throw new SchemaError("Schema property cannot be defined as boolean.", path);
  }
}
const isObject = (obj) => {
  if (typeof obj === "object" && obj !== null) {
    if (typeof Object.getPrototypeOf === "function") {
      const prototype = Object.getPrototypeOf(obj);
      return prototype === Object.prototype || prototype === null;
    }
    return Object.prototype.toString.call(obj) === "[object Object]";
  }
  return false;
};
const merge$1 = (...objects) => objects.reduce((result, current) => {
  if (Array.isArray(current)) {
    throw new TypeError("Arguments provided to ts-deepmerge must be objects, not arrays.");
  }
  Object.keys(current).forEach((key) => {
    if (["__proto__", "constructor", "prototype"].includes(key)) {
      return;
    }
    if (Array.isArray(result[key]) && Array.isArray(current[key])) {
      result[key] = merge$1.options.mergeArrays ? merge$1.options.uniqueArrayItems ? Array.from(new Set(result[key].concat(current[key]))) : [...result[key], ...current[key]] : current[key];
    } else if (isObject(result[key]) && isObject(current[key])) {
      result[key] = merge$1(result[key], current[key]);
    } else {
      result[key] = current[key] === void 0 ? merge$1.options.allowUndefinedOverrides ? current[key] : result[key] : current[key];
    }
  });
  return result;
}, {});
const defaultOptions$2 = {
  allowUndefinedOverrides: true,
  mergeArrays: true,
  uniqueArrayItems: true
};
merge$1.options = defaultOptions$2;
merge$1.withOptions = (options, ...objects) => {
  merge$1.options = Object.assign(Object.assign({}, defaultOptions$2), options);
  const result = merge$1(...objects);
  merge$1.options = defaultOptions$2;
  return result;
};
const conversionFormatTypes = ["unix-time", "bigint", "any", "symbol", "set"];
function schemaInfo(schema, isOptional, path) {
  assertSchema(schema, path);
  if (schema.allOf && schema.allOf.length) {
    return {
      ...merge$1.withOptions({ allowUndefinedOverrides: false }, ...schema.allOf.map((s) => schemaInfo(s, false, []))),
      schema
    };
  }
  const types = schemaTypes(schema, path);
  const array = schema.items && types.includes("array") ? (Array.isArray(schema.items) ? schema.items : [schema.items]).filter((s) => typeof s !== "boolean") : void 0;
  const properties = schema.properties && types.includes("object") ? Object.fromEntries(Object.entries(schema.properties).filter(([, value]) => typeof value !== "boolean")) : void 0;
  const union = unionInfo(schema)?.filter((u) => u.type !== "null" && u.const !== null);
  return {
    types: types.filter((s) => s !== "null"),
    isOptional,
    isNullable: types.includes("null"),
    schema,
    union: union?.length ? union : void 0,
    array,
    properties,
    required: schema.required
  };
}
function schemaTypes(schema, path) {
  assertSchema(schema, path);
  let types = schema.const === null ? ["null"] : [];
  if (schema.type) {
    types = Array.isArray(schema.type) ? schema.type : [schema.type];
  }
  if (schema.anyOf) {
    types = schema.anyOf.flatMap((s) => schemaTypes(s, path));
  }
  if (types.includes("array") && schema.uniqueItems) {
    const i = types.findIndex((t) => t != "array");
    types[i] = "set";
  } else if (schema.format && conversionFormatTypes.includes(schema.format)) {
    types.unshift(schema.format);
    if (schema.format == "unix-time") {
      const i = types.findIndex((t) => t == "integer");
      types.splice(i, 1);
    }
  }
  if (schema.const && schema.const !== null && typeof schema.const !== "function") {
    types.push(typeof schema.const);
  }
  return Array.from(new Set(types));
}
function unionInfo(schema) {
  if (!schema.anyOf || !schema.anyOf.length)
    return void 0;
  return schema.anyOf.filter((s) => typeof s !== "boolean");
}
function defaultValues(schema, isOptional = false, path = []) {
  return _defaultValues(schema, isOptional, path);
}
function _defaultValues(schema, isOptional, path) {
  if (!schema) {
    throw new SchemaError("Schema was undefined", path);
  }
  const info = schemaInfo(schema, isOptional, path);
  if (!info)
    return void 0;
  let objectDefaults = void 0;
  if ("default" in schema) {
    if (info.types.includes("object") && schema.default && typeof schema.default == "object" && !Array.isArray(schema.default)) {
      objectDefaults = schema.default;
    } else {
      if (info.types.length > 1) {
        if (info.types.includes("unix-time") && (info.types.includes("integer") || info.types.includes("number")))
          throw new SchemaError("Cannot resolve a default value with a union that includes a date and a number/integer.", path);
      }
      const [type] = info.types;
      return formatDefaultValue(type, schema.default);
    }
  }
  let _multiType;
  const isMultiTypeUnion = () => {
    if (!info.union || info.union.length < 2)
      return false;
    if (info.union.some((i) => i.enum))
      return true;
    if (!_multiType) {
      _multiType = new Set(info.types.map((i) => {
        return ["integer", "unix-time"].includes(i) ? "number" : i;
      }));
    }
    return _multiType.size > 1;
  };
  let output = {};
  if (!objectDefaults && info.union) {
    const singleDefault = info.union.filter((s) => typeof s !== "boolean" && s.default !== void 0);
    if (singleDefault.length == 1) {
      return _defaultValues(singleDefault[0], isOptional, path);
    } else if (singleDefault.length > 1) {
      throw new SchemaError("Only one default value can exist in a union, or set a default value for the whole union.", path);
    } else {
      if (info.isNullable)
        return null;
      if (info.isOptional)
        return void 0;
      if (isMultiTypeUnion()) {
        throw new SchemaError("Multi-type unions must have a default value, or exactly one of the union types must have.", path);
      }
      if (info.union.length && info.types[0] == "object") {
        output = info.union.length > 1 ? merge$1.withOptions({ allowUndefinedOverrides: true }, ...info.union.map((s) => _defaultValues(s, isOptional, path))) : _defaultValues(info.union[0], isOptional, path);
      }
    }
  }
  if (!objectDefaults) {
    if (info.isNullable)
      return null;
    if (info.isOptional)
      return void 0;
  }
  if (info.properties) {
    for (const [key, value] of Object.entries(info.properties)) {
      assertSchema(value, [...path, key]);
      const def = objectDefaults && objectDefaults[key] !== void 0 ? objectDefaults[key] : _defaultValues(value, !info.required?.includes(key), [...path, key]);
      output[key] = def;
    }
    return output;
  } else if (objectDefaults) {
    return objectDefaults;
  }
  if (schema.enum) {
    return schema.enum[0];
  }
  if (isMultiTypeUnion()) {
    throw new SchemaError("Default values cannot have more than one type.", path);
  } else if (info.types.length == 0) {
    return void 0;
  }
  const [formatType] = info.types;
  return defaultValue(formatType, schema.enum);
}
function formatDefaultValue(type, value) {
  switch (type) {
    case "set":
      return Array.isArray(value) ? new Set(value) : value;
    case "Date":
    case "date":
    case "unix-time":
      if (typeof value === "string" || typeof value === "number")
        return new Date(value);
      break;
    case "bigint":
      if (typeof value === "string" || typeof value === "number")
        return BigInt(value);
      break;
    case "symbol":
      if (typeof value === "string" || typeof value === "number")
        return Symbol(value);
      break;
  }
  return value;
}
function defaultValue(type, enumType) {
  switch (type) {
    case "string":
      return enumType && enumType.length > 0 ? enumType[0] : "";
    case "number":
    case "integer":
      return enumType && enumType.length > 0 ? enumType[0] : 0;
    case "boolean":
      return false;
    case "array":
      return [];
    case "object":
      return {};
    case "null":
      return null;
    case "Date":
    case "date":
    case "unix-time":
      return void 0;
    case "bigint":
      return BigInt(0);
    case "set":
      return /* @__PURE__ */ new Set();
    case "symbol":
      return Symbol();
    case "undefined":
    case "any":
      return void 0;
    default:
      throw new SchemaError("Schema type or format not supported, requires explicit default value: " + type);
  }
}
function defaultTypes(schema, path = []) {
  return _defaultTypes(schema, false, path);
}
function _defaultTypes(schema, isOptional, path) {
  if (!schema) {
    throw new SchemaError("Schema was undefined", path);
  }
  const info = schemaInfo(schema, isOptional, path);
  const output = {
    __types: info.types
  };
  if (info.schema.items && typeof info.schema.items == "object" && !Array.isArray(info.schema.items)) {
    output.__items = _defaultTypes(info.schema.items, info.isOptional, path);
  }
  if (info.properties) {
    for (const [key, value] of Object.entries(info.properties)) {
      assertSchema(value, [...path, key]);
      output[key] = _defaultTypes(info.properties[key], !info.required?.includes(key), [
        ...path,
        key
      ]);
    }
  }
  if (info.isNullable && !output.__types.includes("null")) {
    output.__types.push("null");
  }
  if (info.isOptional && !output.__types.includes("undefined")) {
    output.__types.push("undefined");
  }
  return output;
}
class SuperFormError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, SuperFormError.prototype);
  }
}
class SchemaError extends SuperFormError {
  path;
  constructor(message, path) {
    super((path && path.length ? `[${Array.isArray(path) ? path.join(".") : path}] ` : "") + message);
    this.path = Array.isArray(path) ? path.join(".") : path;
    Object.setPrototypeOf(this, SchemaError.prototype);
  }
}
function mapErrors(errors, shape) {
  const output = {};
  function addFormLevelError(error) {
    if (!("_errors" in output))
      output._errors = [];
    if (!Array.isArray(output._errors)) {
      if (typeof output._errors === "string")
        output._errors = [output._errors];
      else
        throw new SuperFormError("Form-level error was not an array.");
    }
    output._errors.push(error.message);
  }
  for (const error of errors) {
    if (!error.path || error.path.length == 1 && !error.path[0]) {
      addFormLevelError(error);
      continue;
    }
    const isLastIndexNumeric = /^\d$/.test(String(error.path[error.path.length - 1]));
    const objectError = !isLastIndexNumeric && pathExists(shape, error.path.filter((p) => /\D/.test(String(p))))?.value;
    const leaf = traversePath(output, error.path, ({ value, parent: parent2, key: key2 }) => {
      if (value === void 0)
        parent2[key2] = {};
      return parent2[key2];
    });
    if (!leaf) {
      addFormLevelError(error);
      continue;
    }
    const { parent, key } = leaf;
    if (objectError) {
      if (!(key in parent))
        parent[key] = {};
      if (!("_errors" in parent[key]))
        parent[key]._errors = [error.message];
      else
        parent[key]._errors.push(error.message);
    } else {
      if (!(key in parent))
        parent[key] = [error.message];
      else
        parent[key].push(error.message);
    }
  }
  return output;
}
function updateErrors(New, Previous, force) {
  if (force)
    return New;
  traversePaths(Previous, (errors) => {
    if (!Array.isArray(errors.value))
      return;
    errors.set(void 0);
  });
  traversePaths(New, (error) => {
    if (!Array.isArray(error.value) && error.value !== void 0)
      return;
    setPaths(Previous, [error.path], error.value);
  });
  return Previous;
}
function flattenErrors(errors) {
  return _flattenErrors(errors, []);
}
function _flattenErrors(errors, path) {
  const entries = Object.entries(errors);
  return entries.filter(([, value]) => value !== void 0).flatMap(([key, messages]) => {
    if (Array.isArray(messages) && messages.length > 0) {
      const currPath = path.concat([key]);
      return { path: mergePath(currPath), messages };
    } else {
      return _flattenErrors(errors[key], path.concat([key]));
    }
  });
}
function mergeDefaults(parsedData, defaults) {
  if (!parsedData)
    return clone(defaults);
  return merge$1.withOptions({ mergeArrays: false }, defaults, parsedData);
}
function replaceInvalidDefaults(Data, Defaults, _schema, Errors, preprocessed) {
  const defaultType = _schema.additionalProperties && typeof _schema.additionalProperties == "object" ? { __types: schemaInfo(_schema.additionalProperties, false, []).types } : void 0;
  const Types = defaultTypes(_schema);
  function Types_correctValue(dataValue, defValue, type) {
    const types = type.__types;
    if (!types.length || types.every((t) => t == "undefined" || t == "null" || t == "any")) {
      return dataValue;
    } else if (types.length == 1 && types[0] == "array" && !type.__items) {
      return dataValue;
    }
    const dateTypes = ["unix-time", "Date", "date"];
    for (const schemaType of types) {
      const defaultTypeValue = defaultValue(schemaType, void 0);
      const sameType = typeof dataValue === typeof defaultTypeValue || dateTypes.includes(schemaType) && dataValue instanceof Date;
      const sameExistance = sameType && dataValue === null === (defaultTypeValue === null);
      if (sameType && sameExistance) {
        return dataValue;
      } else if (type.__items) {
        return Types_correctValue(dataValue, defValue, type.__items);
      }
    }
    if (defValue === void 0 && types.includes("null")) {
      return null;
    }
    return defValue;
  }
  function Data_traverse() {
    traversePaths(Defaults, Defaults_traverseAndReplace);
    Errors_traverseAndReplace();
    return Data;
  }
  function Data_setValue(currentPath, newValue) {
    setPaths(Data, [currentPath], newValue);
  }
  function Errors_traverseAndReplace() {
    for (const error of Errors) {
      if (!error.path)
        continue;
      Defaults_traverseAndReplace({
        path: error.path,
        value: pathExists(Defaults, error.path)?.value
      });
    }
  }
  function Defaults_traverseAndReplace(defaultPath) {
    const currentPath = defaultPath.path;
    if (!currentPath || !currentPath[0])
      return;
    if (typeof currentPath[0] === "string" && preprocessed?.includes(currentPath[0]))
      return;
    const dataPath = pathExists(Data, currentPath);
    if (!dataPath && defaultPath.value !== void 0 || dataPath && dataPath.value === void 0) {
      Data_setValue(currentPath, defaultPath.value);
    } else if (dataPath) {
      const defValue = defaultPath.value;
      const dataValue = dataPath.value;
      if (defValue !== void 0 && typeof dataValue === typeof defValue && dataValue === null === (defValue === null)) {
        return;
      }
      const typePath = currentPath.filter((p) => /\D/.test(String(p)));
      const pathTypes = traversePath(Types, typePath, (path) => {
        return "__items" in path.value ? path.value.__items : path.value;
      });
      if (!pathTypes) {
        throw new SchemaError("No types found for defaults", currentPath);
      }
      const fieldType = pathTypes.value ?? defaultType;
      if (!fieldType) {
        throw new SchemaError("No default value specified for field (can be undefined, but must be explicit)", currentPath);
      }
      Data_setValue(currentPath, Types_correctValue(dataValue, defValue, fieldType));
    }
  }
  {
    return Data_traverse();
  }
}
function cancelFlash(options) {
  if (!options.flashMessage || !browser)
    return;
  if (!shouldSyncFlash(options))
    return;
  document.cookie = `flash=; Max-Age=0; Path=${options.flashMessage.cookiePath ?? "/"};`;
}
function shouldSyncFlash(options) {
  if (!options.flashMessage || !browser)
    return false;
  return options.syncFlashMessage;
}
const noCustomValidityDataAttribute = "noCustomValidity";
async function updateCustomValidity(validityEl, errors) {
  if ("setCustomValidity" in validityEl) {
    validityEl.setCustomValidity("");
  }
  if (noCustomValidityDataAttribute in validityEl.dataset)
    return;
  setCustomValidity(validityEl, errors);
}
function setCustomValidityForm(formElement, errors) {
  for (const el of formElement.querySelectorAll("input,select,textarea,button")) {
    if (noCustomValidityDataAttribute in el.dataset) {
      continue;
    }
    const error = traversePath(errors, splitPath(el.name));
    setCustomValidity(el, error?.value);
    if (error?.value)
      return;
  }
}
function setCustomValidity(el, errors) {
  const message = errors && errors.length ? errors.join("\n") : "";
  el.setCustomValidity(message);
  if (message)
    el.reportValidity();
}
const isElementInViewport = (el, topOffset = 0) => {
  const rect = el.getBoundingClientRect();
  return rect.top >= topOffset && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
};
const scrollToAndCenter = (el, offset = 1.125, behavior = "smooth") => {
  const elementRect = el.getBoundingClientRect();
  const absoluteElementTop = elementRect.top + window.pageYOffset;
  const top = absoluteElementTop - window.innerHeight / (2 * offset);
  window.scrollTo({ left: 0, top, behavior });
};
const immediateInputTypes = ["checkbox", "radio", "range", "file"];
function inputInfo(el) {
  const immediate = !!el && (el instanceof HTMLSelectElement || el instanceof HTMLInputElement && immediateInputTypes.includes(el.type));
  const multiple = !!el && el instanceof HTMLSelectElement && el.multiple;
  const file = !!el && el instanceof HTMLInputElement && el.type == "file";
  return { immediate, multiple, file };
}
var FetchStatus;
(function(FetchStatus2) {
  FetchStatus2[FetchStatus2["Idle"] = 0] = "Idle";
  FetchStatus2[FetchStatus2["Submitting"] = 1] = "Submitting";
  FetchStatus2[FetchStatus2["Delayed"] = 2] = "Delayed";
  FetchStatus2[FetchStatus2["Timeout"] = 3] = "Timeout";
})(FetchStatus || (FetchStatus = {}));
const activeTimers = /* @__PURE__ */ new Set();
function Form(formElement, timers, options) {
  let state = FetchStatus.Idle;
  let delayedTimeout, timeoutTimeout;
  const Timers = activeTimers;
  function Timers_start() {
    Timers_clear();
    Timers_setState(state != FetchStatus.Delayed ? FetchStatus.Submitting : FetchStatus.Delayed);
    delayedTimeout = window.setTimeout(() => {
      if (delayedTimeout && state == FetchStatus.Submitting)
        Timers_setState(FetchStatus.Delayed);
    }, options.delayMs);
    timeoutTimeout = window.setTimeout(() => {
      if (timeoutTimeout && state == FetchStatus.Delayed)
        Timers_setState(FetchStatus.Timeout);
    }, options.timeoutMs);
    Timers.add(Timers_clear);
  }
  function Timers_clear() {
    clearTimeout(delayedTimeout);
    clearTimeout(timeoutTimeout);
    delayedTimeout = timeoutTimeout = 0;
    Timers.delete(Timers_clear);
    Timers_setState(FetchStatus.Idle);
  }
  function Timers_clearAll() {
    Timers.forEach((t) => t());
    Timers.clear();
  }
  function Timers_setState(s) {
    state = s;
    timers.submitting.set(state >= FetchStatus.Submitting);
    timers.delayed.set(state >= FetchStatus.Delayed);
    timers.timeout.set(state >= FetchStatus.Timeout);
  }
  const ErrorTextEvents = formElement;
  function ErrorTextEvents__selectText(e) {
    const target = e.target;
    if (options.selectErrorText)
      target.select();
  }
  function ErrorTextEvents_addErrorTextListeners() {
    if (!options.selectErrorText)
      return;
    ErrorTextEvents.querySelectorAll("input").forEach((el) => {
      el.addEventListener("invalid", ErrorTextEvents__selectText);
    });
  }
  function ErrorTextEvents_removeErrorTextListeners() {
    if (!options.selectErrorText)
      return;
    ErrorTextEvents.querySelectorAll("input").forEach((el) => el.removeEventListener("invalid", ErrorTextEvents__selectText));
  }
  const Form2 = formElement;
  {
    ErrorTextEvents_addErrorTextListeners();
    const completed = (opts) => {
      if (!opts.clearAll)
        Timers_clear();
      else
        Timers_clearAll();
      if (!opts.cancelled)
        setTimeout(() => scrollToFirstError(Form2, options), 1);
    };
    onDestroy(() => {
      ErrorTextEvents_removeErrorTextListeners();
      completed({ cancelled: true });
    });
    return {
      submitting() {
        Timers_start();
      },
      completed,
      scrollToFirstError() {
        setTimeout(() => scrollToFirstError(Form2, options), 1);
      },
      isSubmitting: () => state === FetchStatus.Submitting || state === FetchStatus.Delayed
    };
  }
}
const scrollToFirstError = async (Form2, options) => {
  if (options.scrollToError == "off")
    return;
  const selector = options.errorSelector;
  if (!selector)
    return;
  await tick();
  let el;
  el = Form2.querySelector(selector);
  if (!el)
    return;
  el = el.querySelector(selector) ?? el;
  const nav = options.stickyNavbar ? document.querySelector(options.stickyNavbar) : null;
  if (typeof options.scrollToError != "string") {
    el.scrollIntoView(options.scrollToError);
  } else if (!isElementInViewport(el, nav?.offsetHeight ?? 0)) {
    scrollToAndCenter(el, void 0, options.scrollToError);
  }
  function Form_shouldAutoFocus(userAgent) {
    if (typeof options.autoFocusOnError === "boolean")
      return options.autoFocusOnError;
    else
      return !/iPhone|iPad|iPod|Android/i.test(userAgent);
  }
  if (!Form_shouldAutoFocus(navigator.userAgent))
    return;
  let focusEl;
  focusEl = el;
  if (!["INPUT", "SELECT", "BUTTON", "TEXTAREA"].includes(focusEl.tagName)) {
    focusEl = focusEl.querySelector('input:not([type="hidden"]):not(.flatpickr-input), select, textarea');
  }
  if (focusEl) {
    try {
      focusEl.focus({ preventScroll: true });
      if (options.selectErrorText && focusEl.tagName == "INPUT") {
        focusEl.select();
      }
    } catch (err) {
    }
  }
};
class DevalueError extends Error {
  /**
   * @param {string} message
   * @param {string[]} keys
   */
  constructor(message, keys) {
    super(message);
    this.name = "DevalueError";
    this.path = keys.join("");
  }
}
function is_primitive(thing) {
  return Object(thing) !== thing;
}
const object_proto_names = /* @__PURE__ */ Object.getOwnPropertyNames(
  Object.prototype
).sort().join("\0");
function is_plain_object(thing) {
  const proto = Object.getPrototypeOf(thing);
  return proto === Object.prototype || proto === null || Object.getOwnPropertyNames(proto).sort().join("\0") === object_proto_names;
}
function get_type(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function get_escaped_char(char) {
  switch (char) {
    case '"':
      return '\\"';
    case "<":
      return "\\u003C";
    case "\\":
      return "\\\\";
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "	":
      return "\\t";
    case "\b":
      return "\\b";
    case "\f":
      return "\\f";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return char < " " ? `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}` : "";
  }
}
function stringify_string(str) {
  let result = "";
  let last_pos = 0;
  const len = str.length;
  for (let i = 0; i < len; i += 1) {
    const char = str[i];
    const replacement = get_escaped_char(char);
    if (replacement) {
      result += str.slice(last_pos, i) + replacement;
      last_pos = i + 1;
    }
  }
  return `"${last_pos === 0 ? str : result + str.slice(last_pos)}"`;
}
const UNDEFINED = -1;
const HOLE = -2;
const NAN = -3;
const POSITIVE_INFINITY = -4;
const NEGATIVE_INFINITY = -5;
const NEGATIVE_ZERO = -6;
function parse(serialized, revivers) {
  return unflatten(JSON.parse(serialized), revivers);
}
function unflatten(parsed, revivers) {
  if (typeof parsed === "number")
    return hydrate(parsed, true);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Invalid input");
  }
  const values = (
    /** @type {any[]} */
    parsed
  );
  const hydrated = Array(values.length);
  function hydrate(index, standalone = false) {
    if (index === UNDEFINED)
      return void 0;
    if (index === NAN)
      return NaN;
    if (index === POSITIVE_INFINITY)
      return Infinity;
    if (index === NEGATIVE_INFINITY)
      return -Infinity;
    if (index === NEGATIVE_ZERO)
      return -0;
    if (standalone)
      throw new Error(`Invalid input`);
    if (index in hydrated)
      return hydrated[index];
    const value = values[index];
    if (!value || typeof value !== "object") {
      hydrated[index] = value;
    } else if (Array.isArray(value)) {
      if (typeof value[0] === "string") {
        const type = value[0];
        const reviver = revivers?.[type];
        if (reviver) {
          return hydrated[index] = reviver(hydrate(value[1]));
        }
        switch (type) {
          case "Date":
            hydrated[index] = new Date(value[1]);
            break;
          case "Set":
            const set = /* @__PURE__ */ new Set();
            hydrated[index] = set;
            for (let i = 1; i < value.length; i += 1) {
              set.add(hydrate(value[i]));
            }
            break;
          case "Map":
            const map = /* @__PURE__ */ new Map();
            hydrated[index] = map;
            for (let i = 1; i < value.length; i += 2) {
              map.set(hydrate(value[i]), hydrate(value[i + 1]));
            }
            break;
          case "RegExp":
            hydrated[index] = new RegExp(value[1], value[2]);
            break;
          case "Object":
            hydrated[index] = Object(value[1]);
            break;
          case "BigInt":
            hydrated[index] = BigInt(value[1]);
            break;
          case "null":
            const obj = /* @__PURE__ */ Object.create(null);
            hydrated[index] = obj;
            for (let i = 1; i < value.length; i += 2) {
              obj[value[i]] = hydrate(value[i + 1]);
            }
            break;
          default:
            throw new Error(`Unknown type ${type}`);
        }
      } else {
        const array = new Array(value.length);
        hydrated[index] = array;
        for (let i = 0; i < value.length; i += 1) {
          const n = value[i];
          if (n === HOLE)
            continue;
          array[i] = hydrate(n);
        }
      }
    } else {
      const object = {};
      hydrated[index] = object;
      for (const key in value) {
        const n = value[key];
        object[key] = hydrate(n);
      }
    }
    return hydrated[index];
  }
  return hydrate(0);
}
function stringify(value, reducers) {
  const stringified = [];
  const indexes = /* @__PURE__ */ new Map();
  const custom = [];
  for (const key in reducers) {
    custom.push({ key, fn: reducers[key] });
  }
  const keys = [];
  let p = 0;
  function flatten(thing) {
    if (typeof thing === "function") {
      throw new DevalueError(`Cannot stringify a function`, keys);
    }
    if (indexes.has(thing))
      return indexes.get(thing);
    if (thing === void 0)
      return UNDEFINED;
    if (Number.isNaN(thing))
      return NAN;
    if (thing === Infinity)
      return POSITIVE_INFINITY;
    if (thing === -Infinity)
      return NEGATIVE_INFINITY;
    if (thing === 0 && 1 / thing < 0)
      return NEGATIVE_ZERO;
    const index2 = p++;
    indexes.set(thing, index2);
    for (const { key, fn } of custom) {
      const value2 = fn(thing);
      if (value2) {
        stringified[index2] = `["${key}",${flatten(value2)}]`;
        return index2;
      }
    }
    let str = "";
    if (is_primitive(thing)) {
      str = stringify_primitive(thing);
    } else {
      const type = get_type(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          str = `["Object",${stringify_primitive(thing)}]`;
          break;
        case "BigInt":
          str = `["BigInt",${thing}]`;
          break;
        case "Date":
          const valid = !isNaN(thing.getDate());
          str = `["Date","${valid ? thing.toISOString() : ""}"]`;
          break;
        case "RegExp":
          const { source, flags } = thing;
          str = flags ? `["RegExp",${stringify_string(source)},"${flags}"]` : `["RegExp",${stringify_string(source)}]`;
          break;
        case "Array":
          str = "[";
          for (let i = 0; i < thing.length; i += 1) {
            if (i > 0)
              str += ",";
            if (i in thing) {
              keys.push(`[${i}]`);
              str += flatten(thing[i]);
              keys.pop();
            } else {
              str += HOLE;
            }
          }
          str += "]";
          break;
        case "Set":
          str = '["Set"';
          for (const value2 of thing) {
            str += `,${flatten(value2)}`;
          }
          str += "]";
          break;
        case "Map":
          str = '["Map"';
          for (const [key, value2] of thing) {
            keys.push(
              `.get(${is_primitive(key) ? stringify_primitive(key) : "..."})`
            );
            str += `,${flatten(key)},${flatten(value2)}`;
            keys.pop();
          }
          str += "]";
          break;
        default:
          if (!is_plain_object(thing)) {
            throw new DevalueError(
              `Cannot stringify arbitrary non-POJOs`,
              keys
            );
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new DevalueError(
              `Cannot stringify POJOs with symbolic keys`,
              keys
            );
          }
          if (Object.getPrototypeOf(thing) === null) {
            str = '["null"';
            for (const key in thing) {
              keys.push(`.${key}`);
              str += `,${stringify_string(key)},${flatten(thing[key])}`;
              keys.pop();
            }
            str += "]";
          } else {
            str = "{";
            let started = false;
            for (const key in thing) {
              if (started)
                str += ",";
              started = true;
              keys.push(`.${key}`);
              str += `${stringify_string(key)}:${flatten(thing[key])}`;
              keys.pop();
            }
            str += "}";
          }
      }
    }
    stringified[index2] = str;
    return index2;
  }
  const index = flatten(value);
  if (index < 0)
    return `${index}`;
  return `[${stringified.join(",")}]`;
}
function stringify_primitive(thing) {
  const type = typeof thing;
  if (type === "string")
    return stringify_string(thing);
  if (thing instanceof String)
    return stringify_string(thing.toString());
  if (thing === void 0)
    return UNDEFINED.toString();
  if (thing === 0 && 1 / thing < 0)
    return NEGATIVE_ZERO.toString();
  if (type === "bigint")
    return `["BigInt","${thing}"]`;
  return String(thing);
}
function updateProxyField(obj, path, updater) {
  const output = traversePath(obj, path, ({ parent, key, value }) => {
    if (value === void 0)
      parent[key] = /\D/.test(key) ? {} : [];
    return parent[key];
  });
  if (output) {
    const newValue = updater(output.value);
    output.parent[output.key] = newValue;
  }
  return obj;
}
function superFieldProxy(superForm2, path, baseOptions) {
  const form = superForm2.form;
  const path2 = splitPath(path);
  const proxy = derived(form, ($form) => {
    const data = traversePath($form, path2);
    return data?.value;
  });
  return {
    subscribe(...params) {
      const unsub = proxy.subscribe(...params);
      return () => unsub();
    },
    update(upd, options) {
      form.update((data) => updateProxyField(data, path2, upd), options ?? baseOptions);
    },
    set(value, options) {
      form.update((data) => updateProxyField(data, path2, () => value), options ?? baseOptions);
    }
  };
}
function isSuperForm(form, options) {
  const isSuperForm2 = "form" in form;
  if (!isSuperForm2 && options?.taint !== void 0) {
    throw new SuperFormError("If options.taint is set, the whole superForm object must be used as a proxy.");
  }
  return isSuperForm2;
}
function fieldProxy(form, path, options) {
  const path2 = splitPath(path);
  if (isSuperForm(form, options)) {
    return superFieldProxy(form, path, options);
  }
  const proxy = derived(form, ($form) => {
    const data = traversePath($form, path2);
    return data?.value;
  });
  return {
    subscribe(...params) {
      const unsub = proxy.subscribe(...params);
      return () => unsub();
    },
    update(upd) {
      form.update((data) => updateProxyField(data, path2, upd));
    },
    set(value) {
      form.update((data) => updateProxyField(data, path2, () => value));
    }
  };
}
function schemaShape(schema, path = []) {
  const output = _schemaShape(schema, path);
  if (!output)
    throw new SchemaError("No shape could be created for schema.", path);
  return output;
}
function _schemaShape(schema, path) {
  assertSchema(schema, path);
  const info = schemaInfo(schema, false, path);
  if (info.array || info.union) {
    const arr = info.array || [];
    const union = info.union || [];
    return arr.concat(union).reduce((shape, next) => {
      const nextShape = _schemaShape(next, path);
      if (nextShape)
        shape = { ...shape ?? {}, ...nextShape };
      return shape;
    }, arr.length ? {} : void 0);
  }
  if (info.properties) {
    const output = {};
    for (const [key, prop] of Object.entries(info.properties)) {
      const shape = _schemaShape(prop, [...path, key]);
      if (shape)
        output[key] = shape;
    }
    return output;
  }
  return info.types.includes("array") || info.types.includes("object") ? {} : void 0;
}
function shapeFromObject(obj) {
  let output = {};
  const isArray = Array.isArray(obj);
  for (const [key, value] of Object.entries(obj)) {
    if (!value || typeof value !== "object")
      continue;
    if (isArray)
      output = { ...output, ...shapeFromObject(value) };
    else
      output[key] = shapeFromObject(value);
  }
  return output;
}
const formIds = /* @__PURE__ */ new WeakMap();
const initialForms = /* @__PURE__ */ new WeakMap();
const defaultOnError = (event) => {
  console.warn("Unhandled error caught by Superforms, use onError event to handle it:", event.result.error);
};
const defaultFormOptions = {
  applyAction: true,
  invalidateAll: true,
  resetForm: true,
  autoFocusOnError: "detect",
  scrollToError: "smooth",
  errorSelector: '[aria-invalid="true"],[data-invalid]',
  selectErrorText: false,
  stickyNavbar: void 0,
  taintedMessage: false,
  onSubmit: void 0,
  onResult: void 0,
  onUpdate: void 0,
  onUpdated: void 0,
  onError: defaultOnError,
  dataType: "form",
  validators: void 0,
  customValidity: false,
  clearOnSubmit: "message",
  delayMs: 500,
  timeoutMs: 8e3,
  multipleSubmits: "prevent",
  SPA: void 0,
  validationMethod: "auto"
};
let LEGACY_MODE = false;
try {
  if (SUPERFORMS_LEGACY)
    LEGACY_MODE = true;
} catch {
}
let STORYBOOK_MODE = false;
try {
  if (globalThis.STORIES)
    STORYBOOK_MODE = true;
} catch {
}
function superForm(form, formOptions) {
  let initialForm;
  let options = formOptions ?? {};
  let initialValidator = void 0;
  {
    if (options.legacy ?? LEGACY_MODE) {
      if (options.resetForm === void 0)
        options.resetForm = false;
      if (options.taintedMessage === void 0)
        options.taintedMessage = true;
    }
    if (STORYBOOK_MODE) {
      if (options.applyAction === void 0)
        options.applyAction = false;
    }
    if (typeof options.SPA === "string") {
      if (options.invalidateAll === void 0)
        options.invalidateAll = false;
      if (options.applyAction === void 0)
        options.applyAction = false;
    }
    initialValidator = options.validators;
    options = {
      ...defaultFormOptions,
      ...options
    };
    if ((options.SPA === true || typeof options.SPA === "object") && options.validators === void 0) {
      console.warn("No validators set for superForm in SPA mode. Add a validation adapter to the validators option, or set it to false to disable this warning.");
    }
    if (!form) {
      throw new SuperFormError("No form data sent to superForm. Make sure the output from superValidate is used (usually data.form) and that it's not null or undefined. Alternatively, an object with default values for the form can also be used, but then constraints won't be available.");
    }
    if (Context_isValidationObject(form) === false) {
      form = {
        id: options.id ?? Math.random().toString(36).slice(2, 10),
        valid: false,
        posted: false,
        errors: {},
        data: form,
        shape: shapeFromObject(form)
      };
    }
    form = form;
    const _initialFormId = form.id = options.id ?? form.id;
    const _currentPage = get_store_value(page) ?? (STORYBOOK_MODE ? {} : void 0);
    if (!initialForms.has(form)) {
      initialForms.set(form, form);
    }
    initialForm = initialForms.get(form);
    if (_currentPage.form && typeof _currentPage.form === "object") {
      const postedData = _currentPage.form;
      for (const postedForm of Context_findValidationForms(postedData).reverse()) {
        if (postedForm.id == _initialFormId && !initialForms.has(postedForm)) {
          initialForms.set(postedData, postedData);
          const pageDataForm = form;
          form = postedForm;
          form.constraints = pageDataForm.constraints;
          form.shape = pageDataForm.shape;
          if (form.valid && options.resetForm && (options.resetForm === true || options.resetForm())) {
            form = clone(pageDataForm);
            form.message = clone(postedForm.message);
          }
          break;
        }
      }
    } else {
      form = clone(initialForm);
    }
    onDestroy(() => {
      Unsubscriptions_unsubscribe();
      NextChange_clear();
      EnhancedForm_destroy();
      for (const events of Object.values(formEvents)) {
        events.length = 0;
      }
      formIds.get(_currentPage)?.delete(_initialFormId);
    });
    if (options.dataType !== "json") {
      const checkForNestedData = (key, value) => {
        if (!value || typeof value !== "object")
          return;
        if (Array.isArray(value)) {
          if (value.length > 0)
            checkForNestedData(key, value[0]);
        } else if (!(value instanceof Date) && !(value instanceof File) && !browser) {
          throw new SuperFormError(`Object found in form field "${key}". Set the dataType option to "json" and add use:enhance to use nested data structures. More information: https://superforms.rocks/concepts/nested-data`);
        }
      };
      for (const [key, value] of Object.entries(form.data)) {
        checkForNestedData(key, value);
      }
    }
  }
  const __data = {
    formId: form.id,
    form: clone(form.data),
    constraints: form.constraints ?? {},
    posted: form.posted,
    errors: clone(form.errors),
    message: clone(form.message),
    tainted: void 0,
    valid: form.valid,
    submitting: false,
    shape: form.shape
  };
  const Data = __data;
  const FormId = writable(options.id ?? form.id);
  function Context_findValidationForms(data) {
    const forms = Object.values(data).filter((v) => Context_isValidationObject(v) !== false);
    return forms;
  }
  function Context_isValidationObject(object) {
    if (!object || typeof object !== "object")
      return false;
    if (!("valid" in object && "errors" in object && typeof object.valid === "boolean")) {
      return false;
    }
    return "id" in object && typeof object.id === "string" ? object.id : false;
  }
  const _formData = writable(form.data);
  const Form$1 = {
    subscribe: _formData.subscribe,
    set: (value, options2 = {}) => {
      const newData = clone(value);
      Tainted_update(newData, options2.taint ?? true);
      return _formData.set(newData);
    },
    update: (updater, options2 = {}) => {
      return _formData.update((value) => {
        const newData = updater(value);
        Tainted_update(newData, options2.taint ?? true);
        return newData;
      });
    }
  };
  function Form_isSPA() {
    return options.SPA === true || typeof options.SPA === "object";
  }
  async function Form_validate(opts = {}) {
    const dataToValidate = opts.formData ?? Data.form;
    let errors = {};
    let status;
    const validator = opts.adapter ?? options.validators;
    if (typeof validator == "object") {
      if (validator != initialValidator && !("jsonSchema" in validator)) {
        throw new SuperFormError('Client validation adapter found in options.validators. A full adapter must be used when changing validators dynamically, for example "zod" instead of "zodClient".');
      }
      status = await /* @__PURE__ */ validator.validate(dataToValidate);
      if (!status.success) {
        errors = mapErrors(status.issues, validator.shape ?? Data.shape ?? {});
      } else if (opts.recheckValidData !== false) {
        return Form_validate({ ...opts, recheckValidData: false });
      }
    } else {
      status = { success: true, data: {} };
    }
    const data = { ...Data.form, ...dataToValidate, ...status.success ? status.data : {} };
    return {
      valid: status.success,
      posted: false,
      errors,
      data,
      constraints: Data.constraints,
      message: void 0,
      id: Data.formId,
      shape: Data.shape
    };
  }
  function Form__changeEvent(event) {
    if (!options.onChange || !event.paths.length || event.type == "blur")
      return;
    let changeEvent;
    const paths = event.paths.map(mergePath);
    if (event.type && event.paths.length == 1 && event.formElement && event.target instanceof Element) {
      changeEvent = {
        path: paths[0],
        paths,
        formElement: event.formElement,
        target: event.target,
        set(path, value, options2) {
          fieldProxy({ form: Form$1 }, path, options2).set(value);
        },
        get(path) {
          return get_store_value(fieldProxy(Form$1, path));
        }
      };
    } else {
      changeEvent = {
        paths,
        target: void 0,
        set(path, value, options2) {
          fieldProxy({ form: Form$1 }, path, options2).set(value);
        },
        get(path) {
          return get_store_value(fieldProxy(Form$1, path));
        }
      };
    }
    options.onChange(changeEvent);
  }
  async function Form_clientValidation(event, force = false, adapter) {
    if (event) {
      if (options.validators == "clear") {
        Errors.update(($errors) => {
          setPaths($errors, event.paths, void 0);
          return $errors;
        });
      }
      setTimeout(() => Form__changeEvent(event));
    }
    let skipValidation = false;
    if (!force) {
      if (options.validationMethod == "onsubmit" || options.validationMethod == "submit-only") {
        skipValidation = true;
      } else if (options.validationMethod == "onblur" && event?.type == "input")
        skipValidation = true;
      else if (options.validationMethod == "oninput" && event?.type == "blur")
        skipValidation = true;
    }
    if (skipValidation || !event || !options.validators || options.validators == "clear") {
      if (event?.paths) {
        const formElement = event?.formElement ?? EnhancedForm_get();
        if (formElement)
          Form__clearCustomValidity(formElement, event.paths);
      }
      return;
    }
    const result = await Form_validate({ adapter });
    if (result.valid && (event.immediate || event.type != "input")) {
      Form$1.set(result.data, { taint: "ignore" });
    }
    await tick();
    Form__displayNewErrors(result.errors, event, force);
    return result;
  }
  function Form__clearCustomValidity(formElement, paths) {
    const validity = /* @__PURE__ */ new Map();
    if (options.customValidity && formElement) {
      for (const path of paths) {
        const name = CSS.escape(mergePath(path));
        const el = formElement.querySelector(`[name="${name}"]`);
        if (el) {
          const message = "validationMessage" in el ? String(el.validationMessage) : "";
          validity.set(path.join("."), { el, message });
          updateCustomValidity(el, void 0);
        }
      }
    }
    return validity;
  }
  async function Form__displayNewErrors(errors, event, force) {
    const { type, immediate, multiple, paths } = event;
    const previous = Data.errors;
    const output = {};
    let validity = /* @__PURE__ */ new Map();
    const formElement = event.formElement ?? EnhancedForm_get();
    if (formElement)
      validity = Form__clearCustomValidity(formElement, event.paths);
    traversePaths(errors, (error) => {
      if (!Array.isArray(error.value))
        return;
      const currentPath = [...error.path];
      if (currentPath[currentPath.length - 1] == "_errors") {
        currentPath.pop();
      }
      const joinedPath = currentPath.join(".");
      function addError() {
        setPaths(output, [error.path], error.value);
        if (options.customValidity && isEventError && validity.has(joinedPath)) {
          const { el, message } = validity.get(joinedPath);
          if (message != error.value) {
            updateCustomValidity(el, error.value);
            validity.clear();
          }
        }
      }
      if (force)
        return addError();
      const lastPath = error.path[error.path.length - 1];
      const isObjectError = lastPath == "_errors";
      const isEventError = error.value && paths.some((path) => {
        return isObjectError ? currentPath && path && currentPath.length > 0 && currentPath[0] == path[0] : joinedPath == path.join(".");
      });
      if (isEventError && options.validationMethod == "oninput")
        return addError();
      if (immediate && !multiple && isEventError)
        return addError();
      if (multiple) {
        const errorPath = pathExists(get_store_value(Errors), error.path.slice(0, -1));
        if (errorPath?.value && typeof errorPath?.value == "object") {
          for (const errors2 of Object.values(errorPath.value)) {
            if (Array.isArray(errors2)) {
              return addError();
            }
          }
        }
      }
      const previousError = pathExists(previous, error.path);
      if (previousError && previousError.key in previousError.parent) {
        return addError();
      }
      if (isObjectError) {
        if (options.validationMethod == "oninput" || type == "blur" && Tainted_hasBeenTainted(mergePath(error.path.slice(0, -1)))) {
          return addError();
        }
      } else {
        if (type == "blur" && isEventError) {
          return addError();
        }
      }
    });
    Errors.set(output);
  }
  function Form_set(data, options2 = {}) {
    if (options2.keepFiles) {
      traversePaths(Data.form, (info) => {
        if (info.value instanceof File || browser) {
          const dataPath = pathExists(data, info.path);
          if (!dataPath || !(dataPath.key in dataPath.parent)) {
            setPaths(data, [info.path], info.value);
          }
        }
      });
    }
    return Form$1.set(data, options2);
  }
  function Form_shouldReset(validForm, successActionResult) {
    return validForm && successActionResult && options.resetForm && (options.resetForm === true || options.resetForm());
  }
  async function Form_updateFromValidation(form2, successResult) {
    if (form2.valid && successResult && Form_shouldReset(form2.valid, successResult)) {
      Form_reset({ message: form2.message, posted: true });
    } else {
      rebind({
        form: form2,
        untaint: successResult,
        keepFiles: true,
        // Check if the form data should be used for updating, or if the invalidateAll load function should be used:
        skipFormData: options.invalidateAll == "force"
      });
    }
    if (formEvents.onUpdated.length) {
      await tick();
    }
    for (const event of formEvents.onUpdated) {
      event({ form: form2 });
    }
  }
  function Form_reset(opts = {}) {
    if (opts.newState)
      initialForm.data = { ...initialForm.data, ...opts.newState };
    const resetData = clone(initialForm);
    resetData.data = { ...resetData.data, ...opts.data };
    if (opts.id !== void 0)
      resetData.id = opts.id;
    rebind({
      form: resetData,
      untaint: true,
      message: opts.message,
      keepFiles: false,
      posted: opts.posted
    });
  }
  async function Form_updateFromActionResult(result) {
    if (result.type == "error") {
      throw new SuperFormError(`ActionResult of type "${result.type}" cannot be passed to update function.`);
    }
    if (result.type == "redirect") {
      if (Form_shouldReset(true, true))
        Form_reset({ posted: true });
      return;
    }
    if (typeof result.data !== "object") {
      throw new SuperFormError("Non-object validation data returned from ActionResult.");
    }
    const forms = Context_findValidationForms(result.data);
    if (!forms.length) {
      throw new SuperFormError("No form data returned from ActionResult. Make sure you return { form } in the form actions.");
    }
    for (const newForm of forms) {
      if (newForm.id !== Data.formId)
        continue;
      await Form_updateFromValidation(newForm, result.status >= 200 && result.status < 300);
    }
  }
  const Message = writable(__data.message);
  const Constraints = writable(__data.constraints);
  const Posted = writable(__data.posted);
  const Shape = writable(__data.shape);
  const _errors = writable(form.errors);
  const Errors = {
    subscribe: _errors.subscribe,
    set(value, options2) {
      return _errors.set(updateErrors(value, Data.errors, options2?.force));
    },
    update(updater, options2) {
      return _errors.update((value) => {
        return updateErrors(updater(value), Data.errors, options2?.force);
      });
    },
    /**
     * To work with client-side validation, errors cannot be deleted but must
     * be set to undefined, to know where they existed before (tainted+error check in oninput)
     */
    clear: () => Errors.set({})
  };
  let NextChange = null;
  function NextChange_setHtmlEvent(event) {
    if (NextChange && event && Object.keys(event).length == 1 && event.paths?.length && NextChange.target && NextChange.target instanceof HTMLInputElement && NextChange.target.type.toLowerCase() == "file") {
      NextChange.paths = event.paths;
    } else {
      NextChange = event;
    }
    setTimeout(() => {
      Form_clientValidation(NextChange);
    }, 0);
  }
  function NextChange_additionalEventInformation(event, immediate, multiple, formElement, target) {
    if (NextChange === null) {
      NextChange = { paths: [] };
    }
    NextChange.type = event;
    NextChange.immediate = immediate;
    NextChange.multiple = multiple;
    NextChange.formElement = formElement;
    NextChange.target = target;
  }
  function NextChange_paths() {
    return NextChange?.paths ?? [];
  }
  function NextChange_clear() {
    NextChange = null;
  }
  const Tainted = {
    defaultMessage: "Leave page? Changes that you made may not be saved.",
    state: writable(),
    message: options.taintedMessage,
    clean: clone(form.data),
    // Important to clone form.data, so it's not comparing the same object,
    forceRedirection: false
  };
  function Tainted_enable() {
    options.taintedMessage = Tainted.message;
  }
  function Tainted_currentState() {
    return Tainted.state;
  }
  function Tainted_hasBeenTainted(path) {
    if (!Data.tainted)
      return false;
    if (!path)
      return !!Data.tainted;
    const field = pathExists(Data.tainted, splitPath(path));
    return !!field && field.key in field.parent;
  }
  function Tainted_isTainted(path) {
    if (typeof path === "boolean")
      return path;
    if (typeof path === "object")
      return Tainted__isObjectTainted(path);
    if (!Data.tainted)
      return false;
    if (!path)
      return Tainted__isObjectTainted(Data.tainted);
    const field = pathExists(Data.tainted, splitPath(path));
    return Tainted__isObjectTainted(field?.value);
  }
  function Tainted__isObjectTainted(obj) {
    if (!obj)
      return false;
    if (typeof obj === "object") {
      for (const obj2 of Object.values(obj)) {
        if (Tainted__isObjectTainted(obj2))
          return true;
      }
    }
    return obj === true;
  }
  function Tainted_update(newData, taintOptions) {
    if (taintOptions == "ignore")
      return;
    const paths = comparePaths(newData, Data.form);
    const newTainted = comparePaths(newData, Tainted.clean).map((path) => path.join());
    if (paths.length) {
      if (taintOptions == "untaint-all" || taintOptions == "untaint-form") {
        Tainted.state.set(void 0);
      } else {
        Tainted.state.update((currentlyTainted) => {
          if (!currentlyTainted)
            currentlyTainted = {};
          setPaths(currentlyTainted, paths, (path, data) => {
            if (!newTainted.includes(path.join()))
              return void 0;
            const currentValue = traversePath(newData, path);
            const cleanPath = traversePath(Tainted.clean, path);
            return currentValue && cleanPath && currentValue.value === cleanPath.value ? void 0 : taintOptions === true ? true : taintOptions === "untaint" ? void 0 : data.value;
          });
          return currentlyTainted;
        });
      }
    }
    NextChange_setHtmlEvent({ paths });
  }
  function Tainted_set(tainted, newClean) {
    Tainted.state.set(tainted);
    if (newClean)
      Tainted.clean = newClean;
  }
  const Submitting = writable(false);
  const Delayed = writable(false);
  const Timeout = writable(false);
  const Unsubscriptions = [
    // eslint-disable-next-line dci-lint/private-role-access
    Tainted.state.subscribe((tainted) => __data.tainted = clone(tainted)),
    // eslint-disable-next-line dci-lint/private-role-access
    Form$1.subscribe((form2) => __data.form = clone(form2)),
    // eslint-disable-next-line dci-lint/private-role-access
    Errors.subscribe((errors) => __data.errors = clone(errors)),
    FormId.subscribe((id) => __data.formId = id),
    Constraints.subscribe((constraints2) => __data.constraints = constraints2),
    Posted.subscribe((posted) => __data.posted = posted),
    Message.subscribe((message) => __data.message = message),
    Submitting.subscribe((submitting) => __data.submitting = submitting),
    Shape.subscribe((shape) => __data.shape = shape)
  ];
  function Unsubscriptions_unsubscribe() {
    Unsubscriptions.forEach((unsub) => unsub());
  }
  let EnhancedForm;
  function EnhancedForm_get() {
    return EnhancedForm;
  }
  function EnhancedForm_setAction(action) {
    if (EnhancedForm)
      EnhancedForm.action = action;
  }
  function EnhancedForm_destroy() {
    if (EnhancedForm?.parentElement) {
      EnhancedForm.remove();
    }
    EnhancedForm = void 0;
  }
  const AllErrors = derived(Errors, ($errors) => $errors ? flattenErrors($errors) : []);
  options.taintedMessage = void 0;
  function rebind(opts) {
    const form2 = opts.form;
    const message = opts.message ?? form2.message;
    if (opts.untaint) {
      Tainted_set(typeof opts.untaint === "boolean" ? void 0 : opts.untaint, form2.data);
    }
    if (opts.skipFormData !== true) {
      Form_set(form2.data, {
        taint: "ignore",
        keepFiles: opts.keepFiles
      });
    }
    Message.set(message);
    Errors.set(form2.errors);
    FormId.set(form2.id);
    Posted.set(opts.posted ?? form2.posted);
    if (form2.constraints)
      Constraints.set(form2.constraints);
    if (form2.shape)
      Shape.set(form2.shape);
    __data.valid = form2.valid;
    if (options.flashMessage && shouldSyncFlash(options)) {
      const flash = options.flashMessage.module.getFlash(page);
      if (message && get_store_value(flash) === void 0) {
        flash.set(message);
      }
    }
  }
  const formEvents = {
    onSubmit: options.onSubmit ? [options.onSubmit] : [],
    onResult: options.onResult ? [options.onResult] : [],
    onUpdate: options.onUpdate ? [options.onUpdate] : [],
    onUpdated: options.onUpdated ? [options.onUpdated] : [],
    onError: options.onError ? [options.onError] : []
  };
  function superFormEnhance(FormElement, events) {
    if (options.SPA !== void 0 && FormElement.method == "get")
      FormElement.method = "post";
    if (typeof options.SPA === "string") {
      if (options.SPA.length && FormElement.action == document.location.href) {
        FormElement.action = options.SPA;
      }
    } else {
      EnhancedForm = FormElement;
    }
    if (events) {
      if (events.onError) {
        if (options.onError === "apply") {
          throw new SuperFormError('options.onError is set to "apply", cannot add any onError events.');
        } else if (events.onError === "apply") {
          throw new SuperFormError('Cannot add "apply" as onError event in use:enhance.');
        }
        formEvents.onError.push(events.onError);
      }
      if (events.onResult)
        formEvents.onResult.push(events.onResult);
      if (events.onSubmit)
        formEvents.onSubmit.push(events.onSubmit);
      if (events.onUpdate)
        formEvents.onUpdate.push(events.onUpdate);
      if (events.onUpdated)
        formEvents.onUpdated.push(events.onUpdated);
    }
    Tainted_enable();
    let lastInputChange;
    async function onInput(e) {
      const info = inputInfo(e.target);
      if (info.immediate && !info.file)
        await new Promise((r) => setTimeout(r, 0));
      lastInputChange = NextChange_paths();
      NextChange_additionalEventInformation("input", info.immediate, info.multiple, FormElement, e.target ?? void 0);
    }
    async function onBlur(e) {
      if (Data.submitting)
        return;
      if (!lastInputChange || NextChange_paths() != lastInputChange) {
        return;
      }
      const info = inputInfo(e.target);
      if (info.immediate && !info.file)
        await new Promise((r) => setTimeout(r, 0));
      Form_clientValidation({
        paths: lastInputChange,
        immediate: info.multiple,
        multiple: info.multiple,
        type: "blur",
        formElement: FormElement,
        target: e.target ?? void 0
      });
      lastInputChange = void 0;
    }
    FormElement.addEventListener("focusout", onBlur);
    FormElement.addEventListener("input", onInput);
    onDestroy(() => {
      FormElement.removeEventListener("focusout", onBlur);
      FormElement.removeEventListener("input", onInput);
    });
    const htmlForm = Form(FormElement, { submitting: Submitting, delayed: Delayed, timeout: Timeout }, options);
    let currentRequest;
    return enhance(FormElement, async (submitParams) => {
      let jsonData = void 0;
      let validationAdapter = options.validators;
      const submit = {
        ...submitParams,
        jsonData(data) {
          if (options.dataType !== "json") {
            throw new SuperFormError("options.dataType must be set to 'json' to use jsonData.");
          }
          jsonData = data;
        },
        validators(adapter) {
          validationAdapter = adapter;
        }
      };
      const _submitCancel = submit.cancel;
      let cancelled = false;
      function clientValidationResult(validation) {
        const validationResult = { ...validation, posted: true };
        const status = validationResult.valid ? 200 : (typeof options.SPA === "boolean" || typeof options.SPA === "string" ? void 0 : options.SPA?.failStatus) ?? 400;
        const data = { form: validationResult };
        const result = validationResult.valid ? { type: "success", status, data } : { type: "failure", status, data };
        setTimeout(() => validationResponse({ result }), 0);
      }
      function clearOnSubmit() {
        switch (options.clearOnSubmit) {
          case "errors-and-message":
            Errors.clear();
            Message.set(void 0);
            break;
          case "errors":
            Errors.clear();
            break;
          case "message":
            Message.set(void 0);
            break;
        }
      }
      function cancel(opts = {
        resetTimers: true
      }) {
        cancelled = true;
        if (opts.resetTimers && htmlForm.isSubmitting()) {
          htmlForm.completed({ cancelled });
        }
        return _submitCancel();
      }
      submit.cancel = cancel;
      if (htmlForm.isSubmitting() && options.multipleSubmits == "prevent") {
        cancel({ resetTimers: false });
      } else {
        if (htmlForm.isSubmitting() && options.multipleSubmits == "abort") {
          if (currentRequest)
            currentRequest.abort();
        }
        htmlForm.submitting();
        currentRequest = submit.controller;
        for (const event of formEvents.onSubmit) {
          await event(submit);
        }
      }
      if (cancelled && options.flashMessage)
        cancelFlash(options);
      if (!cancelled) {
        const noValidate = !Form_isSPA() && (FormElement.noValidate || (submit.submitter instanceof HTMLButtonElement || submit.submitter instanceof HTMLInputElement) && submit.submitter.formNoValidate);
        let validation = void 0;
        const validateForm = async () => {
          return await Form_validate({ adapter: validationAdapter });
        };
        clearOnSubmit();
        if (!noValidate) {
          validation = await validateForm();
          if (!validation.valid) {
            cancel({ resetTimers: false });
            clientValidationResult(validation);
          }
        }
        if (!cancelled) {
          if (options.flashMessage && (options.clearOnSubmit == "errors-and-message" || options.clearOnSubmit == "message") && shouldSyncFlash(options)) {
            options.flashMessage.module.getFlash(page).set(void 0);
          }
          const submitData = "formData" in submit ? submit.formData : submit.data;
          lastInputChange = void 0;
          if (Form_isSPA()) {
            if (!validation)
              validation = await validateForm();
            cancel({ resetTimers: false });
            clientValidationResult(validation);
          } else if (options.dataType === "json") {
            if (!validation)
              validation = await validateForm();
            const postData = clone(jsonData ?? validation.data);
            traversePaths(postData, (data) => {
              if (data.value instanceof File) {
                const key = "__superform_file_" + mergePath(data.path);
                submitData.append(key, data.value);
                return data.set(void 0);
              } else if (Array.isArray(data.value) && data.value.length && data.value.every((v) => v instanceof File)) {
                const key = "__superform_files_" + mergePath(data.path);
                for (const file of data.value) {
                  submitData.append(key, file);
                }
                return data.set(void 0);
              }
            });
            Object.keys(postData).forEach((key) => {
              if (typeof submitData.get(key) === "string") {
                submitData.delete(key);
              }
            });
            const chunks = chunkSubstr(stringify(postData), options.jsonChunkSize ?? 5e5);
            for (const chunk of chunks) {
              submitData.append("__superform_json", chunk);
            }
          }
          if (!submitData.has("__superform_id")) {
            const id = Data.formId;
            if (id !== void 0)
              submitData.set("__superform_id", id);
          }
          if (typeof options.SPA === "string") {
            EnhancedForm_setAction(options.SPA);
          }
        }
      }
      function chunkSubstr(str, size) {
        const numChunks = Math.ceil(str.length / size);
        const chunks = new Array(numChunks);
        for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
          chunks[i] = str.substring(o, o + size);
        }
        return chunks;
      }
      async function validationResponse(event) {
        let cancelled2 = false;
        currentRequest = null;
        let result = "type" in event.result && "status" in event.result ? event.result : {
          type: "error",
          status: parseInt(String(event.result.status)) || 500,
          error: event.result.error instanceof Error ? event.result.error : event.result
        };
        const cancel2 = () => cancelled2 = true;
        const data = {
          result,
          formEl: FormElement,
          formElement: FormElement,
          cancel: cancel2
        };
        const unsubCheckforNav = STORYBOOK_MODE || !Form_isSPA() ? () => {
        } : navigating.subscribe(($nav) => {
          if (!$nav || $nav.from?.route.id === $nav.to?.route.id)
            return;
          cancel2();
        });
        for (const event2 of formEvents.onResult) {
          await event2(data);
        }
        result = data.result;
        if (!cancelled2) {
          if ((result.type === "success" || result.type == "failure") && result.data) {
            const forms = Context_findValidationForms(result.data);
            if (!forms.length) {
              throw new SuperFormError("No form data returned from ActionResult. Make sure you return { form } in the form actions.");
            }
            for (const newForm of forms) {
              if (newForm.id !== Data.formId)
                continue;
              const data2 = {
                form: newForm,
                formEl: FormElement,
                formElement: FormElement,
                cancel: () => cancelled2 = true,
                result
              };
              for (const event2 of formEvents.onUpdate) {
                await event2(data2);
              }
              result = data2.result;
              if (!cancelled2) {
                if (options.customValidity) {
                  setCustomValidityForm(FormElement, data2.form.errors);
                }
                if (Form_shouldReset(data2.form.valid, result.type == "success")) {
                  data2.formElement.querySelectorAll('input[type="file"]').forEach((e) => e.value = "");
                }
              }
            }
          }
          if (!cancelled2) {
            if (result.type !== "error") {
              if (result.type === "success" && options.invalidateAll) {
                await invalidateAll();
              }
              if (options.applyAction) {
                await applyAction();
              } else {
                await Form_updateFromActionResult(result);
              }
            } else {
              if (options.applyAction) {
                if (options.onError == "apply") {
                  await applyAction();
                } else {
                  ({
                    type: "failure",
                    status: Math.floor(result.status || 500),
                    data: result
                  });
                  await applyAction();
                }
              }
              if (options.onError !== "apply") {
                const data2 = { result, message: Message };
                for (const onErrorEvent of formEvents.onError) {
                  if (onErrorEvent !== "apply" && (onErrorEvent != defaultOnError || !options.flashMessage?.onError)) {
                    await onErrorEvent(data2);
                  }
                }
              }
            }
            if (options.flashMessage) {
              if (result.type == "error" && options.flashMessage.onError) {
                await options.flashMessage.onError({
                  result,
                  flashMessage: options.flashMessage.module.getFlash(page)
                });
              }
            }
          }
        }
        if (cancelled2 && options.flashMessage) {
          cancelFlash(options);
        }
        if (cancelled2 || result.type != "redirect") {
          htmlForm.completed({ cancelled: cancelled2 });
        } else if (STORYBOOK_MODE) {
          htmlForm.completed({ cancelled: cancelled2, clearAll: true });
        } else {
          const unsub = navigating.subscribe(($nav) => {
            if ($nav)
              return;
            setTimeout(() => {
              try {
                if (unsub)
                  unsub();
              } catch {
              }
            });
            if (htmlForm.isSubmitting()) {
              htmlForm.completed({ cancelled: cancelled2, clearAll: true });
            }
          });
        }
        unsubCheckforNav();
      }
      return validationResponse;
    });
  }
  function removeFiles(formData) {
    const paths = [];
    traversePaths(formData, (data2) => {
      if (data2.value instanceof File) {
        paths.push(data2.path);
        return "skip";
      } else if (Array.isArray(data2.value) && data2.value.length && data2.value.every((d) => d instanceof File)) {
        paths.push(data2.path);
        return "skip";
      }
    });
    if (!paths.length)
      return { data: formData, paths };
    const data = clone(formData);
    setPaths(data, paths, (path) => pathExists(initialForm.data, path)?.value);
    return { data, paths };
  }
  return {
    form: Form$1,
    formId: FormId,
    errors: Errors,
    message: Message,
    constraints: Constraints,
    tainted: Tainted_currentState(),
    submitting: readonly(Submitting),
    delayed: readonly(Delayed),
    timeout: readonly(Timeout),
    options,
    capture() {
      const { data, paths } = removeFiles(Data.form);
      let tainted = Data.tainted;
      if (paths.length) {
        tainted = clone(tainted) ?? {};
        setPaths(tainted, paths, false);
      }
      return {
        valid: Data.valid,
        posted: Data.posted,
        errors: Data.errors,
        data,
        constraints: Data.constraints,
        message: Data.message,
        id: Data.formId,
        tainted,
        shape: Data.shape
      };
    },
    restore: (snapshot) => {
      rebind({ form: snapshot, untaint: snapshot.tainted ?? true });
    },
    async validate(path, opts = {}) {
      if (!options.validators) {
        throw new SuperFormError("options.validators must be set to use the validate method.");
      }
      if (opts.update === void 0)
        opts.update = true;
      if (opts.taint === void 0)
        opts.taint = false;
      if (typeof opts.errors == "string")
        opts.errors = [opts.errors];
      let data;
      const splittedPath = splitPath(path);
      if ("value" in opts) {
        if (opts.update === true || opts.update === "value") {
          Form$1.update(($form) => {
            setPaths($form, [splittedPath], opts.value);
            return $form;
          }, { taint: opts.taint });
          data = Data.form;
        } else {
          data = clone(Data.form);
          setPaths(data, [splittedPath], opts.value);
        }
      } else {
        data = Data.form;
      }
      const result = await Form_validate({ formData: data });
      const error = pathExists(result.errors, splittedPath);
      if (error && error.value && opts.errors) {
        error.value = opts.errors;
      }
      if (opts.update === true || opts.update == "errors") {
        Errors.update(($errors) => {
          setPaths($errors, [splittedPath], error?.value);
          return $errors;
        });
      }
      return error?.value;
    },
    async validateForm(opts = {}) {
      if (!options.validators && !opts.schema) {
        throw new SuperFormError("options.validators or the schema option must be set to use the validateForm method.");
      }
      const result = opts.update ? await Form_clientValidation({ paths: [] }, true, opts.schema) : Form_validate({ adapter: opts.schema });
      const enhancedForm = EnhancedForm_get();
      if (opts.update && enhancedForm) {
        setTimeout(() => {
          if (!enhancedForm)
            return;
          scrollToFirstError(enhancedForm, {
            ...options,
            scrollToError: opts.focusOnError === false ? "off" : options.scrollToError
          });
        }, 1);
      }
      return result || Form_validate({ adapter: opts.schema });
    },
    allErrors: AllErrors,
    posted: Posted,
    reset(options2) {
      return Form_reset({
        message: options2?.keepMessage ? Data.message : void 0,
        data: options2?.data,
        id: options2?.id,
        newState: options2?.newState
      });
    },
    submit(submitter) {
      const form2 = EnhancedForm_get() ? EnhancedForm_get() : submitter && submitter instanceof HTMLElement ? submitter.closest("form") : void 0;
      if (!form2) {
        throw new SuperFormError("use:enhance must be added to the form to use submit, or pass a HTMLElement inside the form (or the form itself) as an argument.");
      }
      if (!form2.requestSubmit) {
        return form2.submit();
      }
      const isSubmitButton = submitter && (submitter instanceof HTMLButtonElement && submitter.type == "submit" || submitter instanceof HTMLInputElement && ["submit", "image"].includes(submitter.type));
      form2.requestSubmit(isSubmitButton ? submitter : void 0);
    },
    isTainted: Tainted_isTainted,
    enhance: superFormEnhance
  };
}
function constraints(schema) {
  return _constraints(schemaInfo(schema, false, []), []);
}
function merge(...constraints2) {
  const filtered = constraints2.filter((c) => !!c);
  if (!filtered.length)
    return void 0;
  if (filtered.length == 1)
    return filtered[0];
  return merge$1(...filtered);
}
function _constraints(info, path) {
  if (!info)
    return void 0;
  let output = void 0;
  if (info.union && info.union.length) {
    const infos = info.union.map((s) => schemaInfo(s, info.isOptional, path));
    const merged = infos.map((i) => _constraints(i, path));
    output = merge(output, ...merged);
    if (output && (info.isNullable || info.isOptional || infos.some((i) => i?.isNullable || i?.isOptional))) {
      delete output.required;
    }
  }
  if (info.array) {
    output = merge(output, ...info.array.map((i) => _constraints(schemaInfo(i, info.isOptional, path), path)));
  }
  if (info.properties) {
    const obj = {};
    for (const [key, prop] of Object.entries(info.properties)) {
      const propInfo = schemaInfo(prop, !info.required?.includes(key) || prop.default !== void 0, [key]);
      const propConstraint = _constraints(propInfo, [...path, key]);
      if (typeof propConstraint === "object" && Object.values(propConstraint).length > 0) {
        obj[key] = propConstraint;
      }
    }
    output = merge(output, obj);
  }
  return output ?? constraint(info);
}
function constraint(info) {
  const output = {};
  const schema = info.schema;
  const type = schema.type;
  const format = schema.format;
  if (type == "integer" && format == "unix-time") {
    const date = schema;
    if (date.minimum !== void 0)
      output.min = new Date(date.minimum).toISOString();
    if (date.maximum !== void 0)
      output.max = new Date(date.maximum).toISOString();
  } else if (type == "string") {
    const str = schema;
    const patterns = [
      str.pattern,
      ...str.allOf ? str.allOf.map((s) => typeof s == "boolean" ? void 0 : s.pattern) : []
    ].filter((s) => s !== void 0);
    if (patterns.length > 0)
      output.pattern = patterns[0];
    if (str.minLength !== void 0)
      output.minlength = str.minLength;
    if (str.maxLength !== void 0)
      output.maxlength = str.maxLength;
  } else if (type == "number" || type == "integer") {
    const num = schema;
    if (num.minimum !== void 0)
      output.min = num.minimum;
    else if (num.exclusiveMinimum !== void 0)
      output.min = num.exclusiveMinimum + (type == "integer" ? 1 : Number.MIN_VALUE);
    if (num.maximum !== void 0)
      output.max = num.maximum;
    else if (num.exclusiveMaximum !== void 0)
      output.max = num.exclusiveMaximum - (type == "integer" ? 1 : Number.MIN_VALUE);
    if (num.multipleOf !== void 0)
      output.step = num.multipleOf;
  } else if (type == "array") {
    const arr = schema;
    if (arr.minItems !== void 0)
      output.min = arr.minItems;
    if (arr.maxItems !== void 0)
      output.max = arr.maxItems;
  }
  if (!info.isNullable && !info.isOptional) {
    output.required = true;
  }
  return Object.keys(output).length > 0 ? output : void 0;
}
function schemaHash(schema) {
  return hashCode(_schemaHash(schemaInfo(schema, false, []), 0, []));
}
function _schemaHash(info, depth, path) {
  if (!info)
    return "";
  function tab() {
    return "  ".repeat(depth);
  }
  function mapSchemas(schemas) {
    return schemas.map((s) => _schemaHash(schemaInfo(s, info?.isOptional ?? false, path), depth + 1, path)).filter((s) => s).join("|");
  }
  function nullish() {
    const output = [];
    if (info?.isNullable)
      output.push("null");
    if (info?.isOptional)
      output.push("undefined");
    return !output.length ? "" : "|" + output.join("|");
  }
  if (info.union) {
    return "Union {\n  " + tab() + mapSchemas(info.union) + "\n" + tab() + "}" + nullish();
  }
  if (info.properties) {
    const output = [];
    for (const [key, prop] of Object.entries(info.properties)) {
      const propInfo = schemaInfo(prop, !info.required?.includes(key) || prop.default !== void 0, [key]);
      output.push(key + ": " + _schemaHash(propInfo, depth + 1, path));
    }
    return "Object {\n  " + tab() + output.join(",\n  ") + "\n" + tab() + "}" + nullish();
  }
  if (info.array) {
    return "Array[" + mapSchemas(info.array) + "]" + nullish();
  }
  return info.types.join("|") + nullish();
}
function hashCode(str) {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  if (hash < 0)
    hash = hash >>> 0;
  return hash.toString(36);
}
// @__NO_SIDE_EFFECTS__
function createAdapter(adapter, jsonSchema) {
  if (!adapter || !("superFormValidationLibrary" in adapter)) {
    throw new SuperFormError('Superforms v2 requires a validation adapter for the schema. Import one of your choice from "sveltekit-superforms/adapters" and wrap the schema with it.');
  }
  if (!jsonSchema)
    jsonSchema = adapter.jsonSchema;
  return {
    ...adapter,
    constraints: adapter.constraints ?? constraints(jsonSchema),
    defaults: adapter.defaults ?? defaultValues(jsonSchema),
    shape: schemaShape(jsonSchema),
    id: schemaHash(jsonSchema)
  };
}
let legacyMode = false;
try {
  if (SUPERFORMS_LEGACY)
    legacyMode = true;
} catch {
}
const unionError = 'FormData parsing failed: Unions are only supported when the dataType option for superForm is set to "json".';
async function parseRequest(data, schemaData, options) {
  let parsed;
  if (data instanceof FormData) {
    parsed = parseFormData(data, schemaData, options);
  } else if (data instanceof URL || data instanceof URLSearchParams) {
    parsed = parseSearchParams(data, schemaData, options);
  } else if (data instanceof Request) {
    parsed = await tryParseFormData(data, schemaData, options);
  } else if (
    // RequestEvent
    data && typeof data === "object" && "request" in data && data.request instanceof Request
  ) {
    parsed = await tryParseFormData(data.request, schemaData, options);
  } else {
    parsed = {
      id: void 0,
      data,
      posted: false
    };
  }
  return parsed;
}
async function tryParseFormData(request, schemaData, options) {
  let formData = void 0;
  try {
    formData = await request.formData();
  } catch (e) {
    if (e instanceof TypeError && e.message.includes("already been consumed")) {
      throw e;
    }
    return { id: void 0, data: void 0, posted: false };
  }
  return parseFormData(formData, schemaData, options);
}
function parseSearchParams(data, schemaData, options) {
  if (data instanceof URL)
    data = data.searchParams;
  const convert = new FormData();
  for (const [key, value] of data.entries()) {
    convert.append(key, value);
  }
  const output = parseFormData(convert, schemaData, options);
  output.posted = false;
  return output;
}
function parseFormData(formData, schemaData, options) {
  function tryParseSuperJson() {
    if (formData.has("__superform_json")) {
      try {
        const output = parse(formData.getAll("__superform_json").join("") ?? "");
        if (typeof output === "object") {
          const filePaths = Array.from(formData.keys());
          for (const path of filePaths.filter((path2) => path2.startsWith("__superform_file_"))) {
            const realPath = splitPath(path.substring(17));
            setPaths(output, [realPath], formData.get(path));
          }
          for (const path of filePaths.filter((path2) => path2.startsWith("__superform_files_"))) {
            const realPath = splitPath(path.substring(18));
            const allFiles = formData.getAll(path);
            setPaths(output, [realPath], Array.from(allFiles));
          }
          return output;
        }
      } catch {
      }
    }
    return null;
  }
  const data = tryParseSuperJson();
  const id = formData.get("__superform_id")?.toString();
  return data ? { id, data, posted: true } : {
    id,
    data: _parseFormData(formData, schemaData, options),
    posted: true
  };
}
function _parseFormData(formData, schema, options) {
  const output = {};
  const schemaKeys = options?.strict ? new Set([...formData.keys()].filter((key) => !key.startsWith("__superform_"))) : new Set([
    ...Object.keys(schema.properties ?? {}),
    ...schema.additionalProperties ? formData.keys() : []
  ].filter((key) => !key.startsWith("__superform_")));
  function parseSingleEntry(key, entry, info) {
    if (options?.preprocessed && options.preprocessed.includes(key)) {
      return entry;
    }
    if (entry && typeof entry !== "string") {
      const allowFiles = legacyMode ? options?.allowFiles === true : options?.allowFiles !== false;
      return !allowFiles ? void 0 : entry.size ? entry : info.isNullable ? null : void 0;
    }
    if (info.types.length > 1) {
      throw new SchemaError(unionError, key);
    }
    const [type] = info.types;
    return parseFormDataEntry(key, entry, type ?? "any", info);
  }
  const defaultPropertyType = typeof schema.additionalProperties == "object" ? schema.additionalProperties : { type: "string" };
  for (const key of schemaKeys) {
    const property = schema.properties ? schema.properties[key] : defaultPropertyType;
    assertSchema(property, key);
    const info = schemaInfo(property ?? defaultPropertyType, !schema.required?.includes(key), [
      key
    ]);
    if (!info)
      continue;
    if (!info.types.includes("boolean") && !schema.additionalProperties && !formData.has(key)) {
      continue;
    }
    const entries = formData.getAll(key);
    if (info.union && info.union.length > 1) {
      throw new SchemaError(unionError, key);
    }
    if (info.types.includes("array") || info.types.includes("set")) {
      const items = property.items ?? (info.union?.length == 1 ? info.union[0] : void 0);
      if (!items || typeof items == "boolean" || Array.isArray(items) && items.length != 1) {
        throw new SchemaError('Arrays must have a single "items" property that defines its type.', key);
      }
      const arrayType = Array.isArray(items) ? items[0] : items;
      assertSchema(arrayType, key);
      const arrayInfo = schemaInfo(arrayType, info.isOptional, [key]);
      if (!arrayInfo)
        continue;
      const isFileArray = entries.length && entries.some((e) => e && typeof e !== "string");
      const arrayData = entries.map((e) => parseSingleEntry(key, e, arrayInfo));
      if (isFileArray && arrayData.every((file) => !file))
        arrayData.length = 0;
      output[key] = info.types.includes("set") ? new Set(arrayData) : arrayData;
    } else {
      output[key] = parseSingleEntry(key, entries[entries.length - 1], info);
    }
  }
  return output;
}
function parseFormDataEntry(key, value, type, info) {
  if (!value) {
    if (type == "boolean" && info.isOptional && info.schema.default === true) {
      return false;
    }
    const defaultValue2 = defaultValues(info.schema, info.isOptional, [key]);
    if (info.schema.enum && defaultValue2 !== null && defaultValue2 !== void 0) {
      return value;
    }
    if (defaultValue2 !== void 0)
      return defaultValue2;
    if (info.isNullable)
      return null;
    if (info.isOptional)
      return void 0;
  }
  function typeError() {
    throw new SchemaError(type[0].toUpperCase() + type.slice(1) + ` type found. Set the dataType option to "json" and add use:enhance on the client to use nested data structures. More information: https://superforms.rocks/concepts/nested-data`, key);
  }
  switch (type) {
    case "string":
    case "any":
      return value;
    case "integer":
      return parseInt(value ?? "", 10);
    case "number":
      return parseFloat(value ?? "");
    case "boolean":
      return Boolean(value == "false" ? "" : value).valueOf();
    case "unix-time": {
      const date = new Date(value ?? "");
      return !isNaN(date) ? date : void 0;
    }
    case "bigint":
      return BigInt(value ?? ".");
    case "symbol":
      return Symbol(String(value));
    case "set":
    case "array":
    case "object":
      return typeError();
    default:
      throw new SuperFormError("Unsupported schema type for FormData: " + type);
  }
}
function isPrimitive(value) {
  return typeof value !== "object" && typeof value !== "function" || value === null;
}
function MapTree() {
  this.childBranches = /* @__PURE__ */ new WeakMap();
  this.primitiveKeys = /* @__PURE__ */ new Map();
  this.hasValue = false;
  this.value = void 0;
}
MapTree.prototype.has = function has(key) {
  var keyObject = isPrimitive(key) ? this.primitiveKeys.get(key) : key;
  return keyObject ? this.childBranches.has(keyObject) : false;
};
MapTree.prototype.get = function get(key) {
  var keyObject = isPrimitive(key) ? this.primitiveKeys.get(key) : key;
  return keyObject ? this.childBranches.get(keyObject) : void 0;
};
MapTree.prototype.resolveBranch = function resolveBranch(key) {
  if (this.has(key)) {
    return this.get(key);
  }
  var newBranch = new MapTree();
  var keyObject = this.createKey(key);
  this.childBranches.set(keyObject, newBranch);
  return newBranch;
};
MapTree.prototype.setValue = function setValue(value) {
  this.hasValue = true;
  return this.value = value;
};
MapTree.prototype.createKey = function createKey(key) {
  if (isPrimitive(key)) {
    var keyObject = {};
    this.primitiveKeys.set(key, keyObject);
    return keyObject;
  }
  return key;
};
MapTree.prototype.clear = function clear() {
  if (arguments.length === 0) {
    this.childBranches = /* @__PURE__ */ new WeakMap();
    this.primitiveKeys.clear();
    this.hasValue = false;
    this.value = void 0;
  } else if (arguments.length === 1) {
    var key = arguments[0];
    if (isPrimitive(key)) {
      var keyObject = this.primitiveKeys.get(key);
      if (keyObject) {
        this.childBranches.delete(keyObject);
        this.primitiveKeys.delete(key);
      }
    } else {
      this.childBranches.delete(key);
    }
  } else {
    var childKey = arguments[0];
    if (this.has(childKey)) {
      var childBranch = this.get(childKey);
      childBranch.clear.apply(childBranch, Array.prototype.slice.call(arguments, 1));
    }
  }
};
var memoize$1 = function memoize(fn) {
  var argsTree = new MapTree();
  function memoized() {
    var args = Array.prototype.slice.call(arguments);
    var argNode = args.reduce(function getBranch(parentBranch, arg) {
      return parentBranch.resolveBranch(arg);
    }, argsTree);
    if (argNode.hasValue) {
      return argNode.value;
    }
    var value = fn.apply(null, args);
    return argNode.setValue(value);
  }
  memoized.clear = argsTree.clear.bind(argsTree);
  return memoized;
};
var memoizeWeak = memoize$1;
const baseMemoize = /* @__PURE__ */ getDefaultExportFromCjs(memoizeWeak);
const memoize2 = baseMemoize;
const ignoreOverride = Symbol("Let zodToJsonSchema decide on which parser to use");
const defaultOptions$1 = {
  name: void 0,
  $refStrategy: "root",
  basePath: ["#"],
  effectStrategy: "input",
  pipeStrategy: "all",
  dateStrategy: "format:date-time",
  mapStrategy: "entries",
  removeAdditionalStrategy: "passthrough",
  definitionPath: "definitions",
  target: "jsonSchema7",
  strictUnions: false,
  definitions: {},
  errorMessages: false,
  markdownDescription: false,
  patternStrategy: "escape",
  emailStrategy: "format:email",
  base64Strategy: "contentEncoding:base64"
};
const getDefaultOptions = (options) => typeof options === "string" ? {
  ...defaultOptions$1,
  name: options
} : {
  ...defaultOptions$1,
  ...options
};
const getRefs = (options) => {
  const _options = getDefaultOptions(options);
  const currentPath = _options.name !== void 0 ? [..._options.basePath, _options.definitionPath, _options.name] : _options.basePath;
  return {
    ..._options,
    currentPath,
    propertyPath: void 0,
    seen: new Map(Object.entries(_options.definitions).map(([name, def]) => [
      def._def,
      {
        def: def._def,
        path: [..._options.basePath, _options.definitionPath, name],
        // Resolution of references will be forced even though seen, so it's ok that the schema is undefined here for now.
        jsonSchema: void 0
      }
    ]))
  };
};
function addErrorMessage(res, key, errorMessage, refs) {
  if (!refs?.errorMessages)
    return;
  if (errorMessage) {
    res.errorMessage = {
      ...res.errorMessage,
      [key]: errorMessage
    };
  }
}
function setResponseValueAndErrors(res, key, value, errorMessage, refs) {
  res[key] = value;
  addErrorMessage(res, key, errorMessage, refs);
}
function parseAnyDef() {
  return {};
}
function parseArrayDef(def, refs) {
  const res = {
    type: "array"
  };
  if (def.type?._def?.typeName !== ZodFirstPartyTypeKind.ZodAny) {
    res.items = parseDef(def.type._def, {
      ...refs,
      currentPath: [...refs.currentPath, "items"]
    });
  }
  if (def.minLength) {
    setResponseValueAndErrors(res, "minItems", def.minLength.value, def.minLength.message, refs);
  }
  if (def.maxLength) {
    setResponseValueAndErrors(res, "maxItems", def.maxLength.value, def.maxLength.message, refs);
  }
  if (def.exactLength) {
    setResponseValueAndErrors(res, "minItems", def.exactLength.value, def.exactLength.message, refs);
    setResponseValueAndErrors(res, "maxItems", def.exactLength.value, def.exactLength.message, refs);
  }
  return res;
}
function parseBigintDef(def, refs) {
  const res = {
    type: "integer",
    format: "int64"
  };
  if (!def.checks)
    return res;
  for (const check of def.checks) {
    switch (check.kind) {
      case "min":
        if (refs.target === "jsonSchema7") {
          if (check.inclusive) {
            setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
          } else {
            setResponseValueAndErrors(res, "exclusiveMinimum", check.value, check.message, refs);
          }
        } else {
          if (!check.inclusive) {
            res.exclusiveMinimum = true;
          }
          setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
        }
        break;
      case "max":
        if (refs.target === "jsonSchema7") {
          if (check.inclusive) {
            setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
          } else {
            setResponseValueAndErrors(res, "exclusiveMaximum", check.value, check.message, refs);
          }
        } else {
          if (!check.inclusive) {
            res.exclusiveMaximum = true;
          }
          setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
        }
        break;
      case "multipleOf":
        setResponseValueAndErrors(res, "multipleOf", check.value, check.message, refs);
        break;
    }
  }
  return res;
}
function parseBooleanDef() {
  return {
    type: "boolean"
  };
}
function parseBrandedDef(_def, refs) {
  return parseDef(_def.type._def, refs);
}
const parseCatchDef = (def, refs) => {
  return parseDef(def.innerType._def, refs);
};
function parseDateDef(def, refs, overrideDateStrategy) {
  const strategy = overrideDateStrategy ?? refs.dateStrategy;
  if (Array.isArray(strategy)) {
    return {
      anyOf: strategy.map((item, i) => parseDateDef(def, refs, item))
    };
  }
  switch (strategy) {
    case "string":
    case "format:date-time":
      return {
        type: "string",
        format: "date-time"
      };
    case "format:date":
      return {
        type: "string",
        format: "date"
      };
    case "integer":
      return integerDateParser(def, refs);
  }
}
const integerDateParser = (def, refs) => {
  const res = {
    type: "integer",
    format: "unix-time"
  };
  if (refs.target === "openApi3") {
    return res;
  }
  for (const check of def.checks) {
    switch (check.kind) {
      case "min":
        setResponseValueAndErrors(
          res,
          "minimum",
          check.value,
          // This is in milliseconds
          check.message,
          refs
        );
        break;
      case "max":
        setResponseValueAndErrors(
          res,
          "maximum",
          check.value,
          // This is in milliseconds
          check.message,
          refs
        );
        break;
    }
  }
  return res;
};
function parseDefaultDef(_def, refs) {
  return {
    ...parseDef(_def.innerType._def, refs),
    default: _def.defaultValue()
  };
}
function parseEffectsDef(_def, refs) {
  return refs.effectStrategy === "input" ? parseDef(_def.schema._def, refs) : {};
}
function parseEnumDef(def) {
  return {
    type: "string",
    enum: def.values
  };
}
const isJsonSchema7AllOfType = (type) => {
  if ("type" in type && type.type === "string")
    return false;
  return "allOf" in type;
};
function parseIntersectionDef(def, refs) {
  const allOf = [
    parseDef(def.left._def, {
      ...refs,
      currentPath: [...refs.currentPath, "allOf", "0"]
    }),
    parseDef(def.right._def, {
      ...refs,
      currentPath: [...refs.currentPath, "allOf", "1"]
    })
  ].filter((x) => !!x);
  let unevaluatedProperties = refs.target === "jsonSchema2019-09" ? { unevaluatedProperties: false } : void 0;
  const mergedAllOf = [];
  allOf.forEach((schema) => {
    if (isJsonSchema7AllOfType(schema)) {
      mergedAllOf.push(...schema.allOf);
      if (schema.unevaluatedProperties === void 0) {
        unevaluatedProperties = void 0;
      }
    } else {
      let nestedSchema = schema;
      if ("additionalProperties" in schema && schema.additionalProperties === false) {
        const { additionalProperties, ...rest } = schema;
        nestedSchema = rest;
      } else {
        unevaluatedProperties = void 0;
      }
      mergedAllOf.push(nestedSchema);
    }
  });
  return mergedAllOf.length ? {
    allOf: mergedAllOf,
    ...unevaluatedProperties
  } : void 0;
}
function parseLiteralDef(def, refs) {
  const parsedType = typeof def.value;
  if (parsedType !== "bigint" && parsedType !== "number" && parsedType !== "boolean" && parsedType !== "string") {
    return {
      type: Array.isArray(def.value) ? "array" : "object"
    };
  }
  if (refs.target === "openApi3") {
    return {
      type: parsedType === "bigint" ? "integer" : parsedType,
      enum: [def.value]
    };
  }
  return {
    type: parsedType === "bigint" ? "integer" : parsedType,
    const: def.value
  };
}
const zodPatterns = {
  /**
   * `c` was changed to `[cC]` to replicate /i flag
   */
  cuid: "^[cC][^\\s-]{8,}$",
  cuid2: "^[a-z][a-z0-9]*$",
  ulid: "^[0-9A-HJKMNP-TV-Z]{26}$",
  /**
   * `a-z` was added to replicate /i flag
   */
  email: "^(?!\\.)(?!.*\\.\\.)([a-zA-Z0-9_+-\\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\\-]*\\.)+[a-zA-Z]{2,}$",
  emoji: "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$",
  /**
   * Unused
   */
  uuid: "^[0-9a-fA-F]{8}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{12}$",
  /**
   * Unused
   */
  ipv4: "^(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))$",
  /**
   * Unused
   */
  ipv6: "^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$",
  base64: "^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$",
  nanoid: "^[a-zA-Z0-9_-]{21}$"
};
function parseStringDef(def, refs) {
  const res = {
    type: "string"
  };
  function processPattern(value) {
    return refs.patternStrategy === "escape" ? escapeNonAlphaNumeric(value) : value;
  }
  if (def.checks) {
    for (const check of def.checks) {
      switch (check.kind) {
        case "min":
          setResponseValueAndErrors(res, "minLength", typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value, check.message, refs);
          break;
        case "max":
          setResponseValueAndErrors(res, "maxLength", typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value, check.message, refs);
          break;
        case "email":
          switch (refs.emailStrategy) {
            case "format:email":
              addFormat(res, "email", check.message, refs);
              break;
            case "format:idn-email":
              addFormat(res, "idn-email", check.message, refs);
              break;
            case "pattern:zod":
              addPattern(res, zodPatterns.email, check.message, refs);
              break;
          }
          break;
        case "url":
          addFormat(res, "uri", check.message, refs);
          break;
        case "uuid":
          addFormat(res, "uuid", check.message, refs);
          break;
        case "regex":
          addPattern(res, check.regex.source, check.message, refs);
          break;
        case "cuid":
          addPattern(res, zodPatterns.cuid, check.message, refs);
          break;
        case "cuid2":
          addPattern(res, zodPatterns.cuid2, check.message, refs);
          break;
        case "startsWith":
          addPattern(res, "^" + processPattern(check.value), check.message, refs);
          break;
        case "endsWith":
          addPattern(res, processPattern(check.value) + "$", check.message, refs);
          break;
        case "datetime":
          addFormat(res, "date-time", check.message, refs);
          break;
        case "date":
          addFormat(res, "date", check.message, refs);
          break;
        case "time":
          addFormat(res, "time", check.message, refs);
          break;
        case "duration":
          addFormat(res, "duration", check.message, refs);
          break;
        case "length":
          setResponseValueAndErrors(res, "minLength", typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value, check.message, refs);
          setResponseValueAndErrors(res, "maxLength", typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value, check.message, refs);
          break;
        case "includes": {
          addPattern(res, processPattern(check.value), check.message, refs);
          break;
        }
        case "ip": {
          if (check.version !== "v6") {
            addFormat(res, "ipv4", check.message, refs);
          }
          if (check.version !== "v4") {
            addFormat(res, "ipv6", check.message, refs);
          }
          break;
        }
        case "emoji":
          addPattern(res, zodPatterns.emoji, check.message, refs);
          break;
        case "ulid": {
          addPattern(res, zodPatterns.ulid, check.message, refs);
          break;
        }
        case "base64": {
          switch (refs.base64Strategy) {
            case "format:binary": {
              addFormat(res, "binary", check.message, refs);
              break;
            }
            case "contentEncoding:base64": {
              setResponseValueAndErrors(res, "contentEncoding", "base64", check.message, refs);
              break;
            }
            case "pattern:zod": {
              addPattern(res, zodPatterns.base64, check.message, refs);
              break;
            }
          }
          break;
        }
        case "nanoid": {
          addPattern(res, zodPatterns.nanoid, check.message, refs);
        }
      }
    }
  }
  return res;
}
const escapeNonAlphaNumeric = (value) => Array.from(value).map((c) => /[a-zA-Z0-9]/.test(c) ? c : `\\${c}`).join("");
const addFormat = (schema, value, message, refs) => {
  if (schema.format || schema.anyOf?.some((x) => x.format)) {
    if (!schema.anyOf) {
      schema.anyOf = [];
    }
    if (schema.format) {
      schema.anyOf.push({
        format: schema.format,
        ...schema.errorMessage && refs.errorMessages && {
          errorMessage: { format: schema.errorMessage.format }
        }
      });
      delete schema.format;
      if (schema.errorMessage) {
        delete schema.errorMessage.format;
        if (Object.keys(schema.errorMessage).length === 0) {
          delete schema.errorMessage;
        }
      }
    }
    schema.anyOf.push({
      format: value,
      ...message && refs.errorMessages && { errorMessage: { format: message } }
    });
  } else {
    setResponseValueAndErrors(schema, "format", value, message, refs);
  }
};
const addPattern = (schema, value, message, refs) => {
  if (schema.pattern || schema.allOf?.some((x) => x.pattern)) {
    if (!schema.allOf) {
      schema.allOf = [];
    }
    if (schema.pattern) {
      schema.allOf.push({
        pattern: schema.pattern,
        ...schema.errorMessage && refs.errorMessages && {
          errorMessage: { pattern: schema.errorMessage.pattern }
        }
      });
      delete schema.pattern;
      if (schema.errorMessage) {
        delete schema.errorMessage.pattern;
        if (Object.keys(schema.errorMessage).length === 0) {
          delete schema.errorMessage;
        }
      }
    }
    schema.allOf.push({
      pattern: value,
      ...message && refs.errorMessages && { errorMessage: { pattern: message } }
    });
  } else {
    setResponseValueAndErrors(schema, "pattern", value, message, refs);
  }
};
function parseRecordDef(def, refs) {
  if (refs.target === "openApi3" && def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodEnum) {
    return {
      type: "object",
      required: def.keyType._def.values,
      properties: def.keyType._def.values.reduce((acc, key) => ({
        ...acc,
        [key]: parseDef(def.valueType._def, {
          ...refs,
          currentPath: [...refs.currentPath, "properties", key]
        }) ?? {}
      }), {}),
      additionalProperties: false
    };
  }
  const schema = {
    type: "object",
    additionalProperties: parseDef(def.valueType._def, {
      ...refs,
      currentPath: [...refs.currentPath, "additionalProperties"]
    }) ?? {}
  };
  if (refs.target === "openApi3") {
    return schema;
  }
  if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodString && def.keyType._def.checks?.length) {
    const keyType = Object.entries(parseStringDef(def.keyType._def, refs)).reduce((acc, [key, value]) => key === "type" ? acc : { ...acc, [key]: value }, {});
    return {
      ...schema,
      propertyNames: keyType
    };
  } else if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodEnum) {
    return {
      ...schema,
      propertyNames: {
        enum: def.keyType._def.values
      }
    };
  }
  return schema;
}
function parseMapDef(def, refs) {
  if (refs.mapStrategy === "record") {
    return parseRecordDef(def, refs);
  }
  const keys = parseDef(def.keyType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "items", "items", "0"]
  }) || {};
  const values = parseDef(def.valueType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "items", "items", "1"]
  }) || {};
  return {
    type: "array",
    maxItems: 125,
    items: {
      type: "array",
      items: [keys, values],
      minItems: 2,
      maxItems: 2
    }
  };
}
function parseNativeEnumDef(def) {
  const object = def.values;
  const actualKeys = Object.keys(def.values).filter((key) => {
    return typeof object[object[key]] !== "number";
  });
  const actualValues = actualKeys.map((key) => object[key]);
  const parsedTypes = Array.from(new Set(actualValues.map((values) => typeof values)));
  return {
    type: parsedTypes.length === 1 ? parsedTypes[0] === "string" ? "string" : "number" : ["string", "number"],
    enum: actualValues
  };
}
function parseNeverDef() {
  return {
    not: {}
  };
}
function parseNullDef(refs) {
  return refs.target === "openApi3" ? {
    enum: ["null"],
    nullable: true
  } : {
    type: "null"
  };
}
const primitiveMappings = {
  ZodString: "string",
  ZodNumber: "number",
  ZodBigInt: "integer",
  ZodBoolean: "boolean",
  ZodNull: "null"
};
function parseUnionDef(def, refs) {
  if (refs.target === "openApi3")
    return asAnyOf(def, refs);
  const options = def.options instanceof Map ? Array.from(def.options.values()) : def.options;
  if (options.every((x) => x._def.typeName in primitiveMappings && (!x._def.checks || !x._def.checks.length))) {
    const types = options.reduce((types2, x) => {
      const type = primitiveMappings[x._def.typeName];
      return type && !types2.includes(type) ? [...types2, type] : types2;
    }, []);
    return {
      type: types.length > 1 ? types : types[0]
    };
  } else if (options.every((x) => x._def.typeName === "ZodLiteral" && !x.description)) {
    const types = options.reduce((acc, x) => {
      const type = typeof x._def.value;
      switch (type) {
        case "string":
        case "number":
        case "boolean":
          return [...acc, type];
        case "bigint":
          return [...acc, "integer"];
        case "object":
          if (x._def.value === null)
            return [...acc, "null"];
        case "symbol":
        case "undefined":
        case "function":
        default:
          return acc;
      }
    }, []);
    if (types.length === options.length) {
      const uniqueTypes = types.filter((x, i, a) => a.indexOf(x) === i);
      return {
        type: uniqueTypes.length > 1 ? uniqueTypes : uniqueTypes[0],
        enum: options.reduce((acc, x) => {
          return acc.includes(x._def.value) ? acc : [...acc, x._def.value];
        }, [])
      };
    }
  } else if (options.every((x) => x._def.typeName === "ZodEnum")) {
    return {
      type: "string",
      enum: options.reduce((acc, x) => [
        ...acc,
        ...x._def.values.filter((x2) => !acc.includes(x2))
      ], [])
    };
  }
  return asAnyOf(def, refs);
}
const asAnyOf = (def, refs) => {
  const anyOf = (def.options instanceof Map ? Array.from(def.options.values()) : def.options).map((x, i) => parseDef(x._def, {
    ...refs,
    currentPath: [...refs.currentPath, "anyOf", `${i}`]
  })).filter((x) => !!x && (!refs.strictUnions || typeof x === "object" && Object.keys(x).length > 0));
  return anyOf.length ? { anyOf } : void 0;
};
function parseNullableDef(def, refs) {
  if (["ZodString", "ZodNumber", "ZodBigInt", "ZodBoolean", "ZodNull"].includes(def.innerType._def.typeName) && (!def.innerType._def.checks || !def.innerType._def.checks.length)) {
    if (refs.target === "openApi3") {
      return {
        type: primitiveMappings[def.innerType._def.typeName],
        nullable: true
      };
    }
    return {
      type: [
        primitiveMappings[def.innerType._def.typeName],
        "null"
      ]
    };
  }
  if (refs.target === "openApi3") {
    const base2 = parseDef(def.innerType._def, {
      ...refs,
      currentPath: [...refs.currentPath]
    });
    if (base2 && "$ref" in base2)
      return { allOf: [base2], nullable: true };
    return base2 && { ...base2, nullable: true };
  }
  const base = parseDef(def.innerType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "anyOf", "0"]
  });
  return base && { anyOf: [base, { type: "null" }] };
}
function parseNumberDef(def, refs) {
  const res = {
    type: "number"
  };
  if (!def.checks)
    return res;
  for (const check of def.checks) {
    switch (check.kind) {
      case "int":
        res.type = "integer";
        addErrorMessage(res, "type", check.message, refs);
        break;
      case "min":
        if (refs.target === "jsonSchema7") {
          if (check.inclusive) {
            setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
          } else {
            setResponseValueAndErrors(res, "exclusiveMinimum", check.value, check.message, refs);
          }
        } else {
          if (!check.inclusive) {
            res.exclusiveMinimum = true;
          }
          setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
        }
        break;
      case "max":
        if (refs.target === "jsonSchema7") {
          if (check.inclusive) {
            setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
          } else {
            setResponseValueAndErrors(res, "exclusiveMaximum", check.value, check.message, refs);
          }
        } else {
          if (!check.inclusive) {
            res.exclusiveMaximum = true;
          }
          setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
        }
        break;
      case "multipleOf":
        setResponseValueAndErrors(res, "multipleOf", check.value, check.message, refs);
        break;
    }
  }
  return res;
}
function decideAdditionalProperties(def, refs) {
  if (refs.removeAdditionalStrategy === "strict") {
    return def.catchall._def.typeName === "ZodNever" ? def.unknownKeys !== "strict" : parseDef(def.catchall._def, {
      ...refs,
      currentPath: [...refs.currentPath, "additionalProperties"]
    }) ?? true;
  } else {
    return def.catchall._def.typeName === "ZodNever" ? def.unknownKeys === "passthrough" : parseDef(def.catchall._def, {
      ...refs,
      currentPath: [...refs.currentPath, "additionalProperties"]
    }) ?? true;
  }
}
function parseObjectDef(def, refs) {
  const result = {
    type: "object",
    ...Object.entries(def.shape()).reduce((acc, [propName, propDef]) => {
      if (propDef === void 0 || propDef._def === void 0)
        return acc;
      const parsedDef = parseDef(propDef._def, {
        ...refs,
        currentPath: [...refs.currentPath, "properties", propName],
        propertyPath: [...refs.currentPath, "properties", propName]
      });
      if (parsedDef === void 0)
        return acc;
      return {
        properties: { ...acc.properties, [propName]: parsedDef },
        required: propDef.isOptional() ? acc.required : [...acc.required, propName]
      };
    }, { properties: {}, required: [] }),
    additionalProperties: decideAdditionalProperties(def, refs)
  };
  if (!result.required.length)
    delete result.required;
  return result;
}
const parseOptionalDef = (def, refs) => {
  if (refs.currentPath.toString() === refs.propertyPath?.toString()) {
    return parseDef(def.innerType._def, refs);
  }
  const innerSchema = parseDef(def.innerType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "anyOf", "1"]
  });
  return innerSchema ? {
    anyOf: [
      {
        not: {}
      },
      innerSchema
    ]
  } : {};
};
const parsePipelineDef = (def, refs) => {
  if (refs.pipeStrategy === "input") {
    return parseDef(def.in._def, refs);
  } else if (refs.pipeStrategy === "output") {
    return parseDef(def.out._def, refs);
  }
  const a = parseDef(def.in._def, {
    ...refs,
    currentPath: [...refs.currentPath, "allOf", "0"]
  });
  const b = parseDef(def.out._def, {
    ...refs,
    currentPath: [...refs.currentPath, "allOf", a ? "1" : "0"]
  });
  return {
    allOf: [a, b].filter((x) => x !== void 0)
  };
};
function parsePromiseDef(def, refs) {
  return parseDef(def.type._def, refs);
}
function parseSetDef(def, refs) {
  const items = parseDef(def.valueType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "items"]
  });
  const schema = {
    type: "array",
    uniqueItems: true,
    items
  };
  if (def.minSize) {
    setResponseValueAndErrors(schema, "minItems", def.minSize.value, def.minSize.message, refs);
  }
  if (def.maxSize) {
    setResponseValueAndErrors(schema, "maxItems", def.maxSize.value, def.maxSize.message, refs);
  }
  return schema;
}
function parseTupleDef(def, refs) {
  if (def.rest) {
    return {
      type: "array",
      minItems: def.items.length,
      items: def.items.map((x, i) => parseDef(x._def, {
        ...refs,
        currentPath: [...refs.currentPath, "items", `${i}`]
      })).reduce((acc, x) => x === void 0 ? acc : [...acc, x], []),
      additionalItems: parseDef(def.rest._def, {
        ...refs,
        currentPath: [...refs.currentPath, "additionalItems"]
      })
    };
  } else {
    return {
      type: "array",
      minItems: def.items.length,
      maxItems: def.items.length,
      items: def.items.map((x, i) => parseDef(x._def, {
        ...refs,
        currentPath: [...refs.currentPath, "items", `${i}`]
      })).reduce((acc, x) => x === void 0 ? acc : [...acc, x], [])
    };
  }
}
function parseUndefinedDef() {
  return {
    not: {}
  };
}
function parseUnknownDef() {
  return {};
}
const parseReadonlyDef = (def, refs) => {
  return parseDef(def.innerType._def, refs);
};
function parseDef(def, refs, forceResolution = false) {
  const seenItem = refs.seen.get(def);
  if (refs.override) {
    const overrideResult = refs.override?.(def, refs, seenItem, forceResolution);
    if (overrideResult !== ignoreOverride) {
      return overrideResult;
    }
  }
  if (seenItem && !forceResolution) {
    const seenSchema = get$ref(seenItem, refs);
    if (seenSchema !== void 0) {
      return seenSchema;
    }
  }
  const newItem = { def, path: refs.currentPath, jsonSchema: void 0 };
  refs.seen.set(def, newItem);
  const jsonSchema = selectParser(def, def.typeName, refs);
  if (jsonSchema) {
    addMeta(def, refs, jsonSchema);
  }
  newItem.jsonSchema = jsonSchema;
  return jsonSchema;
}
const get$ref = (item, refs) => {
  switch (refs.$refStrategy) {
    case "root":
      return { $ref: item.path.join("/") };
    case "relative":
      return { $ref: getRelativePath(refs.currentPath, item.path) };
    case "none":
    case "seen": {
      if (item.path.length < refs.currentPath.length && item.path.every((value, index) => refs.currentPath[index] === value)) {
        console.warn(`Recursive reference detected at ${refs.currentPath.join("/")}! Defaulting to any`);
        return {};
      }
      return refs.$refStrategy === "seen" ? {} : void 0;
    }
  }
};
const getRelativePath = (pathA, pathB) => {
  let i = 0;
  for (; i < pathA.length && i < pathB.length; i++) {
    if (pathA[i] !== pathB[i])
      break;
  }
  return [(pathA.length - i).toString(), ...pathB.slice(i)].join("/");
};
const selectParser = (def, typeName, refs) => {
  switch (typeName) {
    case ZodFirstPartyTypeKind.ZodString:
      return parseStringDef(def, refs);
    case ZodFirstPartyTypeKind.ZodNumber:
      return parseNumberDef(def, refs);
    case ZodFirstPartyTypeKind.ZodObject:
      return parseObjectDef(def, refs);
    case ZodFirstPartyTypeKind.ZodBigInt:
      return parseBigintDef(def, refs);
    case ZodFirstPartyTypeKind.ZodBoolean:
      return parseBooleanDef();
    case ZodFirstPartyTypeKind.ZodDate:
      return parseDateDef(def, refs);
    case ZodFirstPartyTypeKind.ZodUndefined:
      return parseUndefinedDef();
    case ZodFirstPartyTypeKind.ZodNull:
      return parseNullDef(refs);
    case ZodFirstPartyTypeKind.ZodArray:
      return parseArrayDef(def, refs);
    case ZodFirstPartyTypeKind.ZodUnion:
    case ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
      return parseUnionDef(def, refs);
    case ZodFirstPartyTypeKind.ZodIntersection:
      return parseIntersectionDef(def, refs);
    case ZodFirstPartyTypeKind.ZodTuple:
      return parseTupleDef(def, refs);
    case ZodFirstPartyTypeKind.ZodRecord:
      return parseRecordDef(def, refs);
    case ZodFirstPartyTypeKind.ZodLiteral:
      return parseLiteralDef(def, refs);
    case ZodFirstPartyTypeKind.ZodEnum:
      return parseEnumDef(def);
    case ZodFirstPartyTypeKind.ZodNativeEnum:
      return parseNativeEnumDef(def);
    case ZodFirstPartyTypeKind.ZodNullable:
      return parseNullableDef(def, refs);
    case ZodFirstPartyTypeKind.ZodOptional:
      return parseOptionalDef(def, refs);
    case ZodFirstPartyTypeKind.ZodMap:
      return parseMapDef(def, refs);
    case ZodFirstPartyTypeKind.ZodSet:
      return parseSetDef(def, refs);
    case ZodFirstPartyTypeKind.ZodLazy:
      return parseDef(def.getter()._def, refs);
    case ZodFirstPartyTypeKind.ZodPromise:
      return parsePromiseDef(def, refs);
    case ZodFirstPartyTypeKind.ZodNaN:
    case ZodFirstPartyTypeKind.ZodNever:
      return parseNeverDef();
    case ZodFirstPartyTypeKind.ZodEffects:
      return parseEffectsDef(def, refs);
    case ZodFirstPartyTypeKind.ZodAny:
      return parseAnyDef();
    case ZodFirstPartyTypeKind.ZodUnknown:
      return parseUnknownDef();
    case ZodFirstPartyTypeKind.ZodDefault:
      return parseDefaultDef(def, refs);
    case ZodFirstPartyTypeKind.ZodBranded:
      return parseBrandedDef(def, refs);
    case ZodFirstPartyTypeKind.ZodReadonly:
      return parseReadonlyDef(def, refs);
    case ZodFirstPartyTypeKind.ZodCatch:
      return parseCatchDef(def, refs);
    case ZodFirstPartyTypeKind.ZodPipeline:
      return parsePipelineDef(def, refs);
    case ZodFirstPartyTypeKind.ZodFunction:
    case ZodFirstPartyTypeKind.ZodVoid:
    case ZodFirstPartyTypeKind.ZodSymbol:
      return void 0;
    default:
      return /* @__PURE__ */ ((_) => void 0)();
  }
};
const addMeta = (def, refs, jsonSchema) => {
  if (def.description) {
    jsonSchema.description = def.description;
    if (refs.markdownDescription) {
      jsonSchema.markdownDescription = def.description;
    }
  }
  return jsonSchema;
};
const zodToJsonSchema = (schema, options) => {
  const refs = getRefs(options);
  const definitions = typeof options === "object" && options.definitions ? Object.entries(options.definitions).reduce((acc, [name2, schema2]) => ({
    ...acc,
    [name2]: parseDef(schema2._def, {
      ...refs,
      currentPath: [...refs.basePath, refs.definitionPath, name2]
    }, true) ?? {}
  }), {}) : void 0;
  const name = typeof options === "string" ? options : options?.name;
  const main = parseDef(schema._def, name === void 0 ? refs : {
    ...refs,
    currentPath: [...refs.basePath, refs.definitionPath, name]
  }, false) ?? {};
  const combined = name === void 0 ? definitions ? {
    ...main,
    [refs.definitionPath]: definitions
  } : main : {
    $ref: [
      ...refs.$refStrategy === "relative" ? [] : refs.basePath,
      refs.definitionPath,
      name
    ].join("/"),
    [refs.definitionPath]: {
      ...definitions,
      [name]: main
    }
  };
  if (refs.target === "jsonSchema7") {
    combined.$schema = "http://json-schema.org/draft-07/schema#";
  } else if (refs.target === "jsonSchema2019-09") {
    combined.$schema = "https://json-schema.org/draft/2019-09/schema#";
  }
  return combined;
};
const defaultOptions = {
  dateStrategy: "integer",
  pipeStrategy: "output",
  $refStrategy: "none"
};
const zodToJSONSchema = /* @__NO_SIDE_EFFECTS__ */ (...params) => {
  params[1] = typeof params[1] == "object" ? { ...defaultOptions, ...params[1] } : defaultOptions;
  return zodToJsonSchema(...params);
};
async function validate(schema, data) {
  const result = await schema.safeParseAsync(data);
  if (result.success) {
    return {
      data: result.data,
      success: true
    };
  }
  return {
    issues: result.error.issues.map(({ message, path }) => ({ message, path })),
    success: false
  };
}
function _zod(schema, options) {
  return /* @__PURE__ */ createAdapter({
    superFormValidationLibrary: "zod",
    validate: async (data) => validate(schema, data),
    jsonSchema: options?.jsonSchema ?? /* @__PURE__ */ zodToJSONSchema(schema, options?.config),
    defaults: options?.defaults
  });
}
function _zodClient(schema) {
  return {
    superFormValidationLibrary: "zod",
    validate: async (data) => validate(schema, data)
  };
}
const zod = /* @__PURE__ */ memoize2(_zod);
const zodClient = /* @__PURE__ */ memoize2(_zodClient);
export {
  zod as a,
  mapErrors as b,
  mergeDefaults as m,
  parseRequest as p,
  replaceInvalidDefaults as r,
  superForm as s,
  zodClient as z
};
