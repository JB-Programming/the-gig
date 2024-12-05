from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from .models import Struktur, Employee, Folder, Primary, Team
from django.http import JsonResponse
from rest_framework.permissions import IsAdminUser
from rest_framework.throttling import UserRateThrottle
from django.db import transaction

from rest_framework.views import APIView
from django.apps import apps
from django.db import DatabaseError
from django.db import connection
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission

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
    user = request.user
    return Response({
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'is_superuser': user.is_superuser,
        'is_staff': user.is_staff,
        'id': user.id,
        'groups': list(user.groups.values_list('name', flat=True)),
        'permissions': list(user.get_all_permissions()),
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

def build_tree(struktur_data):
    # Create dictionary for quick lookup
    nodes_by_id = {item['struktur_id']: {
        'struktur_id': item['struktur_id'],
        'name': item['name'],
        'parent': item['parent'],
        'primär_id': item['primär_id'],
        'ordner_id': item['ordner_id'],
        'team_id': item['team_id'],
        'mitarbeiter_id': item['mitarbeiter_id'],
        'children': []
    } for item in struktur_data}
    
    # Initialize root nodes list
    root_nodes = []
    
    # Process each node
    for item in struktur_data:
        node = nodes_by_id[item['struktur_id']]
        parent_ids = item['parent']
        
        if not parent_ids:  # If no parents, it's a root node
            root_nodes.append(node)
        else:
            # Add node as child to each parent
            for parent_id in parent_ids:
                if parent_id in nodes_by_id:
                    nodes_by_id[parent_id]['children'].append(node)
    
    return root_nodes


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


class PrimaryListView(APIView):
    def get(self, request):
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT bezeichnung 
                    FROM primärteam_stammdaten 
                """)
                teams = [row[0] for row in cursor.fetchall()]
            
            return Response({'teams': teams})
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch teams: {str(e)}'}, 
                status=500
            )

class TeamListView(APIView):
    def get(self, request):
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT bezeichnung 
                    FROM team_stammdaten 
                    ORDER BY bezeichnung
                """)
                teams = [row[0] for row in cursor.fetchall()]
            
            return Response({'teams': teams})
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch teams: {str(e)}'}, 
                status=500
            )

class EmployeeListView(APIView):
    def get(self, request):
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT vorname, nachname 
                    FROM mitarbeiter_stammdaten 
                    ORDER BY nachname, vorname
                """)
                employees = [
                    {'vorname': row[0], 'nachname': row[1]} 
                    for row in cursor.fetchall()
                ]
            
            return Response({'employees': employees})
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch employees: {str(e)}'}, 
                status=500
            )

class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        User = get_user_model()
        user = User.objects.get(id=request.user.id)  # Get fresh user object
        
        # Debug print
        print(f"""
        User Details:
        ID: {user.id}
        Username: {user.username}
        Is Superuser: {user.is_superuser}
        Is Staff: {user.is_staff}
        """)
        
        return Response({
            'id': user.id,
            'username': user.username,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
            'email': user.email,
        })

class UserRolesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        User = get_user_model()
        user = User.objects.select_related().get(id=request.user.id)
        
        # Get all user's groups and permissions
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_superuser': user.is_superuser,
            'is_staff': user.is_staff,
            'groups': list(user.groups.values_list('name', flat=True)),
            'permissions': list(user.get_all_permissions()),
        }
        
        print("Backend User Data:", user_data)  # Debug print
        
        return Response(user_data)

def build_tree(struktur_data):
    # Create dictionary for quick lookup
    nodes_by_id = {item['struktur_id']: {
        'struktur_id': item['struktur_id'],
        'name': item['name'],
        'parent': item['parent'],
        'primär_id': item['primär_id'],
        'ordner_id': item['ordner_id'],
        'team_id': item['team_id'],
        'mitarbeiter_id': item['mitarbeiter_id'],
        'children': []
    } for item in struktur_data}
    
    # Initialize root nodes list
    root_nodes = []
    
    # Process each node
    for item in struktur_data:
        node = nodes_by_id[item['struktur_id']]
        parent_ids = item['parent']
        
        if not parent_ids:  # If no parents, it's a root node
            root_nodes.append(node)
        else:
            # Add node as child to each parent
            for parent_id in parent_ids:
                if parent_id in nodes_by_id:
                    nodes_by_id[parent_id]['children'].append(node)
    
    return root_nodes


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
    data = build_tree(data)
        #print(node)
    #return JsonResponse(build_tree(data))
    return JsonResponse(list(data), safe=False)



class RelationRateThrottle(UserRateThrottle):
    rate = '100/hour'


@api_view(['POST'])
def create_instance(request):
    #if request.user.is_superuser:
    try:
        with transaction.atomic():
            new_typ = request.data.get('typ')
            new_vorname = request.data.get('vorname')
            new_name = request.data.get('name')
            new_standort = request.data.get('standort')
            new_bemerkung = request.data.get('bemerkung')
            print(new_typ)

            if new_typ != "Person" and new_typ != 'Team' and new_typ != 'Ordner' and new_typ != 'Primär':
                print("Invalid type")
                return Response({'error': 'Invalid type'}, status=400)
            elif new_typ == "Person":
                print("test")
                employee = Employee.objects.create(
                    mitarbeiter_aktiv=True,
                    login_gesperrt=False,
                    vorname=new_vorname,
                    nachname=new_name,
                    standort=new_standort,
                    bemerkung=new_bemerkung,
                )

                # Then create the corresponding Struktur entry
                struktur = Struktur.objects.create(
                    name=f"{new_vorname}, {new_name}",
                    mitarbeiter_id=employee.id,
                    parent=[]
                )
                print(employee.id)
                return Response({'success': True, 'id_mit': employee.id, 'id_struktur': struktur.struktur_id})
            elif new_typ == "Team":
                team = Team.objects.create(
                    bezeichnung = new_name,
                    notiz = new_bemerkung
                )

                struktur = Struktur.objects.create(
                    name=f"{new_name}",
                    team_id=team.id,  # Generate appropriate ID
                    parent=[]
                )
                return Response({'success': True, 'id_mit': team.id, 'id_struktur': struktur.struktur_id})
            elif new_typ == "Ordner":
                ordner = Folder.objects.create(
                    bezeichnung = new_name,
                    notiz = new_bemerkung
                )

                struktur = Struktur.objects.create(
                    name=f"{new_name}",
                    ordner_id=ordner.id,  # Generate appropriate ID
                    parent=[]
                )
                return Response({'success': True, 'id_mit': ordner.id, 'id_struktur': struktur.struktur_id})
            elif new_typ == "Primär":
                primär = Primary.objects.create(
                    bezeichnung = new_name,
                    notiz = new_bemerkung
                )

                struktur = Struktur.objects.create(
                    name=f"{new_name}",
                    primär_id=primär.id,  # Generate appropriate ID
                    parent=[]
                )
                return Response({'success': True, 'id_mit': primär.id, 'id_struktur': struktur.struktur_id})
            
        
    except Exception as e:
        return Response({'error': 'Operation failed'}, status=500)

@api_view(['POST'])
# @permission_classes([IsAuthenticated])
# @throttle_classes([RelationRateThrottle])
def manage_relation(request):
    #if request.user.is_superuser:
    with transaction.atomic():
        action = request.data.get('action')
        entity = request.data.get('entity')
        parent = request.data.get('parent')
        x = request.user.is_superuser

        print(f"User ID: {x}")
        print(f"Action: {action}, Entity: {entity}, Parent: {parent}")

        struktur = Struktur.objects.get(struktur_id=entity['id'])
        print(f"struktur: {struktur.parent}")
        
        
        if not all([isinstance(id, int) and id > 0 for id in [parent, entity['type_id'], entity['id']]]):
            return Response({'error': 'Invalid ID format'}, status=400)
            
        if parent == entity['id']:
            return Response({'error': 'Self-reference not allowed'}, status=400)
            
        try:
            if action == 'create':
                
                # Create a new parent

                struktur = Struktur.objects.get(struktur_id=entity['id'])
                print(f"add parent: {parent}")
                #struktur.parent = None
                numbers_set = set(struktur.parent)
                numbers_set.add(parent)  # Will only add if not present
                struktur.parent = list(numbers_set)
                print(f"struktur: {struktur.parent}")
                struktur.save()

                
            elif action == 'delete':
                struktur = Struktur.objects.get(struktur_id=entity['id'])
                #struktur.parent = None
                numbers_set = set(struktur.parent)
                numbers_set.discard(parent)
                struktur.parent = list(numbers_set)
                print(f"struktur: {struktur}")
                struktur.save()
            
            return Response({'success': True})
            
        
        except Exception as e:
            return Response({'error': 'Operation failed'}, status=500)
    """else:
        return Response({'error': 'You do not have permission to perform this action'}, status=403)
    """
