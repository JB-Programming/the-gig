from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt

@api_view(['POST'])
@csrf_exempt
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'success': True, 'token': token.key})
    return Response({'success': False}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_data(request):
    return Response({
        'username': request.user.username,
        'email': request.user.email,
        'first_name': request.user.first_name,
        'last_name': request.user.last_name,
    })

#from .models import Struktur
from django.shortcuts import render

def build_tree(nodes, parent=None):
    tree = []
    # Filter nodes that have this parent
    children = [node for node in nodes]
    for child in children:
        child_data = {
            'id': child.id,
            'primaerteam_id': child.primaerteam_id,
            'team_id': child.team_id,
            'personen_id': child.personen_id,
        }
        tree.append(child_data)
    return tree

# views.py
from django.http import JsonResponse
from django.db import connection
from .models import teamschlüssel
from .models import Struktur

@api_view(['GET'])
def get_structure(request):
    nodes = teamschlüssel.objects.all()
    print(nodes)
    tree = build_tree(nodes)  # Start with top-level nodes (parent=None)
    return Response(tree)

def build_tree(struktur_data):
    # Step 1: Organize items by their struktur_id for easy lookup
    struktur_dict = {item['struktur_id']: item for item in struktur_data}
    
    # Step 2: Initialize an empty list for the top-level items
    tree = []
    
    # Step 3: Add an empty list to store children for each item
    for item in struktur_data:
        item['children'] = []

    # Step 4: Build the hierarchy
    for item in struktur_data:
        if item['parent'] is None:
            # Top-level item (no parent)
            tree.append(item)
            print(item)
        else:
            # Child item: add to its parent's children list
            parent_id = item['parent']
            if parent_id in struktur_dict:
                struktur_dict[parent_id]['children'].append(item)
    
    return tree

def build_tree_with_null(request):
    """# Step 1: Parse the data into a dictionary
    nodes = {}  # Dictionary to hold each node by ID
    tree = {}   # Dictionary to hold root nodes (those with NULL parent IDs)
    print(teamschlüssel.objects.all())
    x = teamschlüssel.objects.all()
    for obj in x:
        print(f"ID: {obj.id}, Primaerteam ID: {obj.primaerteam_id}, Team ID: {obj.team_id}, Personen ID: {obj.personen_id}")
    # Step 2: Initialize each entry in the data as a node
    for node in teamschlüssel.objects.all():
        nodes[node.id] = {
            'id': node.id,
            'primaerteam_id': node.primaerteam_id,
            'team_id': node.team_id,
            'personen_id': node.personen_id,
            'children': []
        }
        print(nodes[node.id])"""
    data = Struktur.objects.all().values('struktur_id', 'name', 'parent', 'primär_id', 'ordner_id', 'team_id', 'mitarbeiter_id')
    print(data)
    print("Hello")
    data = build_tree(data)
        #print(node)
    #return JsonResponse(build_tree(data))
    return JsonResponse(list(data), safe=False)

