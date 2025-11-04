import FileItem from "../model/FileItem.tsx";
import type {RawFileNode} from "../model/RawFileNode.tsx";

interface ExplorerSidebarProps {
    onLayoutChange: (direction: "DOWN" | "RIGHT") => void;
    currentDirection: "DOWN" | "RIGHT";
    initialData: RawFileNode[];
}


function ExplorerSidebar({onLayoutChange, currentDirection , initialData}: ExplorerSidebarProps) {
    return (
        <div className="w-[280px] p-4 flex flex-col bg-gray-800 border-r border-gray-700 overflow-y-auto flex-shrink-0 h-full">
            <h2 className="text-xl font-bold mb-4 text-white">⚙️ Reflekt</h2>
            <input
                type="text"
                placeholder="Search files or commits..."
                className="w-full p-2 mb-4 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            {/* View Mode Controls */}
            <div className="mb-6 pb-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold mb-2 text-gray-300">View Mode</h3>
                <div className="flex space-x-2">
                    <button className="flex-1 py-1 rounded bg-blue-600 text-white font-medium transition hover:bg-blue-700 shadow-lg">
                        File Tree
                    </button>
                    <button className="flex-1 py-1 rounded bg-gray-700 text-gray-400 font-medium transition hover:bg-gray-600">
                        Git Graph
                    </button>
                </div>
            </div>

            {/* Layout Direction Controls */}
            <div className="mb-6 pb-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold mb-2 text-gray-300">Layout Direction</h3>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onLayoutChange('DOWN')}
                        className={`flex-1 py-1 rounded font-medium transition ${currentDirection === 'DOWN' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        Vertical (⬇️)
                    </button>
                    <button
                        onClick={() => onLayoutChange('RIGHT')}
                        className={`flex-1 py-1 rounded font-medium transition ${currentDirection === 'RIGHT' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        Horizontal (➡️)
                    </button>
                </div>
            </div>

            {/* Mock File Tree Content */}
            <div className="flex-1 min-h-0">
                <h3 className="text-lg font-semibold mb-2 text-gray-300">Repository Files</h3>
                <div className="text-gray-300 space-y-0.5">
                    {initialData.map((item) => (
                        <FileItem
                            key={item.id}
                            name={item.file_name}
                            isDir={item.node_type === 'DIRECTORY'}
                            level={item.level}
                        />
                    ))}
                </div>
            </div>


        </div>
    )
}

export default ExplorerSidebar;