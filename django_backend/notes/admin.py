from django.contrib import admin
from notes.models import Category, CategoryNote, Note


class CategoryNoteAdmin(admin.TabularInline):
    model = CategoryNote


class NoteAdmin(admin.ModelAdmin):
    inlines = (CategoryNoteAdmin,)
    list_display = (
        'author',
        'name',
        'text',
    )
    search_fields = (
        'name',
        'author__username',
        'author__email'
    )
    list_filter = ('category',)
    empty_value_display = '>empty<'


class CategoryAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'color',
        'slug',

    )
    list_editable = ('color',)
    search_fields = (
        'name',
        'slug',
    )
    list_filter = ('name',)
    empty_value_display = '>empty<'


admin.site.register(Category, CategoryAdmin)
admin.site.register(Note, NoteAdmin)
