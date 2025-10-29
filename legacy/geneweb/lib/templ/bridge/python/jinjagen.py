from datetime import datetime
import sys
from typing import Any, Callable, Self
import pytypes
import templates

from functools import singledispatchmethod, wraps

from djlint import reformat, settings

from jinja2 import Environment, TemplateSyntaxError

env = Environment()

format_config = settings.Config(
    format_css=True,
    format_js=True,
)

rl = sys.getrecursionlimit()
sys.setrecursionlimit(max(rl, 3000))


class TraceLoc:
    class TraceEntry:
        def __init__(self, obj: pytypes.AnyType):
            self.childs = []
            self.parent = None
            self._length = 0
            self.rendered = ""
            self._obj = obj

        _obj: pytypes.AnyType
        rendered: str = ""
        _length: int
        childs: list["TraceLoc.TraceEntry"]
        parent: "TraceLoc.TraceEntry | None"

        def _show(
            self, line: int, start: int, stop: int, level: int = 0, indent: int = 2
        ) -> int:
            if line > stop:
                return line

            def padding(line: int, level: int, indent: int) -> str:
                return "\n" + f"{line:<10}" + (" " * (indent * level))

            display = False
            child_level = level
            if line >= start and line + self.length <= stop:
                display = True
            if display:
                print(
                    padding(line, level, indent)
                    + f"TraceEntry(obj={type(self._obj).__name__}, "
                    + f"length={self.length}, "
                    + f"rendered={self.rendered[:120]!r}..., "
                    + "childs=[",
                    end="",
                    file=sys.stderr,
                )
                child_level += 1
            child_line = line
            for index, child in enumerate(self.childs):
                if index > 0 and display:
                    print(", ", end="", file=sys.stderr)
                child_line = max(
                    child_line,
                    child._show(child_line, start, stop, child_level, indent),
                )
            if display:
                print(
                    padding(child_line, level, indent) + "])", end="", file=sys.stderr
                )
            return line + self.length

        def show(self, start: int = 0, stop: int = sys.maxsize, indent: int = 2) -> int:
            if stop < start:
                raise ValueError("stop must be greater than or equal to start")
            res = self._show(1, start, stop, indent)
            return res

        @property
        def length(self) -> int:
            return self._length

        @property
        def obj(self) -> pytypes.AnyType:
            return self._obj

    EndTraceCallback = Callable[[str], None]

    def __init__(self):
        self.childs: list[TraceLoc.TraceEntry] = []
        self.current: TraceLoc.TraceEntry | None = None

    def __call__(self, obj: pytypes.AnyType) -> EndTraceCallback:
        entry = TraceLoc.TraceEntry(obj)

        if self.current is not None:
            entry.parent = self.current
            self.current.childs.append(entry)
        else:
            entry.parent = None
            self.childs.append(entry)

        def end_callback(rendered: str):
            entry._length = rendered.count("\n")
            entry.rendered = rendered
            self.current = entry.parent

        self.current = entry
        return end_callback

    def show_trace(self, line: int, backtrace: int = 2):
        start = max(0, line - backtrace)
        stop = line + backtrace

        print(f"TraceLoc showing trace from line {start} to {stop}:", file=sys.stderr)
        for entry in self.childs:
            line = entry.show(start, stop)


class JinjaGenerator:
    Render = Callable[[Self, Any, bool], str]

    def __init__(self, template: templates.Template):
        self.template = template
        self.result: str | None = None
        self.tracer = TraceLoc()

    def _rendert(self, obj: pytypes.AnyType, escape: bool) -> str:
        end_callback = self.tracer(obj)
        result: str | None = None
        try:
            result = self._render(obj, escape)
            return result
        finally:
            end_callback(result if result is not None else "")

    def render(self) -> str:
        if self.result is None:
            self.build()
        if self.result is None:
            raise RuntimeError("JinjaGenerator build failed to produce a result")
        return self.result

    @singledispatchmethod
    def _render(self, obj, escape: bool) -> str:
        raise NotImplementedError(f"Rendering not implemented for type: {type(obj)}")

    @staticmethod
    def _escape(fn: Render) -> Render:
        @wraps(fn)
        def wrapper(self, obj, escape: bool) -> str:
            if not escape:
                raise ValueError(f"{fn.__name__} must be called with escape=True")
            return fn(self, obj, escape)

        return wrapper

    @staticmethod
    def _no_escape(fn: Render) -> Render:
        @wraps(fn)
        def wrapper(self, obj, escape: bool) -> str:
            if escape:
                raise ValueError(f"{fn.__name__} must be called with escape=False")
            return fn(self, obj, escape)

        return wrapper

    def _render_template(
        self, template: templates.Template, escape: bool
    ) -> tuple[str, str]:
        macros, includes, variables = template.deps()

        macro_list = [
            f"  - {key}({', '.join(macro.args)})" for key, macro in macros.items()
        ]

        include_list = [
            f"  - {include.path if include.path else 'raw include'}"
            for _, include in includes.items()
        ]

        variable_list = []
        for _, variable in variables.items():
            for key, var_list in variable.var.items():
                variable_list.append(f"  - {key} (x{len(var_list)})")

        header = f"""
  Generated by JinjaGenerator for template '{template.name}'
    at {datetime.now().isoformat()}

  Used macros:
{(("\n".join(macro_list)) if macros else "  None")}

  Used includes:
{(("\n".join(include_list)) if includes else "  None")}

  Used variables:
{(("\n".join(variable_list)) if variables else "  None")}
"""
        return r"{# " + header + r"#}" + "\n\n", self._rendert(template.tree, True)

    @_render.register(pytypes.Tree)
    def _render_tree(self, tree: pytypes.Tree, escape: bool) -> str:
        rop = "" if escape else "+"
        parts = [self._rendert(node, escape) for node in tree.nodes]
        res = rop.join([p for p in parts if p != ""])
        return res

    @_render.register(pytypes.Node)
    def _render_node(self, node: pytypes.Node, escape: bool) -> str:
        res = self._rendert(node.value, escape)
        return res

    @_render.register(pytypes.AText)
    def _render_value(self, value: pytypes.AText, escape: bool) -> str:
        if value.text == "":
            return ""
        
        def unescaped_text() -> str:            
            return '"' + str(value.text).replace('"', '\\"') + '"'
        
        def escaped_text() -> str:
            res = str(value.text)
            res = res.replace(r'{%', '{% raw %}{%{% endraw %}')
            res = res.replace(r'{{', '{% raw %}{{{% endraw %}')
            res = res.replace(r'%}', '{% raw %}%}{% endraw %}')
            res = res.replace(r'}}', '{% raw %}}}{% endraw %}')
            return " " + res + " "

        return escaped_text() if escape else unescaped_text()

    @_render.register(pytypes.AVar)
    def _render_var(self, var: pytypes.AVar, escape: bool) -> str:
        res = r"{{ " if escape else ""
        res += var.path()
        res += r" }}" if escape else ""
        return res

    @_render.register(pytypes.ATransl)
    def _render_transl(self, transl: pytypes.ATransl, escape: bool) -> str:
        res = r"{{ " if escape else ""
        res += "_('" + transl.key.replace("'", "\\'") + "'"
        if transl.variant and transl.variant != "":
            res += f", variant='{transl.variant}'"
        res += r")"
        if transl.capitalize:
            res += r"|capitalize"
        res += r" }}" if escape else ""
        return res

    @_render.register(pytypes.AWidHei)
    def _render_widhei(self, wh: pytypes.AWidHei, escape: bool) -> str:
        return wh.size

    @_render.register(pytypes.AIf)
    # @_escape
    def _render_if(self, if_node: pytypes.AIf, escape: bool) -> str:
        if not escape:
            res = r"(" + self._rendert(if_node.then_branch, False) + r") if "
            res += r"(" + self._rendert(if_node.cond, False) + r")"
            if if_node.else_branch.nodes:
                res += r" else (" + self._rendert(if_node.else_branch, False) + r")"
            return res
        res = r"{% if " + self._rendert(if_node.cond, False) + r" %}"
        res += self._rendert(if_node.then_branch, True)
        if if_node.else_branch.nodes:
            res += r"{% else %}"
            res += self._rendert(if_node.else_branch, True)
        res += r"{% endif %}"
        return res

    @_render.register(pytypes.AForEach)
    @_escape
    def _render_foreach(self, foreach: pytypes.AForEach, escape: bool) -> str:
        return r"{# foreach not implemented yet #}"

    @_render.register(pytypes.AFor)
    @_escape
    def _render_for(self, for_node: pytypes.AFor, escape: bool) -> str:
        res = r"{% for " + for_node.var + r" in range("
        res += self._rendert(for_node.start, False) + r", "
        res += self._rendert(for_node.end, False) + r") %}"
        res += self._rendert(for_node.body, True)
        res += r"{% endfor %}"
        return res

    @_render.register(pytypes.ADefine)
    @_escape
    def _render_define(self, define: pytypes.ADefine, escape: bool) -> str:
        res = r"{% macro " + define.name + "("
        res += ", ".join(
            f"{p[0]}={self._rendert(p[1], False)}" if p[1] else p[0]
            for p in define.params
        )
        res += r") %}"
        res += self._rendert(define.value, True)
        res += r"{% endmacro %}"
        res += self._rendert(define.body, True)
        return res

    @_render.register(pytypes.AApply)
    def _render_apply(self, apply: pytypes.AApply, escape: bool) -> str:
        res = r"{{ " if escape else ""
        res += apply.macro + r"("
        res += ", ".join(arg for arg in [
            f"{arg[0]}={self._rendert(arg[1], False)}"
            if arg[0]
            else self._rendert(arg[1], False)
            for arg in apply.args] if arg != ""
        )
        res += r")"
        res += r" }}" if escape else ""
        return res

    @_render.register(pytypes.ALet)
    @_escape
    def _render_let(self, let: pytypes.ALet, escape: bool) -> str:
        res = r"{% with %}"
        let_value = self._rendert(let.value, False)
        if let_value == "":
            let_value = '""'
        res += r"{% set " + let.var + r" = " + let_value + r" %}"
        res += self._rendert(let.body, True)
        res += r"{% endwith %}"
        return res

    def _map_op(self, op: str) -> str:
        match op:
            case "=":
                return "=="
            case "^":
                return "and not" #TODO: proper xor operator
            case "is_substr":
                return "in"
            case "/":
                return "//"
            case "/.":
                return "/"
            case _:
                return op

    @_render.register(pytypes.AOp1)
    def _render_op1(self, op1: pytypes.AOp1, escape: bool) -> str:
        op = self._map_op(op1.op)
        res = r"{{ " if escape else r""
        res += op + " "
        a = self._rendert(op1.a, False)
        if a == "":
            a = '""'
        res += a
        res += r" }}" if escape else r""
        return res

    @_render.register(pytypes.AOp2)
    def _render_op2(self, op2: pytypes.AOp2, escape: bool) -> str:
        op = self._map_op(op2.op)
        res = r"{{ " if escape else r""
        a = self._rendert(op2.a, False)
        if a == "":
            a = '""'
        res += a
        res += " " + op + " "
        b = self._rendert(op2.b, False)
        if b == "":
            b = '""'
        res += b
        res += r" }}" if escape else r""
        return res

    @_render.register(pytypes.AInt)
    def _render_int(self, aint: pytypes.AInt, escape: bool) -> str:
        return aint.num if not escape else r"{{ " + aint.num + r" }}"

    @_render.register(pytypes.AInclude)
    @_escape
    def _render_include(self, include: pytypes.AInclude, escape: bool) -> str:
        match include.value:
            case pytypes.AInclude.FileInclude():
                return r"{% include '" + include.value.path + ".html.j2" + r"' %}"
            case pytypes.AInclude.RawInclude():
                return include.value.raw
            case _:
                raise NotImplementedError("AInclude variant not implemented yet")

    @_render.register(pytypes.PUrlFor)
    def _render_url_for(self, url_for: pytypes.PUrlFor, escape: bool) -> str:
        res = r"{{ " if escape else ""
        res += 'url_for("' + url_for.base + '"'
        res += ', path="' + url_for.path + '"'
        res += r")"
        res += r" }}" if escape else ""
        return res

    def build(self):
        header, body = self._render_template(self.template, escape=True)

        try:
            env.parse(body)
        except TemplateSyntaxError as e:
            DEBUG_LINES = 5
            lines = body.splitlines()
            context_start = max(0, e.lineno - DEBUG_LINES)
            context_end = min(len(lines), e.lineno + DEBUG_LINES)

            print(
                f"Jinja2 syntax error context (lines {context_start + 1} to {context_end}):",
                file=sys.stderr,
            )
            for i in range(context_start, context_end):
                line_number = i + 1
                line_content = lines[i]
                pointer = ">> " if line_number == e.lineno else "   "
                print(f"{pointer}{line_number:4}: {line_content}", file=sys.stderr)
            self.tracer.show_trace(e.lineno, backtrace=1)
            raise RuntimeError(
                f"Jinja2 syntax error in generated template: {e.message} at line {e.lineno}"
            ) from e

        body = reformat.formatter(format_config, body)

        result = header + body

        self.result = result
