from django.contrib.auth import get_user_model
from django.db import models
from notes.models import Note

User = get_user_model()


class Sharing(models.Model):
    """
    Providing access to your notes to other users
    (for example, family members).
    """
    recipient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='recipient',
        verbose_name='recipient',
        help_text='the user to whom the notes were shared'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='accessor',
        verbose_name='accessor',
        help_text='the user who gave access to his notes'
    )
    sharing_date = models.DateField(
        auto_now_add=True,
        verbose_name='sharing date',
        help_text='sharing date'
    )

    class Meta:
        verbose_name = 'sharing'
        verbose_name_plural = 'sharing'
        constraints = (
            models.UniqueConstraint(
                fields=('user', 'recipient'),
                name='sharing_unique'
            ),
            models.CheckConstraint(
                check=~models.Q(user=models.F('recipient')),
                name='not_sharing_myself'
            ),
        )

    def __str__(self):
        return f'{self.user} shared notes to {self.recipient}'


class Favourites(models.Model):
    """
    Favorites for the most important or frequently used notes.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='favorite_note',
        verbose_name='owner of note',
        help_text='the author who added the note to favorites'
    )
    note = models.ForeignKey(
        Note,
        on_delete=models.CASCADE,
        related_name='favorite_note',
        verbose_name='favorite note',
        help_text='note added to favorites'
    )
    date_favorite = models.DateTimeField(
        auto_now_add=True,
        verbose_name='date added in favourites',
        help_text='date the note was added to favorites'
    )

    class Meta:
        ordering = ('-date_favorite',)
        verbose_name = 'favourites'
        verbose_name_plural = 'favourites'
        constraints = (
            models.UniqueConstraint(
                fields=('user', 'note'), name='favorite_unique'
            ),
        )

    def __str__(self):
        return f'{self.note} in favorites at {self.user}'
