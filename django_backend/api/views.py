from actions.models import Favourites
from api.filters import NoteFilter
from api.pagination import CustomPagePagination
from api.permissions import AdminOrAuthorOrReadOnly
from api.serializers import (
    CategorySerializer, NoteSerializer, FavoriteSerializer
)
from django_filters import rest_framework as filters
from notes.models import Category, Note
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (AllowAny,)
    pagination_class = None


class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = (AdminOrAuthorOrReadOnly,)
    pagination_class = CustomPagePagination
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = NoteFilter

    def perform_create(self, serializer):
        serializer.save(
            author=self.request.user, category=self.request.data['category']
        )

    def perform_update(self, serializer):
        serializer.save(
            author=self.request.user, category=self.request.data['category']
        )

    @staticmethod
    def static_post(request, pk, serializers):
        data = {'user': request.user.id, 'note': pk}
        serializer = serializers(data=data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @staticmethod
    def static_delete(request, pk, model):
        user = request.user
        note = get_object_or_404(Note, id=pk)
        model_obj = get_object_or_404(model, user=user, note=note)
        model_obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=('POST',),
            permission_classes=(IsAuthenticated,))
    def favorite(self, request, pk):
        return self.static_post(
            request=request, pk=pk, serializers=FavoriteSerializer)

    @favorite.mapping.delete
    def delete_favorite(self, request, pk):
        return self.static_delete(
            request=request, pk=pk, model=Favourites)
