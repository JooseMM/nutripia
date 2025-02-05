import { HttpErrorResponse } from '@angular/common/http';
import ApiResponse from 'src/models/IApiResponse';

export const ApiResponseErrorAdapter = (
  data: HttpErrorResponse,
): ApiResponse => {
  return data.error;
};
