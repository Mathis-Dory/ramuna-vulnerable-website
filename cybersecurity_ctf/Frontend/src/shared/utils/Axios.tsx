import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const baseURL = "http://"+window.location.host+":8000/";

export const axiosInstance = axios.create({
  baseURL,
});

export const apiRequest = async <T,>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  try {
    return await axiosInstance(config);
  } catch (error) {
    throw error;
  }
};
