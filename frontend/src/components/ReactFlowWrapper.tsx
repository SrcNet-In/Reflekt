import {
    ReactFlow,
    useReactFlow,
    Controls,
    Background,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {useNodeEdgeContext} from "../context/NodeEdgeContext.tsx";
import {createNewNode} from "../utis/createNewNode.ts";


function ReactFlowWrapper() {
    const {nodes, edges,setNodes , setEdges, onNodesChange, onEdgesChange, onConnect} = useNodeEdgeContext();
    const reactFlowInstance = useReactFlow();



    const handleNewNodeCreation = (event: React.MouseEvent) => {
        createNewNode(event, reactFlowInstance , setNodes);
    };


    return (
        <div style={{ width: '100vw', height: '100vh' }} onDoubleClick={handleNewNodeCreation}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                zoomOnDoubleClick={false}
            >
                <Background/>
                <Controls/>
            </ReactFlow>
        </div>

    );
}

export default ReactFlowWrapper;