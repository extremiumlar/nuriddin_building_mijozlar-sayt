from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'projects', views.ProjectViewSet, basename='project')
router.register(r'construction', views.ConstructionBlockViewSet, basename='construction')
router.register(r'lottery-winners', views.LotteryWinnerViewSet, basename='lottery-winner')
router.register(r'amenities', views.AmenityViewSet, basename='amenity')
router.register(r'news', views.NewsViewSet, basename='news')
router.register(r'stats', views.StatViewSet, basename='stat')
router.register(r'monthly-media', views.MonthlyMediaViewSet, basename='monthly-media')

urlpatterns = [
    path('', include(router.urls)),
    path('landing/', views.LandingBundleView.as_view(), name='landing-bundle'),
]
