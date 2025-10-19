from enum import Enum
import sys
import os

import pytypes

from ctypes import (
    CDLL,
    c_bool,
    c_int,
    c_size_t,
    c_char_p,
    Union,
    POINTER,
    Structure,
)


class ANode(Structure):
    class ANodeUnion(Union):
        pass

    def to_py(self) -> pytypes.Node:
        match self.tag:
            case 0:
                value = self.u.atext.to_py()
            case 1:
                value = self.u.avar.to_py()
            case 2:
                value = self.u.atransl.to_py()
            case 3:
                value = self.u.awidhei.to_py()
            case 4:
                value = self.u.aif.to_py()
            case 5:
                value = self.u.aforeach.to_py()
            case 6:
                value = self.u.afor.to_py()
            case 7:
                value = self.u.adefine.to_py()
            case 8:
                value = self.u.aapply.to_py()
            case 9:
                value = self.u.alet.to_py()
            case 10:
                value = self.u.aop1.to_py()
            case 11:
                value = self.u.aop2.to_py()
            case 12:
                value = self.u.aint.to_py()
            case 13:
                value = self.u.ainclude.to_py()
            case _:
                raise ValueError(f"Unknown tag: {self.tag}")
        return pytypes.Node(value=value)


class ATree(Structure):
    def to_py(self) -> pytypes.Tree:
        result = []
        for i in range(self.len):
            node = self.nodes[i]
            if not node:
                raise ValueError("Null node in tree")
            res = node.contents.to_py()
            result.append(res)
        return pytypes.Tree(nodes=result)


class AText(Structure):
    _fields_ = [("text", c_char_p)]

    def to_py(self) -> pytypes.AText:
        return pytypes.AText(text=self.text.decode("utf-8"))


class AVar(Structure):
    _fields_ = [
        ("name", c_char_p),
        ("values", POINTER(c_char_p)),
        ("values_len", c_size_t),
    ]

    def to_py(self) -> pytypes.AVar:
        paths: list[str|int] = []
        for i in range(self.values_len):
            v = self.values[i].decode("utf-8")
            if v.isdigit():
                paths.append(int(v))
            else:
                paths.append(v)

        return pytypes.AVar(
            name=self.name.decode("utf-8"),
            paths=paths,
        )


class ATransl(Structure):
    _fields_ = [("capitalize", c_bool), ("key", c_char_p), ("variant", c_char_p)]

    def to_py(self) -> pytypes.ATransl:
        return pytypes.ATransl(
            capitalize=self.capitalize,
            key=self.key.decode("utf-8"),
            variant=self.variant.decode("utf-8"),
        )


class AWidHei(Structure):
    _fields_ = [("size", c_char_p)]

    def to_py(self) -> pytypes.AWidHei:
        return pytypes.AWidHei(size=self.size.decode("utf-8"))


class AIf(Structure):
    _fields_ = [
        ("cond", POINTER(ANode)),
        ("then_branch", POINTER(ATree)),
        ("else_branch", POINTER(ATree)),
    ]

    def to_py(self) -> pytypes.AIf:
        return pytypes.AIf(
            cond=self.cond.contents.to_py(),
            then_branch=self.then_branch.contents.to_py(),
            else_branch=self.else_branch.contents.to_py(),
        )


class AForEach(Structure):
    _fields_ = []

    def to_py(self) -> pytypes.AForEach:
        return pytypes.AForEach()


class AFor(Structure):
    _fields_ = [
        ("var", c_char_p),
        ("start", POINTER(ANode)),
        ("end", POINTER(ANode)),
        ("body", POINTER(ATree)),
    ]

    def to_py(self) -> pytypes.AFor:
        return pytypes.AFor(
            var=self.var.decode("utf-8"),
            start=self.start.contents.to_py(),
            end=self.end.contents.to_py(),
            body=self.body.contents.to_py(),
        )


class ADefine(Structure):
    class ADefineParam(Structure):
        _fields_ = [
            ("name", c_char_p),
            ("has_value", c_int),
            ("value", POINTER(ANode)),
        ]

        def to_py(self) -> tuple[str, pytypes.Node | None]:
            if self.has_value:
                return (
                    self.name.decode("utf-8"),
                    self.value.contents.to_py(),
                )
            else:
                return (self.name.decode("utf-8"), None)

    _fields_ = [
        ("name", c_char_p),
        ("param_vals", POINTER(ADefineParam)),
        ("params_len", c_size_t),
        ("values", POINTER(ATree)),
        ("body", POINTER(ATree)),
    ]

    def to_py(self) -> pytypes.ADefine:
        params = []
        for i in range(self.params_len):
            param = self.param_vals[i]
            params.append(param.to_py())
        return pytypes.ADefine(
            name=self.name.decode("utf-8"),
            params=params,
            value=self.values.contents.to_py(),
            body=self.body.contents.to_py(),
        )


class AApply(Structure):
    class AApplyArg(Structure):
        _fields_ = [
            ("has_key", c_bool),
            ("key", c_char_p),
            ("arg", POINTER(ATree)),
        ]

        def to_py(self) -> tuple[str | None, pytypes.Tree]:
            if self.has_key:
                key = self.key.decode("utf-8")
            else:
                key = None
            return (
                key,
                self.arg.contents.to_py(),
            )

    _fields_ = [
        ("macro", c_char_p),
        ("args", POINTER(AApplyArg)),
        ("args_len", c_size_t),
    ]

    def to_py(self) -> pytypes.AApply:
        args = []
        for i in range(self.args_len):
            arg = self.args[i]
            args.append(arg.to_py())
        return pytypes.AApply(
            macro=self.macro.decode("utf-8"),
            args=args,
        )


class ALet(Structure):
    _fields_ = [
        ("var", c_char_p),
        ("value", POINTER(ATree)),
        ("body", POINTER(ATree)),
    ]

    def to_py(self) -> pytypes.ALet:
        return pytypes.ALet(
            var=self.var.decode("utf-8"),
            value=self.value.contents.to_py(),
            body=self.body.contents.to_py(),
        )


class AOp1(Structure):
    _fields_ = [("op", c_char_p), ("a", POINTER(ANode))]

    def to_py(self) -> pytypes.AOp1:
        return pytypes.AOp1(
            op=self.op.decode("utf-8"),
            a=self.a.contents.to_py(),
        )


class AOp2(Structure):
    _fields_ = [("op", c_char_p), ("a", POINTER(ANode)), ("b", POINTER(ANode))]

    def to_py(self) -> pytypes.AOp2:
        return pytypes.AOp2(
            op=self.op.decode("utf-8"),
            a=self.a.contents.to_py(),
            b=self.b.contents.to_py(),
        )


class AInt(Structure):
    _fields_ = [("num", c_char_p)]

    def to_py(self) -> pytypes.AInt:
        value = self.num.decode("utf-8")
        return pytypes.AInt(num=value)


class AInclude(Structure):
    class AIncludeType(Enum):
        RAW = 0
        FILE = 1

    class AIncludeUnion(Union):
        class AIncludeRaw(Structure):
            _fields_ = [("raw", c_char_p)]

            def to_py(self) -> pytypes.AInclude.RawInclude:
                return pytypes.AInclude.RawInclude(raw=self.raw.decode("utf-8"))

        class AIncludeFile(Structure):
            _fields_ = [("path", c_char_p)]

            def to_py(self) -> pytypes.AInclude.FileInclude:
                return pytypes.AInclude.FileInclude(path=self.path.decode("utf-8"))

        _fields_ = [
            ("raw_include", AIncludeRaw),
            ("file_include", AIncludeFile),
        ]

    _fields_ = [
        ("type", c_int),
        ("data", AIncludeUnion),
    ]

    def to_py(self) -> pytypes.AInclude:
        match self.type:
            case 0:
                value = self.data.raw_include.to_py()
            case 1:
                value = self.data.file_include.to_py()
            case _:
                raise ValueError(f"Unknown include type: {self.type}")
        return pytypes.AInclude(
            value=value,
        )


if not hasattr(ANode.ANodeUnion, "_fields_"):
    ANode.ANodeUnion._fields_ = [
        ("atext", AText),
        ("avar", AVar),
        ("atransl", ATransl),
        ("awidhei", AWidHei),
        ("aif", AIf),
        ("aforeach", AForEach),
        ("afor", AFor),
        ("adefine", ADefine),
        ("aapply", AApply),
        ("alet", ALet),
        ("aop1", AOp1),
        ("aop2", AOp2),
        ("aint", AInt),
        ("ainclude", AInclude),
    ]

if not hasattr(ANode, "_fields_"):
    ANode._fields_ = [("tag", c_int), ("u", ANode.ANodeUnion)]

if not hasattr(ATree, "_fields_"):
    ATree._fields_ = [("len", c_size_t), ("nodes", POINTER(POINTER(ANode)))]


class OcamlBridge:
    def __init__(self, libname: str | None = None):
        if libname is None:
            if sys.platform == "darwin":
                libname = "bridge.dylib"
            else:
                libname = "bridge.so"

        self.lib = CDLL(libname)

        self.lib.ocaml_runtime_start.restype = None
        self.lib.ocaml_runtime_start.argtypes = []

        self.lib.parse_path_ml.restype = POINTER(ATree)
        self.lib.parse_path_ml.argtypes = [c_char_p]

        self.lib.free_tree.restype = None
        self.lib.free_tree.argtypes = [POINTER(ATree)]

        self.lib.ocaml_runtime_start()
        self.started = True

    def shutdown(self):
        if self.started:
            self.lib.ocaml_runtime_stop()
            self.started = False

    def __del__(self):
        self.shutdown()

    def parse_path_ml(self, path: str) -> pytypes.Tree:
        c_path = path.encode("utf-8")
        tree_ptr = self.lib.parse_path_ml(c_path)
        # print("Finished parsing, converting to Python types...")
        tree = tree_ptr.contents.to_py()
        self.lib.free_tree(tree_ptr)
        return tree
