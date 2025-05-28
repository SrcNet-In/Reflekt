import ReactFlowWrapper from './components/ReactFlowWrapper';
import SearchBar from "./components/SearchBar.tsx";
import {useState} from "react";
import type {Edge, Node} from "@xyflow/react";


function App() {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const updateNodesAndEdges = (newNodes: Node[] , newEdges: Edge[]) => {
        setNodes(newNodes);
        setEdges(newEdges);
    }



    return (
        <>
            <SearchBar updateFlow = {updateNodesAndEdges}/>
            <div style={{ height: '100vh', width: '100vw', display: 'flex' }}>
                <ReactFlowWrapper nodes={nodes} edges={edges} setEdges={setEdges} setNodes={setNodes} />
            </div>
        </>

    );
}

export default App;