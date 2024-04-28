import { s as setContext, w as hasContext, x as getContext, d as store_get, c as slot, u as unsubscribe_stores, j as bind_props, b as pop, p as push, v as value_or_fallback, o as rest_props, q as spread_attributes, f as ensure_array_like, e as escape, t as sanitize_props, y as element, m as spread_props, g as attr, i as stringify, z as await_block } from "./index3.js";
import { w as writable, d as derived, r as readable, g as get_store_value } from "./index.js";
import { clsx } from "clsx";
import { tv } from "tailwind-variants";
import { twMerge } from "tailwind-merge";
import { p as page } from "./stores.js";
import "./zod.js";
const FORM_FIELD = Symbol("FORM_FIELD_CTX");
function setFormField(props) {
  setContext(FORM_FIELD, props);
  return props;
}
function getFormField() {
  if (!hasContext(FORM_FIELD)) {
    ctxError("Form.Field");
  }
  return getContext(FORM_FIELD);
}
const FORM_CONTROL = Symbol("FORM_CONTROL_CTX");
function setFormControl(props) {
  setContext(FORM_CONTROL, props);
  return props;
}
function getFormControl() {
  if (!hasContext(FORM_CONTROL)) {
    ctxError("<Control />");
  }
  return getContext(FORM_CONTROL);
}
function ctxError(ctx) {
  throw new Error(`Unable to find \`${ctx}\` context. Did you forget to wrap the component in a \`${ctx}\`?`);
}
function getAriaDescribedBy({ fieldErrorsId = void 0, descriptionId = void 0, errors }) {
  let describedBy = "";
  if (descriptionId) {
    describedBy += descriptionId + " ";
  }
  if (errors.length && fieldErrorsId) {
    describedBy += fieldErrorsId;
  }
  return describedBy ? describedBy.trim() : void 0;
}
function getAriaRequired(constraints) {
  if (!("required" in constraints))
    return void 0;
  return constraints.required ? "true" : void 0;
}
function getAriaInvalid(errors) {
  return errors && errors.length ? "true" : void 0;
}
function getDataFsError(errors) {
  return errors && errors.length ? "" : void 0;
}
let urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let nanoid = (size = 21) => {
  let id = "";
  let i = size;
  while (i--) {
    id += urlAlphabet[Math.random() * 64 | 0];
  }
  return id;
};
function generateId() {
  return nanoid(5);
}
function extractErrorArray(errors) {
  if (Array.isArray(errors))
    return errors;
  if (typeof errors === "object" && "_errors" in errors) {
    if (errors._errors !== void 0)
      return errors._errors;
  }
  return [];
}
function getValueAtPath(path, obj) {
  const keys = path.split(/[[\].]/).filter(Boolean);
  let value = obj;
  for (const key of keys) {
    if (typeof value !== "object" || value === null) {
      return void 0;
    }
    value = value[key];
  }
  return value;
}
function Field($$payload, $$props) {
  push();
  var $$store_subs;
  let formErrors, formConstraints, formTainted, formData;
  let form = $$props["form"];
  let name = $$props["name"];
  const field = {
    name: writable(name),
    errors: writable([]),
    constraints: writable({}),
    tainted: writable(false),
    fieldErrorsId: writable(),
    descriptionId: writable(),
    form
  };
  const { tainted, errors } = field;
  setFormField(field);
  ({
    errors: formErrors,
    constraints: formConstraints,
    tainted: formTainted,
    form: formData
  } = form);
  field.name.set(name);
  field.errors.set(extractErrorArray(getValueAtPath(name, store_get($$store_subs ??= {}, "$formErrors", formErrors))));
  field.constraints.set(getValueAtPath(name, store_get($$store_subs ??= {}, "$formConstraints", formConstraints)) ?? {});
  field.tainted.set(store_get($$store_subs ??= {}, "$formTainted", formTainted) ? getValueAtPath(name, store_get($$store_subs ??= {}, "$formTainted", formTainted)) === true : false);
  $$payload.out += `<!--[-->`;
  slot(
    $$payload,
    $$props.children,
    {
      get value() {
        return store_get($$store_subs ??= {}, "$formData", formData)[name];
      },
      get errors() {
        return store_get($$store_subs ??= {}, "$errors", errors);
      },
      get tainted() {
        return store_get($$store_subs ??= {}, "$tainted", tainted);
      },
      get constraints() {
        return store_get($$store_subs ??= {}, "$formConstraints", formConstraints)[name];
      }
    },
    null
  );
  $$payload.out += `<!--]-->`;
  if ($$store_subs)
    unsubscribe_stores($$store_subs);
  bind_props($$props, { form, name });
  pop();
}
function Control$1($$payload, $$props) {
  push();
  var $$store_subs;
  let errorAttr, attrs, labelAttrs;
  let id = value_or_fallback($$props["id"], generateId);
  const {
    name,
    fieldErrorsId,
    descriptionId,
    errors,
    constraints
  } = getFormField();
  const controlContext = {
    id: writable(id),
    attrs: writable(),
    labelAttrs: writable()
  };
  const { id: idStore } = controlContext;
  setFormControl(controlContext);
  controlContext.id.set(id);
  errorAttr = getDataFsError(store_get($$store_subs ??= {}, "$errors", errors));
  attrs = {
    name: store_get($$store_subs ??= {}, "$name", name),
    id: store_get($$store_subs ??= {}, "$idStore", idStore),
    "data-fs-error": errorAttr,
    "aria-describedby": getAriaDescribedBy({
      fieldErrorsId: store_get($$store_subs ??= {}, "$fieldErrorsId", fieldErrorsId),
      descriptionId: store_get($$store_subs ??= {}, "$descriptionId", descriptionId),
      errors: store_get($$store_subs ??= {}, "$errors", errors)
    }),
    "aria-invalid": getAriaInvalid(store_get($$store_subs ??= {}, "$errors", errors)),
    "aria-required": getAriaRequired(store_get($$store_subs ??= {}, "$constraints", constraints)),
    "data-fs-control": ""
  };
  labelAttrs = {
    for: store_get($$store_subs ??= {}, "$idStore", idStore),
    "data-fs-label": "",
    "data-fs-error": errorAttr
  };
  controlContext.attrs.set(attrs);
  controlContext.labelAttrs.set(labelAttrs);
  $$payload.out += `<!--[-->`;
  slot(
    $$payload,
    $$props.children,
    {
      get attrs() {
        return attrs;
      }
    },
    null
  );
  $$payload.out += `<!--]-->`;
  if ($$store_subs)
    unsubscribe_stores($$store_subs);
  bind_props($$props, { id });
  pop();
}
function Field_errors($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["id", "asChild", "el", "$$props"]);
  push();
  var $$store_subs;
  let errorAttr, fieldErrorsAttrs, errorAttrs;
  const tmp = getFormField(), fieldErrorsId = tmp.fieldErrorsId, errors = tmp.errors;
  let id = value_or_fallback($$props["id"], generateId);
  let asChild = value_or_fallback($$props["asChild"], () => false);
  let el = value_or_fallback($$props["el"], () => void 0);
  errorAttr = getDataFsError(store_get($$store_subs ??= {}, "$errors", errors));
  fieldErrorsId.set(id);
  fieldErrorsAttrs = {
    id: store_get($$store_subs ??= {}, "$fieldErrorsId", fieldErrorsId),
    "data-fs-error": errorAttr,
    "data-fs-field-errors": "",
    "aria-live": "assertive",
    ...$$restProps
  };
  errorAttrs = {
    "data-fs-field-error": "",
    "data-fs-error": errorAttr
  };
  $$payload.out += `<!--[-->`;
  if (asChild) {
    $$payload.out += `<!--[-->`;
    slot(
      $$payload,
      $$props.children,
      {
        get errors() {
          return store_get($$store_subs ??= {}, "$errors", errors);
        },
        get fieldErrorsAttrs() {
          return fieldErrorsAttrs;
        },
        get errorAttrs() {
          return errorAttrs;
        }
      },
      null
    );
    $$payload.out += `<!--]-->`;
    $$payload.out += "<!--]-->";
  } else {
    $$payload.out += `<div${spread_attributes([fieldErrorsAttrs], true, false, "")}><!--[-->`;
    slot(
      $$payload,
      $$props.children,
      {
        get errors() {
          return store_get($$store_subs ??= {}, "$errors", errors);
        },
        get fieldErrorsAttrs() {
          return fieldErrorsAttrs;
        },
        get errorAttrs() {
          return errorAttrs;
        }
      },
      () => {
        const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$errors", errors));
        $$payload.out += `<!--[-->`;
        for (let $$index = 0; $$index < each_array.length; $$index++) {
          const error = each_array[$$index];
          $$payload.out += "<!--[-->";
          $$payload.out += `<div${spread_attributes([errorAttrs], true, false, "")}>${escape(error)}</div>`;
          $$payload.out += "<!--]-->";
        }
        $$payload.out += "<!--]-->";
      }
    );
    $$payload.out += `<!--]--></div>`;
    $$payload.out += "<!--]!-->";
  }
  if ($$store_subs)
    unsubscribe_stores($$store_subs);
  bind_props($$props, { id, asChild, el });
  pop();
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function styleToString(style) {
  return Object.keys(style).reduce((str, key) => {
    if (style[key] === void 0)
      return str;
    return str + `${key}:${style[key]};`;
  }, "");
}
({
  type: "hidden",
  "aria-hidden": true,
  hidden: true,
  tabIndex: -1,
  style: styleToString({
    position: "absolute",
    opacity: 0,
    "pointer-events": "none",
    margin: 0,
    transform: "translateX(-100%)"
  })
});
function lightable(value) {
  function subscribe(run) {
    run(value);
    return () => {
    };
  }
  return { subscribe };
}
const hiddenAction = (obj) => {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      return Reflect.get(target, prop, receiver);
    },
    ownKeys(target) {
      return Reflect.ownKeys(target).filter((key) => key !== "action");
    }
  });
};
const isFunctionWithParams = (fn) => {
  return typeof fn === "function";
};
makeElement("empty");
function makeElement(name, args) {
  const { stores, action, returned } = args ?? {};
  const derivedStore = (() => {
    if (stores && returned) {
      return derived(stores, (values) => {
        const result = returned(values);
        if (isFunctionWithParams(result)) {
          const fn = (...args2) => {
            return hiddenAction({
              ...result(...args2),
              [`data-melt-${name}`]: "",
              action: action ?? noop
            });
          };
          fn.action = action ?? noop;
          return fn;
        }
        return hiddenAction({
          ...result,
          [`data-melt-${name}`]: "",
          action: action ?? noop
        });
      });
    } else {
      const returnedFn = returned;
      const result = returnedFn?.();
      if (isFunctionWithParams(result)) {
        const resultFn = (...args2) => {
          return hiddenAction({
            ...result(...args2),
            [`data-melt-${name}`]: "",
            action: action ?? noop
          });
        };
        resultFn.action = action ?? noop;
        return lightable(resultFn);
      }
      return lightable(hiddenAction({
        ...result,
        [`data-melt-${name}`]: "",
        action: action ?? noop
      }));
    }
  })();
  const actionFn = action ?? (() => {
  });
  actionFn.subscribe = derivedStore.subscribe;
  return actionFn;
}
function isHTMLElement(element2) {
  return element2 instanceof HTMLElement;
}
function noop() {
}
function addEventListener(target, event, handler, options) {
  const events = Array.isArray(event) ? event : [event];
  events.forEach((_event) => target.addEventListener(_event, handler, options));
  return () => {
    events.forEach((_event) => target.removeEventListener(_event, handler, options));
  };
}
function addMeltEventListener(target, event, handler, options) {
  const events = Array.isArray(event) ? event : [event];
  if (typeof handler === "function") {
    const handlerWithMelt = withMelt((_event) => handler(_event));
    events.forEach((_event) => target.addEventListener(_event, handlerWithMelt, options));
    return () => {
      events.forEach((_event) => target.removeEventListener(_event, handlerWithMelt, options));
    };
  }
  return () => noop();
}
function dispatchMeltEvent(originalEvent) {
  const node = originalEvent.currentTarget;
  if (!isHTMLElement(node))
    return null;
  const customMeltEvent = new CustomEvent(`m-${originalEvent.type}`, {
    detail: {
      originalEvent
    },
    cancelable: true
  });
  node.dispatchEvent(customMeltEvent);
  return customMeltEvent;
}
function withMelt(handler) {
  return (event) => {
    const customEvent = dispatchMeltEvent(event);
    if (customEvent?.defaultPrevented)
      return;
    return handler(event);
  };
}
function omit(obj, ...keys) {
  const result = {};
  for (const key of Object.keys(obj)) {
    if (!keys.includes(key)) {
      result[key] = obj[key];
    }
  }
  return result;
}
const kbd = {
  ALT: "Alt",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  ARROW_UP: "ArrowUp",
  BACKSPACE: "Backspace",
  CAPS_LOCK: "CapsLock",
  CONTROL: "Control",
  DELETE: "Delete",
  END: "End",
  ENTER: "Enter",
  ESCAPE: "Escape",
  F1: "F1",
  F10: "F10",
  F11: "F11",
  F12: "F12",
  F2: "F2",
  F3: "F3",
  F4: "F4",
  F5: "F5",
  F6: "F6",
  F7: "F7",
  F8: "F8",
  F9: "F9",
  HOME: "Home",
  META: "Meta",
  PAGE_DOWN: "PageDown",
  PAGE_UP: "PageUp",
  SHIFT: "Shift",
  SPACE: " ",
  TAB: "Tab",
  CTRL: "Control",
  ASTERISK: "*",
  A: "a",
  P: "p"
};
readable(void 0, (set) => {
  function clicked(event) {
    set(event);
    set(void 0);
  }
  const unsubscribe = addEventListener(document, "pointerup", clicked, {
    passive: false,
    capture: true
  });
  return unsubscribe;
});
readable(void 0, (set) => {
  function keydown(event) {
    if (event && event.key === kbd.ESCAPE) {
      set(event);
    }
    set(void 0);
  }
  const unsubscribe = addEventListener(document, "keydown", keydown, {
    passive: false
  });
  return unsubscribe;
});
({
  prefix: "",
  disabled: readable(false),
  required: readable(false),
  name: readable(void 0)
});
function createLabel() {
  const root = makeElement("label", {
    action: (node) => {
      const mouseDown = addMeltEventListener(node, "mousedown", (e) => {
        if (!e.defaultPrevented && e.detail > 1) {
          e.preventDefault();
        }
      });
      return {
        destroy: mouseDown
      };
    }
  });
  return {
    elements: {
      root
    }
  };
}
const defaults = {
  isDateDisabled: void 0,
  isDateUnavailable: void 0,
  value: void 0,
  preventDeselect: false,
  numberOfMonths: 1,
  pagedNavigation: false,
  weekStartsOn: 0,
  fixedWeeks: false,
  calendarLabel: "Event Date",
  locale: "en",
  minValue: void 0,
  maxValue: void 0,
  disabled: false,
  readonly: false,
  weekdayFormat: "narrow"
};
({
  isDateDisabled: void 0,
  isDateUnavailable: void 0,
  value: void 0,
  positioning: {
    placement: "bottom"
  },
  closeOnEscape: true,
  closeOnOutsideClick: true,
  onOutsideClick: void 0,
  preventScroll: false,
  forceVisible: false,
  locale: "en",
  granularity: void 0,
  disabled: false,
  readonly: false,
  minValue: void 0,
  maxValue: void 0,
  weekdayFormat: "narrow",
  ...omit(defaults, "isDateDisabled", "isDateUnavailable", "value", "locale", "disabled", "readonly", "minValue", "maxValue", "weekdayFormat")
});
function createBitAttrs(bit, parts) {
  const attrs = {};
  parts.forEach((part) => {
    attrs[part] = {
      [`data-${bit}-${part}`]: ""
    };
  });
  return (part) => attrs[part];
}
function getAttrs(builders) {
  const attrs = {};
  builders.forEach((builder) => {
    Object.keys(builder).forEach((key) => {
      if (key !== "action") {
        attrs[key] = builder[key];
      }
    });
  });
  return attrs;
}
function Button$1($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "href",
    "type",
    "builders",
    "el",
    "$$props"
  ]);
  push();
  let href = value_or_fallback($$props["href"], () => void 0);
  let type = value_or_fallback($$props["type"], () => void 0);
  let builders = value_or_fallback($$props["builders"], () => []);
  let el = value_or_fallback($$props["el"], () => void 0);
  const attrs = { "data-button-root": "" };
  $$payload.out += `<!--[-->`;
  if (builders && builders.length) {
    const $$tag = href ? "a" : "button";
    $$payload.out += `<!--[-->`;
    if ($$tag)
      element(
        $$payload,
        $$tag,
        () => {
          $$payload.out += `${spread_attributes(
            [
              { "type": href ? void 0 : type },
              { "href": href },
              { "tabindex": "0" },
              getAttrs(builders),
              $$restProps,
              attrs
            ],
            true,
            false,
            ""
          )}`;
        },
        () => {
          $$payload.out += `<!--[-->`;
          slot($$payload, $$props.children, {}, null);
          $$payload.out += `<!--]-->`;
        }
      );
    $$payload.out += `<!--]-->`;
    $$payload.out += "<!--]-->";
  } else {
    const $$tag_1 = href ? "a" : "button";
    $$payload.out += `<!--[-->`;
    if ($$tag_1)
      element(
        $$payload,
        $$tag_1,
        () => {
          $$payload.out += `${spread_attributes(
            [
              { "type": href ? void 0 : type },
              { "href": href },
              { "tabindex": "0" },
              $$restProps,
              attrs
            ],
            true,
            false,
            ""
          )}`;
        },
        () => {
          $$payload.out += `<!--[-->`;
          slot($$payload, $$props.children, {}, null);
          $$payload.out += `<!--]-->`;
        }
      );
    $$payload.out += `<!--]-->`;
    $$payload.out += "<!--]!-->";
  }
  bind_props($$props, { href, type, builders, el });
  pop();
}
function getLabelData() {
  const NAME = "label";
  const PARTS = ["root"];
  const getAttrs2 = createBitAttrs(NAME, PARTS);
  return {
    NAME,
    getAttrs: getAttrs2
  };
}
function Label$1($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["asChild", "el", "$$props"]);
  push();
  var $$store_subs;
  let builder;
  let asChild = value_or_fallback($$props["asChild"], () => false);
  let el = value_or_fallback($$props["el"], () => void 0);
  const { elements: { root } } = createLabel();
  const { getAttrs: getAttrs2 } = getLabelData();
  const attrs = getAttrs2("root");
  builder = store_get($$store_subs ??= {}, "$root", root);
  Object.assign(builder, attrs);
  $$payload.out += `<!--[-->`;
  if (asChild) {
    $$payload.out += `<!--[-->`;
    slot(
      $$payload,
      $$props.children,
      {
        get builder() {
          return builder;
        }
      },
      null
    );
    $$payload.out += `<!--]-->`;
    $$payload.out += "<!--]-->";
  } else {
    $$payload.out += `<label${spread_attributes([builder, $$restProps], true, false, "")}><!--[-->`;
    slot(
      $$payload,
      $$props.children,
      {
        get builder() {
          return builder;
        }
      },
      null
    );
    $$payload.out += `<!--]--></label>`;
    $$payload.out += "<!--]!-->";
  }
  if ($$store_subs)
    unsubscribe_stores($$store_subs);
  bind_props($$props, { asChild, el });
  pop();
}
function Label($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "$$props"]);
  push();
  let className = value_or_fallback($$props["class"], () => void 0);
  $$payload.out += `<!--[-->`;
  Label$1($$payload, spread_props([
    {
      class: cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)
    },
    $$restProps,
    {
      children: ($$payload2, $$slotProps) => {
        $$payload2.out += `<!--[-->`;
        slot($$payload2, $$props.children, {}, null);
        $$payload2.out += `<!--]-->`;
      }
    }
  ]));
  $$payload.out += `<!--]-->`;
  bind_props($$props, { class: className });
  pop();
}
function Form_label($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "$$props"]);
  push();
  var $$store_subs;
  let className = value_or_fallback($$props["class"], () => void 0);
  const { labelAttrs } = getFormControl();
  $$payload.out += `<!--[-->`;
  Label($$payload, spread_props([
    store_get($$store_subs ??= {}, "$labelAttrs", labelAttrs),
    {
      class: cn("data-[fs-error]:text-destructive", className)
    },
    $$restProps,
    {
      children: ($$payload2, $$slotProps) => {
        $$payload2.out += `<!--[-->`;
        slot($$payload2, $$props.children, { labelAttrs }, null);
        $$payload2.out += `<!--]-->`;
      }
    }
  ]));
  $$payload.out += `<!--]-->`;
  if ($$store_subs)
    unsubscribe_stores($$store_subs);
  bind_props($$props, { class: className });
  pop();
}
function Form_field_errors($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "errorClasses", "$$props"]);
  push();
  let className = value_or_fallback($$props["class"], () => void 0);
  let errorClasses = value_or_fallback($$props["errorClasses"], () => void 0);
  $$payload.out += `<!--[-->`;
  Field_errors($$payload, spread_props([
    {
      class: cn("text-[0.8rem] font-medium text-destructive", className)
    },
    $$restProps,
    {
      children: ($$payload2, $$slotProps) => {
        const errors = $$slotProps.errors;
        const fieldErrorsAttrs = $$slotProps.fieldErrorsAttrs;
        const errorAttrs = $$slotProps.errorAttrs;
        $$payload2.out += `<!--[-->`;
        slot(
          $$payload2,
          $$props.children,
          {
            get errors() {
              return errors;
            },
            get fieldErrorsAttrs() {
              return fieldErrorsAttrs;
            },
            get errorAttrs() {
              return errorAttrs;
            }
          },
          () => {
            const each_array = ensure_array_like(errors);
            $$payload2.out += `<!--[-->`;
            for (let $$index = 0; $$index < each_array.length; $$index++) {
              const error = each_array[$$index];
              $$payload2.out += "<!--[-->";
              $$payload2.out += `<div${spread_attributes(
                [
                  errorAttrs,
                  { "class": cn(errorClasses) }
                ],
                true,
                false,
                ""
              )}>${escape(error)}</div>`;
              $$payload2.out += "<!--]-->";
            }
            $$payload2.out += "<!--]-->";
          }
        );
        $$payload2.out += `<!--]-->`;
      }
    }
  ]));
  $$payload.out += `<!--]-->`;
  bind_props($$props, { class: className, errorClasses });
  pop();
}
function Form_field($$payload, $$props) {
  push();
  let form = $$props["form"];
  let name = $$props["name"];
  let className = value_or_fallback($$props["class"], () => void 0);
  $$payload.out += `<!--[-->`;
  Field($$payload, {
    form,
    name,
    children: ($$payload2, $$slotProps) => {
      const constraints = $$slotProps.constraints;
      const errors = $$slotProps.errors;
      const tainted = $$slotProps.tainted;
      const value = $$slotProps.value;
      $$payload2.out += `<div${attr("class", cn("space-y-2", className), false)}><!--[-->`;
      slot(
        $$payload2,
        $$props.children,
        {
          get constraints() {
            return constraints;
          },
          get errors() {
            return errors;
          },
          get tainted() {
            return tainted;
          },
          get value() {
            return value;
          }
        },
        null
      );
      $$payload2.out += `<!--]--></div>`;
    }
  });
  $$payload.out += `<!--]-->`;
  bind_props($$props, { form, name, class: className });
  pop();
}
function Button($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "class",
    "variant",
    "size",
    "builders",
    "$$props"
  ]);
  push();
  let className = value_or_fallback($$props["class"], () => void 0);
  let variant = value_or_fallback($$props["variant"], () => "default");
  let size = value_or_fallback($$props["size"], () => "default");
  let builders = value_or_fallback($$props["builders"], () => []);
  $$payload.out += `<!--[-->`;
  Button$1($$payload, spread_props([
    {
      builders,
      class: cn(buttonVariants({ variant, size, className })),
      type: "button"
    },
    $$restProps,
    {
      children: ($$payload2, $$slotProps) => {
        $$payload2.out += `<!--[-->`;
        slot($$payload2, $$props.children, {}, null);
        $$payload2.out += `<!--]-->`;
      }
    }
  ]));
  $$payload.out += `<!--]-->`;
  bind_props($$props, { class: className, variant, size, builders });
  pop();
}
const buttonVariants = tv({
  base: "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
      outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline"
    },
    size: {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-8",
      icon: "h-9 w-9"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});
function Form_button($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["$$props"]);
  push();
  $$payload.out += `<!--[-->`;
  Button($$payload, spread_props([
    { type: "submit" },
    $$restProps,
    {
      children: ($$payload2, $$slotProps) => {
        $$payload2.out += `<!--[-->`;
        slot($$payload2, $$props.children, {}, null);
        $$payload2.out += `<!--]-->`;
      }
    }
  ]));
  $$payload.out += `<!--]-->`;
  pop();
}
const Control = Control$1;
function Input($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "value", "readonly", "$$props"]);
  push();
  let className = value_or_fallback($$props["class"], () => void 0);
  let value = value_or_fallback($$props["value"], () => void 0);
  let readonly = value_or_fallback($$props["readonly"], () => void 0);
  $$payload.out += `<input${spread_attributes(
    [
      {
        "class": cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className)
      },
      { "value": value },
      { "readonly": readonly },
      $$restProps
    ],
    true,
    false,
    ""
  )}>`;
  bind_props($$props, { class: className, value, readonly });
  pop();
}
function Card($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "$$props"]);
  push();
  let className = value_or_fallback($$props["class"], () => void 0);
  $$payload.out += `<div${spread_attributes(
    [
      {
        "class": cn("rounded-xl border bg-card text-card-foreground shadow", className)
      },
      $$restProps
    ],
    true,
    false,
    ""
  )}><!--[-->`;
  slot($$payload, $$props.children, {}, null);
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { class: className });
  pop();
}
function Card_content($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "$$props"]);
  push();
  let className = value_or_fallback($$props["class"], () => void 0);
  $$payload.out += `<div${spread_attributes(
    [
      { "class": cn("p-6 pt-0", className) },
      $$restProps
    ],
    true,
    false,
    ""
  )}><!--[-->`;
  slot($$payload, $$props.children, {}, null);
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { class: className });
  pop();
}
function Card_footer($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "$$props"]);
  push();
  let className = value_or_fallback($$props["class"], () => void 0);
  $$payload.out += `<div${spread_attributes(
    [
      {
        "class": cn("flex items-center p-6 pt-0", className)
      },
      $$restProps
    ],
    true,
    false,
    ""
  )}><!--[-->`;
  slot($$payload, $$props.children, {}, null);
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { class: className });
  pop();
}
function Card_header($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "$$props"]);
  push();
  let className = value_or_fallback($$props["class"], () => void 0);
  $$payload.out += `<div${spread_attributes(
    [
      {
        "class": cn("flex flex-col space-y-1.5 p-6", className)
      },
      $$restProps
    ],
    true,
    false,
    ""
  )}><!--[-->`;
  slot($$payload, $$props.children, {}, null);
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { class: className });
  pop();
}
function Card_title($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "tag", "$$props"]);
  push();
  let className = value_or_fallback($$props["class"], () => void 0);
  let tag = value_or_fallback($$props["tag"], () => "h3");
  $$payload.out += `<!--[-->`;
  if (tag)
    element(
      $$payload,
      tag,
      () => {
        $$payload.out += `${spread_attributes(
          [
            {
              "class": cn("font-semibold leading-none tracking-tight", className)
            },
            $$restProps
          ],
          true,
          false,
          ""
        )}`;
      },
      () => {
        $$payload.out += `<!--[-->`;
        slot($$payload, $$props.children, {}, null);
        $$payload.out += `<!--]-->`;
      }
    );
  $$payload.out += `<!--]-->`;
  bind_props($$props, { class: className, tag });
  pop();
}
function SuperDebug($$payload, $$props) {
  push();
  var $$store_subs;
  let themeStyle, debugData;
  let data = $$props["data"];
  let display = value_or_fallback($$props["display"], () => true);
  let status = value_or_fallback($$props["status"], () => true);
  let label = value_or_fallback($$props["label"], () => "");
  let stringTruncate = value_or_fallback($$props["stringTruncate"], () => 120);
  let ref = value_or_fallback($$props["ref"], () => void 0);
  let promise = value_or_fallback($$props["promise"], () => false);
  let raw = value_or_fallback($$props["raw"], () => false);
  let functions = value_or_fallback($$props["functions"], () => false);
  let theme = value_or_fallback($$props["theme"], () => "default");
  let collapsible = value_or_fallback($$props["collapsible"], () => false);
  let collapsed = value_or_fallback($$props["collapsed"], () => false);
  function syntaxHighlight(json) {
    switch (typeof json) {
      case "function": {
        return `<span class="function">[function ${json.name ?? "unnamed"}]</span>`;
      }
      case "symbol": {
        return `<span class="symbol">${json.toString()}</span>`;
      }
    }
    const encodedString = JSON.stringify(
      json,
      function(key, value) {
        if (value === void 0) {
          return "#}#undefined";
        }
        if (typeof this === "object" && this[key] instanceof Date) {
          return "#}D#" + (isNaN(this[key]) ? "Invalid Date" : value);
        }
        if (typeof value === "number") {
          if (value == Number.POSITIVE_INFINITY)
            return "#}#Inf";
          if (value == Number.NEGATIVE_INFINITY)
            return "#}#-Inf";
          if (isNaN(value))
            return "#}#NaN";
        }
        if (typeof value === "bigint") {
          return "#}BI#" + value;
        }
        if (typeof value === "function" && functions) {
          return `#}F#[function ${value.name}]`;
        }
        if (value instanceof Error) {
          return `#}E#${value.name}: ${value.message || value.cause || "(No error message)"}`;
        }
        if (value instanceof Set) {
          return Array.from(value);
        }
        if (value instanceof Map) {
          return Array.from(value.entries());
        }
        return value;
      },
      2
    ).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return encodedString.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function(match) {
      let cls = "number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "key";
          match = match.slice(1, -2) + ":";
        } else {
          cls = "string";
          match = stringTruncate > 0 && match.length > stringTruncate ? match.slice(0, stringTruncate / 2) + `[..${match.length - stringTruncate}/${match.length}..]` + match.slice(-stringTruncate / 2) : match;
          if (match == '"#}#undefined"') {
            cls = "undefined";
            match = "undefined";
          } else if (match.startsWith('"#}D#')) {
            cls = "date";
            match = match.slice(5, -1);
          } else if (match == '"#}#NaN"') {
            cls = "nan";
            match = "NaN";
          } else if (match == '"#}#Inf"') {
            cls = "nan";
            match = "Infinity";
          } else if (match == '"#}#-Inf"') {
            cls = "nan";
            match = "-Infinity";
          } else if (match.startsWith('"#}BI#')) {
            cls = "bigint";
            match = match.slice(6, -1) + "n";
          } else if (match.startsWith('"#}F#')) {
            cls = "function";
            match = match.slice(5, -1);
          } else if (match.startsWith('"#}E#')) {
            cls = "error";
            match = match.slice(5, -1);
          }
        }
      } else if (/true|false/.test(match)) {
        cls = "boolean";
      } else if (/null/.test(match)) {
        cls = "null";
      }
      return '<span class="' + cls + '">' + match + "</span>";
    });
  }
  function assertPromise(data2, raw2, promise2) {
    if (raw2) {
      return false;
    }
    return promise2 || typeof data2 === "object" && data2 !== null && "then" in data2 && typeof data2["then"] === "function";
  }
  function assertStore(data2, raw2) {
    if (raw2) {
      return false;
    }
    return typeof data2 === "object" && data2 !== null && "subscribe" in data2 && typeof data2["subscribe"] === "function";
  }
  themeStyle = theme === "vscode" ? `
      --sd-vscode-bg-color: #1f1f1f;
      --sd-vscode-label-color: #cccccc;
      --sd-vscode-code-default: #8c8a89;
      --sd-vscode-code-key: #9cdcfe;
      --sd-vscode-code-string: #ce9171;
      --sd-vscode-code-number: #b5c180;
      --sd-vscode-code-boolean: #4a9cd6;
      --sd-vscode-code-null: #4a9cd6;
      --sd-vscode-code-undefined: #4a9cd6;
      --sd-vscode-code-nan: #4a9cd6;
      --sd-vscode-code-symbol: #4de0c5;
      --sd-vscode-sb-thumb-color: #35373a;
      --sd-vscode-sb-thumb-color-focus: #4b4d50;
    ` : void 0;
  debugData = assertStore(data, raw) ? data : readable(data);
  $$payload.out += `<!--[-->`;
  if (display) {
    $$payload.out += `<div${attr("class", `super-debug svelte-yk8bu4 ${stringify([collapsible ? "super-debug--collapsible" : ""].filter(Boolean).join(" "))}`, false)}${attr("style", themeStyle, false)}><div${attr("class", `super-debug--status ${stringify(label === "" ? "absolute inset-x-0 top-0" : "")} svelte-yk8bu4`, false)}><div class="super-debug--label svelte-yk8bu4">${escape(label)}</div> <div class="super-debug--right-status svelte-yk8bu4"><button type="button" class="super-debug--copy svelte-yk8bu4"><!--[-->`;
    {
      $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M7 9.667A2.667 2.667 0 0 1 9.667 7h8.666A2.667 2.667 0 0 1 21 9.667v8.666A2.667 2.667 0 0 1 18.333 21H9.667A2.667 2.667 0 0 1 7 18.333z"></path><path d="M4.012 16.737A2.005 2.005 0 0 1 3 15V5c0-1.1.9-2 2-2h10c.75 0 1.158.385 1.5 1"></path></g></svg>`;
      $$payload.out += "<!--]-->";
    }
    $$payload.out += `</button> <!--[-->`;
    if (status) {
      $$payload.out += `<div${attr(
        "class",
        `svelte-yk8bu4 ${stringify([
          store_get($$store_subs ??= {}, "$page", page).status < 200 ? "info" : "",
          store_get($$store_subs ??= {}, "$page", page).status >= 200 && store_get($$store_subs ??= {}, "$page", page).status < 300 ? "success" : "",
          store_get($$store_subs ??= {}, "$page", page).status >= 300 && store_get($$store_subs ??= {}, "$page", page).status < 400 ? "redirect" : "",
          store_get($$store_subs ??= {}, "$page", page).status >= 400 ? "error" : ""
        ].filter(Boolean).join(" "))}`,
        false
      )}>${escape(store_get($$store_subs ??= {}, "$page", page).status)}</div>`;
      $$payload.out += "<!--]-->";
    } else {
      $$payload.out += "<!--]!-->";
    }
    $$payload.out += `</div></div> <pre${attr(
      "class",
      `super-debug--pre svelte-yk8bu4 ${stringify([
        label ? "super-debug--with-label" : "",
        collapsed ? "super-debug--hidden" : ""
      ].filter(Boolean).join(" "))}`,
      false
    )}><code class="super-debug--code"><!--[-->`;
    slot($$payload, $$props.children, {}, () => {
      $$payload.out += `<!--[-->`;
      if (assertPromise(store_get($$store_subs ??= {}, "$debugData", debugData), raw, promise)) {
        $$payload.out += `<!--[-->`;
        await_block(
          store_get($$store_subs ??= {}, "$debugData", debugData),
          () => {
            $$payload.out += `<div class="super-debug--promise-loading svelte-yk8bu4">Loading data...</div>`;
          },
          (result) => {
            $$payload.out += `<!--[-->${syntaxHighlight(assertStore(result, raw) ? get_store_value(result) : result)}<!--]-->`;
          }
        );
        $$payload.out += `<!--]-->`;
        $$payload.out += "<!--]-->";
      } else {
        $$payload.out += `<!--[-->${syntaxHighlight(store_get($$store_subs ??= {}, "$debugData", debugData))}<!--]-->`;
        $$payload.out += "<!--]!-->";
      }
    });
    $$payload.out += `<!--]--></code></pre> <!--[-->`;
    if (collapsible) {
      $$payload.out += `<button type="button" class="super-debug--collapse svelte-yk8bu4"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"${attr("class", `svelte-yk8bu4 ${stringify([collapsed ? "rotated" : ""].filter(Boolean).join(" "))}`, false)}><path fill="currentColor" d="M4.08 11.92L12 4l7.92 7.92l-1.42 1.41l-5.5-5.5V22h-2V7.83l-5.5 5.5l-1.42-1.41M12 4h10V2H2v2h10Z"></path></svg></button>`;
      $$payload.out += "<!--]-->";
    } else {
      $$payload.out += "<!--]!-->";
    }
    $$payload.out += `</div>`;
    $$payload.out += "<!--]-->";
  } else {
    $$payload.out += "<!--]!-->";
  }
  if ($$store_subs)
    unsubscribe_stores($$store_subs);
  bind_props($$props, {
    data,
    display,
    status,
    label,
    stringTruncate,
    ref,
    promise,
    raw,
    functions,
    theme,
    collapsible,
    collapsed
  });
  pop();
}
export {
  Card as C,
  Form_field as F,
  Input as I,
  SuperDebug as S,
  Card_header as a,
  Card_title as b,
  Card_content as c,
  Control as d,
  Form_field_errors as e,
  Card_footer as f,
  Form_button as g,
  Form_label as h,
  getFormField as i,
  generateId as j,
  getDataFsError as k,
  cn as l
};
