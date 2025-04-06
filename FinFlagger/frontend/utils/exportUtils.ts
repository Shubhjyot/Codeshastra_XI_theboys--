import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Anomaly } from '../types/anomaly';

// Function to export data as CSV
export const exportToCSV = (data: any[], filename: string) => {
  // Convert data to CSV format
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Handle special cases (objects, arrays, etc.)
      const escaped = typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      return escaped;
    });
    csvRows.push(values.join(','));
  }
  
  // Create a CSV string
  const csvString = csvRows.join('\n');
  
  // Create a blob and download
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Set up download link
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  // Add to document, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Function to export data as PDF
export const exportToPDF = (data: any[], filename: string, title: string) => {
  // Create new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
  
  // Prepare data for table
  const headers = Object.keys(data[0]);
  const rows = data.map(item => headers.map(key => {
    // Format the value for PDF
    const value = item[key];
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return String(value);
  }));
  
  // Add table to document
  (doc as any).autoTable({
    head: [headers],
    body: rows,
    startY: 40,
    margin: { top: 35 },
    styles: { overflow: 'linebreak' },
    headStyles: { fillColor: [41, 128, 185] },
  });
  
  // Save the PDF
  doc.save(`${filename}.pdf`);
};

// Function to export anomalies data
export const exportAnomalies = (anomalies: Anomaly[], format: 'csv' | 'pdf') => {
  // Prepare data for export (simplify complex objects)
  const exportData = anomalies.map(anomaly => ({
    id: anomaly.id,
    title: anomaly.title,
    description: anomaly.description,
    severity: anomaly.severity,
    status: anomaly.status,
    category: anomaly.category,
    detectedAt: new Date(anomaly.detectedAt).toLocaleString(),
    amount: anomaly.amount ? `$${anomaly.amount.toFixed(2)}` : 'N/A',
    accountId: anomaly.accountId || 'N/A',
    transactionId: anomaly.transactionId || 'N/A'
  }));
  
  if (format === 'csv') {
    exportToCSV(exportData, 'anomalies-export');
  } else {
    exportToPDF(exportData, 'anomalies-export', 'Financial Anomalies Report');
  }
};