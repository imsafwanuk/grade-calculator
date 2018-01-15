from django.template import RequestContext
from django.shortcuts import render, render_to_response, redirect

def custom_404(request):
	return render_to_response('404.html',RequestContext(request))
