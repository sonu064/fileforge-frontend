import DashboardLayout from "../layout/DashboardLayout.jsx";
import {useContext, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {UserCreditsContext} from "../context/UserCreditsContext.jsx";
import {AlertCircle} from "lucide-react";
import UploadBox from "../components/UploadBox.jsx";
import {getUploadErrorMessage, uploadFilesRequest} from "../util/uploadFiles.js";


const Upload = () => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); //success or error
    const {getToken} = useAuth();
    const {credits, applyRemainingCredits} = useContext(UserCreditsContext);
    const MAX_FILES = 5;

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        if (files.length + selectedFiles.length > MAX_FILES) {
            setMessage(`You can only upload a maximum of ${MAX_FILES} files at once`);
            setMessageType("error");
            return;
        }

        //add the new files into the existing files
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
        setMessage("");
        setMessageType("");
    }

    const handleRemoveFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        setMessageType("");
        setMessage("");
    }

    const handleUpload = async () => {
        if (files.length === 0){
            setMessageType("error");
            setMessage("Please select atleast one file to upload.");
            return;
        }

        if (files.length > MAX_FILES) {
            setMessage(`You can only upload a maximum of ${MAX_FILES} files at once.`);
            setMessageType("error");
            return;
        }

        setUploading(true);
        setMessage("Uploading files...");
        setMessageType("info");

        try {
            const data = await uploadFilesRequest(files, getToken);
            applyRemainingCredits(data?.remainingCredits);

            setMessage("Files uploaded successfully.");
            setMessageType("success");
            setFiles([]);
        }catch(error) {
            setMessage(getUploadErrorMessage(error));
            setMessageType("error");
        }finally {
            setUploading(false);
        }
    }

    const isUploadDisabled = files.length === 0 || files.length > MAX_FILES || credits == null || credits <= 0 || files.length > credits;


    return (
        <DashboardLayout activeMenu="Upload">
            <div className="p-5 sm:p-7">
                <div className="mb-6 max-w-3xl mx-auto">
                    <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Upload Files</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Add new files to your secure cloud storage.</p>
                </div>
                {message && (
                    <div className={`mb-6 max-w-3xl mx-auto p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${messageType === 'error' ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300': messageType === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300': 'bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300'}`}>
                        {messageType === 'error' && <AlertCircle size={20} />}
                        {message}
                    </div>
                )}

                <UploadBox
                    files={files}
                    onFileChange={handleFileChange}
                    onUpload={handleUpload}
                    uploading={uploading}
                    onRemoveFile={handleRemoveFile}
                    remainingCredits={credits}
                    isUploadDisabled={isUploadDisabled}
                />
            </div>
        </DashboardLayout>
    )
}

export default Upload;