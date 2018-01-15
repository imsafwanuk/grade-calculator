from .models import ContactUser
from django import forms

class ContactUserForm(forms.ModelForm):
# 	# this controls what will be asked in the form
	email = forms.EmailField(label='Email')
	class Meta:
		model = ContactUser
		fields = ['email', 'message','type_message']
		


		# fields = ['email']
		### exclude = ['full_name']
	
	# def clean_email(self):
	# 	email = self.cleaned_data.get('email')
	# 	email_base, provider = email.split("@")
	# 	domain, extension = provider.split('.')
	# 	# if not domain == 'USC':
	# 	# 	raise forms.ValidationError("Please make sure you use your USC email.")
	# 	if not extension == "edu":
	# 		raise forms.ValidationError("Please use a valid .EDU email address")
	# 	return email

	# def clean_full_name(self):
	# 	full_name = self.cleaned_data.get('full_name')
	# 	#write validation code.
	# 	return full_name
