import os
from typing import Dict, List, Set

import templates


class Analyser:
    def __init__(self, templates: list[templates.Template]):
        self.templates = templates

        # Computed aggregates
        self.macro_counts: Dict[str, int] = {}
        self.var_counts: Dict[str, int] = {}
        self.include_edges: Dict[str, Set[str]] = {}
        self.included_by_any: Set[str] = set()

    def _count(self, counter: Dict[str, int], key: str) -> None:
        counter[key] = counter.get(key, 0) + 1
    
    def stats(self) -> None:
        print("Template Analysis Statistics:")
        print(f"Total templates analyzed: {len(self.templates)}")
        print(f"Unique macros found: {len(self.macro_counts)}")
        print(f"Unique variables found: {len(self.var_counts)}")
        print(f"Templates included by others: {len(self.included_by_any)}")

    def analyze(self) -> None:
        # Count macros and variables across all templates
        for tpl in self.templates:
            tpl_macros, tpl_includes, tpl_variables = tpl.deps()

            # Macros are keyed by macro name
            for key in tpl_macros.keys():
                self._count(self.macro_counts, key)

            # Variables are keyed by variable name
            for key in tpl_variables.keys():
                self._count(self.var_counts, key)

            # Includes: build child edges for this template
            children: Set[str] = set()
            for _, inc in tpl_includes.items():
                # Only keep file includes that actually point to another template
                if inc.path is None:
                    continue
                children.add(inc.path)
                self.included_by_any.add(inc.path)
            self.include_edges[tpl.name] = children

    def _escape_label(self, s: str) -> str:
        return s.replace("\\", "\\\\").replace("\"", "\\\"")

    def _node_attrs_for_template(self, tpl_name: str, is_root: bool,
                                 macros_local: List[str], macros_global: List[str],
                                 vars_local: List[str], vars_global: List[str]) -> str:
        # lines: List[str] = [tpl_name]
        # if macros_local:
        #     lines.append("Macros (local): " + ", ".join(sorted(macros_local)))
        # if macros_global:
        #     lines.append("Macros (global): " + ", ".join(sorted(macros_global)))
        # if vars_local:
        #     lines.append("Vars (local): " + ", ".join(sorted(vars_local)))
        # if vars_global:
        #     lines.append("Vars (global): " + ", ".join(sorted(vars_global)))

        # label = "\\n".join(self._escape_label(line) for line in lines)
        shape = "doublecircle" if is_root else "ellipse"
        return f"shape={shape}, style=filled, fillcolor=\"#eef7ff\""

    def build_dot_files(self) -> List[str]:
        """Build a DOT graph file per template.

        Returns list of generated file paths.
        """
        # Ensure analysis has been run
        if not self.include_edges:
            self.analyze()

        generated: List[str] = []
        # Precompute root set
        all_names = {tpl.name for tpl in self.templates}
        roots = {name for name in all_names if name not in self.included_by_any}

        for index, tpl in enumerate(self.templates):
            print(f"Generating DOT file for template {index + 1}/{len(self.templates)}: {tpl.name}")
            name = tpl.name
            tpl_macros, tpl_includes, tpl_variables = tpl.deps()

            # Classify macros/variables as local vs global based on counts
            macros_local = [k for k in tpl_macros.keys() if self.macro_counts.get(k, 0) <= 1]
            macros_global = [k for k in tpl_macros.keys() if self.macro_counts.get(k, 0) > 1]
            vars_local = [k for k in tpl_variables.keys() if self.var_counts.get(k, 0) <= 1]
            vars_global = [k for k in tpl_variables.keys() if self.var_counts.get(k, 0) > 1]

            children = sorted(self.include_edges.get(name, set()))
            is_root = name in roots

            # Build DOT content
            lines: List[str] = []
            graph_name = self._escape_label(name)
            lines.append(f"digraph \"{graph_name}\" {{")
            lines.append("  rankdir=LR;")
            lines.append("  node [fontname=\"Helvetica\"];\n")

            # Template node with details
            tpl_id = f"tpl_{self._escape_label(name)}"
            # lines.append(f"  \"{tpl_id}\" [shape=box, {self._node_attrs_for_template(name, is_root, macros_local, macros_global, vars_local, vars_global)}];")
            lines.append(f"  \"{tpl_id}\" [shape=box, {self._node_attrs_for_template(name, is_root, macros_local, macros_global, vars_local, vars_global)}];")

            # Child include nodes and edges
            for child in children:
                child_id = f"inc_{self._escape_label(child)}"
                child_label = self._escape_label(child)
                lines.append(f"  \"{child_id}\" [shape=oval, label=\"{child_label}\"];")
                lines.append(f"  \"{tpl_id}\" -> \"{child_id}\" [label=\"includes\"];\n")

            # Macro nodes and edges
            for m in sorted(macros_local):
                mid = f"macro_{self._escape_label(m)}"
                mlabel = self._escape_label(m) + "\\n(local)"
                lines.append(f"  \"{mid}\" [shape=hexagon, style=filled, fillcolor=\"#e5ffe5\", label=\"{mlabel}\"];")
                lines.append(f"  \"{tpl_id}\" -> \"{mid}\" [label=\"macro\"];")
            for m in sorted(macros_global):
                mid = f"macro_{self._escape_label(m)}"
                mlabel = self._escape_label(m) + "\\n(global)"
                lines.append(f"  \"{mid}\" [shape=hexagon, style=filled, fillcolor=\"#ffe0b2\", label=\"{mlabel}\"];")
                # Reverse edge to pull globals to the left of template
                lines.append(f"  \"{mid}\" -> \"{tpl_id}\" [label=\"macro\"];\n")

            # Variable nodes and edges
            for v in sorted(vars_local):
                vid = f"var_{self._escape_label(v)}"
                vlabel = self._escape_label(v) + "\\n(local)"
                lines.append(f"  \"{vid}\" [shape=diamond, style=filled, fillcolor=\"#fff9c4\", label=\"{vlabel}\"];")
                lines.append(f"  \"{tpl_id}\" -> \"{vid}\" [label=\"var\"];")
            for v in sorted(vars_global):
                vid = f"var_{self._escape_label(v)}"
                vlabel = self._escape_label(v) + "\\n(global)"
                lines.append(f"  \"{vid}\" [shape=diamond, style=filled, fillcolor=\"#ffe082\", label=\"{vlabel}\"];")
                # Reverse edge to pull globals to the left of template
                lines.append(f"  \"{vid}\" -> \"{tpl_id}\" [label=\"var\"];\n")

            lines.append("}")

            with open(tpl.filepath, "w") as f:
                f.write("\n".join(lines))
            generated.append(tpl.filepath)

        return generated
