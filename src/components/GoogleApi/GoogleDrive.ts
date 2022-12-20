import { getApiClient } from "./GoogleAuth";

export interface ListProps {
  pageSize?: number;
  parents?: string[];
}
export const listFiles = ({ pageSize, parents }: ListProps) => {
  const { drive } = getApiClient();
  return drive.files.list({
    pageSize: pageSize,
    fields: "nextPageToken, files(id, name)",
    q: parents ? `'${parents[0]}' in parents and trashed=false` : "trashed=false",
  });
};

export const listFolders = ({ pageSize, parents }: ListProps) => {
  const { drive } = getApiClient();
  return drive.files.list({
    q: "mimeType='application/vnd.google-apps.folder'",
    fields: "nextPageToken, files(id, name)",
    pageSize,
    parents,
  });
};

export interface CreateFolderProps {
  name: string;
  parents?: string[];
}
export const createFolder = ({ name, parents }: CreateFolderProps) => {
  const { drive } = getApiClient();
  return drive.files.create({
    resource: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents,
    },
    fields: "id",
  });
};

export interface CreateFileProps {
  name: string;
  mimeType: string;
  parents: string[];
}
export const createFile = ({ name, mimeType, parents }: CreateFileProps) => {
  const { drive } = getApiClient();
  return drive.files.create({
    resource: {
      name,
      mimeType,
      parents,
    },
    fields: "id",
  });
};

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
};
