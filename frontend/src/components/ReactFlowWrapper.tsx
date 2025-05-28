import {
    ReactFlow,
    Controls,
    Background, type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {useNodeEdgeContext} from "../context/NodeEdgeContext.tsx";


function ReactFlowWrapper() {
    const {nodes, edges, setEdges, setNodes, onNodesChange, onEdgesChange, onConnect} = useNodeEdgeContext();

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
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