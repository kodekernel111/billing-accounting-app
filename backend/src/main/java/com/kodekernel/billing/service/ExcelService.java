package com.kodekernel.billing.service;

import com.kodekernel.billing.model.Item;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
public class ExcelService {

    public List<Item> parseExcelFile(InputStream is) {
        List<Item> items = new ArrayList<>();
        try {
            Workbook workbook = new XSSFWorkbook(is);
            Sheet sheet = workbook.getSheetAt(0); // Assume data is in first sheet
            Iterator<Row> rows = sheet.iterator();

            int rowNumber = 0;
            while (rows.hasNext()) {
                Row currentRow = rows.next();

                // Skip header row
                if (rowNumber == 0) {
                    rowNumber++;
                    continue;
                }

                Item item = new Item();
                // 0: Name (String)
                // 1: Code/SKU (String)
                // 2: Type (PRODUCT/SERVICE)
                // 3: Unit (String)
                // 4: HSN (String)
                // 5: Tax Rate (Numeric)
                // 6: Selling Price (Numeric)
                // 7: Purchase Price (Numeric)
                // 8: Current Stock (Numeric)

                try {
                    item.setName(getCellValueAsString(currentRow.getCell(0)));
                    item.setCode(getCellValueAsString(currentRow.getCell(1)));

                    String typeStr = getCellValueAsString(currentRow.getCell(2));
                    try {
                        item.setType(Item.ItemType.valueOf(typeStr.toUpperCase()));
                    } catch (Exception e) {
                        item.setType(Item.ItemType.PRODUCT); // Default
                    }

                    item.setUnit(getCellValueAsString(currentRow.getCell(3)));
                    item.setHsnCode(getCellValueAsString(currentRow.getCell(4)));

                    item.setTaxRate(getCellValueAsBigDecimal(currentRow.getCell(5)));
                    item.setSellingPrice(getCellValueAsBigDecimal(currentRow.getCell(6)));
                    item.setPurchasePrice(getCellValueAsBigDecimal(currentRow.getCell(7)));
                    item.setCurrentStock(getCellValueAsBigDecimal(currentRow.getCell(8)));

                    // Only add if name is present
                    if (item.getName() != null && !item.getName().isEmpty()) {
                        items.add(item);
                    }
                } catch (Exception e) {
                    System.err.println("Error parsing row " + rowNumber + ": " + e.getMessage());
                }

                rowNumber++;
            }
            workbook.close();
        } catch (IOException e) {
            throw new RuntimeException("Failed to parse Excel file: " + e.getMessage());
        }
        return items;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null)
            return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf((int) cell.getNumericCellValue()); // Treat as int string if numeric
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return "";
        }
    }

    private BigDecimal getCellValueAsBigDecimal(Cell cell) {
        if (cell == null)
            return BigDecimal.ZERO;
        switch (cell.getCellType()) {
            case NUMERIC:
                return BigDecimal.valueOf(cell.getNumericCellValue());
            case STRING:
                try {
                    return new BigDecimal(cell.getStringCellValue());
                } catch (NumberFormatException e) {
                    return BigDecimal.ZERO;
                }
            default:
                return BigDecimal.ZERO;
        }
    }

    public java.io.ByteArrayInputStream generateSampleExcel() {
        try (Workbook workbook = new XSSFWorkbook();
                java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Items");

            // Header Row
            Row headerRow = sheet.createRow(0);
            String[] headers = { "Name", "Code", "Type", "Unit", "HSN", "Tax Rate", "Selling Price", "Purchase Price",
                    "Current Stock" };
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(createHeaderStyle(workbook));
            }

            // Sample Data Row
            Row dataRow = sheet.createRow(1);
            dataRow.createCell(0).setCellValue("Sample Product Name");
            dataRow.createCell(1).setCellValue("ITEM001");
            dataRow.createCell(2).setCellValue("PRODUCT");
            dataRow.createCell(3).setCellValue("Nos");
            dataRow.createCell(4).setCellValue("1234");
            dataRow.createCell(5).setCellValue(18);
            dataRow.createCell(6).setCellValue(100.00);
            dataRow.createCell(7).setCellValue(80.00);
            dataRow.createCell(8).setCellValue(50);

            workbook.write(out);
            return new java.io.ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate sample Excel: " + e.getMessage());
        }
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);
        return style;
    }
}
