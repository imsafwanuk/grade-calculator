from django.contrib.auth.models import User
from django import forms

class SignUpForm(forms.ModelForm):
# 	# this controls what will be asked in the form
	email = forms.EmailField()
	password = forms.CharField(widget=forms.PasswordInput)
	password2 = forms.CharField(widget=forms.PasswordInput, label="Re-password")
	class Meta:
		model = User
		fields = [ "username",'email','password', 'password2']	


class FbForm(forms.ModelForm):
	class Meta:	
		model=User
		fields=["username"]
		


class LoginForm(forms.ModelForm):
	password = forms.CharField(widget=forms.PasswordInput)
	# username = forms.CharField(max_length=20)
	class Meta:
		model= User
		fields= ['username',"password"]

	# gets rid of help text
	def __init__(self, *args, **kwargs):
		super(LoginForm,self).__init__(*args, **kwargs)

		for field in ['username']:
			self.fields[field].help_text=None

		