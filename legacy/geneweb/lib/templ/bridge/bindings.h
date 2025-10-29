// ast_c_api.h
#pragma once

#include <stddef.h>
#include <stdbool.h>
#include <caml/mlvalues.h>
#include <caml/callback.h>
#include <caml/alloc.h>
#include <caml/memory.h>
#include <caml/fail.h>

#ifdef __cplusplus
extern "C"
{
#endif

// #define DEBUG

#define KNRM "\x1B[0m"
#define KRED "\x1B[31m"
#define KGRN "\x1B[32m"
#define KYEL "\x1B[33m"
#define KBLU "\x1B[34m"
#define KMAG "\x1B[35m"
#define KCYN "\x1B[36m"
#define KWHT "\x1B[37m"

#ifdef DEBUG
#define LOG(fmt, ...) fprintf(stderr, fmt, ##__VA_ARGS__)
#else
#define LOG(fmt, ...) ((void)0)
#endif

#define LOG_LIST(str_list, len)      \
  do                                 \
  {                                  \
    LOG("[");                        \
    for (size_t i = 0; i < len; i++) \
    {                                \
      LOG("%s", str_list[i]);        \
      if (i < len - 1)               \
        LOG(", ");                   \
    }                                \
    LOG("]");                        \
  } while (0)

  typedef enum
  {
    A_TEXT,
    A_VAR,
    A_TRANSL,
    A_WID_HEI,
    A_IF,
    A_FOREACH,
    A_FOR,
    A_DEFINE,
    A_APPLY,
    A_LET,
    A_OP1,
    A_OP2,
    A_INT,
    A_INCLUDE,
    A_PACK
  } desc_tag;

  typedef struct node node_t;

  typedef struct
  {
    size_t len;
    node_t **nodes;
  } tree_t;

  typedef struct
  {
    const char *text;
  } atext_t;

  typedef struct
  {
    const char *name;
    const char **values;
    size_t values_len;
  } avar_t;

  typedef struct
  {
    bool capitalize;
    const char *key;
    const char *variant;
  } atransl_t;

  typedef struct
  {
    const char *size;
  } awid_hei_t;

  typedef struct
  {
    node_t *cond;
    tree_t *then_branch;
    tree_t *else_branch;
  } aif_t;

  typedef struct
  {
    // const char *var;
    // const char **list;
    // size_t list_len;
    // tree_t **rows;
    // size_t row_len;
    // tree_t *body;
  } aforeach_t;

  typedef struct
  {
      const char *var;
      node_t *start;
      node_t *end;
      tree_t *body;
  } afor_t;

  typedef struct
  {
    const char *name;
    bool has_value;
    node_t *value;
  } adefine_param_t;
  typedef struct
  {
    const char *name;
    adefine_param_t *param_vals;
    size_t params_len; // (string * t option) list
    tree_t *values;
    tree_t *body;
  } adefine_t;

  typedef struct
  {
    bool has_key;
    const char *key;
    tree_t *arg;
  } aapply_arg_t;
  typedef struct
  {
    const char *macro;
    aapply_arg_t *args;
    size_t args_len;
  } aapply_t;

  typedef struct
  {
    const char *var;
    tree_t *value;
    tree_t *body;
  } alet_t;

  typedef struct
  {
    const char *op;
    node_t *a;
  } aop1_t;
  typedef struct
  {
    const char *op;
    node_t *a;
    node_t *b;
  } aop2_t;
  typedef struct
  {
    const char *num;
  } aint_t;

  typedef struct
  {
    const char *path;
  } ainclude_file_t;
  typedef struct
  {
    const char *raw;
  } ainclude_raw_t;
  typedef enum
  {
    INCLUDE_RAW,
    INCLUDE_FILE
  } include_type_t;
  typedef struct
  {
    include_type_t type;
    union
    {
      ainclude_file_t ainclude_file;
      ainclude_raw_t ainclude_raw;
    };
  } ainclude_t;

  typedef struct apack
  {
    node_t **items;
    size_t len;
  } apack_t;

  struct node
  {
    desc_tag tag;
    union
    {
      atext_t atext;
      avar_t avar;
      atransl_t atransl;
      awid_hei_t awid_hei;
      aif_t aif;
      aforeach_t aforeach;
      afor_t afor;
      adefine_t adefine;
      aapply_t aapply;
      alet_t alet;
      aop1_t aop1;
      aop2_t aop2;
      aint_t aint;
      ainclude_t ainclude;
      // apack_t apack;
    } u;
  };

  typedef struct
  {
    node_t node;
  } desc_t;

  typedef node_t *(*parser_func)(value);
  typedef void (*show_func)(node_t *);

  typedef struct
  {
    desc_tag tag;
    const char *str;
    parser_func parser;
  } desc_parser_t;

  void ocaml_runtime_start(void);
  void ocaml_runtime_stop(void);
  char *cdup_ocaml_string(value v);

  int list_length(value lst);

  // Entrypoints
  tree_t *parse_path_ml(const char *path);

  // Parsers and free functions
  void free_node(node_t *n);
  node_t *parse_desc(value desc);
  void free_tree(tree_t *t);
  tree_t *parse_tree(value v);

  void free_a_text(node_t *n);
  node_t *parse_a_text(value v);
  void free_a_var(node_t *n);
  node_t *parse_a_var(value v);
  void free_a_transl(node_t *n);
  node_t *parse_a_transl(value v);
  void free_a_wid_hei(node_t *n);
  node_t *parse_a_wid_hei(value v);
  void free_a_if(node_t *n);
  node_t *parse_a_if(value v);
  void free_a_foreach(node_t *n);
  node_t *parse_a_foreach(value v);
  void free_a_for(node_t *n);
  node_t *parse_a_for(value v);
  void free_a_define(node_t *n);
  node_t *parse_a_define(value v);
  void free_a_apply(node_t *n);
  node_t *parse_a_apply(value v);
  void free_a_let(node_t *n);
  node_t *parse_a_let(value v);
  void free_a_op1(node_t *n);
  node_t *parse_a_op1(value v);
  void free_a_op2(node_t *n);
  node_t *parse_a_op2(value v);
  void free_a_int(node_t *n);
  node_t *parse_a_int(value v);
  void free_a_include(node_t *n);
  node_t *parse_a_include(value v);

  extern const desc_parser_t _desc_tags[];
#ifdef __cplusplus
}
#endif
