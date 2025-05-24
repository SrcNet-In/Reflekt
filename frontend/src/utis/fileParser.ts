export function parseFileList(fileList: { id: number; name: string }[]) {
    const nodes: { id: string; data: { label: string }; position: { x: number; y: number } }[] = [];
    const edges: { id: string; source: string; target: string }[] = [];
    const nodeSet :  Set<string> = new Set();

    fileList.forEach((file) => {
        const parts = file.name.split('/');
        let parentId: any = null;

        parts.forEach((part, index) => {
            const nodeId = parentId ? `${parentId}/${part}` : part;

            if (!nodeSet.has(nodeId)) {
                nodes.push({
                    id: nodeId,
                    data: { label: part },
                    position: { x: index * 150, y: nodes.length * 50 },
                });
                nodeSet.add(nodeId);

                if (parentId) {
                    edges.push({
                        id: `${parentId}-${nodeId}`,
                        source: parentId,
                        target: nodeId,
                    });
                }
            }

            parentId = nodeId;
        });
    });

    return { nodes, edges };
}