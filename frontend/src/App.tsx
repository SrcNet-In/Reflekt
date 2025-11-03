// import ReactFlowWrapper from './components/ReactFlowWrapper';
// import SearchBar from "./components/SearchBar.tsx";
// import {NodeEdgeProvider} from "./context/NodeEdgeContext.tsx";
// import {ReactFlowProvider} from "@xyflow/react";


import ExplorerSidebar from "./components/ExplorerSidebar.tsx";
import FlowCanvas from "./components/FlowCanvas.tsx";

function App() {
    function handleLayoutChange() {

    }
    let direction: "DOWN" | "RIGHT" = "DOWN";
    return (
        <div className="h-screen flex">
            <ExplorerSidebar
                onLayoutChange={handleLayoutChange}
                currentDirection={direction}/>
            <FlowCanvas/>
        </div>

    );
}

export default App;