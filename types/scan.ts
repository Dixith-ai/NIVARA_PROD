export interface Prediction {
    condition: string;
    confidence: number;
}

export type Severity = 'Low' | 'Moderate' | 'High';

export interface ScanRecord {
    scanId: string;
    date: string;
    source: 'Demo' | 'Device' | 'Kiosk';
    predictions: Prediction[];
    severity: Severity;
    topCondition: string;
    topConfidence: number;
    createdAt: string;
}
