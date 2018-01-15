from django.db import models

# Create your models here.

class ContactUser(models.Model):
# 	contact_id = models.AutoField(primary_key=True)
	email =	models.EmailField(blank=False, null=False)
	message = models.TextField(blank=False, null=False)
	timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)
	is_active = models.CharField(max_length=5, default='False')
	TYPE_MESSAGE_CHOICES = (
			('QUESTION','QUESTION'),
			('SUGGESTION','SUGGESTION'),
		)
	type_message = models.CharField(
        max_length=10,
        choices=TYPE_MESSAGE_CHOICES,
        default='QUESTION',
    )

	def __str__(self):
		return self.email

	def is_actived(self):
		if self.is_active == 'True':
			return True
		return False
	is_actived.boolean =True


	