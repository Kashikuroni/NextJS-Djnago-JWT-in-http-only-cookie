# Next JS + Django + Auth with JWT in http-only cookie 
A base template for building full-stack applications with **Next.js 15** (frontend) and **Django 5** (backend).

### Features:
- **HTTP-only cookie authentication** for secure session management.
- Preconfigured integration of frontend and backend via REST API.
- Multilingual support using `gettext`.
- Ready-to-use structure for rapid development.
- SQLite as the default database, with support for PostgreSQL or MySQL.

This template is designed to speed up the initial setup of new projects while remaining flexible for customization and scaling.

## Installation Guide

### 1. Clone the Repository and Install Dependencies

Clone the repository using the following command:
```bash
git clone git@github.com:Kashikuroni/NextJS-Django-HTTP-Only-JWT.git
```

#### Backend Dependencies
```bash
cd backend
python3 -m venv venv
. venv/bin/activate
python3 -m pip install -r requirements.txt
```

#### Frontend Dependencies
```bash
cd frontend
npm install
```

---

### 2. Create a `.env` File for the Django Backend

In the root directory of the Django project, create a `.env` file and specify the following variables:
- `DJANGO_SECRET_KEY`
- `DEBUG`
- `DJANGO_ALLOWED_HOSTS`
- `CORS_ALLOWED_ORIGINS`

Example:
```env
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

---

### 3. Create a `.env` File for the Frontend

In the root directory of the Next.js project, create a `.env` file and specify the following variable:
- `NEXT_PUBLIC_DEVELOPMENT_HOST`

Example:
```env
NEXT_PUBLIC_DEVELOPMENT_HOST=http://localhost:8000
```

---

### 4. Run Migrations for SQLite Database

If you want to use SQLite (default):
```bash
cd backend
python3 manage.py makemigrations
python3 manage.py migrate
```

---

### 5. Configure a Different Database (Optional)

To use a database other than SQLite:
1. Edit the database configuration in `backend/settings.py`:
   ```python
   DATABASES = {
       "default": {
           "ENGINE": "django.db.backends.postgresql",  # Example for PostgreSQL
           "NAME": "os.getenv("DB_NAME")",
           "USER": "os.getenv("DB_USER")",
           "PASSWORD": "os.getenv("DB_PASSWORD")",
           "HOST": "os.getenv("DB_HOST")",
           "PORT": "os.getenv("DB_PORT")",
       }
   }
   ```
2. Add any required database parameters to the `.env` file.
3. Apply the migrations as described in **Step 4**.

---

### 6. Select the Development Language (English or Russian)

In `backend/settings.py`, adjust the language settings:
```python
# Internationalization
LANGUAGE_CODE = "en"  # Change to "ru" for Russian
LANGUAGES = [
    ("en", "English"),
    ("ru", "Русский"),
]
```

---

### 7. Configure Cookies and Token Expiration

In `backend/settings.py`, set cookie and token expiration settings:
```python
COOKIE_SETTINGS = {
    "httponly": True,
    "secure": not DEBUG,  # Secure=True for production, False for development
    "samesite": "None" if not DEBUG else "Lax",
    "access_max_age": 60 * 15,          # 15 minutes
    "refresh_max_age": 60 * 60 * 24 * 7,  # 7 days
}
```

---

### 8. Start the Project

#### Start Django Backend
```bash
cd backend
python3 manage.py runserver
```

#### Start Next.js Frontend
```bash
cd frontend
npm run dev
```

---

### 9. Test the Application

1. Navigate to `http://localhost:3000/` in your browser. You should be redirected to `/auth/login/`.
2. Register a new account.
3. Log in with your newly created account. You should be redirected to the homepage with a "Check Profile" button.
4. Go to the profile page and test static file handling by uploading a new avatar.

---

### 10. Additional Tests

- Test the account deletion feature.
- Test logging out from the account.

---

### 11. Start Developing Your Ideas!

The setup is complete. Begin implementing your custom features. **Happy coding!**

---
# Project Documentation

## Backend

### Technologies Used
- **Django**: The backend is built with Django, providing a robust and flexible framework for web applications.
- **Django REST Framework (DRF)**: Used to create RESTful API endpoints for seamless communication with the frontend.

### Authentication
- **Login with Email and Password**: Users authenticate using their email and password.
- **JWT-based Authorization**:
  - Authentication is handled using **JSON Web Tokens (JWT)**.
  - Tokens are stored in **HTTP-only cookies** for enhanced security, preventing client-side scripts from accessing them and reducing the risk of XSS attacks.
  - The backend validates `access_token` on every request. If the `access_token` is expired but the `refresh_token` is valid, a new `access_token` is automatically issued.

---

## Frontend

### Pages

1. **Register Page**
   - Allows users to register by providing their email, username, password, and personal details.
   - Basic form validation ensures correctness and completeness of submitted data.

2. **Login Page**
   - Users log in with their email and password.
   - Displays error messages for invalid credentials or other issues.

3. **Home Page**
   - Displays a personalized landing page for authenticated users.

4. **Profile Page**
   - Displays user details, including:
     - **Username**
     - **Avatar**
     - **First and Last Name**
     - **Email**

5. **Edit Profile Page**
   - Allows users to update their profile information:
     - Editable fields: **username**, **first name**, **last name**, **avatar**.
     - **Email** is displayed but not editable.
   - Includes form validation to ensure data accuracy and prevent invalid submissions.

6. **Change Password Page**
   - Enables users to change their password.
   - Requires the current password and a new password that meets minimum security criteria.

---

### Features and Functionality

1. **Profile Management**
   - Users can update their profile details except for their email.
   - Avatar upload with instant preview functionality.

2. **Form Validation**
   - Basic validation is implemented for all forms to ensure valid and complete data submission.

3. **Token Management via Middleware**
   - A **middleware** layer handles authentication token validation:
     - Checks the `access_token` for validity.
     - Uses the `refresh_token` to issue a new `access_token` if necessary.
     - Redirects users to the login page if both tokens are invalid or absent.

4. **User Context with `useAuth`**
   - A custom `useAuth` context is used to manage authentication state and user data centrally.
   - The context provides:
     - The currently logged-in user's information.
     - A method to refresh user data after updates.
     - Authentication status for conditionally rendering components and pages.

5. **Localization with Django**
   - The application supports **localization** with options for **English (en)** and **Russian (ru)** languages.
   - Uses Django's `.po` files for managing translations.
   - Users can switch between supported languages to view the application in their preferred language.
   - Language-specific text is dynamically loaded based on user preference or browser settings.
---

## Summary
This project integrates a **Django backend** with **JWT-based authentication** and a **Next.js frontend** to deliver a seamless user experience. Features like secure cookie-based token management, user profile editing, and centralized authentication state ensure a robust and user-friendly application.

