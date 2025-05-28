import {buildTree} from "./buildTree.ts";
import {calculateWidth} from "./calculateWidth.ts";
import {layoutTree} from "./layoutTree.ts";
import type {File} from "../../model/file.ts";
import type {Edge, Node} from "@xyflow/react";


export function parseFileList(fileList: File[]) {
    const tree = buildTree(fileList);
    calculateWidth(tree);

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let yOffset = 0;

    for (const root of tree.children) {
        layoutTree(root, 0, 0, nodes, edges, undefined, yOffset);
        yOffset += 2 * 120;
    }

    return {nodes, edges};
}
