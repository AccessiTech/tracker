import { getApiClient } from "./GoogleAuth";

export interface setSheetValuesProps {
  sheetId: string;
  range: string;
  values: any[][];
}
export const setSheetValues = ({
  sheetId,
  range,
  values,
}: setSheetValuesProps) => {
  const { sheets } = getApiClient();
  return sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    valueInputOption: "RAW",
    range,
    resource: {
      values,
    },
  });
};

export interface getSheetValuesProps {
  sheetId: string;
  range: string;
}
export const getSheetValues = async ({ sheetId, range }: getSheetValuesProps) => {
  const { sheets } = getApiClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });
  const { result } = response;
  return result.values;
};
