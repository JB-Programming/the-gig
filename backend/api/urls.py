from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login, name='login'),
    path('user/', views.user_data, name='user_data'),
    path('structure/', views.build_tree_with_null, name='structure'),
]