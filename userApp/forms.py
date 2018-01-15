from django.contrib.auth.models import User
from .models import Course, Assignment, Grade
from django import forms

class CourseForm(forms.ModelForm):
	class Meta:
		model= Course
		fields = ['courseName']
		# exclude = ['user']

class ChangePasswordForm(forms.Form):
	# o = forms.CharField(widget=forms.PasswordInput(), label="Old")
	oldPassword = forms.CharField(widget=forms.PasswordInput(), label="Old password")
	newPassword1 = forms.CharField(widget=forms.PasswordInput(), label="New password")
	newPassword2 = forms.CharField(widget=forms.PasswordInput(), label="Re-password")
	

class ForgotPasswordForm(forms.Form):
	email = forms.EmailField()

# class SignUpForm(forms.ModelForm):
# # 	# this controls what will be asked in the form
# 	password = forms.CharField(widget=forms.PasswordInput)
# 	class Meta:
# 		model = User
# 		fields = ['username', 'password']


# 		# fields = ['email']
# 		### exclude = ['full_name']
	
# 	# def clean_email(self):
# 	# 	email = self.cleaned_data.get('email')
# 	# 	email_base, provider = email.split("@")
# 	# 	domain, extension = provider.split('.')
# 	# 	# if not domain == 'USC':
# 	# 	# 	raise forms.ValidationError("Please make sure you use your USC email.")
# 	# 	if not extension == "edu":
# 	# 		raise forms.ValidationError("Please use a valid .EDU email address")
# 	# 	return email

# 	# def clean_full_name(self):
# 	# 	full_name = self.cleaned_data.get('full_name')
# 	# 	#write validation code.
# 	# 	return full_name

# class LoginForm(forms.ModelForm):
# 	password = forms.CharField(widget=forms.PasswordInput)
# 	username = forms.CharField(max_length=20)
# 	class Meta:
# 		model= User
# 		fields= ["username","password"]

# 	# gets rid of help text
# 	def __init__(self, *args, **kwargs):
# 		super(LoginForm,self).__init__(*args, **kwargs)

# 		for field in ['username']:
# 			self.fields[field].help_text=None