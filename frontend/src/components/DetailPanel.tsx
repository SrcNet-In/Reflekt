import {useEffect, useState} from "react";

/**
 * A minimal representation of the xyflow Node type.
 */
export interface Node<T = any, U extends string = string> {
    id: string;
    position: { x: number, y: number };
    data: T;
    type?: U;
}

/** Custom data attached to the xyflow Node */
export interface FileNodeData {
    label: string;
    nodeType: 'DIRECTORY' | 'FILE';
    fullPath?: string;
}

export type FileTreeNode = Node<FileNodeData, 'directoryNode' | 'fileNode'>;


// --- MOCK CODE SNIPPET ---
const mockGoCode = `
package di

import (
	"fmt"
	"io"
	"log"
	"net/http"
)

// Greet prints a greeting to the writer.
func Greet(writer io.Writer, name string) {
	fmt.Fprintf(writer, "Hello, %s", name)
}

// MyGreeterHandler is an HTTP handler for greeting.
func MyGreeterHandler(w http.ResponseWriter, r *http.Request) {
	Greet(w, "world")
}

// main is the entry point of the application.
func main() {
	log.Fatal(http.ListenAndServe(":5001", http.HandlerFunc(MyGreeterHandler)))
}
`;


// --- PROPS FOR THE COMPONENT ---

interface DetailPanelProps {
    /** The currently selected node from the React Flow canvas */
    selectedNode: FileTreeNode | null;
}


function DetailPanel({selectedNode} : DetailPanelProps){
    // State to control if the panel is expanded to show code
    const [isExpanded, setIsExpanded] = useState(true);

    // Automatically expand or contract the panel when the selected node changes
    useEffect(() => {
        if (selectedNode && selectedNode.data.nodeType === 'FILE') {
            setIsExpanded(true); // Automatically expand for files
        } else {
            setIsExpanded(true); // todo : change it to false to auto collapse for directories
        }
    }, [selectedNode]);


    // Determine panel height using Tailwind classes for smooth transition
    const panelHeightClass = isExpanded
        ? 'h-[40%]'
        : 'h-[150px]';

    return (
        <div
            className={`flex-shrink-0 bg-gray-800 border-t border-gray-700 text-gray-300 transition-all duration-300 ease-in-out ${panelHeightClass}`}
        >
            <div className="p-4 flex flex-col h-full">
                {/* Panel Header */}
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-white">
                        {isExpanded ? `Viewing: ${selectedNode?.data.label}` : "Contextual Details"}
                    </h3>
                    {isExpanded && (
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="px-3 py-1 text-xs rounded bg-gray-700 hover:bg-gray-600 transition-colors"
                        >
                            Close (X)
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-hidden">
                    {!selectedNode && (
                        <p className="text-gray-500">Select a node to see details...</p>
                    )}

                    {selectedNode && (
                        <div className="flex space-x-6">
                            <div className="flex-shrink-0">
                                <p><strong>Node:</strong> <span className="font-mono text-green-400">{selectedNode.data.fullPath}</span></p>
                                <p><strong>Type:</strong> <span className="text-blue-400">{selectedNode.data.nodeType}</span></p>
                            </div>
                            <div>
                                <p><strong>Last Commit:</strong> <span className="font-mono text-gray-400">feat: implemented manual DI (a1b2c3d)</span></p>
                                <p><strong>Author:</strong> <span className="text-gray-400">Jane Doe</span></p>
                            </div>
                        </div>
                    )}

                    {/* Code Viewer (Only when expanded) */}
                    {/*{isExpanded && selectedNode && selectedNode.data.nodeType === 'FILE' && (*/}
                    {/*    <pre className="w-full h-full mt-4 p-4 rounded bg-gray-900 overflow-auto text-sm text-yellow-200">*/}
                    {/*        {mockGoCode}*/}
                    {/*    </pre>*/}
                    {/*)}*/}

                    {isExpanded && (
                        <pre className="w-full h-full mt-4 p-4 rounded bg-gray-900 overflow-auto text-sm text-yellow-200">
                            {mockGoCode}
                        </pre>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailPanel;
