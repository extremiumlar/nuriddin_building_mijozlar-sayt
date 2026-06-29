from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    Amenity,
    ConstructionBlock,
    LotteryWinner,
    MonthlyMedia,
    NewsItem,
    Project,
    ProjectStat,
)
from .serializers import (
    AmenitySerializer,
    ConstructionBlockSerializer,
    LotteryWinnerSerializer,
    MonthlyMediaSerializer,
    NewsItemSerializer,
    ProjectSerializer,
    ProjectStatSerializer,
)


class LargePagination(PageNumberPagination):
    page_size = 500
    page_size_query_param = 'page_size'
    max_page_size = 500


NoPagination = LargePagination  # backwards compat alias


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """Public project list + detail (Nurli Diyor + future projects)."""

    queryset = Project.objects.filter(is_active=True).prefetch_related('renders')
    serializer_class = ProjectSerializer
    lookup_field = 'slug'
    pagination_class = NoPagination


class ConstructionBlockViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ConstructionBlock.objects.select_related('project').prefetch_related('floors').all()
    serializer_class = ConstructionBlockSerializer
    pagination_class = NoPagination


class LotteryWinnerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LotteryWinner.objects.all()
    serializer_class = LotteryWinnerSerializer
    pagination_class = NoPagination


class AmenityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer
    pagination_class = NoPagination


class NewsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = NewsItem.objects.filter(is_active=True)
    serializer_class = NewsItemSerializer
    pagination_class = NoPagination


class StatViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProjectStat.objects.all()
    serializer_class = ProjectStatSerializer
    pagination_class = NoPagination


class MonthlyMediaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MonthlyMedia.objects.filter(is_active=True)
    serializer_class = MonthlyMediaSerializer
    pagination_class = NoPagination


class LandingBundleView(APIView):
    """Convenience endpoint — one round-trip for the whole landing page."""

    def get(self, request, *args, **kwargs):
        ctx = {'request': request}
        featured_project = (
            Project.objects.filter(is_active=True, is_featured=True)
            .prefetch_related('renders')
            .first()
        )
        return Response({
            'project': ProjectSerializer(featured_project, context=ctx).data if featured_project else None,
            'blocks': ConstructionBlockSerializer(
                ConstructionBlock.objects.prefetch_related('floors').all(),
                many=True,
                context=ctx,
            ).data,
            'lottery_winners': LotteryWinnerSerializer(
                LotteryWinner.objects.all()[:6],
                many=True,
                context=ctx,
            ).data,
            'amenities': AmenitySerializer(
                Amenity.objects.all(),
                many=True,
                context=ctx,
            ).data,
            'news': NewsItemSerializer(
                NewsItem.objects.filter(is_active=True)[:6],
                many=True,
                context=ctx,
            ).data,
            'stats': ProjectStatSerializer(
                ProjectStat.objects.all(),
                many=True,
                context=ctx,
            ).data,
            'monthly_media': MonthlyMediaSerializer(
                MonthlyMedia.objects.filter(is_active=True)[:12],
                many=True,
                context=ctx,
            ).data,
        })
