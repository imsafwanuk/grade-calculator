from django.db import models
from django.contrib.auth.models import User
from django.template.defaultfilters import slugify
from django.db.models.signals import pre_save
from django.db.models.signals import post_save
from django.dispatch import receiver
# Create your models here.



class MyUser(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	verKey = models.CharField(max_length=20)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        MyUser.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.myuser.save()





class Course(models.Model):
	user= models.ForeignKey(
		User,
		on_delete=models.CASCADE,
		)
	courseName= models.CharField(max_length=20, blank=False)
	slug = models.SlugField() 

	class Meta:
		unique_together= ('user','courseName',)


	def __str__(self):
		return self.courseName

	def save(self, *args, **kwargs):
		if not self.id:
			self.slug= '-'.join((slugify(self.user.username), slugify(self.courseName)))
			super(Course,self).save(*args,**kwargs)


class Assignment(models.Model):
	user= models.ForeignKey(
		User,
		on_delete=models.CASCADE,
		)
	course= models.ForeignKey(
		'Course',
		on_delete=models.CASCADE,
		)
	assignmentNumber=models.CharField(max_length=2, blank=False )
	assignmentName=models.CharField(max_length=20, blank=True, null=True)
	achieved= models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
	totalMark= models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
	grade= models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
	weight= models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
	
	def __str__(self):
		return self.assignmentNumber

class Grade(models.Model):
	user= models.ForeignKey(
		User,
		on_delete=models.CASCADE,
		)
	course= models.ForeignKey(
		'Course',
		on_delete=models.CASCADE,
		)
	currentGrade=models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
	desiredGrade= models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
	finalWeight= models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True )
	finalMark= models.IntegerField(blank=True, null=True)
	
	def __str__(self):
		return self.course.courseName