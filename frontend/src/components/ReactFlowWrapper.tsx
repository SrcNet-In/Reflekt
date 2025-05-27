import {
    ReactFlow,
    Controls,
    Background,
    applyEdgeChanges,
    applyNodeChanges,
    type NodeChange,
    type EdgeChange,
    type Node,
    type Edge,
    addEdge,
} from '@xyflow/react';
import { useState, useCallback, useEffect } from 'react';
import { parseFileList } from '../utis/fileParser';

import '@xyflow/react/dist/style.css';
import { fileList } from '../mediaTypes.ts';

function ReactFlowWrapper() {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) =>
            setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) =>
            setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        []
    );

    useEffect(() => {
        const { nodes: parsedNodes, edges: parsedEdges } = parseFileList(fileList);
        setNodes(parsedNodes);
        setEdges(parsedEdges);
    }, []);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
        >
            <Background />
            <Controls />
        </ReactFlow>
    );
}

export default ReactFlowWrapper;