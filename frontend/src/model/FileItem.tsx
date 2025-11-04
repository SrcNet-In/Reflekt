interface FileItemProps {
    name: string;
    isDir?: boolean;
    isActive?: boolean;
    level: number;
}

function FileItem({name , isDir , isActive , level} : FileItemProps) {

    const paddingLeft = level * 1.5 + 1;
    const icon = isDir ? '📂' : '📄';
    const activeClass = isActive ? 'bg-blue-900/40 text-blue-300 font-medium' : 'hover:bg-gray-700/50 text-gray-300';
    const caretIcon = isDir ?
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg> : null;

    return (
        <div
            className={`py-1 text-sm cursor-pointer transition-colors duration-150 flex items-center justify-between`}
            style={{ paddingLeft: `${paddingLeft}rem` }}
        >
            <div className="flex items-center truncate">
                <span className="mr-2">{icon}</span>
                <span className={`truncate ${activeClass}`}>{name}</span>
            </div>
            {caretIcon}
        </div>
    );
}
export default FileItem;