// import ReactFlowWrapper from './components/ReactFlowWrapper';
// import SearchBar from "./components/SearchBar.tsx";
// import {NodeEdgeProvider} from "./context/NodeEdgeContext.tsx";
// import {ReactFlowProvider} from "@xyflow/react";


import ExplorerSidebar from "./components/ExplorerSidebar.tsx";
import FlowCanvas from "./components/FlowCanvas.tsx";
// import React from "react";
// import {useCallback, useEffect, useState} from "react";
// import {useEdgesState, useNodesState, useReactFlow} from "@xyflow/react";
import type {RawFileNode} from "./model/RawFileNode.tsx";
import {useState} from "react";

function App() {
    function handleLayoutChange() {

    }
    let direction: "DOWN" | "RIGHT" = "DOWN";

    const defaultInitialData: RawFileNode[] = [
        { id: 1, parent_id: 0, level: 0, file_name: 'golang-helper', node_type: 'DIRECTORY', full_path: '/' },
        { id: 2, parent_id: 1, level: 1, file_name: 'basics', node_type: 'DIRECTORY', full_path: '/basics' },
        { id: 3, parent_id: 2, level: 2, file_name: 'di', node_type: 'DIRECTORY', full_path: '/basics/di' },
        { id: 4, parent_id: 3, level: 3, file_name: 'manual_di.go', node_type: 'FILE', full_path: '/basics/di/manual_di.go' },
        { id: 5, parent_id: 3, level: 3, file_name: 'di_test.go', node_type: 'FILE', full_path: '/basics/di/di_test.go' },
        { id: 6, parent_id: 2, level: 2, file_name: 'serializing', node_type: 'DIRECTORY', full_path: '/basics/serializing' },
        { id: 7, parent_id: 6, level: 3, file_name: 'json_example.go', node_type: 'FILE', full_path: '/basics/serializing/json_example.go' },
        { id: 8, parent_id: 6, level: 3, file_name: 'xml_example.go', node_type: 'FILE', full_path: '/basics/serializing/xml_example.go' },
        { id: 9, parent_id: 1, level: 1, file_name: 'README.md', node_type: 'FILE', full_path: '/README.md' },
    ];


    const [fileTreeData, setFileTreeData] = useState<RawFileNode[]>(defaultInitialData)
    return (
        <div className="h-screen flex">
            <ExplorerSidebar
                onLayoutChange={handleLayoutChange}
                currentDirection={direction}
                initialData = {fileTreeData}/>

            <FlowCanvas
                initialData={fileTreeData}
                onSubmitRepo={setFileTreeData}
                currentDirection={"DOWN"}
                onNodeClick={() => {}}/>
        </div>

    );
}

export default App;