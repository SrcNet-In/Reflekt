import axios from "axios";
import type {File} from "../model/file.ts";
import type {RawFileNode} from "../model/RawFileNode.tsx";

export const getRepoAnalysis = async (absPath: string , fileExtension : string ) => {
    console.log(absPath , fileExtension)
    const params = {
       absPath,
        fileExtension,
    }
    const response = await axios.post<File[]>(`${import.meta.env.VITE_SPRING_BOOT_BACKEND}/analyzeV2` , params)
    return response.data
}

type repoAnalysisResponse = {
    giturl: string;
    nodes : RawFileNode[];
}

export const getRepoAnalysisV2 = async (url: string , branch : string ) => {
    console.log(url , branch)
    const params = {
        url,
        branch,
    }
    const response = await axios.post<repoAnalysisResponse>(`${import.meta.env.VITE_SPRING_BOOT_BACKEND}/analyzeV2` , params)
    return response.data
}