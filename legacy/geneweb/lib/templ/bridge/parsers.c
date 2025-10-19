#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <caml/mlvalues.h>
#include <caml/memory.h>
#include <caml/alloc.h>
#include <caml/callback.h>
#include <caml/fail.h>

#include "bindings.h"

#define _PARSER_BASE(kind)                         \
    CAMLparam1(v);                                 \
    node_t *n = malloc(sizeof(node_t));            \
    if (!n)                                        \
    {                                              \
        caml_failwith("malloc failed for " #kind); \
        CAMLreturnT(node_t *, NULL);               \
    }                                              \
    n->tag = kind;

void free_a_text(node_t *n)
{
    if (n)
        free((void *)n->u.atext.text);
    free((void *)n);
}

node_t *parse_a_text(value v)
{
    _PARSER_BASE(A_TEXT);

    CAMLlocal1(vs);
    vs = Field(v, 0); // atext.s
    n->u.atext.text = cdup_ocaml_string(vs);
    if (!n->u.atext.text)
    {
        free_a_text(n);
        caml_failwith("cdup_ocaml_string failed in parse_a_text");
        CAMLreturnT(node_t *, NULL);
    }

    LOG("`" KYEL "%s" KNRM "`", n->u.atext.text);

    CAMLreturnT(node_t *, n);
}

void free_a_var(node_t *n)
{
    if (n)
    {
        free((void *)n->u.avar.name);
        for (size_t i = 0; i < n->u.avar.values_len; i++)
        {
            free((void *)n->u.avar.values[i]);
        }
        free((void *)n->u.avar.values);
    }
    free((void *)n);
}

node_t *parse_a_var(value v)
{
    _PARSER_BASE(A_VAR);

    CAMLlocal1(vname);
    vname = Field(v, 0); // avar.name

    n->u.avar.name = cdup_ocaml_string(vname);
    if (!n->u.avar.name)
    {
        free_a_var(n);
        caml_failwith("cdup_ocaml_string failed in parse_a_var");
        CAMLreturnT(node_t *, NULL);
    }

    CAMLlocal1(vlist);
    vlist = Field(v, 1); // avar.list
    size_t len = list_length(vlist);
    n->u.avar.values = calloc(len, sizeof(char *));
    if (!n->u.avar.values)
    {
        free_a_var(n);
        caml_failwith("malloc failed in parse_a_var");
        CAMLreturnT(node_t *, NULL);
    }
    n->u.avar.values_len = len;

    CAMLlocal2(first, nrest);

    for (size_t i = 0; i < len; i++)
    {
        first = Field(vlist, 0);
        nrest = Field(vlist, 1);
        vlist = nrest;
        n->u.avar.values[i] = cdup_ocaml_string(first);
        if (!n->u.avar.values[i])
        {
            free_a_var(n);
            caml_failwith("cdup_ocaml_string failed in parse_a_var");
            CAMLreturnT(node_t *, NULL);
        }
    }

    LOG("`" KMAG "%s(%zu)" KNRM "`", n->u.avar.name, n->u.avar.values_len);

    CAMLreturnT(node_t *, n);
}

void free_a_transl(node_t *n)
{
    if (n)
    {
        free((void *)n->u.atransl.key);
        free((void *)n->u.atransl.variant);
    }
    free((void *)n);
}

node_t *parse_a_transl(value v)
{
    _PARSER_BASE(A_TRANSL);

    CAMLlocal3(vb, vs1, vs2);

    vb = Field(v, 0);  // atransl.b
    vs1 = Field(v, 1); // atransl.s1
    vs2 = Field(v, 2); // atransl.s2

    bool b = Bool_val(vb);

    n->u.atransl.capitalize = b;
    n->u.atransl.key = cdup_ocaml_string(vs1);
    if (!n->u.atransl.key)
    {
        free_a_transl(n);
        caml_failwith("cdup_ocaml_string failed in parse_a_transl");
        CAMLreturnT(node_t *, NULL);
    }
    n->u.atransl.variant = cdup_ocaml_string(vs2);
    if (!n->u.atransl.variant)
    {
        free_a_transl(n);
        caml_failwith("cdup_ocaml_string failed in parse_a_transl");
        CAMLreturnT(node_t *, NULL);
    }
    LOG("`" KBLU "%c%s[%s]" KNRM "`\n", n->u.atransl.capitalize ? '^' : '_', n->u.atransl.key, n->u.atransl.variant);

    CAMLreturnT(node_t *, n);
}

void free_a_wid_hei(node_t *n)
{
    if (n)
    {
        free((void *)n->u.awid_hei.size);
    }
    free((void *)n);
}

node_t *parse_a_wid_hei(value v)
{
    _PARSER_BASE(A_WID_HEI);

    CAMLlocal1(vs);
    vs = Field(v, 0); // awid_hei.s
    n->u.awid_hei.size = cdup_ocaml_string(vs);
    if (!n->u.awid_hei.size)
    {
        free_a_wid_hei(n);
        caml_failwith("cdup_ocaml_string failed in parse_a_wid_hei");
        CAMLreturnT(node_t *, NULL);
    }

    LOG("`" KGRN "%s" KNRM "`", n->u.awid_hei.size);

    CAMLreturnT(node_t *, n);
}

void free_a_if(node_t *n)
{
    if (n)
    {
        free_node(n->u.aif.cond);
        free_tree(n->u.aif.then_branch);
        free_tree(n->u.aif.else_branch);
    }
    free((void *)n);
}

node_t *parse_a_if(value v)
{
    _PARSER_BASE(A_IF);

    CAMLlocal3(vcond, vthen, velse);

    vcond = Field(v, 0); // aif.cond
    vthen = Field(v, 1); // aif.then_branch
    velse = Field(v, 2); // aif.else_branch

    n->u.aif.cond = parse_desc(vcond);
    if (!n->u.aif.cond)
    {
        caml_failwith("parse_a_if: failed to parse condition");
        CAMLreturnT(node_t *, NULL);
    }

    n->u.aif.then_branch = parse_tree(vthen);
    if (!n->u.aif.then_branch)
    {
        caml_failwith("parse_a_if: failed to parse then_branch");
        CAMLreturnT(node_t *, NULL);
    }

    n->u.aif.else_branch = parse_tree(velse);
    if (!n->u.aif.else_branch)
    {
        caml_failwith("parse_a_if: failed to parse else_branch");
        CAMLreturnT(node_t *, NULL);
    }

    CAMLreturnT(node_t *, n);
}

void free_a_foreach(node_t *n)
{
}

node_t *parse_a_foreach(value v)
{
    _PARSER_BASE(A_FOREACH);

    // fprintf(stderr, "parse_a_foreach not implemented yet\n");

    // CAMLlocal3(vvar, viterable, vbody);
    // vvar = Field(v, 0);       // aforeach.var
    // viterable = Field(v, 1);  // aforeach.iterable
    // vbody = Field(v, 2);      // aforeach.body

    // n->u.aforeach.var = cdup_ocaml_string(vvar);
    // if (!n->u.aforeach.var)
    // {
    //     free_a_foreach(n);
    //     caml_failwith("cdup_ocaml_string failed in parse_a_foreach");
    //     CAMLreturnT(node_t *, NULL);
    // }

    // n->u.aforeach.iterable = parse_desc(viterable);
    // if (!n->u.aforeach.iterable)
    // {
    //     free_a_foreach(n);
    //     caml_failwith("parse_desc failed in parse_a_foreach");
    //     CAMLreturnT(node_t *, NULL);
    // }

    // n->u.aforeach.body = parse_tree(vbody);
    // if (!n->u.aforeach.body)
    // {
    //     free_a_foreach(n);
    //     caml_failwith("parse_tree failed in parse_a_foreach");
    //     CAMLreturnT(node_t *, NULL);
    // }

    CAMLreturnT(node_t *, n);
}

void free_a_for(node_t *n)
{
}

node_t *parse_a_for(value v)
{
    _PARSER_BASE(A_FOR);

    CAMLlocal4(vvar, vstart, vend, vbody);
    vvar = Field(v, 0);   // afor.var
    vstart = Field(v, 1); // afor.start
    vend = Field(v, 2);   // afor.end
    vbody = Field(v, 3);  // afor.body

    n->u.afor.var = cdup_ocaml_string(vvar);
    if (!n->u.afor.var)
    {
        free_a_for(n);
        caml_failwith("cdup_ocaml_string failed in parse_a_for");
        CAMLreturnT(node_t *, NULL);
    }

    n->u.afor.start = parse_desc(vstart);
    if (!n->u.afor.start)
    {
        free_a_for(n);
        caml_failwith("parse_desc failed in parse_a_for");
        CAMLreturnT(node_t *, NULL);
    }
    n->u.afor.end = parse_desc(vend);
    if (!n->u.afor.end)
    {
        free_a_for(n);
        caml_failwith("parse_desc failed in parse_a_for");
        CAMLreturnT(node_t *, NULL);
    }

    n->u.afor.body = parse_tree(vbody);
    if (!n->u.afor.body)
    {
        free_a_for(n);
        caml_failwith("parse_tree failed in parse_a_for");
        CAMLreturnT(node_t *, NULL);
    }

    CAMLreturnT(node_t *, n);
}

void free_a_define(node_t *n)
{
    if (n)
    {
        free((void *)n->u.adefine.name);
        for (size_t i = 0; i < n->u.adefine.params_len; i++)
        {
            free((void *)n->u.adefine.param_vals[i].name);
            free_node(n->u.adefine.param_vals[i].value);
        }
        free((void *)n->u.adefine.param_vals);
        free_tree(n->u.adefine.values);
        free_tree(n->u.adefine.body);
    }
    free((void *)n);
}

node_t *parse_a_define(value v)
{
    _PARSER_BASE(A_DEFINE);

    CAMLlocal4(vname, vparams, vbody, vrest);
    vname = Field(v, 0);   // adefine.name
    vparams = Field(v, 1); // adefine.params
    vbody = Field(v, 2);   // adefine.body
    vrest = Field(v, 3);   // adefine.rest

    n->u.adefine.name = cdup_ocaml_string(vname);
    if (!n->u.adefine.name)
    {
        free_a_define(n);
        caml_failwith("cdup_ocaml_string failed in parse_a_define");
        CAMLreturnT(node_t *, NULL);
    }

    // Parse params
    n->u.adefine.params_len = list_length(vparams);
    n->u.adefine.param_vals = calloc(n->u.adefine.params_len, sizeof(adefine_param_t));
    if (!n->u.adefine.param_vals)
    {
        free_a_define(n);
        caml_failwith("malloc failed in parse_a_define");
        CAMLreturnT(node_t *, NULL);
    }

    CAMLlocal3(vparam, vparam_name, vparam_val);
    for (size_t i = 0; i < n->u.adefine.params_len; i++)
    {
        vparam = Field(vparams, 0);
        vparams = Field(vparams, 1);
        vparam_name = Field(vparam, 0);
        vparam_val = Field(vparam, 1);

        n->u.adefine.param_vals[i].name = cdup_ocaml_string(vparam_name);
        if (!n->u.adefine.param_vals[i].name)
        {
            free_a_define(n);
            caml_failwith("cdup_ocaml_string failed in parse_a_define");
            CAMLreturnT(node_t *, NULL);
        }

        if (Is_long(vparam_val))
        {
            n->u.adefine.param_vals[i].value = NULL;
            n->u.adefine.param_vals[i].has_value = false;
            continue;
        }

        n->u.adefine.param_vals[i].value = parse_desc(vparam_val);
        if (!n->u.adefine.param_vals[i].value)
        {
            free_a_define(n);
            caml_failwith("parse_a_define: failed to parse param value");
            CAMLreturnT(node_t *, NULL);
        }
        n->u.adefine.param_vals[i].has_value = true;
    }

    n->u.adefine.values = parse_tree(vbody);
    if (!n->u.adefine.values)
    {
        free_a_define(n);
        caml_failwith("parse_a_define: failed to parse values");
        CAMLreturnT(node_t *, NULL);
    }

    n->u.adefine.body = parse_tree(vrest);
    if (!n->u.adefine.body)
    {
        free_a_define(n);
        caml_failwith("parse_a_define: failed to parse body");
        CAMLreturnT(node_t *, NULL);
    }

    CAMLreturnT(node_t *, n);
}

void free_a_apply(node_t *n)
{
    if (n)
    {
        free((void *)n->u.aapply.macro);
        for (size_t i = 0; i < n->u.aapply.args_len; i++)
        {
            free((void *)n->u.aapply.args[i].key);
            free_tree(n->u.aapply.args[i].arg);
        }
        free((void *)n->u.aapply.args);
    }
    free((void *)n);
}

node_t *parse_a_apply(value v)
{
    _PARSER_BASE(A_APPLY);

    CAMLlocal3(vmacro, vargs, varg);

    vmacro = Field(v, 0); // aapply.macro
    vargs = Field(v, 1);  // aapply.args

    n->u.aapply.macro = cdup_ocaml_string(vmacro);
    if (!n->u.aapply.macro)
    {
        free_a_apply(n);
        caml_failwith("cdup_ocaml_string failed in parse_a_apply");
        CAMLreturnT(node_t *, NULL);
    }

    n->u.aapply.args_len = list_length(vargs);
    n->u.aapply.args = calloc(n->u.aapply.args_len, sizeof(aapply_arg_t));
    if (!n->u.aapply.args)
    {
        free_a_apply(n);
        caml_failwith("malloc failed in parse_a_apply");
        CAMLreturnT(node_t *, NULL);
    }

    for (size_t i = 0; i < n->u.aapply.args_len; i++)
    {
        varg = Field(vargs, 0);
        vargs = Field(vargs, 1);

        CAMLlocal2(vkey_opt, varg_tree);
        vkey_opt = Field(varg, 0);  // aapply_arg.has_key
        varg_tree = Field(varg, 1); // aapply_arg.arg

        n->u.aapply.args[i].has_key = !Is_long(vkey_opt);
        if (n->u.aapply.args[i].has_key)
        {
            n->u.aapply.args[i].key = cdup_ocaml_string(vkey_opt);
            if (!n->u.aapply.args[i].key)
            {
                free_a_apply(n);
                caml_failwith("cdup_ocaml_string failed in parse_a_apply");
                CAMLreturnT(node_t *, NULL);
            }
        }
        else
        {
            n->u.aapply.args[i].key = NULL;
        }

        n->u.aapply.args[i].arg = parse_tree(varg_tree);
        if (!n->u.aapply.args[i].arg)
        {
            free_a_apply(n);
            caml_failwith("parse_a_apply: failed to parse arg tree");
            CAMLreturnT(node_t *, NULL);
        }
    }

    CAMLreturnT(node_t *, n);
}

void free_a_let(node_t *n)
{
    if (n)
    {
        free((void *)n->u.alet.var);
        free_tree(n->u.alet.value);
        free_tree(n->u.alet.body);
    }
    free((void *)n);
}

node_t *parse_a_let(value v)
{
    _PARSER_BASE(A_LET);

    CAMLlocal3(vvar, vvalue, vbody);

    vvar = Field(v, 0);   // alet.var
    vvalue = Field(v, 1); // alet.value
    vbody = Field(v, 2);  // alet.body

    n->u.alet.var = cdup_ocaml_string(vvar);
    if (!n->u.alet.var)
    {
        free_a_let(n);
        caml_failwith("cdup_ocaml_string failed in parse_a_let");
        CAMLreturnT(node_t *, NULL);
    }

    n->u.alet.value = parse_tree(vvalue);
    if (!n->u.alet.value)
    {
        free_a_let(n);
        caml_failwith("parse_a_let: failed to parse value");
        CAMLreturnT(node_t *, NULL);
    }

    n->u.alet.body = parse_tree(vbody);
    if (!n->u.alet.body)
    {
        free_a_let(n);
        caml_failwith("parse_a_let: failed to parse body");
        CAMLreturnT(node_t *, NULL);
    }

    CAMLreturnT(node_t *, n);
}

void free_a_op1(node_t *n)
{
    if (n)
    {
        free((void *)n->u.aop1.op);
        free_node(n->u.aop1.a);
    }
    free((void *)n);
}

node_t *parse_a_op1(value v)
{
    _PARSER_BASE(A_OP1);

    CAMLlocal2(vop, va);

    vop = Field(v, 0); // aop1.op
    va = Field(v, 1);  // aop1.a

    n->u.aop1.op = cdup_ocaml_string(vop);
    if (!n->u.aop1.op)
    {
        free_a_op1(n);
        caml_failwith("malloc failed in parse_a_op1");
        CAMLreturnT(node_t *, NULL);
    }

    n->u.aop1.a = parse_desc(va);
    if (!n->u.aop1.a)
    {
        free_a_op1(n);
        caml_failwith("parse_a_op1: failed to parse a");
        CAMLreturnT(node_t *, NULL);
    }

    LOG("`" KBLU "%s" KNRM "`", n->u.aop1.op);

    CAMLreturnT(node_t *, n);
}

void free_a_op2(node_t *aop2)
{
    if (aop2)
    {
        free((void *)aop2->u.aop2.op);
        free_node(aop2->u.aop2.a);
        free_node(aop2->u.aop2.b);
    }
    free((void *)aop2);
}

node_t *parse_a_op2(value v)
{
    _PARSER_BASE(A_OP2);

    CAMLlocal3(vop, va, vb);

    vop = Field(v, 0); // aop2.op
    va = Field(v, 1);  // aop2.a
    vb = Field(v, 2);  // aop2.b

    n->u.aop2.op = cdup_ocaml_string(vop);
    if (!n->u.aop2.op)
    {
        free_a_op2(n);
        caml_failwith("malloc failed in parse_a_op2");
        CAMLreturnT(node_t *, NULL);
    }
    n->u.aop2.a = parse_desc(va);
    if (!n->u.aop2.a)
    {
        free_a_op2(n);
        caml_failwith("parse_a_op2: failed to parse a");
        CAMLreturnT(node_t *, NULL);
    }

    LOG("`" KBLU "%s" KNRM "`", n->u.aop2.op);

    n->u.aop2.b = parse_desc(vb);
    if (!n->u.aop2.b)
    {
        free_a_op2(n);
        caml_failwith("parse_a_op2: failed to parse b");
        CAMLreturnT(node_t *, NULL);
    }

    CAMLreturnT(node_t *, n);
}

void free_a_int(node_t *n)
{
    if (n)
    {
        free((void *)n->u.aint.num);
    }
    free((void *)n);
}

node_t *parse_a_int(value v)
{
    _PARSER_BASE(A_INT);

    CAMLlocal1(vi);
    vi = Field(v, 0); // aint.s

    n->u.aint.num = cdup_ocaml_string(vi);
    if (!n->u.aint.num)
    {
        free_a_int(n);
        caml_failwith("cdup_ocaml_string failed in parse_a_int");
        CAMLreturnT(node_t *, NULL);
    }

    LOG("`" KYEL "%s" KNRM "`", n->u.aint.num);

    CAMLreturnT(node_t *, n);
}

void free_a_include(node_t *n)
{
    if (n)
    {
        if (n->u.ainclude.type == INCLUDE_FILE)
        {
            free((void *)n->u.ainclude.ainclude_file.path);
        }
        else if (n->u.ainclude.type == INCLUDE_RAW)
        {
            free((void *)n->u.ainclude.ainclude_raw.raw);
        }
    }
    free((void *)n);
}

node_t *parse_a_include(value v)
{
    _PARSER_BASE(A_INCLUDE);

    CAMLlocal3(pv, tagv, payloadv);

    pv = Field(v, 0);        /* polyvariant block */
    tagv = Field(pv, 0);     /* OCaml immediate int */
    payloadv = Field(pv, 1); /* OCaml immediate int */

    if (tagv == caml_hash_variant("File"))
    {
        n->u.ainclude.type = INCLUDE_FILE;

        n->u.ainclude.ainclude_file.path = cdup_ocaml_string(payloadv);
        if (!n->u.ainclude.ainclude_file.path)
        {
            free_a_include(n);
            caml_failwith("cdup_ocaml_string failed in parse_a_include");
            CAMLreturnT(node_t *, NULL);
        }

        LOG("`" KGRN "path(%s)" KNRM "`\n", n->u.ainclude.ainclude_file.path);

        CAMLreturnT(node_t *, n);
    }
    else if (tagv == caml_hash_variant("Raw"))
    {
        n->u.ainclude.type = INCLUDE_RAW;
        n->u.ainclude.ainclude_raw.raw = cdup_ocaml_string(payloadv);
        if (!n->u.ainclude.ainclude_raw.raw)
        {
            free_a_include(n);
            caml_failwith("cdup_ocaml_string failed in parse_a_include");
            CAMLreturnT(node_t *, NULL);
        }

        LOG("`" KGRN "raw(%s)" KNRM "`\n", n->u.ainclude.ainclude_raw.raw);

        CAMLreturnT(node_t *, n);
    }
    LOG("Unknown include tag: %ld\n", tagv);

    free_a_include(n);
    caml_failwith("unknown include tag");
    CAMLreturnT(node_t *, NULL);
}
