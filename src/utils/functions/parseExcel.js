import { read, utils } from 'xlsx';

export const parseExcel = async (file) => {
  const f = await file.arrayBuffer();
  const wb = read(f);
  const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

  return data;
};
