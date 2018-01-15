from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User


# Register your models here.

from .models import Course, Assignment, Grade, MyUser

class MyUserInline(admin.StackedInline):
    model = MyUser
    can_delete = False
    verbose_name_plural = 'MyUser'

# Define a new User admin
class UserAdmin(BaseUserAdmin):
    inlines = (MyUserInline, )
    list_display = ["email","__str__","is_active","date_joined","last_login"]

class CourseAdmin(admin.ModelAdmin):
	list_display = ["user","__str__"]
	list_filter = ["user","courseName"]
	class Meta:
		model = Course
		
class AssignmentAdmin(admin.ModelAdmin):
	list_display=["user","course",'assignmentNumber','assignmentName','achieved']
	list_filter = ["user","course",'assignmentNumber','grade']

class GradeAdmin(admin.ModelAdmin):
	list_display=["user","course",'__str__']
	list_filter = ["user","course",'currentGrade']



admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Course,CourseAdmin)
admin.site.register(Assignment,AssignmentAdmin)
admin.site.register(Grade,GradeAdmin)
# Re-register UserAdmin
