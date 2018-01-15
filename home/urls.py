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
    url(r'^$', views.home, name='home'),
    url(r'^login$', views.auth_login, name='login'),
    # url(r'^save/login/$', views.save_login, name='saveLogin'),
    url(r'^signup/$', views.signup, name='signUp'),
    url(r'^fbSignup/$',views.fb_signup, name='fbSignup'),
    url(r'^fbLogin/$',views.fb_login, name='fbLogin'),
    url(r'^rego-email-sent/$',views.rego_email_sent, name='regoEmailSent'),
    url(r'^verification-key/(?P<username>[\w\-]+)/(?P<ver_key>.+)/$',views.ver_key_signup, name='verKeySignup'),
    url(r'^email-already-in-use/$',views.email_already_in_use, name='emailAlreadyInUse'),
]


