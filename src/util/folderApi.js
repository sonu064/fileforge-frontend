import axios from "axios";
import { apiEndpoints } from "./apiEndpoints.js";

/**
 * Folder + file-organization API helpers. Every call needs a Clerk token, so callers pass a
 * `getToken` function (from `useAuth`) and we build the auth header per request to stay fresh.
 */
const authHeader = async (getToken) => ({
    headers: { Authorization: `Bearer ${await getToken()}` },
});

export const fetchFolderContents = async (getToken, folderId) => {
    const url = folderId && folderId !== "root"
        ? apiEndpoints.FOLDER_CONTENTS(folderId)
        : apiEndpoints.ROOT_CONTENTS;
    const { data } = await axios.get(url, await authHeader(getToken));
    return data; // { currentFolder, breadcrumb, folders, files }
};

export const listFolders = async (getToken) => {
    const { data } = await axios.get(apiEndpoints.LIST_FOLDERS, await authHeader(getToken));
    return data;
};

export const createFolder = async (getToken, folderName, parentFolderId = null) => {
    const { data } = await axios.post(
        apiEndpoints.CREATE_FOLDER,
        { folderName, parentFolderId },
        await authHeader(getToken),
    );
    return data;
};

export const renameFolder = async (getToken, id, folderName) => {
    const { data } = await axios.put(
        apiEndpoints.RENAME_FOLDER(id),
        { folderName },
        await authHeader(getToken),
    );
    return data;
};

export const moveFolder = async (getToken, id, parentFolderId) => {
    const { data } = await axios.put(
        apiEndpoints.MOVE_FOLDER(id),
        { parentFolderId },
        await authHeader(getToken),
    );
    return data;
};

export const deleteFolder = async (getToken, id) => {
    await axios.delete(apiEndpoints.DELETE_FOLDER(id), await authHeader(getToken));
};

export const moveFile = async (getToken, fileId, folderId) => {
    const { data } = await axios.put(
        apiEndpoints.MOVE_FILE(fileId),
        { folderId },
        await authHeader(getToken),
    );
    return data;
};

export const moveFiles = async (getToken, fileIds, folderId) => {
    const { data } = await axios.put(
        apiEndpoints.MOVE_FILES,
        { fileIds, folderId },
        await authHeader(getToken),
    );
    return data;
};

export const toggleFavorite = async (getToken, fileId) => {
    const { data } = await axios.put(
        apiEndpoints.TOGGLE_FAVORITE(fileId),
        {},
        await authHeader(getToken),
    );
    return data;
};

export const fetchFavorites = async (getToken) => {
    const { data } = await axios.get(apiEndpoints.FAVORITE_FILES, await authHeader(getToken));
    return data;
};

export const searchAll = async (getToken, query) => {
    const { data } = await axios.get(apiEndpoints.SEARCH(query), await authHeader(getToken));
    return data; // { files, folders }
};
