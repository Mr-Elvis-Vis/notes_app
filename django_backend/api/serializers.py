from actions.models import Favourites, Sharing
from django.db import transaction
from drf_extra_fields.fields import Base64ImageField
from notes.models import Category, CategoryNote, Note
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from users.models import User
from users.serializers import CustomUserSerializer


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ('id', 'name', 'color', 'slug')

    def create(self, validated_data):
        return Category.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get(
            'name', instance.name
        )
        instance.color = validated_data.get(
            'color', instance.color
        )
        instance.slug = validated_data.get(
            'slug', instance.slug
        )
        instance.save()
        return instance

    def to_internal_value(self, data):
        return Category.objects.get(id=data)


class NoteSerializer(serializers.ModelSerializer):
    author = CustomUserSerializer(
        read_only=True, default=serializers.CurrentUserDefault()
    )
    image = Base64ImageField(
        max_length=None, use_url=True,
    )
    text = serializers.CharField()
    category = CategorySerializer(many=True)
    is_favorited = serializers.SerializerMethodField(
        method_name='get_is_favorited'
    )

    class Meta:
        model = Note
        fields = ('id',
                  'category',
                  'author',
                  'is_favorited',
                  'name',
                  'image',
                  'text',
                  )

        validators = (
            UniqueTogetherValidator(
                queryset=Note.objects.all(),
                fields=('name', 'author'),
                message='There is already such a note.',
            ),
        )

    def get_is_favorited(self, obj):
        user = self.context.get('request').user
        if user.is_anonymous:
            return False
        return Favourites.objects.filter(
            user=user, note=obj
        ).exists()

    def validate(self, data):
        if 'category' not in self.initial_data:
            raise serializers.ValidationError(
                {'error': 'The category for the recipe must be specified'}
            )
        return data

    @transaction.atomic
    def create(self, validated_data):
        category = validated_data.pop('category')
        note = Note.objects.create(**validated_data)
        for category_id in category:
            CategoryNote.objects.update_or_create(
                note=note, category=Category.objects.get(id=category_id)
            )
        return note

    @transaction.atomic
    def update(self, instance, validated_data):
        instance.category.clear()
        category = validated_data.pop('category')
        for category_id in category:
            CategoryNote.objects.create(
                note=instance, category=Category.objects.get(id=category_id)
            )
        return super().update(instance, validated_data)


class SharingNoteSerializer(NoteSerializer):

    class Meta:
        model = Note
        fields = ('id', 'name', 'image')


class SharingSerializer(serializers.ModelSerializer):
    notes = serializers.SerializerMethodField(
        method_name='get_notes'
    )
    is_shared = serializers.SerializerMethodField(
        method_name='is_shared'
    )
    notes_count = serializers.SerializerMethodField(
        method_name='get_notes_count'
    )

    class Meta:
        fields = '__all__'
        model = User

    def is_shared(self, obj):
        user = self.context.get('request').user
        if user.is_anonymous:
            return False
        return Sharing.objects.filter(recipient=user, user=obj).exists()

    def get_notes(self, obj):
        notes_limit = self.context['request'].query_params.get(
            'notes_limit'
        )
        notes = obj.notes.all()
        if notes_limit:
            notes = notes[:int(notes_limit)]
        return FavoriteNoteSerializer(notes, many=True).data

    def get_notes_count(self, obj):
        return obj.notes.all().count()


class FavoriteNoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Note
        fields = ('id', 'name', 'image')


class FavoriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Favourites
        fields = ('user', 'note')

        validators = (
            UniqueTogetherValidator(
                queryset=Favourites.objects.all(),
                fields=('user', 'note'),
                message='Note is already in favorites',
            ),
        )

    def to_representation(self, instance):
        request = self.context.get('request')
        context = {'request': request}
        return FavoriteNoteSerializer(
            instance.recipe, context=context
        ).data
