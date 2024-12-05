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
    path('primary/', views.PrimaryListView.as_view(), name='primary-list'),
    path('teams/', TeamListView.as_view(), name='team-list'),
    path('employees/', EmployeeListView.as_view(), name='employee-list'),
    path('user/', UserInfoView.as_view(), name='user-info'),
    path('user-roles/', UserRolesView.as_view(), name='user-roles'),
]
