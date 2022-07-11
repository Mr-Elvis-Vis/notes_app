from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models
from users.validations import validate_email

USER = 'user'
MODERATOR = 'moderator'
ADMIN = 'admin'
ROLE_CHOICES = (
    (USER, USER),
    (MODERATOR, MODERATOR),
    (ADMIN, ADMIN)
)


class UserCreatePatch(UserManager):
    def create_user(self, username, email, password, **extra_fields):
        username = validate_email(email, username)
        return super().create_user(
            username,
            email=email,
            password=password,
            **extra_fields
        )

    def create_superuser(
        self,
        username,
        email,
        password,
        role=ADMIN,
        **extra_fields
    ):
        return super().create_superuser(
            username,
            email,
            password,
            role=ADMIN,
            **extra_fields
        )


class User(AbstractUser):
    email = models.EmailField(
        verbose_name='email_address',
        max_length=254,
        unique=True,
        help_text='users email address'
    )
    role = models.CharField(
        max_length=150,
        choices=ROLE_CHOICES,
        default=USER,
        verbose_name='role_user',
        help_text='user role (admin, user, etc.)'
    )
    username = models.CharField(
        max_length=150,
        unique=True,
        help_text='users nickname'
    )
    first_name = models.CharField(
        max_length=150,
        blank=True,
        help_text='user name'
    )
    last_name = models.CharField(
        max_length=150,
        blank=True,
        help_text='users last name'
    )
    objects = UserCreatePatch()

    class Meta:
        constraints = (
            models.UniqueConstraint(
                fields=('username', 'email',),
                name='unique_email'
            ),
            models.CheckConstraint(
                name='me_no_create_user',
                check=~models.Q(username='me')
            ),
        )

    @property
    def is_admin(self):
        return (
            self.is_superuser
            or self.role == ADMIN
        )

    @property
    def is_moderator(self):
        return self.role == MODERATOR
