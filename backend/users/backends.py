from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model

User = get_user_model()


class EmailBackend(BaseBackend):
    """
        We have created our own backend
        for email and password authentication along with username.
    """
    def authenticate(self,
                     request,
                     email=None,
                     password=None,
                     *args, **kwargs):
        """Authenticating the user."""
        user = User.objects.filter(email=email).first()

        if user and user.check_password(password):
            return user
        return None

    def get_user(self, user_id):
        """Getting the user's model object."""
        return User.objects.filter(pk=user_id).first()
