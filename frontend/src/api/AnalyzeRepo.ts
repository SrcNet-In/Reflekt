import axios from "axios";
import type {File} from "../mediaTypes.ts";

export const getRepoAnalysis = async (absPath: string , fileExtension : string ) => {
    console.log(absPath , fileExtension)
    const params = {
        "absPath": "/Users/sayan_roy/SRC_NET/opencadc-science-platform/skaha/src",
        "fileExtension": ".java"
    }
    const response = await axios.post<File>(`${import.meta.env.VITE_SPRING_BOOT_BACKEND}/analyze` , params)
    return response.data
}