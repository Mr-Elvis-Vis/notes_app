from actions.models import Sharing
from djoser.serializers import UserCreateSerializer, UserSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from users.models import User


class CustomUserCreateSerializer(UserCreateSerializer):
    email = serializers.EmailField(
        validators=(UniqueValidator(queryset=User.objects.all()),)
    )

    class Meta:
        model = User
        fields = (
            'username', 'email', 'role', 'password',
            'first_name', 'last_name',
        )
        read_only_fields = ('role',)


class CustomUserSerializer(UserSerializer):
    is_shared = serializers.SerializerMethodField(
        method_name='get_is_shared'
    )

    class Meta:
        model = User
        fields = ('email',
                  'id',
                  'username',
                  'first_name',
                  'last_name',
                  'is_subscribed'
                  )

    def get_is_shared(self, obj):
        user = self.context.get('request').user
        return Sharing.objects.filter(
            author=obj, user=user
        ).exists()
