from django.db import models
from django.contrib.auth.models import User

# Create your models here.

# class Course(models.Model):
# 	# user= models.ForeignKey(
# 	# 	User,
# 	# 	on_delete=models.CASCADE,
# 	# 	)
# 	courseName= models.CharField(max_length=20, blank=False)

# 	def __str__(self):
# 		return self.courseName

# class Assignment(models.Model):
# 	user= models.ForeignKey(
# 		User,
# 		on_delete=models.CASCADE,
# 		)
# 	course= models.ForeignKey(
# 		'Course',
# 		on_delete=models.CASCADE,
# 		)
# 	assignmentName=models.CharField(max_length=20, blank=True)
# 	achieved= models.DecimalField(max_digits=5, decimal_places=2, blank=False)
# 	totalMark= models.DecimalField(max_digits=5, decimal_places=2, blank=False)
# 	grade= models.DecimalField(max_digits=5, decimal_places=2, blank=False)
# 	weight= models.DecimalField(max_digits=5, decimal_places=2, blank=False)
	
# 	def __str__(self):
# 		return self.assignmentName