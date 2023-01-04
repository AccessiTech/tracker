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
export const getSheetValues = async ({
  sheetId,
  range,
}: getSheetValuesProps) => {
  const { sheets } = getApiClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });
  const { result } = response;
  return result.values;
};

export interface setSheetNameProps {
  sheetId: string;
  sheetName: string | string[];
}

export const defaultSheetNameRequest = {
  updateSheetProperties: {
    properties: {
      sheetId: 0,
      title: "",
    },
    fields: "title",
  },
};

export const setSheetName = async ({
  sheetId,
  sheetName,
}: setSheetNameProps) => {
  const { sheets } = getApiClient();

  const requests = Array.isArray(sheetName)
    ? sheetName.map((name, index) => {
        const thisRequest = { ...defaultSheetNameRequest };
        thisRequest.updateSheetProperties.properties.sheetId = index;
        thisRequest.updateSheetProperties.properties.title = name;
        return thisRequest;
      })
    : [
        {
          ...defaultSheetNameRequest,
          updateSheetProperties: {
            ...defaultSheetNameRequest.updateSheetProperties,
            properties: {
              ...defaultSheetNameRequest.updateSheetProperties.properties,
              title: sheetName,
            }
          }
        },
      ];

  const response = await sheets.spreadsheets.batchUpdate({
    spreadsheetId: sheetId,
    resource: { requests },
  });
  const { result } = response;
  return result;
};
