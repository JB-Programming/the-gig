from django.urls import path
from . import views
from .views import TeamListView, EmployeeListView, UserInfoView, UserRolesView, MonatsdatenTeamsView, TeamschluesselView, TeamDetailsView

urlpatterns = [
    path('login/', views.login, name='login'),
    path('user/', views.user_data, name='user_data'),
    #path('structure/', views.build_tree_with_null, name='struktur_list'),
    path('relation/', views.manage_relation, name='manage_relation'),
    path('add_instance/', views.create_instance, name='create_instance'),
    path('structure/', views.build_tree_with_null, name='structure'),
    path('get_structure/', views.structure, name='structure'),
    path('primary/', views.PrimaryListView.as_view(), name='primary-list'),
    path('monthly/', views.monatspflege_daten, name='monthly-list'),
    path('monthly_save/', views.monatspflege_speichern, name='monthly-save'),
    path('monthly_employees/', views.get_employees, name='monthly-employees'),
    path('teams/', TeamListView.as_view(), name='team-list'),
    path('employees/', EmployeeListView.as_view(), name='employee-list'),
    path('user/', UserInfoView.as_view(), name='user-info'),
    path('user-roles/', UserRolesView.as_view(), name='user-roles'),
<<<<<<< HEAD
    path('monatsdaten_teams/', MonatsdatenTeamsView.as_view(), name='monatsdaten-teams'),
    path('team-percentages/', TeamschluesselView.as_view(), name='team-percentages'),
    path('team-details/', TeamDetailsView.as_view(), name='team-details'),
=======
    path('primary_team_data/', views.get_primary_data, name='primary-data'),
    path('primary_team_data_top/', views.get_primary_data_top, name='primary-data-top'),
    path('save_schwellenwerte/', views.save_schwellenwerte, name='save-schwellenwerte'),
    path('get_monthly_data/', views.get_monthly_data, name='get-monthly-data'),
    path('save_monthly_data/', views.save_monthly_data, name='save-monthly-data'),
    path('get_team_data/', views.get_team_data, name='get-team-data'),
<<<<<<< HEAD
    path('get_teamschluessel_data/', views.get_teamschlüssel_data, name='get-teamschlüssel-data'),
    path('save_teamschluessel/', views.save_teamschlüssel, name='save-teamschlüssel'),
    path('get_teamschluessel_data_team/', views.get_teamschlüssel_data_team, name='get-teamschlüssel-data-team'),
    path('save_teamschluessel_team/', views.save_teamschlüssel_team, name='save-teamschlüssel-team'),
>>>>>>> remotes/origin/12-teamschlüssel
=======
    path('create-user/', views.createUser, name='create-user'),

>>>>>>> remotes/origin/16-person-in-django-mit-account-und-passwort-1preusse
]


