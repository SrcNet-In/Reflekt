import axios from "axios";
import type {File} from "../model/file.ts";

export const getRepoAnalysis = async (absPath: string , fileExtension : string ) => {
    console.log(absPath , fileExtension)
    const params = {
       absPath,
        fileExtension,
    }
    const response = await axios.post<File[]>(`${import.meta.env.VITE_SPRING_BOOT_BACKEND}/analyze` , params)
    return response.data
}