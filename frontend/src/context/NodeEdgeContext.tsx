import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    type Edge,
    type EdgeChange,
    type Node,
    type NodeChange
} from "@xyflow/react";
import * as React from "react";
import {type ReactNode, useContext, useState} from "react";
import { parseFileList } from "../utis/fileParser";
import {fileList} from "../mediaTypes.ts";

type NodeEdgeContextType = {
    nodes: Node[];
    edges: Edge[];
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onConnect: (params: any) => void;
}

const NodeEdgeContext = React.createContext<NodeEdgeContextType | undefined>(undefined);
export function NodeEdgeProvider({ children }: { children: ReactNode }) {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);


    const onNodesChange = (changes: NodeChange[]) => {
        setNodes((nds) => applyNodeChanges(changes, nds));
    };

    const onEdgesChange = (changes: EdgeChange[]) => {
        setEdges((eds) => applyEdgeChanges(changes, eds));
    };

    const onConnect = (params: any) => {
        setEdges((eds) => addEdge(params, eds));
    }

    React.useEffect(() => {
        const { nodes, edges } = parseFileList(fileList); // Correct destructuring
        setNodes(nodes);
        setEdges(edges);
    }, []);


    return (
        <NodeEdgeContext.Provider value={{ nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange, onConnect }}>
            {children}
        </NodeEdgeContext.Provider>
    );
}

export const useNodeEdgeContext = () => {
    const context = useContext(NodeEdgeContext);
    if (!context) {
        throw new Error('useNodeEdgeContext must be used within a NodeEdgeProvider');
    }
    return context;
};