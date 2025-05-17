"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeGraph = computeGraph;
const pyodide_1 = require("pyodide");
let pyodideInstance = null;
function getPyodide() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!pyodideInstance) {
            pyodideInstance = yield (0, pyodide_1.loadPyodide)({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.6/full/" // ✅ use CDN path here
            });
            ;
        }
        if (pyodideInstance === null) {
            throw new Error("Pyodide instance is null");
        }
        return pyodideInstance;
    });
}
const python_code = `from enum import Enum
from typing import Any, Iterator, Callable
from dataclasses import dataclass
from inspect import signature


@dataclass(frozen=True, eq=True)
class Edge:
    future: tuple[bool, ...]
    target_state: int


@dataclass(frozen=True, eq=True)
class Node:
    state: int
    edges: tuple[Edge, ...]


class GameEnd(Enum):
    WIN = 1
    LOSE = 2


def generate_future(n_params: int) -> Iterator[tuple[bool, ...]]:
    if n_params == 1:
        yield (False,)
        yield (True,)
    else:
        for future in generate_future(n_params - 1):
            yield (False,) + future
            yield (True,) + future


@dataclass(frozen=True, eq=True)
class GameGraph:
    nodes: list[Node]
    states: list[Any]
    playing_function: Callable[..., Any | GameEnd]
    root: Any

    def _serialize_int(self) -> list[int]:
        output: list[int] = []
        n_edges: int = -1
        for node in self.nodes:
            if n_edges < 1:
                n_edges = len(node.edges)
            else:
                assert n_edges == len(node.edges)

        for node in self.nodes:
            for edge in node.edges:
                assert 2 ** len(edge.future) == n_edges
                k: int = len(edge.future)
        output = []
        output.append(k)
        output.append(len(self.nodes))
        for node in self.nodes:
            for edge in node.edges:
                output.append(edge.target_state)
        return output

    @classmethod
    def compute_graph(
        cls,
        playing_function: Callable[..., Any | GameEnd],
        root: Any,
    ) -> "GameGraph":
        n_params: int = len(signature(playing_function).parameters) - 1
        states: dict[Any, int] = {GameEnd.WIN: 0, GameEnd.LOSE: 1}
        nodes: list[Node] = [Node(state=0, edges=()), Node(state=1, edges=())]

        def _dfs(score: Any) -> None:
            states[score] = len(states)
            score_idx = len(states) - 1
            nodes.append(Node(state=score_idx, edges=()))
            edges: list[Edge] = []
            for probe in generate_future(n_params):
                n_score = playing_function(score, *probe)
                if n_score not in states and not isinstance(n_score, GameEnd):
                    _dfs(n_score)
                edges.append(Edge(future=probe, target_state=states[n_score]))
            nodes[score_idx] = Node(state=score_idx, edges=tuple(edges))

        _dfs(root)

        states_list = list(states.keys())
        for k in range(len(states_list)):
            states[states_list[k]] = k

        return GameGraph(
            nodes=nodes,
            states=states_list,
            playing_function=playing_function,
            root=root,
        )
`;
function computeGraph(code) {
    return __awaiter(this, void 0, void 0, function* () {
        const pyodide = yield getPyodide();
        try {
            yield pyodide.runPythonAsync(python_code);
            yield pyodide.runPythonAsync(code);
            const play_fnIsDefined = yield pyodide.runPythonAsync(`"play_fn" in globals()`);
            const s0IsDefined = yield pyodide.runPythonAsync(`"s0" in globals()`);
            if (!play_fnIsDefined) {
                throw new Error("Function play_fn is not defined in the provided code.");
            }
            if (!s0IsDefined) {
                throw new Error("Variable s0 is not defined in the provided code.");
            }
            const result = yield pyodide.runPythonAsync(`GameGraph.compute_graph(play_fn, s0)._serialize_int()`);
            console.log(result.toJs());
            return result.toJs();
            ;
        }
        catch (error) {
            console.error("Error executing Python code:", error);
            throw error;
        }
    });
}
