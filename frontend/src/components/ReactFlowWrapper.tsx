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
import { useCallback, useEffect} from 'react';
import {parseFileList} from '../utis/fileParser';

import '@xyflow/react/dist/style.css';
import {fileList} from '../mediaTypes.ts';
import * as React from "react";

interface ReactFlowWrapperProps {
    nodes?: Node[]
    edges?: Edge[]
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

function ReactFlowWrapper(ReactFlowWrapperProps: ReactFlowWrapperProps) {

    const onNodesChange = useCallback(
        (changes: NodeChange[]) =>
            ReactFlowWrapperProps.setNodes((nds: Node[]) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) =>
            ReactFlowWrapperProps.setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback(
        (params: any) => ReactFlowWrapperProps.setEdges((eds) => addEdge(params, eds)),
        []
    );

    useEffect(() => {
        const {nodes: parsedNodes, edges: parsedEdges} = parseFileList(fileList);
        ReactFlowWrapperProps.setNodes(parsedNodes);
        ReactFlowWrapperProps.setEdges(parsedEdges);
    }, []);


    return (
        <ReactFlow
            nodes={ReactFlowWrapperProps.nodes}
            edges={ReactFlowWrapperProps.edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
        >
            <Background/>
            <Controls/>
        </ReactFlow>
    );
}

export default ReactFlowWrapper;