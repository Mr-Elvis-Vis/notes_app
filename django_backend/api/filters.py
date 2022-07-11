import django_filters
from django_filters.rest_framework import filters
from notes.models import Category, Note
from users.models import User


class NoteFilter(django_filters.FilterSet):
    category = filters.ModelMultipleChoiceFilter(
        field_name='category__slug',
        to_field_name='slug',
        queryset=Category.objects.all(),
    )
    author = filters.ModelChoiceFilter(
        queryset=User.objects.all()
    )
    is_favorited = filters.BooleanFilter(
        method='filter_favorited'
    )

    class Meta:
        model = Note
        fields = ('author', 'category', 'is_favorited')

    def filter_favorited(self, queryset, name, value):
        user = self.request.user
        if value and user.is_authenticated:
            return queryset.filter(favorite_note__user=user)
        return queryset.exclude(favorite_note__user=user)
