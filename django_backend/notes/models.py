from colorfield.fields import ColorField
from django.contrib.auth import get_user_model
from django.core.validators import validate_slug
from django.db import models


User = get_user_model()


class Category(models.Model):
    """
    Categories to facilitate the classification and search of recipes. One
    note can belong to several categories.
    """
    name = models.CharField(
        max_length=200,
        unique=True,
        verbose_name='category title',
        help_text='category name'
    )
    color = ColorField(
        default='#FF0000',
        unique=True,
        verbose_name='HEX color',
        help_text='color designation of the category'
    )
    slug = models.SlugField(
        max_length=200,
        unique=True,
        verbose_name='unique slug',
        validators=(validate_slug,),
        help_text='abbreviated category designation'
    )

    class Meta:
        verbose_name = 'category'
        verbose_name_plural = 'category'

    def __str__(self):
        return self.name


class Note(models.Model):
    """
    Text note. May contain an image.
    """
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notes',
        verbose_name='author of note',
        help_text='the author/owner of the note'
    )
    category = models.ManyToManyField(
        Category,
        through='CategoryNote',
        related_name='notes',
        verbose_name='category',
        help_text='category linked to the recipe'
    )
    name = models.CharField(
        max_length=200,
        verbose_name='title',
        help_text='name of the recipe'
    )
    image = models.ImageField(
        upload_to='recipes_image/',
        blank=True,
        verbose_name='image of finished food',
        help_text='image to explain the note'
    )
    text = models.TextField(
        verbose_name='description',
        help_text='note text'
    )
    pub_date = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        verbose_name='date of publication',
        help_text='date of publication of the note'
    )

    class Meta:
        ordering = ('-pub_date',)
        verbose_name = 'note'
        verbose_name_plural = 'notes'
        constraints = (
            models.UniqueConstraint(
                fields=('name', 'author',),
                name='note_unique'
            ),
        )

    def __str__(self):
        return f'Note: {self.name}'


class CategoryNote(models.Model):
    """
    A class linking tags and a recipe.
    """
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='note_category',
        verbose_name='category',
        help_text='category linked to the note'
    )
    note = models.ForeignKey(
        Note,
        on_delete=models.CASCADE,
        related_name='note_category',
        verbose_name='note',
        help_text='note'
    )

    class Meta:
        verbose_name = 'category of note'
        verbose_name_plural = 'category of note'
        constraints = (
            models.UniqueConstraint(
                fields=('category', 'note',),
                name='category_note_unique'
            ),
        )

    def __str__(self):
        return f'Tag {self.category} of recipe {self.note}.'
