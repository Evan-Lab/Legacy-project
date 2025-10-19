let parse_source ~cached path =
  Geneweb_templ.Parser.parse_source ~cached
    (`File path)

(* Register the functions to be callable from C *)

let () =
  Callback.register "parse_source" parse_source;
