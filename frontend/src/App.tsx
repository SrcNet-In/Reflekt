// import ReactFlowWrapper from './components/ReactFlowWrapper';
// import SearchBar from "./components/SearchBar.tsx";
// import {NodeEdgeProvider} from "./context/NodeEdgeContext.tsx";
// import {ReactFlowProvider} from "@xyflow/react";


import ExplorerSidebar from "./components/ExplorerSidebar.tsx";

function App() {
    function handleLayoutChange() {

    }
    let direction: "DOWN" | "RIGHT" = "DOWN";
    return (
        // <NodeEdgeProvider>
        //     <SearchBar/>
        //     <div style={{ height: '100vh', width: '100vw', display: 'flex' }}>
        //         <ReactFlowProvider>
        //             <ReactFlowWrapper/>
        //         </ReactFlowProvider>
        //
        //     </div>
        // </NodeEdgeProvider>

        <div>
            <ExplorerSidebar
                onLayoutChange={handleLayoutChange}
                currentDirection={direction}/>
        </div>

    );
}

export default App;