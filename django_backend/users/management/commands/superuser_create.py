import os
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from dotenv import load_dotenv
from django_backend.settings import EMAIL_PROJECT

load_dotenv()

User = get_user_model()


class Command(BaseCommand):
    def handle(self, *args, **options):
        username = 'admin'
        email = EMAIL_PROJECT
        password = os.getenv('ADMIN_PASSWORD')
        User.objects.create_superuser(
            username=username,
            email=email,
            password=password,
            role='admin',
            first_name='Admin',
            last_name='Adminium'
        )
