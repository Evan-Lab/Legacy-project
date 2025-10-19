// main.c

#include <stdio.h>
#include <stdlib.h>
#include "bindings.h"

// Decls must match your bindings.h
// void ocaml_runtime_start(void);
// struct node;               // your C AST root type
// struct node* parse_path_c(const char* path);

char *simple_test(int arg);
char *simple_test_multi(int arg1, int arg2, int arg3);



int main(void){
  ocaml_runtime_start();
  tree_t *t = parse_path_ml("/home/maxime/EPITECH/G-ING-900-PAR-9-1-legacy-6/legacy/geneweb/hd/etc/home.txt");
  if (!t) {
    LOG("Failed to parse file\n");
    ocaml_runtime_stop();
    return 1;
  }
  free_tree(t);
  ocaml_runtime_stop();
  return 0;


  // char *str = simple_test(42);
  // LOG("Result from OCaml: %s\n", str);

  // char *str_multi = simple_test_multi(42, 43, 44);
  // LOG("Result from OCaml (multi): %s\n", str_multi);
}
