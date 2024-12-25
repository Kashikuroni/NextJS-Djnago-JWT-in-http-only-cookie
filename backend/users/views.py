from typing import Optional, cast

from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser

from users.types import LoginValidatedData, RefreshValidatedData
from users.serializers import (
    RegistrationSerializer,
    LoginSerializer,
    RefreshSerializer,
    UserSerializer
)


class RegistrationView(APIView):
    """
    API endpoint for user registration.

    This endpoint allows new users to register by providing
    email, username, password, first name, and last name.
    """
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs) -> Response:
        """
        Handles user registration.

        Args:
          request: The HTTP request object containing user data.

        Returns:
          Response: A JSON response with a success message and status 201
                    upon successful registration, or an error message with
                    the appropriate status code.
        """
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"success": True, "message": "Registration successful"},
                status=status.HTTP_201_CREATED
            )
        return Response(
            {"success": False, "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )


class LoginView(APIView):
    """
    API endpoint for user login.

    This endpoint authenticates a user using email and password.
    Upon successful authentication, it generates and sets
    HttpOnly cookies for access and refresh tokens.
    """
    authentication_classes = []
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs) -> Response:
        """
        Handles user login.

        This method validates user credentials (email and password),
        generates access and refresh tokens upon successful authentication,
        and sets them as HttpOnly cookies.

        Args:
          request: The HTTP request object containing user credentials.

        Returns:
          Response: A JSON response with a success message and status 200,
                    along with HttpOnly cookies for access and refresh tokens.
        """
        serializer = LoginSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        
        validated_data: LoginValidatedData = cast(LoginValidatedData,
                                                  serializer.validated_data)
        access_token: str = validated_data['access']
        refresh_token: str = validated_data['refresh']
        
        response = Response(
            {"success": True, "message": "Login successful"},
            status=status.HTTP_200_OK
        )
        
        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=settings.COOKIE_SETTINGS['httponly'],
            secure=settings.COOKIE_SETTINGS['secure'],
            samesite=settings.COOKIE_SETTINGS['samesite'],
            max_age=settings.COOKIE_SETTINGS['access_max_age'],
        )

        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=settings.COOKIE_SETTINGS['httponly'],
            secure=settings.COOKIE_SETTINGS['secure'],
            samesite=settings.COOKIE_SETTINGS['samesite'],
            max_age=settings.COOKIE_SETTINGS['refresh_max_age'],
        )
        
        return response


class RefreshTokenView(APIView):
    """
    API endpoint for refreshing tokens.

    This endpoint validates the provided refresh token (from cookies)
    and generates a new access token and a new refresh token.
    It updates the HttpOnly cookies with the new tokens.
    """
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs) -> Response:
        """
        Refreshes tokens.

        This method retrieves the refresh token from cookies, validates it,
        and generates a new pair of access and refresh tokens. The new tokens
        are set as HttpOnly cookies.

        Args:
            request: The HTTP request object.

        Returns:
            Response: A JSON response with a success message and status 200,
                      along with updated HttpOnly cookies
                      for access and refresh tokens.

        Raises:
            Response: A JSON response with status 400
                      if the refresh token is missing.
        """
        token_from_cookie = request.COOKIES.get('refresh_token')
        
        if not token_from_cookie:
            return Response(
                {"error": "No refresh token provided"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        data = {'refresh': token_from_cookie}
        serializer = RefreshSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        
        validated_data: RefreshValidatedData = cast(
            RefreshValidatedData,
            serializer.validated_data
        )
        access_token: str = validated_data['access']
        new_refresh_token: str = validated_data['refresh']
        
        response = Response(
            {"success": True, "message": "Token successfully refreshed"},
            status=status.HTTP_200_OK
        )
        
        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=settings.COOKIE_SETTINGS['httponly'],
            secure=settings.COOKIE_SETTINGS['secure'],
            samesite=settings.COOKIE_SETTINGS['samesite'],
            max_age=settings.COOKIE_SETTINGS['access_max_age'],
        )
        response.set_cookie(
            key='refresh_token',
            value=new_refresh_token,
            httponly=settings.COOKIE_SETTINGS['httponly'],
            secure=settings.COOKIE_SETTINGS['secure'],
            samesite=settings.COOKIE_SETTINGS['samesite'],
            max_age=settings.COOKIE_SETTINGS['refresh_max_age'],
        )
        
        return response


class LogoutView(APIView):
    """
    API endpoint for logging out a user.

    This view deletes the 'access_token' and 'refresh_token'
    cookies to log the user out.
    """
    def post(self, request) -> Response:
        """
        Logs out the user.

        This method removes the authentication cookies
        ('access_token' and 'refresh_token'),
        effectively logging out the user.

        Args:
            request: The HTTP request object.

        Returns:
            Response: A JSON response with a success message and status 200.
        """
        response = Response(
            {"success": True, "message": "You have successfully logged out"},
            status=status.HTTP_200_OK
        )
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response


class CurrentUserView(APIView):
    """
    API endpoint for retrieving the authenticated user's data.

    This endpoint returns the details of the currently authenticated user.
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        """
        Retrieves the authenticated user's data.

        This method serializes and returns the currently
        authenticated user's data.

        Args:
            request: The HTTP request object.

        Returns:
            Response: A JSON response containing
                      the user's data with status 200.
        """
        serializer = UserSerializer(request.user, context={"request": request})
        return Response(serializer.data, status=200)

    def put(self, request):
        """
        Update the authenticated user's data.
        """
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class DeleteUserView(APIView):
    """
    API endpoint for deleting the authenticated user's account.

    This view allows a user to delete their own account permanently.
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        """
        Deletes the authenticated user's account.

        Args:
            request: The HTTP request object.

        Returns:
            Response: A JSON response with a success message and status 204.
        """
        user = request.user
        user.delete()
        return Response(
            {"success": True, "message": "Your account has been deleted"},
            status=status.HTTP_204_NO_CONTENT
        )
