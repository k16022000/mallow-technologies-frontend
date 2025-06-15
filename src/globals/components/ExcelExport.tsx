import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import xl from '@assets/icons/xl.svg';
import { Box } from '@mui/material';

interface ExcelExportProps<T> {
    data: T[];
    fileName?: string;
    sheetName?: string;
    buttonLabel?: string;
}

const ExcelExport = <T extends Record<string, unknown>>({
    data,
    fileName = 'export.xlsx',
    sheetName = 'Sheet1',
}: ExcelExportProps<T>) => {
    const handleExport = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        });

        const blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        saveAs(blob, fileName);
    };

    return (
        <Box
            component="img"
            onClickCapture={handleExport}
            src={xl}
            alt="Excel Icon"
            // className={styles.excelIcon}
        />
    );
};

export default ExcelExport;
