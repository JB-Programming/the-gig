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
from django import forms

from django.http import JsonResponse
from django.db import connection
from .models import teamschlüssel
from .models import Struktur
from .models import MonatsdatenTeams, MonatsdatenPersonen
from datetime import datetime
import copy
from decimal import Decimal

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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def monatspflege_speichern(request):
    try:
        with transaction.atomic():
            x = 1
            team_data = request.data.get('data')
            date = request.data.get('date')
            person_data = request.data.get('data2')
            
            target_date = datetime(
                    int(date.split('-')[0]),
                    int(date.split('-')[1]),
                    1
                )

            # Delete existing entries for this date
            try:
                MonatsdatenTeams.objects.filter(jahr_und_monat=target_date).delete()
            except:
                print("No teams data!")
            
            # Create new team entries
            for team in team_data:
                revenue = str(team['revenue']).replace('.', '').replace(',', '.')
                db_percent = str(team['dbPercent']).replace(',', '.')
                team_adjustment = str(team['teamAdjustment']).replace('.', '').replace(',', '.')
                
                revenue_val = int(float(revenue)) if revenue else 0
                db_val = Decimal(db_percent) if db_percent else Decimal('0.0000')
                adjustment_val = int(float(team_adjustment)) if team_adjustment else 0

                MonatsdatenTeams.objects.create(
                    jahr_und_monat=target_date,
                    primaerteam_id=x,
                    umsatz=revenue_val,
                    db_ist=db_val,
                    teamanpassung=adjustment_val
                )
                x += 1
            try:
                MonatsdatenPersonen.objects.filter(jahr_und_monat=target_date).delete()
            except:
                print("No person data!")

            # Create new person entries
            for person in person_data:
                MonatsdatenPersonen.objects.create(
                    jahr_und_monat=target_date,
                    mitarbeiter_id=person['mitarbeiter_id'],
                    festbetrag=float(person['festbetrag']),
                    fixum=float(person['fixum']),
                    fehltage=int(person['fehltage']),
                    teiler=int(person['teiler'])
                )

            return Response({'success': True})
    except Exception as e:
        return Response(
            {str(e)},#{'error': f'Failed to fetch teams: {str(e)}'}, 
            status=500
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def monatspflege_daten(request):
    target_date = datetime(
        request.data.get('year'),
        request.data.get('month'),
        request.data.get('day')
    )
    try:
        monthly_data = MonatsdatenTeams.objects.filter(jahr_und_monat=target_date).order_by('primaerteam_id')
        return JsonResponse(list(monthly_data.values()), safe=False)
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch teams: {str(e)}'}, 
            status=500
        )



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

                cursor.execute("""
                    SELECT DISTINCT mt.*
                    FROM monatsdaten_teams mt
                    WHERE mt.primaerteam_id IN (
                        SELECT ts2.primaerteam_id 
                        FROM teamschlüssel ts1
                        JOIN teamschlüssel ts2 ON ts1.team_id = ts2.team_id
                        WHERE ts1.personen_id = %s
                        AND ts2.primaerteam_id IS NOT NULL
                    )
                """, [employee_id])

                columns = [col[0] for col in cursor.description]
                teams_data3 = [
                    dict(zip(columns, row))
                    for row in cursor.fetchall()
                ]

                print("Hello \n\n")
                print("Hello \n\n")
                print("Hello \n\n")
                print(teams_data3)

                for row in teams_data3:
                    date_str = str(row['jahr_und_monat'])
                    year = int(date_str.split('-')[0])  # Gets 2024
                    month = int(date_str.split('-')[1])  # Gets 1
                    primaer_id = row['primaerteam_id']

                    # First get all data for the year and id
                    cursor.execute("""
                        SELECT jan_anteile, feb_anteile, mar_anteile, apr_anteile, 
                            mai_anteile, jun_anteile, jul_anteile, aug_anteile,
                            sep_anteile, okt_anteile, nov_anteile, dez_anteile,
                            schwellenwert_db
                        FROM primärteam_stammdaten_jahr
                        WHERE jahr = %s AND id = %s
                    """, [year, primaer_id])
                    
                    stamm_data = cursor.fetchone()
                    if stamm_data:
                        total_anteile = sum(stamm_data[0:12])
                        print(stamm_data[0:12])
                        month_anteile = stamm_data[month-1]
                        schwellenwert = round((month_anteile / total_anteile) * float(stamm_data[12]),0) if total_anteile else 0
                        row['schwellenwert'] = schwellenwert

                    else:
                        row['schwellenwert'] = 0




                return Response({'teams_data': teams_data3})
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
                        SELECT ts.team_id, ts.anteil, ts.year, ts.primaerteam_id
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
                        pt.primaerteam_id,
                        pt.year,
                        pt.anteil as person_anteil,
                        tt.total_anteil,
                        ROUND((pt.anteil * 100.0 / tt.total_anteil), 2) as percentage
                    FROM person_teams pt
                    JOIN team_totals tt ON pt.team_id = tt.team_id AND pt.year = tt.year
                    ORDER BY pt.year, pt.team_id
                """, [first_name.strip(), last_name.strip()])

                columns = [col[0] for col in cursor.description]
                team_percentages2 = [dict(zip(columns, row)) for row in cursor.fetchall()]

                print("Hello this is me 2\n\n")
                print(team_percentages2)

                cursor.execute("""
                    SELECT id FROM mitarbeiter_stammdaten 
                    WHERE vorname = %s AND nachname = %s
                """, [first_name.strip(), last_name.strip()])
                
                employee_id = cursor.fetchone()[0]

                cursor.execute("""
                    SELECT ts1.*, ts2.*
                    FROM teamschlüssel ts1
                    JOIN teamschlüssel ts2 
                        ON ts1.team_id = ts2.team_id
                    WHERE ts1.personen_id = %s
                    AND ts2.primaerteam_id IS NOT NULL
                """, [employee_id])

                columns = [col[0] for col in cursor.description]
                team_percentages3 = [dict(zip(columns, row)) for row in cursor.fetchall()]

                # Create mapping from team_id to primaerteam_id from second object
                primaerteam_mapping = {item['team_id']: item['primaerteam_id'] for item in team_percentages3}
                # Update first object with correct primaerteam_ids
                for item in team_percentages2:
                    item['primaerteam_id'] = primaerteam_mapping[item['team_id']]


                return Response({'team_percentages': team_percentages2})
                
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
    data2 = copy.deepcopy(data)
    for item in data2:
        if item['parent'] and 1 in item['parent'] and item['mitarbeiter_id'] is not None:
            print(f"Struktur ID: {item['struktur_id']}")
            item['parent'].remove(1)

    data = build_tree(data2)
        #print(node)
    #return JsonResponse(build_tree(data))
    return JsonResponse(list(data), safe=False)

@api_view(['GET'])
def structure(request):
   
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_employees(request):
    target_date = datetime(
        request.data.get('year'),
        request.data.get('month'),
        request.data.get('day')
    )
    try:
        employees = Struktur.objects.filter(
            mitarbeiter_id__isnull=False,
            parent__contains=[1]
        ).values('name', 'mitarbeiter_id')
        
        formatted_data = []
        for emp in employees:
            monthly_entry = MonatsdatenPersonen.objects.filter(
                jahr_und_monat=target_date,
                mitarbeiter_id=emp['mitarbeiter_id']
            ).values().first()
            
            if monthly_entry:
                monthly_entry['name'] = emp['name']
                monthly_entry['festbetrag'] = int(monthly_entry['festbetrag'])
                monthly_entry['fixum'] = int(monthly_entry['fixum'])
                formatted_data.append(monthly_entry)
            else:
                formatted_data.append({
                    'name': emp['name'],
                    'mitarbeiter_id': emp['mitarbeiter_id'],
                    'festbetrag': 0,
                    'fixum': 0,
                    'fehltage': 0,
                    'teiler': 1
                })
        

        return JsonResponse(list(formatted_data), safe=False)
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch teams: {str(e)}'}, 
            status=500
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_primary_data_top(request):
        bezeichnung = request.data.get('team')
        try:
            
            struktur = Struktur.objects.get(name=bezeichnung)
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT *
                    FROM primärteam_stammdaten 
                    WHERE id = %s 
                """, [struktur.primär_id])

                row = cursor.fetchone()
                print(row)

                if row:
                    return Response({
                        'primär_id': row[0],
                        'bezeichnung': row[1],
                        'sortierfeld': row[2], 
                        'notiz': row[3]
                    })
                else:
                    return Response({
                        'primär_id': 0,
                        'bezeichnung': 0,
                        'sortierfeld': 0, 
                        'notiz': 0

                })
        except Struktur.DoesNotExist:
            return Response({'error': 'Team not found'}, status=404)
        
        except Exception as e:
            return Response({'error': f'Failed to fetch primary data: {str(e)}'}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_primary_data(request):
        bezeichnung = request.data.get('team')
        jahr = request.data.get('year')
        try:
            struktur = Struktur.objects.get(name=bezeichnung)

            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT *
                    FROM primärteam_stammdaten_jahr 
                    WHERE id = %s AND jahr = %s
                """, [struktur.primär_id, jahr])

                row = cursor.fetchone()
                print(row)

                if row:
                    return Response({
                        'primär_id': row[1],
                        'plan_db': row[2],
                        'teamanpassung': row[3], 
                        'db_beteiligung': row[4],
                        'umsatz_beteiligung': row[5],
                        'schwellwert_db': row[6],
                        'januar': row[7],
                        'februar': row[8],
                        'maerz': row[9],
                        'april': row[10],
                        'mai': row[11],
                        'juni': row[12],
                        'juli': row[13],
                        'august': row[14],
                        'september': row[15],
                        'oktober': row[16],
                        'november': row[17],
                        'dezember': row[18]
                    })
                else:
                    return Response({
                        'primär_id': struktur.primär_id,
                        'plan_db': 0,
                        'teamanpassung': 0, 
                        'db_beteiligung': 0,
                        'umsatz_beteiligung': 0,
                        'schwellwert_db': 0,
                        'januar': 0,
                        'februar': 0,
                        'maerz': 0,
                        'april': 0,
                        'mai': 0,
                        'juni': 0,
                        'juli': 0,
                        'august': 0,
                        'september': 0,
                        'oktober': 0,
                        'november': 0,
                        'dezember': 0
                    })

            return Response({
                'primär_id': struktur.primär_id
            })

            return Response({'teams': teams})
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch teams: {str(e)}'}, 
                status=500
            )
        
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_schwellenwerte(request):
    try:
        with transaction.atomic():
            combinedData = request.data.get('combinedData')
            
            """
            # Process the data here
            # Example: Save to database or perform calculations

            print(f"Plan DB: {combinedData["planDB"]}")
            print(f"Teamanpassung: {combinedData["teamanpassung"]}")
            print(f"DB Beteiligung: {combinedData["dbBeteiligung"]}")
            print(f"Schwellwert DB: {combinedData["schwellwertDB"]}")
            print(f"Primär ID: {combinedData["primär_id"]}")
            print(combinedData["monthlyData"])
            for month in combinedData["monthlyData"]:
                print(f"Month: {month["anteile"]}")
            print(combinedData["year"])

            return Response({'success': True})"""


            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO primärteam_stammdaten_jahr (
                        jahr, id, plan_deckungsbeitrag, teamanpassung, 
                        teambeteiligung_deckungsbeitrag, teambeteiligung_umsatz, 
                        schwellenwert_db, jan_anteile, feb_anteile, mar_anteile,
                        apr_anteile, mai_anteile, jun_anteile, jul_anteile,
                        aug_anteile, sep_anteile, okt_anteile, nov_anteile, dez_anteile
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                    )
                    ON DUPLICATE KEY UPDATE
                        plan_deckungsbeitrag = VALUES(plan_deckungsbeitrag),
                        teamanpassung = VALUES(teamanpassung),
                        teambeteiligung_deckungsbeitrag = VALUES(teambeteiligung_deckungsbeitrag),
                        teambeteiligung_umsatz = VALUES(teambeteiligung_umsatz),
                        schwellenwert_db = VALUES(schwellenwert_db),
                        jan_anteile = VALUES(jan_anteile),
                        feb_anteile = VALUES(feb_anteile),
                        mar_anteile = VALUES(mar_anteile),
                        apr_anteile = VALUES(apr_anteile),
                        mai_anteile = VALUES(mai_anteile),
                        jun_anteile = VALUES(jun_anteile),
                        jul_anteile = VALUES(jul_anteile),
                        aug_anteile = VALUES(aug_anteile),
                        sep_anteile = VALUES(sep_anteile),
                        okt_anteile = VALUES(okt_anteile),
                        nov_anteile = VALUES(nov_anteile),
                        dez_anteile = VALUES(dez_anteile)
                """, [
                    combinedData['year'],
                    combinedData['primär_id'],
                    combinedData['planDB'],
                    combinedData['teamanpassung'],
                    combinedData['dbBeteiligung'],
                    0,
                    combinedData['schwellwertDB'],
                    combinedData['monthlyData'][0]['anteile'],
                    combinedData['monthlyData'][1]['anteile'],
                    combinedData['monthlyData'][2]['anteile'],
                    combinedData['monthlyData'][3]['anteile'],
                    combinedData['monthlyData'][4]['anteile'],
                    combinedData['monthlyData'][5]['anteile'],
                    combinedData['monthlyData'][6]['anteile'],
                    combinedData['monthlyData'][7]['anteile'],
                    combinedData['monthlyData'][8]['anteile'],
                    combinedData['monthlyData'][9]['anteile'],
                    combinedData['monthlyData'][10]['anteile'],
                    combinedData['monthlyData'][11]['anteile']
                ])

            return Response({'success': True})
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_monthly_data(request):
    try:
        bezeichnung = request.data.get('team')
        year = request.data.get('year')
        monthly_data = []
        monthly_data_schwellenwert = []
        with connection.cursor() as cursor:
            struktur = Struktur.objects.get(name=bezeichnung)
            
            
            for month in range(1, 13):
                target_date = datetime(
                    int(year),
                    month,
                    1
                )
                print("HI")
                cursor.execute("""
                    SELECT umsatz_plan, umsatz, db_plan, db_ist
                    FROM monatsdaten_teams 
                    WHERE primaerteam_id = %s AND jahr_und_monat = %s
                """, [struktur.primär_id, target_date])

                row = cursor.fetchone()

                if row:
                    monthly_data.append({
                        'umsatzPlan': row[0] or 0,
                        'umsatzIst': row[1] or 0, 
                        'dbPlanPercent': row[2] or 0,
                        'dbIstPercent': row[3] or 0
                    })
                else:
                    monthly_data.append({
                        'umsatzPlan': 0,
                        'umsatzIst': 0,
                        'dbPlanPercent': 0,
                        'dbIstPercent': 0
                    })

            cursor.execute("""
                    SELECT *
                    FROM primärteam_stammdaten_jahr 
                    WHERE id = %s AND jahr = %s
                """, [struktur.primär_id, year])

            row = cursor.fetchone()
            print(row)

            if row:
                schwellenwert_gesamt = float(row[6])
                anteile_gesamt = row[7] + row[8] + row[9] + row[10] + row[11] + row[12] + row[13] + row[14] + row[15] + row[16] + row[17] + row[18]
                print(anteile_gesamt)
                if anteile_gesamt != 0:
                    monthly_data_schwellenwert.append({
                        
                        0: round(row[7] / anteile_gesamt * schwellenwert_gesamt, None),
                        1: round(row[8] / anteile_gesamt * schwellenwert_gesamt, None),
                        2: round(row[9] / anteile_gesamt * schwellenwert_gesamt, None),
                        3: round(row[10] / anteile_gesamt * schwellenwert_gesamt, None),
                        4: round(row[11] / anteile_gesamt * schwellenwert_gesamt, None),
                        5: round(row[12] / anteile_gesamt * schwellenwert_gesamt, None),
                        6: round(row[13] / anteile_gesamt * schwellenwert_gesamt, None),
                        7: round(row[14] / anteile_gesamt * schwellenwert_gesamt, None),
                        8: round(row[15] / anteile_gesamt * schwellenwert_gesamt, None),
                        9: round(row[16] / anteile_gesamt * schwellenwert_gesamt, None),
                        10: round(row[17] / anteile_gesamt * schwellenwert_gesamt, None),
                        11: round(row[18] / anteile_gesamt * schwellenwert_gesamt, None),
                        12: row[2],
                    })
                else:
                    monthly_data_schwellenwert.append({
                        0: 0,
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                        5: 0,
                        6: 0,
                        7: 0,
                        8: 0,
                        9: 0,
                        10: 0,
                        11: 0,
                        12: row[2],
                    })
            else:
                monthly_data_schwellenwert.append({
                    0: 0,
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    6: 0,
                    7: 0,
                    8: 0,
                    9: 0,
                    10: 0,
                    11: 0,
                    12: 0,
                })
            
        return Response({
        'monthlyData': monthly_data,
        'monthlyDataSchwellenwert': monthly_data_schwellenwert,
        'primär_id': struktur.primär_id,
        })

    except Exception as e:
        return Response({'error': str(e)}, status=500)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_monthly_data(request):
    try:
        year = request.data.get('year')
        data = request.data.get('data')
        id = request.data.get('id')
        with connection.cursor() as cursor:
            for month in range(1, 13):
                target_date = datetime(
                    int(year),
                    month,
                    1
                )
                print(target_date,
                    id,
                    data[month - 1]['umsatzPlan'],
                    data[month - 1]['umsatzIst'],
                    data[month - 1]['dbPlanPercent'],
                    data[month - 1]['dbIstPercent'])
                cursor.execute("""
                    INSERT INTO monatsdaten_teams (
                        jahr_und_monat, primaerteam_id, umsatz_plan, umsatz, db_plan, db_ist
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s
                    )
                    ON DUPLICATE KEY UPDATE
                        umsatz_plan = VALUES(umsatz_plan),
                        umsatz = VALUES(umsatz),
                        db_plan = VALUES(db_plan),
                        db_ist = VALUES(db_ist)
                """, [
                    target_date,
                    id,
                    data[month - 1]['umsatzPlan'],
                    data[month - 1]['umsatzIst'],
                    data[month - 1]['dbPlanPercent'],
                    data[month - 1]['dbIstPercent']
                ])
                
        return Response({'success': True})
    
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_team_data(request):
    try:
        year = request.data.get('year')
        bezeichnung = request.data.get('team')
        monthly_data = []
        team_data = []
        anteile_gesamt = 0
        schwellenwert_gesamt = 0
        mitarbeiter_prozent = 0
        len_anteile = 0
        team_schlüssel_prozent = 0
        print("hi")
        mitarbeiter_prozent = 0
        with connection.cursor() as cursor:
            struktur = Struktur.objects.get(name=bezeichnung)
            print(struktur.team_id)
            cursor.execute("""
                SELECT anteil
                FROM teamschlüssel
                WHERE team_id = %s 
                AND personen_id IS NOT NULL
            """, [struktur.team_id])
            anteile = cursor.fetchall()
            print(anteile)

            cursor.execute("""
                SELECT primaerteam_id
                FROM teamschlüssel
                WHERE team_id = %s 
                AND primaerteam_id IS NOT NULL
            """, [struktur.team_id])
            primär_id = cursor.fetchall()

            # Aktuell besteht hier die Gefahr, dass ein Team in mehreren Primärteams ist,
            # wenn dies der Fall wäre würde diese Funktion fehlschlagen.

            if primär_id:
                cursor.execute("""
                    SELECT provisionssatz
                    FROM teamschlüssel
                    WHERE team_id = %s 
                    AND primaerteam_id = %s
                    AND year = %s
                """, [struktur.team_id, primär_id, year])
                team_schlüssel_prozent = cursor.fetchall()
                if team_schlüssel_prozent:
                    print("team_schlüssel_prozent", team_schlüssel_prozent)
                    team_schlüssel_prozent = float(team_schlüssel_prozent[0][0])
                    print("team_schlüssel_prozent after", type(team_schlüssel_prozent))
                else:
                    team_schlüssel_prozent = float(0)
                    print("no teamschlüssel")
            
            else: 
                team_schlüssel_prozent = float(0)


            len_anteile = len(anteile)
            print("This is len_anteile", len_anteile)
            for x in anteile:
                mitarbeiter_prozent = mitarbeiter_prozent + x[0]

            cursor.execute("""
                    SELECT *
                    FROM primärteam_stammdaten_jahr 
                    WHERE id = %s AND jahr = %s
                """, [primär_id, year])

            row_stamm = cursor.fetchone()
            print(row_stamm[6])
            if row_stamm:
                schwellenwert_gesamt = float(row_stamm[6])
                anteile_gesamt = row_stamm[7] + row_stamm[8] + row_stamm[9] + row_stamm[10] + row_stamm[11] + row_stamm[12] + row_stamm[13] + row_stamm[14] + row_stamm[15] + row_stamm[16] + row_stamm[17] + row_stamm[18]
                print("This is anteile",anteile_gesamt)
            
            for month in range(1, 13):
                target_date = datetime(
                    int(year),
                    month,
                    1
                )
                print(anteile_gesamt != 0)

                cursor.execute("""
                    SELECT umsatz_plan, umsatz, db_plan, db_ist
                    FROM monatsdaten_teams 
                    WHERE primaerteam_id = %s AND jahr_und_monat = %s
                """, [primär_id, target_date])
                
                row_month = cursor.fetchone()

                if row_month and row_stamm: 
                    umsatzPlan = row_month[0] if row_month[0] else 0
                    dbPlanPercent = row_month[2] if row_month[2] is None or row_month[2] != 0 else row_stamm[2]
                    print("This is ", dbPlanPercent)
                    print("And that is", umsatzPlan)
                    umsatzIst = row_month[1] if row_month[1] else 0
                    dbIstPercent = float(row_month[3]) if row_month[3] or float(row_month[3]) != 0 else row_stamm[3]
                    plan = (umsatzPlan * dbPlanPercent) / 100
                    print(plan)
                    ist = (umsatzIst * dbIstPercent) / 100
                    print(ist)
                    if anteile_gesamt != 0:
                        schwellen_wert = round(row_stamm[6+month] / anteile_gesamt * schwellenwert_gesamt, None) # Schwellenwert
                    else:
                        schwellen_wert = 0.0
                    schwellen_wert_pro_mitarbeiter = schwellen_wert / (mitarbeiter_prozent / 100)
                    print("This is schwellenwert", schwellen_wert)
                    print("This is personen", schwellen_wert_pro_mitarbeiter)
                    print(plan - schwellen_wert)
                    print(type(plan - schwellen_wert))
                    plan_db = (float(plan - schwellen_wert)*team_schlüssel_prozent) / 100
                    ist_db = (float(ist - schwellen_wert)*team_schlüssel_prozent) / 100
                    print("Tabelle:")
                    print(plan_db)
                    print(ist_db)
                    print(schwellen_wert_pro_mitarbeiter)
                    print(schwellen_wert)
                    monthly_data.append({
                        'teamentgeltPlan': round(plan_db,None),
                        'teamentgeltIst': round(ist_db,None),
                        'schwellenwertMA': round(schwellen_wert_pro_mitarbeiter,None),
                        'schwellenwert': round(schwellen_wert,None)
                    })
                else:
                    print("No data for this month")
                    monthly_data.append({
                        'teamentgeltPlan': 0,
                        'teamentgeltIst': 0,
                        'schwellenwertMA': 0,
                        'schwellenwert': 0
                    })

        return Response(monthly_data, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_teamschlüssel_data(request):
    try:
        bezeichnung = request.data.get('team')
        year = request.data.get('year')
        team_data = []
        with connection.cursor() as cursor:
            struktur = Struktur.objects.get(name=bezeichnung)
            print(struktur.struktur_id)
            cursor.execute("""
                SELECT name, team_id 
                FROM struktur
                WHERE JSON_Contains(parent, '%s');
            """, [struktur.struktur_id])

            teams = cursor.fetchall()
            print(teams)
            for team in teams:
                cursor.execute("""
                    SELECT provisionssatz 
                    FROM teamschlüssel
                    WHERE year = %s AND team_id = %s
                """, [year, team[1]])
                
                row = cursor.fetchone()
                print(row)
                team_data.append({
                    'team': team[0],
                    'team_id': team[1],
                    'provisionssatz': row[0] if row else 0
                })

        return Response(team_data, status=200)
    
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_teamschlüssel(request):
    try:
        data = request.data.get('data')
        year = request.data.get('year')
        bezeichnung = request.data.get('team')
        struktur = Struktur.objects.get(name=bezeichnung)
        with connection.cursor() as cursor:
            for team in data:
                print(team)
                cursor.execute("""
                    SELECT * FROM teamschlüssel 
                    WHERE primaerteam_id = %s 
                    AND team_id = %s 
                    AND year = %s
                """, [struktur.primär_id, team['team_id'], year])
                result = cursor.fetchone()
                if result:
                    cursor.execute("""
                        UPDATE teamschlüssel
                        SET provisionssatz = %s
                        WHERE primaerteam_id = %s AND team_id = %s AND year = %s
                    """, [team['provisionssatz'], struktur.primär_id, team['team_id'], year])
                else:
                    cursor.execute("""
                        INSERT INTO teamschlüssel (primaerteam_id, team_id, provisionssatz, year)
                        VALUES (%s, %s, %s, %s)
                    """, [struktur.primär_id, team['team_id'], team['provisionssatz'], year])
                
        return Response(year, status=200)
    
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_teamschlüssel_data_team(request):
    try:
        bezeichnung = request.data.get('team')
        year = request.data.get('year')
        team_data = []
        with connection.cursor() as cursor:
            struktur = Struktur.objects.get(name=bezeichnung)
            print(struktur.struktur_id)
            cursor.execute("""
                SELECT name, mitarbeiter_id 
                FROM struktur
                WHERE JSON_Contains(parent, '%s');
            """, [struktur.struktur_id])

            teams = cursor.fetchall()
            print(teams)
            for team in teams:
                cursor.execute("""
                    SELECT anteil 
                    FROM teamschlüssel
                    WHERE year = %s AND personen_id = %s
                """, [year, team[1]])
                
                row = cursor.fetchone()
                print(row)
                team_data.append({
                    'team': team[0],
                    'team_id': team[1],
                    'provisionssatz': row[0] if row else 0
                })

        return Response(team_data, status=200)
    
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_teamschlüssel_team(request):
    try:
        data = request.data.get('data')
        year = request.data.get('year')
        bezeichnung = request.data.get('team')
        print("hi")
        print(bezeichnung['name'])
        struktur = Struktur.objects.get(name=bezeichnung['name'])
        with connection.cursor() as cursor:
            for team in data:
                print(team)
                cursor.execute("""
                    SELECT * FROM teamschlüssel 
                    WHERE team_id = %s 
                    AND personen_id = %s 
                    AND year = %s
                """, [struktur.team_id, team['team_id'], year])
                result = cursor.fetchone()
                if result:
                    cursor.execute("""
                        UPDATE teamschlüssel
                        SET anteil = %s
                        WHERE team_id = %s AND personen_id = %s AND year = %s
                    """, [team['provisionssatz'], struktur.team_id, team['team_id'], year])
                    print("Done")
                else:
                    cursor.execute("""
                        INSERT INTO teamschlüssel (team_id, personen_id, anteil, year)
                        VALUES (%s, %s, %s, %s)
                    """, [struktur.team_id, team['team_id'], team['provisionssatz'], year])
                    print("Done newS")
                
        return Response(year, status=200)
    
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    


from django import forms
from django.contrib.auth.models import User
from django.shortcuts import render
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAdminUser

class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ["username", "email", "password", "first_name", "last_name", "is_staff", "is_superuser"]

from django.contrib.auth.decorators import user_passes_test


@api_view(['POST'])
@user_passes_test(lambda u: u.is_superuser)
def createUser(request):
    print("Request headers:", request.headers)  # Add this line
    print("User authenticated:", request.user.is_authenticated)  # Add this line
    if request.method == 'POST':
        uform = UserForm(data=request.data)
        if uform.is_valid():
            user = uform.save(commit=False)
            user.set_password(user.password)
            user.save()
            return JsonResponse({'message': 'User created successfully'}, status=201)
        return JsonResponse({'errors': uform.errors}, status=400)
    return JsonResponse({'message': 'Method not allowed'}, status=405)



