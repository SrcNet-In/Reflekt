import ReactFlowWrapper from './components/ReactFlowWrapper';
import SearchBar from "./components/SearchBar.tsx";


function App() {
    return (
        <>
            <SearchBar />
            <div style={{ height: '100vh', width: '100vw', display: 'flex' }}>
                <ReactFlowWrapper />
            </div>
        </>

    );
}

export default App;