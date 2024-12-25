import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

export class BaseApi {
  public api: AxiosInstance;

  constructor() {
    const baseURL =
      process.env.NEXT_PUBLIC_DEVELOPMENT_HOST || "http://localhost:8000";
    this.api = axios.create({
      baseURL,
      withCredentials: true,
    });
  }

  /**
   * Объединение заголовков.
   * @param headers Дополнительные заголовки.
   * @returns Итоговые заголовки.
   */
  private mergeHeaders(
    headers?: Record<string, string>,
  ): Record<string, string> {
    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    return { ...defaultHeaders, ...headers };
  }

  /**
   * Метод для выполнения POST-запроса.
   * @param url URL для запроса.
   * @param data Тело запроса.
   * @param headers Дополнительные заголовки.
   */
  protected async post<D, R>(
    url: string,
    data?: D,
    headers?: Record<string, string>,
  ): Promise<R> {
    const config: AxiosRequestConfig = {
      headers: this.mergeHeaders(headers),
    };
    const response = await this.api.post<R>(url, data, config);
    return response.data;
  }

  /**
   * Метод для выполнения GET-запроса.
   * @param url URL для запроса.
   * @param headers Дополнительные заголовки.
   */
  protected async get<R>(
    url: string,
    headers?: Record<string, string>,
  ): Promise<R> {
    const config: AxiosRequestConfig = {
      headers: this.mergeHeaders(headers),
    };
    const response = await this.api.get<R>(url, config);
    return response.data;
  }

  protected handleError = (error: AxiosError) => {
    const simpleError = {
      status: error.status,
      message: error.message,
      data: error.response?.data,
    };
    return simpleError;
  };

  /**
   * Executes a PUT request to the specified URL with the given data.
   *
   * @template D The type of the request payload.
   * @template R The expected type of the response data.
   * @param {string} url - The URL to send the PUT request to.
   * @param {D} [data] - The payload to be sent in the request body.
   * @param {Record<string, string>} [headers] - Optional additional headers to include in the request.
   * @returns {Promise<R>} A promise resolving to the response data of type R.
   *
   * @throws {Error} Throws an error if the request fails. The error will be formatted by `handleError`.
   */
  protected async put<D, R>(
    url: string,
    data?: D,
    headers?: Record<string, string>,
  ): Promise<R> {
    const config: AxiosRequestConfig = {
      headers: this.mergeHeaders(headers),
    };
    try {
      const response = await this.api.put<R>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }
  /**
   * Executes a DELETE request to the specified URL with optional headers.
   *
   * @template R The expected type of the response data.
   * @param {string} url - The URL to send the DELETE request to.
   * @param {Record<string, string>} [headers] - Optional additional headers to include in the request.
   * @returns {Promise<R>} A promise resolving to the response data of type R, if provided by the server.
   *
   * @throws {Error} Throws an error if the request fails. The error will be formatted by `handleError`.
   */
  protected async delete<R>(
    url: string,
    headers?: Record<string, string>,
  ): Promise<R> {
    const config: AxiosRequestConfig = {
      headers: this.mergeHeaders(headers),
    };
    try {
      const response = await this.api.delete<R>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }
}
