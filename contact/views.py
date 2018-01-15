from django.shortcuts import render
from .models import ContactUser
from .forms import ContactUserForm
from django.http import HttpResponseRedirect, HttpResponse
from home.forms import LoginForm, SignUpForm, FbForm

# Create your views here.


def contact_home(request):
	contactForm=ContactUserForm(request.POST or None, prefix="contactForm")
	context={
		'contactForm':contactForm,
	}
	
	if not request.user.is_authenticated():
		formLogin = LoginForm(request.POST or None, prefix="loginForm")
		formSignup = SignUpForm(request.POST or None, prefix="signupForm")
		formFb = FbForm(request.POST or None, prefix="FBform")
		context['formLogin'] = formLogin
		context['formSignup'] = formSignup
		context['formFb'] = formFb
		
	if contactForm.is_valid():
		print(contactForm.cleaned_data)
		contactForm.save()
		print("saving form")
	return render(request,'contact/contact_home.html',context)

# for contact form
# def contact_user_form(request):
# 	if request.method == 'POST':
# 		print(request.POST.get('contactForm-email'))
# 		if form.is_valid():
# 			form.save()
# 		return HttpResponse('success')