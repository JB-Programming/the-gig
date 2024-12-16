from django.urls import path
from . import views
from .views import TeamListView, EmployeeListView, UserInfoView, UserRolesView

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
    path('primary_team_data/', views.get_primary_data, name='primary-data'),
    path('primary_team_data_top/', views.get_primary_data_top, name='primary-data-top'),
    path('save_schwellenwerte/', views.save_schwellenwerte, name='save-schwellenwerte')
]
