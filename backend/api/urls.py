from django.urls import path
from . import views
from .views import TeamListView, EmployeeListView, UserInfoView, UserRolesView, MonatsdatenTeamsView, TeamschluesselView, TeamDetailsView

urlpatterns = [
    path('login/', views.login, name='login'),
    path('user/', views.user_data, name='user_data'),
    path('structure/', views.build_tree_with_null, name='structure'),
    path('teams/', TeamListView.as_view(), name='team-list'),
    path('employees/', EmployeeListView.as_view(), name='employee-list'),
    path('user/', UserInfoView.as_view(), name='user-info'),
    path('user-roles/', UserRolesView.as_view(), name='user-roles'),
    path('monatsdaten_teams/', MonatsdatenTeamsView.as_view(), name='monatsdaten-teams'),
    path('team-percentages/', TeamschluesselView.as_view(), name='team-percentages'),
    path('team-details/', TeamDetailsView.as_view(), name='team-details'),
]


