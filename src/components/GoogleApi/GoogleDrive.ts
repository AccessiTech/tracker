import { getApiClient } from "./GoogleAuth";

export const listFiles = async () => {
  const { drive } = getApiClient();
  const response = await drive.files.list({
    pageSize: 10,
    fields: "nextPageToken, files(id, name)",
  });
  const files = response.result.files;
  if (files && files.length > 0) {
    console.log("Files:");
    files.map((file: any) => {
      console.log(`${file.name} (${file.id})`);
    });
  } else {
    console.log("No files found.");
  }
}