import ReactFlowWrapper from './components/ReactFlowWrapper';
import SearchBar from "./components/SearchBar.tsx";
import {NodeEdgeProvider} from "./context/NodeEdgeContext.tsx";


function App() {
    return (
        <NodeEdgeProvider>
            <SearchBar/>
            <div style={{ height: '100vh', width: '100vw', display: 'flex' }}>
                <ReactFlowWrapper/>
            </div>
        </NodeEdgeProvider>

    );
}
export default App;