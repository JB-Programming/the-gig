from django.urls import path
from . import views
from .views import TeamListView, EmployeeListView

urlpatterns = [
    path('login/', views.login, name='login'),
    path('user/', views.user_data, name='user_data'),
    path('structure/', views.build_tree_with_null, name='structure'),
    path('teams/', TeamListView.as_view(), name='team-list'),
    path('employees/', EmployeeListView.as_view(), name='employee-list'),
]
