from rest_framework import serializers

from .models import (
    Amenity,
    BlockFloor,
    ConstructionBlock,
    LotteryWinner,
    MonthlyMedia,
    NewsItem,
    Project,
    ProjectRender,
    ProjectStat,
)


class ProjectRenderSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = ProjectRender
        fields = ['id', 'url', 'caption', 'order']

    def get_url(self, obj: ProjectRender) -> str:
        if obj.image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return obj.image_url


class ProjectSerializer(serializers.ModelSerializer):
    renders = ProjectRenderSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'slug', 'tagline', 'description',
            'address', 'location_label',
            'block_count', 'floor_count', 'apartment_count',
            'construction_progress', 'estimated_delivery', 'estimated_delivery_label',
            'is_featured', 'is_active', 'renders',
        ]


class BlockFloorSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockFloor
        fields = ['id', 'number', 'status', 'completion_date', 'note']


class ConstructionBlockSerializer(serializers.ModelSerializer):
    floors = BlockFloorSerializer(many=True, read_only=True)

    class Meta:
        model = ConstructionBlock
        fields = [
            'id', 'name',
            'total_floors', 'completed_floors', 'percentage',
            'delivery_date', 'status', 'order', 'floors',
        ]


class LotteryWinnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = LotteryWinner
        fields = [
            'id', 'lottery_name', 'winner_name', 'ticket_number',
            'prize', 'city', 'drawn_at', 'verification_hash',
        ]


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = [
            'id', 'kind', 'label', 'description',
            'icon_name', 'image_url', 'color',
            'hours_from', 'hours_to', 'capacity',
            'is_free', 'price_per_hour', 'order',
        ]


class NewsItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsItem
        fields = ['id', 'title', 'body', 'tone', 'kicker', 'published_at', 'is_pinned']


class MonthlyMediaSerializer(serializers.ModelSerializer):
    media_url = serializers.SerializerMethodField()

    class Meta:
        model = MonthlyMedia
        fields = [
            'id', 'title', 'month', 'media_type',
            'media_url', 'thumbnail_url', 'description', 'order',
        ]

    def get_media_url(self, obj: MonthlyMedia) -> str:
        url = obj.get_url()
        if url and obj.file:
            request = self.context.get('request')
            return request.build_absolute_uri(url) if request else url
        return url


class ProjectStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectStat
        fields = ['id', 'key', 'label', 'description', 'value', 'prefix', 'suffix', 'icon_name', 'order']
