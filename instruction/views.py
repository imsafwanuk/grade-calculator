from django.shortcuts import render
from home.forms import LoginForm, SignUpForm, FbForm
# Create your views here.

def basic_instruction(request):
	context={}
	if not request.user.is_authenticated():
		formLogin = LoginForm(request.POST or None, prefix="loginForm")
		formSignup = SignUpForm(request.POST or None, prefix="signupForm")
		formFb = FbForm(request.POST or None, prefix="FBform")
		context['formLogin'] = formLogin
		context['formSignup'] = formSignup
		context['formFb'] = formFb
		
	return render(request,"instruction/basicInstruction.html",context)

