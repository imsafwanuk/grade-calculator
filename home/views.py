import string
import random
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib import messages
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.core.urlresolvers import reverse_lazy
from django.shortcuts import render, render_to_response, redirect
from django.template.loader import render_to_string
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.views import generic
from django.views.generic import View
from django.urls import reverse
#for sending mail
from django.core.mail import send_mail,get_connection, EmailMultiAlternatives
from home.forms import LoginForm, SignUpForm, FbForm
from django.template import RequestContext
# from .models import User
# from allauth.account.views import LoginView


# random string generator
def id_generator(size=6, chars=string.ascii_lowercase + string.digits):
	return ''.join(random.choice(chars) for _ in range(size))

# Create your views here.

def home(request):
	context={}
	# if not logged in
	if not request.user.is_authenticated():
		formLogin = LoginForm(request.POST or None, prefix="loginForm")
		formSignup = SignUpForm(request.POST or None, prefix="signupForm")
		formFb = FbForm(request.POST or None, prefix="FBform")
		context = {
			'formLogin':formLogin,
			'formSignup':formSignup,
			'formFb':formFb,
		}	
	return render(request,'home/frontPage.html',context)
	

def signup(request):
	print("in my signup")

	# instance = form.save(commit=False)
	# get all the user credentials
	username = request.POST.get('signupForm-username')
	email = request.POST.get('signupForm-email')
	# print(username)
	password = request.POST.get('signupForm-password')
	# print(password)
	password2 = request.POST.get('signupForm-password2')

	if password == password2:

		try:
			user = User.objects.get(email__exact=email)
			print("same email found")
			return redirect('emailAlreadyInUse')
		except User.DoesNotExist:
			# create inactive user
			user = User.objects.create_user(username=username, email=email, password=password)
			user.is_active = False
	
		# get confirmation mail ready
		domainName = 'checkmygrade.herokuapp.com'
		verKey = id_generator(15)
		user.myuser.verKey=verKey
		subject = "Came from Saf's server!"
		contact_message = """Thank you for joining Grade Calculator. Please click on the link below to complete registration.
	%s/home/verification-key/%s/%s
		"""%(domainName,username,verKey)
		from_email = settings.EMAIL_HOST_USER
		to_email = [email]
		# imsafwanuk@gmail.com
	
		# send mail
		send_mail(subject,contact_message, from_email, to_email,fail_silently = False)
		user.last_login = user.date_joined
		user.is_active = False
		user.save()
	print('lol')
	return redirect('regoEmailSent')



def auth_login(request):
	print("in login")
	if request.method == 'POST':
		username = request.POST.get('loginForm-username')
		password = request.POST.get('loginForm-password')
		print(username)
		user = authenticate(username=username, password=password)

		if user is not None:
			# Is the account active? It could have been disabled.
			if user.is_active:	
				# If the account is valid and active, we can log the user in.
	            # We'll send the user back to the homepage.
				login(request, user)
				print("active")
				context={
					'username':getattr(user,'username')
				}
				return redirect('userHome')
			else:
				print("1")
	# 			# An inactive account was used - no logging in!
		else:
			print("2")
            # Bad login details were provided. So we can't log the user in.
		return redirect('home')


def fb_signup(request):
	email = request.POST.get('email')
	username = request.POST.get('username')
	print("in fb signup")
	try:
		user = User.objects.get(email__exact=email)
		print("fail fb-signup")
		return HttpResponse("fail")

	except User.DoesNotExist:
		user = User.objects.create_user(username,email,password="facebookUsers")
		login(request, user)
		print("success fb-signup")
		domainName = request.META['HTTP_HOST']
		print(domainName)
		return HttpResponse(domainName)


def fb_login(request):
	email = request.POST.get('email')
	print("in fb login")
	try:
		user = User.objects.get(email__exact=email)
		login(request, user)
		return HttpResponse("success")

	except User.DoesNotExist:
		return HttpResponse("fail")


def rego_email_sent(request):
	context={}
	# if not logged in
	if not request.user.is_authenticated():
		formLogin = LoginForm(request.POST or None, prefix="loginForm")
		formSignup = SignUpForm(request.POST or None, prefix="signupForm")
		formFb = FbForm(request.POST or None, prefix="FBform")
		context = {
			'formLogin':formLogin,
			'formSignup':formSignup,
			'formFb':formFb,
		}	
	return render(request,"home/regoEmailSent.html",context)


# def sendVarificationEmail():

def ver_key_signup(request,username, ver_key):
	print(username)
	print(ver_key)
	context={}
	user = User.objects.get(username__exact=username)
	userKey = user.myuser.verKey
	if ver_key == userKey:
		user.is_active = True
		login(request, user)
		user.save()
		return redirect('userHome')
	else:
		return redirect('home')



# when someone just tries with an email thats already in the database, this is different than fb bad email. in that case, a pop up is shown
def email_already_in_use(request):
	context={}
	# if not logged in
	if not request.user.is_authenticated():
		formLogin = LoginForm(request.POST or None, prefix="loginForm")
		formSignup = SignUpForm(request.POST or None, prefix="signupForm")
		formFb = FbForm(request.POST or None, prefix="FBform")
		context = {
			'formLogin':formLogin,
			'formSignup':formSignup,
			'formFb':formFb,
		}	
	return render(request,"home/emailAlreadyInUse.html",context)
