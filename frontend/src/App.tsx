import ReactFlowWrapper from './components/ReactFlowWrapper';
import SearchBar from "./components/SearchBar.tsx";
import {NodeEdgeProvider} from "./context/NodeEdgeContext.tsx";
import {ReactFlowProvider} from "@xyflow/react";


function App() {
    return (
        <NodeEdgeProvider>
            <SearchBar/>
            <div style={{ height: '100vh', width: '100vw', display: 'flex' }}>
                <ReactFlowProvider>
                    <ReactFlowWrapper/>
                </ReactFlowProvider>

            </div>
        </NodeEdgeProvider>

    );
}
export default App;