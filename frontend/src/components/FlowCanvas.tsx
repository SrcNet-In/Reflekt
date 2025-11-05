import React, { useCallback, useEffect, useState } from 'react';
import type { RawFileNode } from '../model/RawFileNode';
// --- FIX: Import only TYPES from reactflow ---
import type {
    NodeProps,
} from 'reactflow';
import '@xyflow/react/dist/style.css';
import {
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
    useReactFlow,
    ReactFlow,
    MiniMap,
    Position,
    Controls,
    Handle
} from '@xyflow/react';

import type { Node, Edge } from '@xyflow/react';
import DetailPanel from "./DetailPanel.tsx";


import ELK from 'elkjs/lib/elk.bundled.js';
import {getRepoAnalysisV2} from "../api/AnalyzeRepo.ts";



/** Custom data attached to the xyflow Node */
interface FileNodeData extends Record<string, unknown>{
    label: string;
    nodeType: 'DIRECTORY' | 'FILE';
    fullPath?: string;
}

/** Specific xyflow Node type for type safety */
type FileTreeNode = Node<FileNodeData, 'directoryNode' | 'fileNode'>;

/** Layout options for Elk.js */
interface LayoutOptions {
    direction: 'DOWN' | 'RIGHT';
}

// --- ELK.js LAYOUT LOGIC ---

const elk = new ELK();

const elkOptions = {
    'elk.algorithm': 'layered',
    'elk.layered.spacing.nodeNodeBetweenLayers': '100', // Vertical spacing
    'elk.spacing.nodeNode': '80', // Horizontal spacing
    'elk.direction': 'DOWN',
};

/**
 * Calculates the positions for all nodes using the ELK layout algorithm.
 */
const getLayoutedElements = async (
    nodes: FileTreeNode[],
    edges: Edge[],
    options: LayoutOptions
): Promise<{ nodes: FileTreeNode[]; edges: Edge[] }> => {
    const NODE_WIDTH = 180;
    const NODE_HEIGHT = 40;

    const graph: any = {
        id: 'root',
        layoutOptions: {
            ...elkOptions,
            'elk.direction': options.direction,
        },
        children: nodes.map((node) => ({
            id: node.id,
            width: NODE_WIDTH,
            height: NODE_HEIGHT,
        })),
        edges: edges.map((edge) => ({
            id: edge.id,
            sources: [edge.source],
            targets: [edge.target],
        })),
    };

    try {
        const layoutedGraph = await elk.layout(graph);

        if (!layoutedGraph.children) {
            return { nodes: [], edges: [] };
        }

        const layoutedNodes = layoutedGraph.children.map((elkNode: any) => {
            const originalNode = nodes.find(n => n.id === elkNode.id);

            if (!originalNode || elkNode.x === undefined || elkNode.y === undefined) {
                return null;
            }

            return {
                ...originalNode,
                position: { x: elkNode.x, y: elkNode.y },
                sourcePosition: options.direction === 'DOWN' ? Position.Bottom : Position.Right,
                targetPosition: options.direction === 'DOWN' ? Position.Top : Position.Left,
            } as FileTreeNode;
        }).filter((n: any): n is FileTreeNode => n !== null);

        return { nodes: layoutedNodes, edges };

    } catch (error) {
        console.error('ELK Layout Error:', error);
        return { nodes: [], edges: [] };
    }
};

// --- CUSTOM NODE COMPONENTS ---

const baseNodeStyle = "px-4 py-2 border-2 rounded-lg shadow-md transition-all duration-200 w-[180px] text-sm";

const DirectoryNode = ({ data }: NodeProps<FileNodeData>) => (
    <div className={`${baseNodeStyle} bg-blue-900/50 border-blue-400 text-blue-200 hover:bg-blue-800/60`}>
        <Handle type="target" position={Position.Top} className="!bg-blue-400" />
        <div className="font-semibold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            {data.label}
        </div>
        <Handle type="source" position={Position.Bottom} className="!bg-blue-400" />
    </div>
);

const FileNode = ({ data }: NodeProps<FileNodeData>) => (
    <div className={`${baseNodeStyle} bg-green-900/50 border-green-400 text-green-200 hover:bg-green-800/60`}>
        <Handle type="target" position={Position.Top} className="!bg-green-400" />
        <div className="font-medium flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0011.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            {data.label}
        </div>
        <Handle type="source" position={Position.Bottom} className="!bg-green-400" />
    </div>
);

const nodeTypes = {
    directoryNode: DirectoryNode,
    fileNode: FileNode,
};

// --- DATA TRANSFORMATION ---

/**
 * Transforms raw JSON data into xyflow Node and Edge objects.
 */
const transformData = (data: RawFileNode[]): { nodes: FileTreeNode[], edges: Edge[] } => {
    return data.reduce((acc, item) => {
        // Node Transformation
        acc.nodes.push({
            id: String(item.id),
            position: { x: 0, y: 0 }, // Placeholder, will be set by layout
            data: { label: item.file_name, nodeType: item.node_type, fullPath: item.full_path },
            type: item.node_type === 'DIRECTORY' ? 'directoryNode' : 'fileNode',
        } as FileTreeNode);

        // Edge Transformation
        if (item.parent_id !== 0) {
            acc.edges.push({
                id: `e${item.parent_id}-${item.id}`,
                source: String(item.parent_id),
                target: String(item.id),
                type: 'smoothstep',
                animated: false,
                markerEnd: { type: 'arrowclosed' as any }, // Use 'as any' for type compatibility
                className: 'stroke-gray-600',
            });
        }
        return acc;
    }, { nodes: [] as FileTreeNode[], edges: [] as Edge[] });
};

// --- PROPS FOR THE CANVAS ---

interface FlowCanvasProps {
    initialData: RawFileNode[];
    onSubmitRepo: (data: RawFileNode[]) => void;
    currentDirection: 'DOWN' | 'RIGHT';
    onNodeClick: (node: FileTreeNode) => void; // Callback for the detail panel
}

// --- MODULE 2: FlowCanvas (Wrapped in useReactFlow for layout hook access) ---


const FlowCanvasInternal: React.FC<FlowCanvasProps> = ({ initialData ,onSubmitRepo ,currentDirection, onNodeClick }) => {
    // @ts-ignore
    const [nodes, setNodes, onNodesChange] = useNodesState<FileTreeNode>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const { fitView } = useReactFlow();
    const [isLoading, setIsLoading] = useState(true);


    const [url, setUrl] = useState("")
    const [branch, setBranch] = useState("");

    // This logic runs the layout algorithm
    const runLayout = useCallback(async (data: RawFileNode[], direction: 'DOWN' | 'RIGHT') => {
        setIsLoading(true);
        const { nodes: rawNodes, edges: rawEdges } = transformData(data);
        const layoutedElements = await getLayoutedElements(rawNodes, rawEdges, { direction });

        setNodes(layoutedElements.nodes);
        setEdges(layoutedElements.edges);

        window.requestAnimationFrame(() => fitView({ padding: 0.2 }));
        setIsLoading(false);
    }, [setNodes, setEdges, fitView]);

    // Re-run layout when data or direction changes
    useEffect(() => {
        runLayout(initialData, currentDirection);
    }, [initialData, runLayout, currentDirection]);

    const handleNodeClick = useCallback((_: any, node: FileTreeNode) => {
        onNodeClick(node);
    }, [onNodeClick]);

    const handleV2Submit = async (event: React.FormEvent)=>{
        event.preventDefault();
        console.log("function is getting called")
        try{
            const data = await getRepoAnalysisV2(url , branch);
            onSubmitRepo(data.nodes)
            console.log(data);
        }
        catch (error){
            console.error("Error fetching repo details:", error);
        }
    }

    return (
        <div className="flex-1 relative bg-gray-900 h-full w-full">
            <div className="absolute top-0 left-0 z-10 flex w-full items-center justify-start bg-gray-800 border-b border-gray-700 px-6 py-3">
                <div className="flex items-center gap-2 w-full max-w-md">
                    <input
                        type="text"
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Search repository..."
                        className="flex-1 rounded-lg bg-gray-700 border border-gray-600 px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        onChange={(e) => setBranch(e.target.value)}
                        placeholder="Branch..."
                        className="flex-1 rounded-lg bg-gray-700 border border-gray-600 px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition" type={'submit'}
                    onClick={handleV2Submit}>
                        Search
                    </button>
                </div>
            </div>

            {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900/80 text-white text-xl">
                    Calculating Layout...
                </div>
            )}
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={handleNodeClick}
                nodeTypes={nodeTypes as any}
                fitView
                defaultEdgeOptions={{
                    style: { strokeWidth: 2 },
                    type: 'smoothstep'
                }}
                proOptions={{ hideAttribution: true }}
            >
                <MiniMap nodeStrokeColor="#4ade80" nodeColor="#3b82f6" maskColor="rgba(0, 0, 0, 0.5)" />
                <Controls showInteractive={false} className="!text-gray-300 !bg-gray-700" />
                <div className="w-full h-full absolute inset-0 bg-gray-900" />
            </ReactFlow>
        </div>
    );
};

// --- FINAL WRAPPER COMPONENT ---
// This wraps the canvas in the ReactFlowProvider, which is required by the useReactFlow hook

const FlowCanvas: React.FC<FlowCanvasProps> = (props) => (
    <ReactFlowProvider>
        <div className="flex-1 flex flex-col relative overflow-hidden">
            <FlowCanvasInternal {...props} />
            <DetailPanel selectedNode={null}/>
        </div>
    </ReactFlowProvider>
);

export default FlowCanvas;

