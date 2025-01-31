export default interface RawApiResponse {
  isSuccess: false;
  data: unknown;
  error: string;
  dateTime: string; // to later be converted into a Date
  statusCode: number;
}
