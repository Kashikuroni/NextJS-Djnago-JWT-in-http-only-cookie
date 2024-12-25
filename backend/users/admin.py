from django.contrib import admin
from users.models import CustomUsers


@admin.register(CustomUsers)
class CustomUsersAdmin(admin.ModelAdmin):
    """
    A class for configuring the display
    of the user's model in the admin panel.
    """
    list_display = ["id", "email", "first_name", "last_name"]
    search_fields = ["email", "first_name", "last_name"]

