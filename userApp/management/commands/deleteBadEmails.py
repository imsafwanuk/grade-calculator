from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
import datetime

class Command(BaseCommand):
	help = "Delete all users with that has 24hrs between last_login - date_joined"

	def handle(self, *args, **options):
		year = datetime.datetime.now().year
		month = datetime.datetime.now().month
		day = datetime.datetime.now().day
		print("Checking for bad emails...\n\n\n\n\n")
		badEmails = User.objects.filter(last_login=None)
		if not badEmails:
			print("No bad emails.")
		else:
			for i in badEmails:
				if i.date_joined.day+2 == day:
					i.delete()
					print(".")
				elif i.date_joined.year != year or i.date_joined.month != month:
					i.delete()
					print(".")
				else:
					print("issues with: " + i.email)

			print("Bad emails deleted!")

