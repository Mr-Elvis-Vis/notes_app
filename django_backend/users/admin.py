from django.contrib import admin
from users.models import User


class UserAdmin(admin.ModelAdmin):
    list_display = (
        'pk',
        'username',
        'role',
        'email',
        'date_joined',
    )
    list_editable = ('role',)
    search_fields = ('username', 'email')
    list_filter = ('date_joined',)
    empty_value_display = '>empty<'


admin.site.register(User, UserAdmin)
