#!/bin/bash

# cur_directory=$(dirname "$0")
# cd "$cur_directory" || exit 1

echo "Building bridge.so and test executable..."

echo "Cleaning up previous builds..."
rm -f bridge.so test
rm -f ../../../_build/default/lib/templ/bridge/bridge.so

echo "Building OCaml shared library..."
dune build bridge.so
echo "Copying bridge.so to current directory..."
cp ../../../_build/default/lib/templ/bridge/bridge.so .
echo "OCaml shared library built and copied."

# echo "Compiling test executable..."
# gcc -L. -l:bridge.so -g -o a.out -Wl,-rpath=. -I. -I/home/maxime/.opam/default/lib/ocaml main.c
# echo "Test executable compiled."