from fastapi_mail import ConnectionConfig

conf = ConnectionConfig(
    MAIL_USERNAME = "gkatthirumurugan104@gmail.com",
    MAIL_PASSWORD = "djtygyyayywzuxjv",
    MAIL_FROM = "gkatthirumurugan104@gmail.com",
    MAIL_PORT = 587,
    MAIL_SERVER = "smtp.gmail.com",
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True
)