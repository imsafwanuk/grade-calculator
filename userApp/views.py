import string
import random
from django.conf import settings
from django.views.generic.edit import CreateView, UpdateView, DeleteView, FormMixin
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView
from django.core.urlresolvers import reverse_lazy
from django.shortcuts import render, render_to_response, redirect
from django.contrib import messages
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.views import generic
from django.views.generic import View
from home.forms import LoginForm, SignUpForm
from django.db import IntegrityError
from django.urls import reverse
from django.contrib.auth.models import User
from .models import Assignment,Course, Grade
from userApp.forms import CourseForm, ChangePasswordForm, ForgotPasswordForm
from home.forms import LoginForm, SignUpForm, FbForm
#for sending mail
from django.core.mail import send_mail,get_connection, EmailMultiAlternatives

# random string generator
def id_generator(size=6, chars=string.ascii_lowercase + string.digits):
	return ''.join(random.choice(chars) for _ in range(size))

# Create your views here.

def user_homeView(request):
	if not request.user.is_authenticated():
		return HttpResponseRedirect(reverse('home'))
	courseForm=CourseForm
	context={
		'courseForm':courseForm,
		'homeView':'True',
	}
	return render(request,"userApp/userHome.html",context)

def auth_logout(request):
	logout(request)
	form = LoginForm(request.POST or None)
	context = {
		'formLogin':form,
	}
	return HttpResponseRedirect(reverse('home'))

def ass_table_save(request):
	# if not request.user.is_authenticated:
	# 	return redirect('saveLogin')
	if request.method== 'POST':
		# get assingment table data thats bundled up 1st
		courseName = request.POST.get('courseName')
		print(courseName)
		tableData = request.POST.get('tableData')
		totalRow = request.POST.get('totalRow')	#number of rows in assignment table
		totalRow = int(totalRow)


		# get grade table data 2nd
		currentGrade= request.POST.get('currentGrade')
		desiredGrade= request.POST.get('desiredGrade')
		finalWeight= request.POST.get('finalWeight')
		finalMark= request.POST.get('finalMark')
		
		
		# get course name
		course = Course.objects.get(user__exact=request.user,courseName__exact=courseName)
		rowQuerySet = Assignment.objects.filter(user__exact=request.user,course__exact=course)

		if len(rowQuerySet)>totalRow:
			# reduce rows in database
			extraRow = len(rowQuerySet)-totalRow 	#get extra rows for deletion
			for i in range(totalRow+1,len(rowQuerySet)+1):
				# print(i)
				rowQuerySet[i-1].delete()
				
	# parse data
		# split all rows
		allRows=tableData.split('/')

		# for each row get field data
		for rowData in allRows:
			# print(rowData)
			data = rowData.split(',')
			rowId=data[0]
			# print(data)
		# ass name length is never 0. this is ensured by .js file
			assName=data[1]

			achieved=data[2]
			if len(achieved) == 0:
				achieved=None
			
			total=data[3]
			if len(total) == 0:
				total=None

			grade=data[4]
			if len(grade) == 0:
				grade=None

			weight=data[5]
			if len(weight) == 0:
				weight=None
			
			# try to get assignment row instance
			try:
				row=Assignment.objects.get(user__exact=request.user,course__exact=course,assignmentNumber__exact=rowId)
				# print("found")
				row.assignmentName=assName
				row.achieved=achieved
				row.totalMark=total
				row.grade=grade
				row.weight=weight
				row.save()
				
			except Assignment.DoesNotExist:
				# print("not found")
				ass= Assignment.objects.create(user=request.user,course=course,assignmentNumber=rowId,assignmentName=assName,achieved=achieved,totalMark=total,grade=grade,weight=weight)


		# try to get grade table's instance
		try:
			grade=Grade.objects.get(user__exact=request.user,course__exact=course)
			# print("found")
			grade.currentGrade=currentGrade
			if len(currentGrade)==0:
				grade.currentGrade=None

			grade.desiredGrade=desiredGrade
			if len(desiredGrade)==0:
				grade.desiredGrade=None

			grade.finalWeight=finalWeight
			if len(finalWeight)==0:
				grade.finalWeight=None

			grade.finalMark=finalMark
			if len(finalMark)==0:
				grade.finalMark=None
				
			grade.save()

		except Grade.DoesNotExist:
			# print("not found")
			grade= Grade.objects.create(user=request.user, course=course, currentGrade=currentGrade, desiredGrade=desiredGrade, finalWeight=finalWeight, finalMark=finalMark)

	return HttpResponse('success')


class CoursesListView(ListView, FormMixin):
	model = Course

	context_object_name = 'courses'

	form_class = CourseForm
	template_name = "userApp/courseList.html"

	def get_queryset(self):
		return Course.objects.filter(user__exact=self.request.user)

	def get_context_data(self,*args,**kwargs):
		context= super(CoursesListView,self).get_context_data(*args, **kwargs)
		context['courseForm'] = self.form_class
		context['homeView'] = 'False'
		return context

	def post(self,request, *args, **kwargs):
		form = self.form_class(request.POST)
		if form.is_valid():
			instance = form.save(commit=False)
			courseName = instance.courseName
			courseName = courseName.title()
			print("wwwww")
			try:
				user = User.objects.get(username__exact=self.request.user)
				instance.user = user
				instance.courseName = courseName
				# print(instance)
				instance.save()	
				# courseName = self.cleaned_data.get('courseName')
				# create 3 empty assignment rows
				course = Course.objects.get(id=instance.id)
				ass1 = Assignment.objects.create(user=user,course=course,assignmentNumber='1',assignmentName=None,achieved=None,totalMark=None,grade=None,weight=None)
				ass2 = Assignment.objects.create(user=user,course=course,assignmentNumber='2',assignmentName=None,achieved=None,totalMark=None,grade=None,weight=None)
				ass3 = Assignment.objects.create(user=user,course=course,assignmentNumber='3',assignmentName=None,achieved=None,totalMark=None,grade=None,weight=None)
				grade = Grade.objects.create(user=user,course=course,currentGrade=None,desiredGrade=None,finalWeight=None,finalMark=None)

			except IntegrityError:
					# raise ValidationError('Cant have same course name twice')
					print("gotcha")
					messages.error(request,'Cant have same course name twice')
					return self.get(redirect, *args, **kwargs)
			
		return self.get(redirect, *args, **kwargs)

	def get(self,request, *args, **kwargs):
		self.object=None
		self.form = self.get_form(self.form_class)
		return ListView.get(self, request, *args, **kwargs)

class CourseDetailView(DetailView):
	model = Course
	context_object_name = 'course'
	template_name='userApp/courseView.html'


	def get_context_data(self,**kwargs):
		context= super(CourseDetailView,self).get_context_data(**kwargs)
		user = self.request.user
		course = self.get_object()
		context['assignment_list'] =Assignment.objects.filter(user__exact=user,course__exact=course.id)
		grade = Grade.objects.get(user__exact=user,course__exact=course.id)
		context['grade_data'] = grade
		return context


# delete course ajax
def delete_course(request,slug):
	course = Course.objects.get(slug=slug)
	course.delete()
	return redirect('/user/courses/')



def save_course_and_assignment(request):
	# save course
	courseName = request.POST.get('courseName')
	courseName = courseName.title()
	user = User.objects.get(username__exact=request.user)
	print("1")
	try:
		print("2")
		tryCourse = Course.objects.get(courseName__exact = courseName, user = user)
		print("3")
		# save assignments
		return HttpResponse('fail')

	except Course.DoesNotExist:
		# create course
		course = Course.objects.create(user=user,courseName=courseName)
		print("4")
		# save assignments
		tableData = request.POST.get('tableData')
		totalRow = request.POST.get('totalRow')	#number of rows in assignment table
		totalRow = int(totalRow)


		# get grade table data 2nd
		currentGrade= request.POST.get('currentGrade')
		desiredGrade= request.POST.get('desiredGrade')
		finalWeight= request.POST.get('finalWeight')
		finalMark= request.POST.get('finalMark')
				
	# parse data
		# split all rows
		allRows=tableData.split('/')

		# for each row get field data
		for rowData in allRows:
			# print(rowData)
			data = rowData.split(',')
			rowId=data[0]
			# print(data)
		# ass name is never length is never 0. this is ensured by .js file
			assName=data[1]

			achieved=data[2]
			if len(achieved) == 0:
				achieved=None
			
			total=data[3]
			if len(total) == 0:
				total=None

			grade=data[4]
			if len(grade) == 0:
				grade=None

			weight=data[5]
			if len(weight) == 0:
				weight=None
			
			# try to get assignment row instance
			ass= Assignment.objects.create(user=request.user,course=course,assignmentNumber=rowId,assignmentName=assName,achieved=achieved,totalMark=total,grade=grade,weight=weight)
		
		print("5")
		# fix grade scroes
		if len(currentGrade) == 0:
			currentGrade=None

		if len(desiredGrade) == 0:
			desiredGrade=None

		if len(finalWeight) == 0:
			finalWeight=None

		if len(finalMark) == 0:
			finalMark=None

		grade= Grade.objects.create(user=request.user, course=course, currentGrade=currentGrade, desiredGrade=desiredGrade, finalWeight=finalWeight, finalMark=finalMark)

	return HttpResponse('success')



def user_profile(request):
	changePasswordForm = ChangePasswordForm(request.POST or None, prefix="changePassword")
	context={
		'changePasswordForm':changePasswordForm
	}
	if request.method == 'POST':
		oldPassword = request.POST.get('changePassword-oldPassword')
		# from db
		user = User.objects.get(username__exact = request.user.username)
		if not user.check_password(oldPassword):
			op = id_generator()
			print(op)
			messages.warning(request,'Wrong old password')
			# give a message warning
		else:
			newP1 = request.POST.get('changePassword-newPassword1')
			newP2 = request.POST.get('changePassword-newPassword2')
			if not newP1 == newP2:
				print("new password is inconsistent")
				messages.warning(request,'new password is inconsistent!')
				# give error message
			else:
				user.set_password(newP1)
				user.save()
				login(request,user)
				print("pass changed")
				messages.success(request,'Your password has been successfully changed!')
				# give success message
		
	return render(request,'userApp/userProfile.html',context)

def delete_profile(request):
	context={}
	user = User.objects.get(username__exact=request.user.username)
	print(user)
	user.delete()
	return redirect('home')



def reset_password(request,whereFrom):
	context={}
	tempPassword = id_generator()

	if whereFrom == 'userProfile':
		print("we good nigga")
		user = User.objects.get(username__exact=request.user.username)
		userEmail = user.email	
		user.set_password(tempPassword)
		user.save()
		login(request,user)
	else:
		userEmail = request.POST.get('forgotPassword-email')
		print(userEmail)
	# send email
	subject = "Grade Calculator, Reset Password"
	contact_message = """YOur new password is %s. 
	Use this change to your desired password in your profile.
	"""%(tempPassword)
	from_email = settings.EMAIL_HOST_USER
	to_email = [userEmail]
	# send_mail(subject,contact_message, from_email, to_email,fail_silently = False)
	messages.success(request,'An email has been sent successfully!')
	if whereFrom == 'userProfile':
		return redirect('userProfile')
	else:
		return redirect('forgotPasswordPage')

def forgot_password_page(request):
	if request.user.is_authenticated:
		return redirect('userProfile')

	formLogin = LoginForm(request.POST or None, prefix="loginForm")
	formSignup = SignUpForm(request.POST or None, prefix="signupForm")
	formFb = FbForm(request.POST or None, prefix="FBform")
	forgotPasswordForm = ForgotPasswordForm(request.POST or None, prefix='forgotPassword')
	context = {
		'formLogin':formLogin,
		'formSignup':formSignup,
		'formFb':formFb,
		'forgotPasswordForm':forgotPasswordForm,
	}		
	return render(request,'userApp/forgotPassword.html',context)