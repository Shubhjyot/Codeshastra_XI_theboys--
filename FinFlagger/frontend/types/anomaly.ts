export type AnomalyFeedback = {
  anomalyId: string;
  isTruePositive: boolean;
  comments: string;
  submittedAt: string;
};

// Update the Anomaly type if needed
// Add these properties to your Anomaly type
export type Anomaly = {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  status: 'Open' | 'Investigating' | 'Resolved';
  category: string;
  detectedAt: string;
  amount?: number;
  accountId?: string;
  transactionId?: string;
  feedback?: AnomalyFeedback;
  // Add the missing properties
  detectionMethod?: string;
  confidenceScore?: string | number;
  riskScore?: string | number;
  affectedAccounts?: number;
  investigatedAt?: string;
  resolvedAt?: string;
};

export type Notification = {
  id: string | number;
  anomalyId: string | number;
  title: string;
  message: string;
  severity: string;
  read: boolean;
  createdAt: string;
};

export type ReportFormat = 'pdf' | 'csv' | 'excel';

export type ReportOptions = {
  timeRange: string;
  categories: string[];
  statuses: string[];
  severities: string[];
  format: ReportFormat;
  includeDetails: boolean;
};