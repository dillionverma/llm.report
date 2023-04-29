import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

interface MockData {
  status?: number;
  message?: string;
  data?: any;
}

let mockingEnabled = false;

const mocks: Record<string, MockData> = {};

type AxiosErrorWithMockData = AxiosError & {
  mockData: MockData;
};

export function addMock(url: string, data: MockData): void {
  mocks[url] = data;
}

export function enableMocking(state: boolean): void {
  mockingEnabled = state;
}

const isUrlMocked = (url: string): boolean => url in mocks;

const getMockError = (config: AxiosRequestConfig): Promise<never> => {
  const mockError = new Error() as AxiosError;

  // @ts-ignore
  mockError.mockData = mocks[config.url];
  // @ts-ignore
  mockError.config = config;
  return Promise.reject(mockError);
};

// @ts-ignore
const isMockError = (error: AxiosError): boolean => Boolean(error.mockData);

const getMockResponse = (mockError: AxiosError): Promise<AxiosResponse> => {
  // @ts-ignore
  const { mockData, config } = mockError;
  // Handle mocked error (any non-2xx status code)
  if (mockData.status && String(mockData.status)[0] !== "2") {
    const err = new Error(mockData.message || "mock error") as AxiosError;
    err.code = mockData.status;
    return Promise.reject(err);
  }
  // Handle mocked success
  return Promise.resolve({
    data: {},
    status: 200,
    statusText: "OK",
    headers: {},
    config,
    isMock: true,
    ...mockData,
  });
};

// Add a request interceptor
axios.interceptors.request.use(
  async (config) => {
    console.log("IS ENABLED", mockingEnabled);
    if (mockingEnabled && isUrlMocked(config.url as string)) {
      console.log("axios mocking " + config.url);
      await new Promise((resolve) => setTimeout(resolve, 800));
      return getMockError(config);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isMockError(error)) {
      return getMockResponse(error);
    }
    return Promise.reject(error);
  }
);
