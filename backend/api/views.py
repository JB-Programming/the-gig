from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from .models import Struktur
from django.http import JsonResponse
from rest_framework.permissions import IsAdminUser
from rest_framework.throttling import UserRateThrottle
from django.db import transaction


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

@api_view(['GET'])
def build_tree_with_null(request):
    data = Struktur.objects.all().values('struktur_id', 'name', 'parent', 'primär_id', 'ordner_id', 'team_id', 'mitarbeiter_id')
    #data = build_tree(data)
    return JsonResponse(list(data), safe=False)

class RelationRateThrottle(UserRateThrottle):
    rate = '100/hour'

@api_view(['POST'])
#@permission_classes([IsAdminUser])
# @throttle_classes([RelationRateThrottle])
def manage_relation(request):
    with transaction.atomic():
        action = request.data.get('action')
        entity = request.data.get('entity')
        parent = request.data.get('parent')

        print(f"Action: {action}, Entity: {entity}, Parent: {parent}")

        return Response({'success': True})
        """
        
        if not all([isinstance(id, int) and id > 0 for id in [parent, entity.type_id, entity.id]]):
            return Response({'error': 'Invalid ID format'}, status=400)
            
        if parent == entity.id:
            return Response({'error': 'Self-reference not allowed'}, status=400)
            
        try:
            if action == 'create':
                # Create a new record
                new_struktur = Struktur.objects.create(
                    name = entity.name,
                    parent = parent,
                    primär_id = entity.type_id if entity.type == "Primär" else None,
                    ordner_id = entity.type_id if entity.type == "Ordner" else None,
                    team_id = entity.type_id if entity.type == "Team" else None,
                    mitarbeiter_id = entity.type_id if entity.type == "Person" else None,
                )

                
            elif action == 'delete':
                struktur = Struktur.objects.get(struktur_id=entity.id)
                struktur.parent = None
                struktur.save()
            
            return Response({'success': True})
            
        
        except Exception as e:
            return Response({'error': 'Operation failed'}, status=500)
        """

