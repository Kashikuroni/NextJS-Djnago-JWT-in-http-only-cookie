from typing import TypedDict


class LoginValidatedData(TypedDict):
    access: str
    refresh: str

class RefreshValidatedData(TypedDict):
    access: str
    refresh: str
