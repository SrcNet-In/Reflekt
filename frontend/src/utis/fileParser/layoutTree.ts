import type {TreeNode} from "../../model/treeNode.ts";


export function layoutTree(
    node: TreeNode,
    depth: number,
    xStart: number,
    nodes: any[],
    edges: any[],
    parentId?: string,
    yOffset: number = 0
) {
    const ySpacing = 200;
    const xSpacing = 200;

    let currentX = xStart;

    for (const child of node.children) {
        const childXCenter = currentX + (child.width! * xSpacing) / 2;
        const id = child.id;

        nodes.push({
            id,
            data: { label: child.label },
            position: { x: childXCenter, y: depth * ySpacing + yOffset },
        });

        if (parentId) {
            edges.push({
                id: `${parentId}-${id}`,
                source: parentId,
                target: id,
            });
        }

        layoutTree(child, depth + 1, currentX, nodes, edges, id, yOffset);
        currentX += child.width! * xSpacing;
    }
}
