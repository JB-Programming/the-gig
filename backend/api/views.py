from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
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

@api_view(['GET'])
def get_structure(request):
    nodes = teamschlüssel.objects.all()
    print(nodes)
    tree = build_tree(nodes)  # Start with top-level nodes (parent=None)
    return Response(tree)

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
class MonatsdatenTeamsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            # Get the person parameter from the request
            person_name = request.GET.get('person')
            first_name, last_name = person_name.split(',')  # Assuming format "lastname, firstname"
            
            with connection.cursor() as cursor:
                # First get the employee ID from mitarbeiter_stammdaten
                cursor.execute("""
                    SELECT id FROM mitarbeiter_stammdaten 
                    WHERE vorname = %s AND nachname = %s
                """, [first_name.strip(), last_name.strip()])
                
                employee_id = cursor.fetchone()[0]
                
                # Then get all team data for this employee
                cursor.execute("""
                    SELECT DISTINCT mt.* 
                    FROM monatsdaten_teams mt
                    WHERE mt.primaerteam_id IN (
                        SELECT team_id 
                        FROM teamschlüssel 
                        WHERE personen_id = %s
                    )
                """, [employee_id])
                
                columns = [col[0] for col in cursor.description]
                teams_data = [
                    dict(zip(columns, row))
                    for row in cursor.fetchall()
                ]
                return Response({'teams_data': teams_data})
        except DatabaseError as e:
            return Response({'error': str(e)}, status=500)

class TeamschluesselView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            person_name = request.GET.get('person')
            first_name, last_name = person_name.split(',')
            
            with connection.cursor() as cursor:
                cursor.execute("""
                    WITH person_teams AS (
                        SELECT ts.team_id, ts.anteil, ts.year
                        FROM teamschlüssel ts
                        JOIN mitarbeiter_stammdaten ms ON ts.personen_id = ms.id
                        WHERE ms.vorname = %s AND ms.nachname = %s
                    ),
                    team_totals AS (
                        SELECT team_id, year, SUM(anteil) as total_anteil
                        FROM teamschlüssel
                        GROUP BY team_id, year
                    )
                    SELECT 
                        pt.team_id,
                        pt.year,
                        pt.anteil as person_anteil,
                        tt.total_anteil,
                        ROUND((pt.anteil * 100.0 / tt.total_anteil), 2) as percentage
                    FROM person_teams pt
                    JOIN team_totals tt ON pt.team_id = tt.team_id AND pt.year = tt.year
                    ORDER BY pt.year, pt.team_id
                """, [first_name.strip(), last_name.strip()])
                
                columns = [col[0] for col in cursor.description]
                team_percentages = [dict(zip(columns, row)) for row in cursor.fetchall()]
                
                return Response({'team_percentages': team_percentages})
                
        except DatabaseError as e:
            return Response({'error': str(e)}, status=500)

class TeamDetailsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            person_name = request.GET.get('person')
            first_name, last_name = person_name.split(',')
            
            with connection.cursor() as cursor:
                # First get the employee ID from mitarbeiter_stammdaten
                cursor.execute("""
                    SELECT id FROM mitarbeiter_stammdaten 
                    WHERE vorname = %s AND nachname = %s
                """, [first_name.strip(), last_name.strip()])
                
                employee_id = cursor.fetchone()[0]
                
                # Then get all team data for this employee
                cursor.execute("""
                    SELECT * FROM teamschlüssel ts
                    WHERE (ts.team_id) IN (
                        SELECT team_id 
                        FROM teamschlüssel 
                        WHERE personen_id = %s
                    ) AND ts.primaerteam_id IS NOT NULL;
                """, [employee_id])
                
                columns = [col[0] for col in cursor.description]
                team_details = [dict(zip(columns, row)) for row in cursor.fetchall()]
                
                return Response({'team_details': team_details})
        except DatabaseError as e:
            return Response({'error': str(e)}, status=500)





