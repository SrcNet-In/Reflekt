import type {TreeNode} from "../../model/treeNode.ts";


export function buildTree(fileList: { id: number; name: string }[]): TreeNode {
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