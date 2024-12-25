import axios from "axios";
import { BaseApi } from "./baseApi";
import * as types from "./authApi.types";

class AuthApi extends BaseApi {
  /**
   * Функция авторизации пользователя в системе
   */
  public async register(data: types.SignupData): Promise<types.ApiResponse> {
    try {
      const response = await this.post(`api/auth/v1/register/`, data);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          const errorMessages = error.response.data;
          if (errorMessages.email || errorMessages.username) {
            throw new Error(
              "Указанные данные уже используются. Пожалуйста, проверьте введенные данные.",
            );
          } else {
            throw new Error(
              "Произошла ошибка. Пожалуйста, попробуйте ещё раз.",
            );
          }
        }
      }
    }
  }

  /**
   * Функция регистрации пользователя в системе.
   */
  public async login(data: types.LoginData): Promise<any> {
    const response = await this.post("/api/auth/v1/login/", data);
    return response;
  }

  /**
   * Функция выхода из системы с удалением токена с базы
   */
  public async logout(): Promise<any> {
    const response = await this.post("/api/auth/v1/logout/");
    return response;
  }

  public async deleteAccount(): Promise<any> {
    const response = await this.delete("/api/auth/v1/users/delete/");
    return response;
  }

  /**
   * Fetches user data from the backend API.
   *
   * @returns {Promise<any>} The user data returned from the backend.
   *
   * @throws Will throw an error if the API request fails.
   *
   * Note: This function does not handle errors internally.
   * Ensure that you wrap the call to this function in a `try-catch` block
   * or use a `.catch()` method to handle potential errors.
   *
   * Example usage:
   * ```ts
   * try {
   *   const user = await userService.getUser();
   *   console.log(user);
   * } catch (error) {
   *   console.error("Failed to fetch user data:", error);
   * }
   * ```
   */
  public async getUser(): Promise<any> {
    const response = await this.get("/api/auth/v1/users/", {
      "Cache-Control": "no-store",
    });
    return response;
  }

  /**
   * Refreshes the access token using the refresh token stored in cookies.
   *
   * This function sends a POST request to the backend API endpoint
   * to refresh the tokens. It expects the backend to manage tokens via HttpOnly cookies.
   *
   * @returns {Promise<void>} Resolves when the token is successfully refreshed.
   *
   * @throws Will throw an error if the refresh token is missing or the refresh process fails.
   *
   * Note: This function assumes that HttpOnly cookies are automatically handled
   * by the browser or client during the request.
   *
   * Example usage:
   * ```ts
   * try {
   *   await authService.refreshToken();
   *   console.log("Token refreshed successfully.");
   * } catch (error) {
   *   console.error("Failed to refresh token:", error);
   * }
   * ```
   */
  public async refreshToken(): Promise<void> {
    await this.post<{}, types.RefreshTokenProps>("/api/auth/v1/refresh/");
  }

  public async updateProfile(data: FormData): Promise<any> {
    const response = await this.put("/api/auth/v1/users/", data, {
      "Content-Type": "multipart/form-data",
    });
    return response;
  }

  /**
   * Смена пароля.
   */
  public async changePassword(data: types.ChangePassword): Promise<any> {
    const response = await this.post("/api/users/set_password/", data);
    return response;
  }
}

export default new AuthApi();
