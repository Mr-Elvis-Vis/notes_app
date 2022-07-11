from actions.models import Sharing
from api.serializers import SharingSerializer
from djoser.views import UserViewSet
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from users.models import User
from users.serializers import CustomUserSerializer


class CustomUserViewSet(UserViewSet):
    serializer_class = CustomUserSerializer
    queryset = User.objects.all()

    @action(
        detail=False,
        permission_classes=(IsAuthenticated,),
    )
    def sharing_list(self, request):
        data = User.objects.filter(accessor__user=self.request.user).all()
        page = self.paginate_queryset(data)
        serializer = SharingSerializer(
            page, context={'request': request}, many=True
        )
        return self.get_paginated_response(serializer.data)

    @action(
        detail=True,
        permission_classes=(IsAuthenticated,),
        methods=('POST', 'DELETE'),
    )
    def sharing(self, request, id):
        recipient = get_object_or_404(User, id=id)

        if request.method == 'POST':
            if self.request.user == recipient:
                return Response(
                    {'errors': 'You cant share to yourself.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if Sharing.objects.filter(
                    recipient=recipient, user=self.request.user
            ).exists():
                return Response(
                    {'errors': 'You already shared to this user.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            Sharing.objects.create(recipient=recipient, user=self.request.user)
            serializer = SharingSerializer(
                recipient, context={'request': request}
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        if request.method == 'DELETE':
            if self.request.user == recipient:
                return Response(
                    {'errors': 'You cant unshare from yourself.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            sharing = Sharing.objects.filter(
                recipient=recipient, user_id=self.request.user
            )
            if not sharing.exists():
                return Response(
                    {'errors': 'You are not shared to this user.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            sharing.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
