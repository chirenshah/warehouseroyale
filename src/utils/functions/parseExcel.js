import { read, utils } from 'xlsx';
import { isExcelValid } from './isExcelValid';

export const parseExcel = async (file) => {
  try {
    const f = await file.arrayBuffer();
    const wb = read(f);
    const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

    if (isExcelValid(data)) return data;
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
};
