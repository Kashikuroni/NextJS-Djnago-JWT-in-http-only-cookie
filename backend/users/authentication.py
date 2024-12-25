from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework.exceptions import AuthenticationFailed


class CookieJWTAuthentication(JWTAuthentication):
    """
    Custom authentication class for JWT tokens stored in browser cookies.

    This class extends the default JWTAuthentication to retrieve and validate
    JWT access tokens directly from the 'access_token' cookie in the HTTP request.
    """
    def authenticate(self, request):
        """
        Authenticates the user using the JWT access token from cookies.

        This method retrieves the access token from the 'access_token' cookie,
        validates it, and returns the associated user and the validated token.

        Args:
            request: The HTTP request object containing cookies.

        Returns:
            Tuple: A tuple containing the authenticated user
                   and the validated token, or None if the token is missing.

        Raises:
            AuthenticationFailed: If the token is invalid
                                  or cannot be validated.
        """
        access_token = request.COOKIES.get('access_token')

        if not access_token:
            return None

        try:
            validated_token = self.get_validated_token(access_token)
        except InvalidToken as e:
            raise AuthenticationFailed(f"Invalid token: {e}")

        return self.get_user(validated_token), validated_token
