export interface UploadReportDTO {
  title: string;
  reportType:
    | "BLOOD_TEST"
    | "XRAY"
    | "MRI"
    | "CT_SCAN"
    | "ULTRASOUND"
    | "PRESCRIPTION"
    | "OTHER";
}