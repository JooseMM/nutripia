export default interface ApiResponse {
  isSuccess: false;
  data: unknown;
  error: string;
  dateTime: Date | string; // to later be converted into a Date
  statusCode: number;
}
