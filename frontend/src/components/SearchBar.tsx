import {useState} from "react";
import {getRepoAnalysis} from "../api/AnalyzeRepo.ts";
import * as React from "react";
import {parseFileList} from "../utis/fileParser";

type SearchBarProps = {
    updateFlow?: (newNodes: any, newEdges: any) => void;
}

export default function SearchBar (SearchBarProps: SearchBarProps) {

    const [absPath, setAbsPath] = useState("");
    const [fileExtension, setFileExtension] = useState("");
    const handleSubmit = async (event: React.FormEvent)=>{
        event.preventDefault();
        console.log("function is getting called")
        try{
            const data = await getRepoAnalysis(absPath , fileExtension);
            const {nodes ,edges} = parseFileList(data);
            SearchBarProps.updateFlow?.(nodes , edges);
            console.log(data);
        }
        catch (error){
            console.error("Error fetching repo details:", error);
        }
    }


    return (
        <div style={{ width: '100vw', backgroundColor: 'transparent', padding: '10px' , position : 'absolute', top: 0, left: 0, zIndex: 1000 }}>
            <form style={{ padding: '10px'  , display: 'flex', gap: '10px' , justifyContent: 'center'}}>
                <input type={'text'} placeholder={'repo url'} value={absPath} onChange={(e) => setAbsPath(e.target.value)}  required />
                <input type={'text'} placeholder={'file type'} value={fileExtension} onChange={(e) => setFileExtension(e.target.value)}  required />
                <button type={'submit'} onClick={handleSubmit}>Submit</button>

            </form>
        </div>
    )
}
