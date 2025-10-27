from pydantic import BaseModel
import pytypes
import re


# class FullTemplateVars:
#     Node: TypeAlias = Union[None, Dict[str, "Node"], List["Node"]]
#     variables: Dict[str, Node]
#     avars: list[pytypes.AVar]

#     def __init__(self):
#         self.variables = {}
#         self.avars = []

#     def _ensure_list_size(self, lst: List[Node], idx: int) -> None:
#         """Grow list with None placeholders up to and including idx."""
#         if idx >= len(lst):
#             lst.extend([None] * (idx + 1 - len(lst)))

#     def _promote(self, existing: Node, want: type) -> Node:
#         """
#         Promote an existing node to the desired container type if possible.
#         Rules:
#         - None -> new empty container of 'want'
#         - str  -> if want is dict: turn into {existing: None}; if want is list: raise (ambiguous)
#         - dict -> ok if want is dict; raise if want is list
#         - list -> ok if want is list; raise if want is dict
#         """
#         if existing is None:
#             return {} if want is dict else []
#         if isinstance(existing, dict):
#             if want is dict:
#                 return existing
#             raise TypeError("Cannot promote dict to list")
#         if isinstance(existing, list):
#             if want is list:
#                 return existing
#             raise TypeError("Cannot promote list to dict")
#         if isinstance(existing, str):
#             if want is dict:
#                 # Turn a leaf string into a dict with that string as a leaf key
#                 return {existing: None}
#             raise TypeError("Cannot promote string leaf into a list")
#         raise TypeError("Unknown node type")

#     def add_avar(self, avar: pytypes.AVar):
#         self.avars.append(avar)
#         # TODO: insert into variables dict


class Template:
    class TemplateMacro(BaseModel):
        name: str
        args: list[str]
        macro: list[pytypes.ADefine]

        def key(self) -> str:
            return self.name

    class TemplateInclude(BaseModel):
        path: str | None
        include: list[pytypes.AInclude]

        def key(self) -> str:
            return self.path if self.path else "raw"

    class TemplateVariable(BaseModel):
        name: str
        var: dict[str, list[pytypes.AVar]]

        def key(self) -> str:
            return self.name

    name: str
    filepath: str
    tree: pytypes.Tree
    nodes: list[pytypes.Node]
    macros: dict[str, TemplateMacro]
    includes: dict[str, TemplateInclude]
    variables: dict[str, TemplateVariable]

    def __init__(self, name: str, filepath: str, tree: pytypes.Tree):
        self.name = name
        self.filepath = filepath
        self.tree = tree
        self.nodes = []
        self.macros = {}
        self.includes = {}
        self.variables = {}

    def deps(
        self,
    ) -> tuple[dict[str, TemplateMacro], dict[str, TemplateInclude], dict[str, TemplateVariable]]:
        return (self.macros, self.includes, self.variables)

    def _analyze_macro(self, macro: pytypes.ADefine):
        args = [param[0] for param in macro.params]
        self.macros[macro.name] = Template.TemplateMacro(
            name=macro.name,
            args=args,
            macro=[macro],
        )

    def _analyze_include(self, include: pytypes.AInclude):
        match include.value:
            case pytypes.AInclude.FileInclude():
                path = include.value.path
            case pytypes.AInclude.RawInclude():
                path = None

        merge_template_includes(
            self.includes,
            Template.TemplateInclude(
                path=path,
                include=[include],
            ),
        )

    def _analyze_variable(self, var: pytypes.AVar):
        variable = Template.TemplateVariable(
            name=var.name,
            var={
                var.path(): [var],
            }
        )
        merge_template_variables(self.variables, variable)

    def analyze(self):
        def _walker(node: pytypes.Node):
            match node.value:
                case pytypes.ADefine():
                    self._analyze_macro(node.value)
                case pytypes.AInclude():
                    self._analyze_include(node.value)
                case pytypes.AVar():
                    self._analyze_variable(node.value)

        self.tree.walk(_walker)

    def process(self):
        self.tree.walk(lambda node: self.nodes.append(node))
        self._rule_url_for()
        self._rule_prefix()
        self.analyze()
        print(
            f"Processed template '{self.name}' with {len(self.nodes)} nodes, "
            f"{len(self.macros)} macros, {len(self.includes)} includes, "
            f"and {len(self.variables)} variables."
        )

    def _rule_prefix(self):
        for node in self.nodes:
            if isinstance(node.value, pytypes.AVar):
                if node.value.name == "prefix":
                    node.value = pytypes.AText(text="/")

    def _rule_url_for(self):
        MAPPING = {
            "images_prefix": ("static", "images/"),
            "etc_prefix": ("static", ""),
        }

        PATH_REGEX = r"^[a-zA-Z0-9._/\-]+"

        PATH_EXT = [
            "png",
            "jpg",
            "jpeg",
            "gif",
            "css",
            "js",
            "svg",
            "woff",
            "woff2",
            "ttf",
            "eot",
        ]

        path_ext_re = r"(?:" + "|".join([(r"\." + ext) for ext in PATH_EXT]) + r")$"

        for index, node in enumerate(self.nodes):
            if index < len(self.nodes) - 1 and isinstance(node.value, pytypes.AVar):
                # print(f"Checking node {index} with AVar: {node.value.name}")
                mapping = MAPPING.get(node.value.name)
                if not mapping:
                    # print(f"No mapping found for: {node.value.name}")
                    continue
                next_node = self.nodes[index + 1]
                if not isinstance(next_node.value, pytypes.AText):
                    print(
                        f"Next node of {mapping} is not AText, it's {type(next_node.value)}"
                    )
                    continue
                text_value = next_node.value.text
                match = re.search(PATH_REGEX, text_value)
                if not match:
                    continue
                path = match.group(0)
                if not re.search(path_ext_re, path):
                    continue
                next_node.value.text = next_node.value.text.removeprefix(path)

                path = mapping[1] + path

                path = path.strip()

                purlfor = pytypes.PUrlFor(base=mapping[0], path=path)
                self.nodes[index].value = purlfor


def merge_template_macros(
    macros: dict[str, Template.TemplateMacro],
    macro: Template.TemplateMacro,
) -> None:
    existing = macros.get(macro.key())
    if not existing:
        macros[macro.key()] = macro
        return

def merge_template_variables(
    variables: dict[str, Template.TemplateVariable],
    variable: Template.TemplateVariable,
) -> None:
    existing = variables.get(variable.key())
    if not existing:
        variables[variable.key()] = variable
        return
    for path, var_list in variable.var.items():
        if path not in existing.var:
            existing.var[path] = var_list
        else:
            existing.var[path].extend(var_list)

def merge_template_includes(
    includes: dict[str, Template.TemplateInclude],
    include: Template.TemplateInclude,
) -> None:
    existing = includes.get(include.key())
    if not existing:
        includes[include.key()] = include
        return
    existing.include.extend(include.include)