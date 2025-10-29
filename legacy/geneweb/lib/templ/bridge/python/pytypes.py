from __future__ import annotations
from pydantic import BaseModel

from typing import Callable, Union

Walker = Callable[['Node'], None]

NodeType = Union[
    'AText',
    'AVar',
    'ATransl',
    'AWidHei',
    'AIf',
    'AForEach',
    'AFor',
    'ADefine',
    'AApply',
    'ALet',
    'AOp1',
    'AOp2',
    'AInt',
    'AInclude',
    'PUrlFor',
]

AnyType = Union[NodeType, 'Node', 'Tree']

class AText(BaseModel):
    text: str

    def walk(self, walker: Walker) -> None:
        return


class AVar(BaseModel):
    name: str
    paths: list[str|int]

    def path(self) -> str:
        res = self.name
        for seg in self.paths:
            res += f"[{seg}]" if isinstance(seg, int) else f".{seg}"
        return res

    def walk(self, walker: Walker) -> None:
        return


class ATransl(BaseModel):
    capitalize: bool
    key: str
    variant: str

    def walk(self, walker: Walker) -> None:
        return


class AWidHei(BaseModel):
    size: str

    def walk(self, walker: Walker) -> None:
        return


class AIf(BaseModel):
    cond: Node
    then_branch: Tree
    else_branch: Tree

    def walk(self, walker: Walker) -> None:
        self.cond.walk(walker)
        self.then_branch.walk(walker)
        self.else_branch.walk(walker)


class AForEach(BaseModel):
    def walk(self, walker: Walker) -> None:
        return


class AFor(BaseModel):
    var: str
    start: Node
    end: Node
    body: Tree

    def walk(self, walker: Walker) -> None:
        self.start.walk(walker)
        self.end.walk(walker)
        self.body.walk(walker)


class ADefine(BaseModel):
    name: str
    params: list[tuple[str, Node | None]]
    value: Tree
    body: Tree

    def walk(self, walker: Walker) -> None:
        for _, param in self.params:
            if param:
                param.walk(walker)
        self.value.walk(walker)
        self.body.walk(walker)


class AApply(BaseModel):
    macro: str
    args: list[tuple[str | None, Tree]]

    def walk(self, walker: Walker) -> None:
        for _, arg in self.args:
            arg.walk(walker)


class ALet(BaseModel):
    var: str
    value: Tree
    body: Tree

    def walk(self, walker: Walker) -> None:
        self.value.walk(walker)
        self.body.walk(walker)


class AOp1(BaseModel):
    op: str
    a: Node

    def walk(self, walker: Walker) -> None:
        self.a.walk(walker)


class AOp2(BaseModel):
    op: str
    a: Node
    b: Node

    def walk(self, walker: Walker) -> None:
        self.a.walk(walker)
        self.b.walk(walker)


class AInt(BaseModel):
    num: str

    def walk(self, walker: Walker) -> None:
        return


class AInclude(BaseModel):
    class FileInclude(BaseModel):
        path: str

        def walk(self, walker: Walker) -> None:
            return

    class RawInclude(BaseModel):
        raw: str

        def walk(self, walker: Walker) -> None:
            return

    value: Union[RawInclude, FileInclude]

    def walk(self, walker: Walker) -> None:
        self.value.walk(walker)

class PUrlFor(BaseModel):
    base: str
    path: str

    def walk(self, walker: Walker) -> None:
        return

class Node(BaseModel):
    value: NodeType

    def walk(self, walker: Walker) -> None:
        walker(self)
        self.value.walk(walker)


class Tree(BaseModel):
    nodes: list[Node]

    def walk(self, walker: Walker) -> None:
        for node in self.nodes:
            node.walk(walker)

