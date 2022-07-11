from actions.models import Favourites, Sharing
from django.contrib import admin


class FavouritesAdmin(admin.ModelAdmin):
    list_display = (
        'user',
        'note',
        'date_favorite',
    )
    list_editable = ('note',)
    search_fields = (
        'user__username',
        'user__email',
        'note__name'
    )
    empty_value_display = '>empty<'


class SharingAdmin(admin.ModelAdmin):
    list_display = (
        'user',
        'recipient',
        'sharing_date',
    )
    search_fields = (
        'user__username',
        'user__email',
        'recipient__username',
        'recipient__email',
    )
    empty_value_display = '>empty<'


admin.site.register(Favourites, FavouritesAdmin)
admin.site.register(Sharing, SharingAdmin)
