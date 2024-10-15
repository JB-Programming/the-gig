from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        body = json.loads(request.body)
        username = body.get('username')
        password = body.get('password')
        #user = authenticate(username=username, password=password)
        #if user is not None:
        if username == "abc" and password == "123":
            #login(request, user)
            return JsonResponse({"message": "Login successful"}, status=200)
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=400)

