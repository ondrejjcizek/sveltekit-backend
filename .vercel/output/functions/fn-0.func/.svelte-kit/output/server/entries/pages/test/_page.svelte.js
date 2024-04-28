import { o as rest_props, p as push, v as value_or_fallback, d as store_get, c as slot, q as spread_attributes, u as unsubscribe_stores, j as bind_props, b as pop, t as sanitize_props, m as spread_props, k as copy_payload, l as assign_payload, n as mutate_store } from "../../../chunks/index3.js";
import { i as getFormField, j as generateId, k as getDataFsError, l as cn, C as Card, a as Card_header, b as Card_title, c as Card_content, F as Form_field, d as Control, e as Form_field_errors, f as Card_footer, g as Form_button, S as SuperDebug, h as Form_label, I as Input } from "../../../chunks/SuperDebug.js";
import "clsx";
import { f as formSchema } from "../../../chunks/schema2.js";
import { s as superForm, z as zodClient } from "../../../chunks/zod.js";
import "../../../chunks/index2.js";
function Description($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["id", "asChild", "el", "$$props"]);
  push();
  var $$store_subs;
  let descriptionAttrs;
  const { descriptionId, errors } = getFormField();
  let id = value_or_fallback($$props["id"], generateId);
  let asChild = value_or_fallback($$props["asChild"], () => false);
  let el = value_or_fallback($$props["el"], () => void 0);
  descriptionId.set(id);
  descriptionAttrs = {
    id: store_get($$store_subs ??= {}, "$descriptionId", descriptionId),
    "data-fs-error": getDataFsError(store_get($$store_subs ??= {}, "$errors", errors)),
    "data-fs-description": "",
    ...$$restProps
  };
  $$payload.out += `<!--[-->`;
  if (asChild) {
    $$payload.out += `<!--[-->`;
    slot(
      $$payload,
      $$props.children,
      {
        get descriptionAttrs() {
          return descriptionAttrs;
        }
      },
      null
    );
    $$payload.out += `<!--]-->`;
    $$payload.out += "<!--]-->";
  } else {
    $$payload.out += `<div${spread_attributes([descriptionAttrs], true, false, "")}><!--[-->`;
    slot(
      $$payload,
      $$props.children,
      {
        get descriptionAttrs() {
          return descriptionAttrs;
        }
      },
      null
    );
    $$payload.out += `<!--]--></div>`;
    $$payload.out += "<!--]!-->";
  }
  if ($$store_subs)
    unsubscribe_stores($$store_subs);
  bind_props($$props, { id, asChild, el });
  pop();
}
function Form_description($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["class", "$$props"]);
  push();
  let className = value_or_fallback($$props["class"], () => void 0);
  $$payload.out += `<!--[-->`;
  Description($$payload, spread_props([
    {
      class: cn("text-[0.8rem] text-muted-foreground", className)
    },
    $$restProps,
    {
      children: ($$payload2, $$slotProps) => {
        const descriptionAttrs = $$slotProps.descriptionAttrs;
        $$payload2.out += `<!--[-->`;
        slot(
          $$payload2,
          $$props.children,
          {
            get descriptionAttrs() {
              return descriptionAttrs;
            }
          },
          null
        );
        $$payload2.out += `<!--]-->`;
      }
    }
  ]));
  $$payload.out += `<!--]-->`;
  bind_props($$props, { class: className });
  pop();
}
function Test_form($$payload, $$props) {
  push();
  var $$store_subs;
  let data = $$props["data"];
  const form = superForm(data, { validators: zodClient(formSchema) });
  const { form: formData, enhance } = form;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<div class="flex flex-col gap-10"><form method="POST" class="flexflex-col gap-2"><!--[-->`;
    Card($$payload2, {
      class: "w-full max-w-sm",
      children: ($$payload3, $$slotProps) => {
        $$payload3.out += `<!--[-->`;
        Card_header($$payload3, {
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `<!--[-->`;
            Card_title($$payload4, {
              class: "text-2xl",
              children: ($$payload5, $$slotProps3) => {
                $$payload5.out += `Přihlášení`;
              }
            });
            $$payload4.out += `<!--]-->`;
          }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Card_content($$payload3, {
          class: "grid gap-4",
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `<!--[-->`;
            Form_field($$payload4, {
              form,
              name: "username",
              children: ($$payload5, $$slotProps3) => {
                $$payload5.out += `<!--[-->`;
                Control($$payload5, {
                  children: ($$payload6, $$slotProps4) => {
                    const attrs = $$slotProps4.attrs;
                    $$payload6.out += `<!--[-->`;
                    Form_label($$payload6, {
                      children: ($$payload7, $$slotProps5) => {
                        $$payload7.out += `Uživatelské jméno`;
                      }
                    });
                    $$payload6.out += `<!--]--> <!--[-->`;
                    Input($$payload6, spread_props([
                      { type: "text" },
                      attrs,
                      {
                        get value() {
                          return store_get($$store_subs ??= {}, "$formData", formData).username;
                        },
                        set value($$value) {
                          mutate_store($$store_subs ??= {}, "$formData", formData, store_get($$store_subs ??= {}, "$formData", formData).username = $$value);
                          $$settled = false;
                        }
                      }
                    ]));
                    $$payload6.out += `<!--]-->`;
                  }
                });
                $$payload5.out += `<!--]--> <!--[-->`;
                Form_field_errors($$payload5, {});
                $$payload5.out += `<!--]-->`;
              }
            });
            $$payload4.out += `<!--]--> <!--[-->`;
            Form_field($$payload4, {
              form,
              name: "password",
              children: ($$payload5, $$slotProps3) => {
                $$payload5.out += `<!--[-->`;
                Control($$payload5, {
                  children: ($$payload6, $$slotProps4) => {
                    const attrs = $$slotProps4.attrs;
                    $$payload6.out += `<!--[-->`;
                    Form_label($$payload6, {
                      children: ($$payload7, $$slotProps5) => {
                        $$payload7.out += `Heslo`;
                      }
                    });
                    $$payload6.out += `<!--]--> <!--[-->`;
                    Input($$payload6, spread_props([
                      { type: "password" },
                      attrs,
                      {
                        get value() {
                          return store_get($$store_subs ??= {}, "$formData", formData).password;
                        },
                        set value($$value) {
                          mutate_store($$store_subs ??= {}, "$formData", formData, store_get($$store_subs ??= {}, "$formData", formData).password = $$value);
                          $$settled = false;
                        }
                      }
                    ]));
                    $$payload6.out += `<!--]--> <!--[-->`;
                    Form_description($$payload6, {
                      children: ($$payload7, $$slotProps5) => {
                        $$payload7.out += `Heslo musí obsahovat 8 znaků, velké písmeno, číslo a speciální symbol.`;
                      }
                    });
                    $$payload6.out += `<!--]-->`;
                  }
                });
                $$payload5.out += `<!--]--> <!--[-->`;
                Form_field_errors($$payload5, {});
                $$payload5.out += `<!--]-->`;
              }
            });
            $$payload4.out += `<!--]-->`;
          }
        });
        $$payload3.out += `<!--]--> <!--[-->`;
        Card_footer($$payload3, {
          children: ($$payload4, $$slotProps2) => {
            $$payload4.out += `<!--[-->`;
            Form_button($$payload4, {
              class: "w-full",
              children: ($$payload5, $$slotProps3) => {
                $$payload5.out += `Přihlásit`;
              }
            });
            $$payload4.out += `<!--]-->`;
          }
        });
        $$payload3.out += `<!--]-->`;
      }
    });
    $$payload2.out += `<!--]--></form> <!--[-->`;
    SuperDebug($$payload2, {
      data: store_get($$store_subs ??= {}, "$formData", formData)
    });
    $$payload2.out += `<!--]--></div>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  if ($$store_subs)
    unsubscribe_stores($$store_subs);
  bind_props($$props, { data });
  pop();
}
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  $$payload.out += `<!--[-->`;
  Test_form($$payload, { data: data.form });
  $$payload.out += `<!--]-->`;
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
