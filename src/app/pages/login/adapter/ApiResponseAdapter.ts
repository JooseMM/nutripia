import ApiResponse from 'src/models/IApiResponse';

export const ApiResponseAdapter = (data: ApiResponse): ApiResponse => {
  const adaptedDate = new Date(data.dateTime);
  return { ...data, dateTime: adaptedDate };
};
