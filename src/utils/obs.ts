import { getUploadConfig } from "@/apis/index";
import { uploadFileToObs } from "./request";

export const uploadObs = async (file_path: string, file: File | null, onProgress: Function) => {
    const res: any = await getUploadConfig({
        path: file_path,
        contentType: file?.type
    })
    if(res.data?.SignedUrl) {
        try {
            delete res.data?.ActualSignedRequestHeaders['Host']
            const resopnse: any = await uploadFileToObs({
                serverUrl: res.data?.SignedUrl, 
                file,
                headers: res.data?.ActualSignedRequestHeaders,
                onUploadProgress(progressEvent: any) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress({ percent: percentCompleted })
                }
            })
            if(resopnse.success) {
                return { success: true, message: '上传成功', data: file_path }
            } else {
                return { success: false, message: '上传失败', data: null };
            }
        } catch (error) {
            return { success: false, message: '上传失败', data: null };
        }
    } else {
        return { success: false, message: '获取凭证失败', data: null };
    }
}