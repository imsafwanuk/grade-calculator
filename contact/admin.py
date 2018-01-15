from django.contrib import admin
from .models import ContactUser
# Register your models here.

class ContactUserAdmin(admin.ModelAdmin):
	list_display = ["__str__","type_message", "timestamp", "is_actived"]
	list_filter = ["type_message","is_active"]


admin.site.register(ContactUser, ContactUserAdmin)