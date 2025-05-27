import type {TreeNode} from "../../model/treeNode.ts";

export function calculateWidth(node: TreeNode): number {
    if (node.children.length === 0) {
        node.width = 1;
        return 1;
    }

    node.width = node.children.reduce((acc, child) => acc + calculateWidth(child), 0);
    return node.width;
}
