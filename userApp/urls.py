"""src URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^home/$',views.user_homeView, name='userHome'),
    # url(r'^profile/$',views.user_profile, name='userProfile'),
    url(r'^saveCourseAndAssignment/$',views.save_course_and_assignment, name='saveCourseAndAssignment'),
    url(r'^logout/$', views.auth_logout, name='authLogout'), 
    url(r'^saveAssignment/$', views.ass_table_save, name='assTableSave'), 
    url(r'^courses/$', views.CoursesListView.as_view(), name='userCourses'), 
    url(r'^courseView/(?P<slug>[-\w]+)$', views.CourseDetailView.as_view(), name='userCourseView'), 
    url(r'^deleteCourse/(?P<slug>[-\w]+)/$', views.delete_course, name='deleteCourse'), 
    url(r'^deleteProfile/$',views.delete_profile, name='deleteProfile'),
    url(r'^userProfile/$',views.user_profile, name='userProfile'),
    url(r'^resetPassword/$',views.reset_password, {'whereFrom':'userProfile'}, name='resetPassword'),
    url(r'^forgotPassword/$',views.reset_password, {'whereFrom':'forgotPassword'}, name='forgotPassword'),
    url(r'^forgotPasswordPage/$',views.forgot_password_page, name='forgotPasswordPage'),
]

