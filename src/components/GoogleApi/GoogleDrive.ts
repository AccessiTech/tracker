import { getApiClient } from "./GoogleAuth";

export const listFiles = () => {
  const { drive } = getApiClient();
  return drive.files.list({
    pageSize: 10,
    fields: "nextPageToken, files(id, name)",
  });
}

export const listFolders = () => {
  const { drive } = getApiClient();
  return drive.files.list({
    q: "mimeType='application/vnd.google-apps.folder'",
    fields: "nextPageToken, files(id, name)",
  });
}

export interface CreateFolderProps {
  name: string;
  parents?: string[];
}
export const createFolder = ({
  name,
  parents,
}: CreateFileProps) => {
  const { drive } = getApiClient();
  return drive.files.create({
    resource: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents,
    },
    fields: "id",
  });
}

export interface CreateFileProps {
  name: string;
  mimeType: string;
  parents: string[];
}
export const createFile = ({
  name,
  mimeType,
  parents,
}: CreateFileProps) => {
  const { drive } = getApiClient();
  return drive.files.create({
    resource: {
      name,
      mimeType,
      parents,
    },
    fields: "id",
  });
}

export interface CreateSpreadsheetProps {
  name: string;
  parents: string[];
}
export const createSpreadsheet = ({
  name,
  parents,
}: CreateSpreadsheetProps) => {
  return createFile({
    name,
    mimeType: "application/vnd.google-apps.spreadsheet",
    parents,
  });
}
