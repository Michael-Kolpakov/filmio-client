import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import router from "../router/Routes.tsx";
import { FRONTEND_ROUTES } from "../common/constants/frontend-routes.constants.ts";

const defaultBaseUrl = "https://localhost:5001/api";

const responseData = <T>(response: AxiosResponse<T>) => response.data;
const paginationResponseData = <T>(response: AxiosResponse<T>) => ({
  data: response.data,
  paginationInfo: JSON.parse(response.headers["x-pagination"]),
});

const createAxiosInstance = (baseUrl: string) => {
  const instance = axios.create({
    baseURL: baseUrl,
  });

  axios.interceptors.response.use(
    async (response) => response,
    ({ response, message }: AxiosError) => {
      let errorMessage = "";

      if (message === "Network Error") {
        errorMessage = message;
      }

      switch (response?.status) {
        case StatusCodes.INTERNAL_SERVER_ERROR:
          errorMessage = ReasonPhrases.INTERNAL_SERVER_ERROR;
          void router.navigate(FRONTEND_ROUTES.OTHER_PAGER.SERVER_ERROR);
          break;
        case StatusCodes.NOT_FOUND:
          errorMessage = ReasonPhrases.NOT_FOUND;
          void router.navigate(FRONTEND_ROUTES.OTHER_PAGER.NOT_FOUND);
          break;
        case StatusCodes.BAD_REQUEST:
          errorMessage = ReasonPhrases.BAD_REQUEST;
          break;
        case StatusCodes.UNAUTHORIZED:
          errorMessage = ReasonPhrases.UNAUTHORIZED;
          break;
        case StatusCodes.FORBIDDEN:
          errorMessage = ReasonPhrases.FORBIDDEN;
          break;
        default:
          break;
      }
      if (errorMessage !== "") {
        toast.error(errorMessage);
      }

      return Promise.reject(response);
    }
  );

  return {
    get: async <T>(url: string, params?: URLSearchParams) => instance.get<T>(url, { params }).then(responseData),

    getPaginated: async <T>(url: string, params?: URLSearchParams) =>
      instance.get<T>(url, { params }).then(paginationResponseData),

    post: async <T>(url: string, body: object) => instance.post<T>(url, body).then(responseData),

    put: async <T>(url: string, body: object) => instance.put<T>(url, body).then(responseData),

    delete: async <T>(url: string) => instance.delete<T>(url).then(responseData),
  };
};

const Agent = createAxiosInstance(defaultBaseUrl);

export default Agent;
