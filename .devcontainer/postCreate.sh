#!/bin/bash

CWD=$(pwd)

cd legacy/geneweb

export OPAMYES=1
export OPAMCONFIRMLEVEL=unsafe-yes
opam install -y . --deps-only --with-test --with-doc

eval $(opam env)

ocaml ./configure.ml
make clean distrib

cd $CWD

poetry install --with dev