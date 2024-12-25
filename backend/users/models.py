import uuid
from typing import Optional

from django.conf import settings
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin
)
from django.utils.translation import gettext_lazy as _


class BaseModel(models.Model):
    """
        The basic model that defines the type
        of id and the date of creation of the change.
    """
    id = models.UUIDField(
        "ID",
        default=uuid.uuid4,
        primary_key=True
    )
    created_at = models.DateTimeField("Date of creation", auto_now_add=True)
    updated_at = models.DateTimeField("Date of update", auto_now=True)

    class Meta:
        abstract = True


class CustomUsersManager(BaseUserManager):
    """
        Custom handler for the user"s model
        for the correct operation of email authorization.
    """
    def create_user(
        self,
        email: str,
        password: Optional[str] = None,
        **extra_fields
    ) -> "CustomUsers":

        if not email:
            raise ValueError("The Email field must be set")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        if password:
            user.set_password(password)
        else:
            raise ValueError("Password must be provided")

        user.save(using=self._db)
        return user

    def create_superuser(
        self,
        email: str,
        password: Optional[str] = None,
        **extra_fields
    ) -> "CustomUsers":

        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class CustomUsers(AbstractBaseUser, PermissionsMixin):
    """Custom user model."""
    email = models.EmailField(_("Email"), unique=True)
    username = models.CharField(_("Username"), max_length=150, unique=True)
    first_name = models.CharField(_("First Name"), max_length=150, blank=True)
    last_name = models.CharField(_("Last Name"), max_length=150, blank=True)
    avatar = models.ImageField(
        _("Avatar"),
        upload_to="avatars/",
        blank=True,
        null=True
    )

    is_active = models.BooleanField(_("Active"), default=True)  # pyright: ignore
    is_staff = models.BooleanField(_("Staff"), default=False)  # pyright: ignore

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    objects = CustomUsersManager()

    class Meta(AbstractBaseUser.Meta, PermissionsMixin.Meta):
        db_table = "users"
        verbose_name = _("User") 
        verbose_name_plural = _("Users") 

    def __str__(self) -> str:
        return f"{self.email}"

    def get_avatar_url(self):
        if self.avatar:
            return f"{settings.MEDIA_URL}{self.avatar}"
        return "/default-avatar.png"
