type TreeNode = {
    id: string;
    label: string;
    children: TreeNode[];
    width?: number;
};

// Step 1: Build a tree from file paths
function buildTree(fileList: { id: number; name: string }[]): TreeNode {
    const root: TreeNode = { id: '', label: 'root', children: [] };

    for (const file of fileList) {
        const parts = file.name.split('/');
        let current = root;

        for (let i = 0; i < parts.length; i++) {
            const path = parts.slice(0, i + 1).join('/');
            let child = current.children.find((c) => c.id === path);
            if (!child) {
                child = {
                    id: path,
                    label: parts[i],
                    children: [],
                };
                current.children.push(child);
            }
            current = child;
        }
    }

    return root;
}

// Step 2: Calculate subtree widths recursively
function calculateWidth(node: TreeNode): number {
    if (node.children.length === 0) {
        node.width = 1;
        return 1;
    }

    node.width = node.children.reduce((acc, child) => acc + calculateWidth(child), 0);
    return node.width;
}

// Step 3: Layout the tree horizontally with optional Y offset
function layoutTree(
    node: TreeNode,
    depth: number,
    xStart: number,
    nodes: any[],
    edges: any[],
    parentId?: string,
    yOffset: number = 0
) {
    const ySpacing = 120;
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

// Step 4: Public method to parse file list and generate nodes + edges
export function parseFileList(fileList: { id: number; name: string }[]) {
    const tree = buildTree(fileList);
    console.log(tree)
    calculateWidth(tree);

    const nodes: any[] = [];
    const edges: any[] = [];
    let yOffset = 0;

    for (const root of tree.children) {
        layoutTree(root, 0, 0, nodes, edges, undefined, yOffset);
        yOffset += 2 * 120; // move next root tree downward
    }

    return { nodes, edges };
}
