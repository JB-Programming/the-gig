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
