#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

#include "bindings.h"

const desc_parser_t _desc_tags[] = {
    {A_TEXT, "A_TEXT", parse_a_text},
    {A_VAR, "A_VAR", parse_a_var},
    {A_TRANSL, "A_TRANSL", parse_a_transl},
    {A_WID_HEI, "A_WID_HEI", parse_a_wid_hei},
    {A_IF, "A_IF", parse_a_if},
    {A_FOREACH, "A_FOREACH", parse_a_foreach},
    {A_FOR, "A_FOR", parse_a_for},
    {A_DEFINE, "A_DEFINE", parse_a_define},
    {A_APPLY, "A_APPLY", parse_a_apply},
    {A_LET, "A_LET", parse_a_let},
    {A_OP1, "A_OP1", parse_a_op1},
    {A_OP2, "A_OP2", parse_a_op2},
    {A_INT, "A_INT", parse_a_int},
    {A_INCLUDE, "A_INCLUDE", parse_a_include},
    {A_PACK, "A_PACK", NULL}}; // Keep it NULL! we should never reach A_PACK parser if we don't flatten the includes

void ocaml_runtime_start(void)
{
  static int started = 0;
  if (started)
    return;
  char *argv[2] = {"embed", NULL};
  caml_startup(argv);
  started = 1;
}

void ocaml_runtime_stop(void)
{
  caml_shutdown();
}

void free_node(node_t *n)
{
  if (!n)
    return;
  switch (n->tag)
  {
  case A_TEXT:
    free_a_text(n);
    break;
  case A_VAR:
    free_a_var(n);
    break;
  case A_TRANSL:
    free_a_transl(n);
    break;
  case A_WID_HEI:
    free_a_wid_hei(n);
    break;
  case A_IF:
    free_a_if(n);
    break;
  case A_FOREACH:
    free_a_foreach(n);
    break;
  case A_FOR:
    free_a_for(n);
    break;
  case A_DEFINE:
    free_a_define(n);
    break;
  case A_APPLY:
    free_a_apply(n);
    break;
  case A_LET:
    free_a_let(n);
    break;
  case A_OP1:
    free_a_op1(n);
    break;
  case A_OP2:
    free_a_op2(n);
    break;
  case A_INT:
    free_a_int(n);
    break;
  case A_INCLUDE:
    free_a_include(n);
    break;
  // case A_PACK:
  //   free_a_pack(n);
  //   break;
  default:
    LOG("free_node: unknown tag %d\n", n->tag);
    free((void *)n);
    break;
  }
}

void free_tree(tree_t *t)
{
  if (!t)
    return;
  for (size_t i = 0; i < t->len; i++)
  {
    free_node(t->nodes[i]);
  }
  free((void *)t->nodes);
  free((void *)t);
}

char *cdup_ocaml_string(value v)
{
  mlsize_t n = caml_string_length(v);
  char *s = malloc(sizeof(char) * (n + 1));
  if (!s)
    return NULL;
  memcpy(s, String_val(v), n);
  s[n] = 0;
  return s;
}

const char *desc_tag_to_string(desc_tag tag)
{
  if (tag < 0 || tag >= sizeof(_desc_tags) / sizeof(_desc_tags[0]))
    return "UNKNOWN";
  return _desc_tags[tag].str;
}

value caml_parse_path_ml(value v_cached, value v_path)
{
  CAMLparam2(v_cached, v_path);
  CAMLlocal1(vres);
  const value *f = caml_named_value("parse_source");
  if (!f)
    caml_failwith("function not registered");

  vres = caml_callback2(*f, v_cached, v_path); // vres : t
  CAMLreturnT(value, vres);
}

node_t *parse_desc(value t)
{
  CAMLparam1(t);
  CAMLlocal1(desc);
  desc = Field(t, 0); // desc.desc

  long ret = Tag_val(desc);
  if (ret < 0 || ret >= sizeof(_desc_tags) / sizeof(_desc_tags[0]))
  {
    LOG("Unknown desc tag: %ld\n", ret);
    CAMLreturnT(node_t *, NULL);
  }
  const desc_parser_t *d = &_desc_tags[ret];
  LOG("==> %s (%d): ", d->str, d->tag);
  if (d->parser)
  {
    node_t *n = d->parser(desc);
    LOG("\n<------------------ %s (%d): ", d->str, d->tag);
    if (n)
    {
      LOG("ok\n");
      CAMLreturnT(node_t *, n);
    }
    else
    {
      LOG("ko\n");
      free_node(n);
      caml_failwith("parser returned NULL");
      CAMLreturnT(node_t *, NULL);
    }
  }
  LOG("no parser\n");
  CAMLreturnT(node_t *, NULL);
}

int list_length(value lst)
{
  CAMLparam1(lst);
  int n = 0;
  while (!Is_long(lst))
  {
    n++;
    lst = Field(lst, 1);
  }
  CAMLreturnT(int, n);
}

tree_t *parse_tree(value v)
{
  CAMLparam1(v);
  CAMLlocal1(lst);

  lst = v;

  size_t len = list_length(lst);
  tree_t *t = malloc(sizeof(tree_t));
  if (!t)
  {
    caml_failwith("malloc failed in parse_desc_list");
    CAMLreturnT(tree_t *, NULL);
  }
  t->nodes = calloc(len, sizeof(node_t *));
  if (!t->nodes)
  {
    free_tree(t);
    caml_failwith("malloc failed in parse_desc_list");
    CAMLreturnT(tree_t *, NULL);
  }
  t->len = len;

  for (size_t i = 0; i < len; i++)
  {
    CAMLlocal2(first, next);
    first = Field(lst, 0);
    next = Field(lst, 1);
    node_t *n = parse_desc(first);
    if (n)
      t->nodes[i] = n;
    else
    {
      free_tree(t);
      caml_failwith("parse_desc returned NULL");
      CAMLreturnT(tree_t *, NULL);
    }
    lst = next;
  }

  CAMLreturnT(tree_t *, t);
}

tree_t *parse_path_ml(const char *path)
{
  CAMLparam0();
  CAMLlocal2(v_path, v_cached);

  v_path = caml_copy_string(path);
  v_cached = Val_bool(0); /* or 1 */

  CAMLlocal1(lst);

  lst = caml_parse_path_ml(v_cached, v_path);

  tree_t *t = parse_tree(lst);
  if (!t)
  {
    caml_failwith("parse_tree failed");
    CAMLreturnT(tree_t *, NULL);
  }

  CAMLreturnT(tree_t *, t);
}
