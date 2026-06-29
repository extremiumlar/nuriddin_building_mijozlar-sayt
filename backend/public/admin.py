from django.contrib import admin
from django.utils.html import format_html

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


class BlockFloorInline(admin.TabularInline):
    model = BlockFloor
    extra = 0
    fields = ('number', 'status', 'completion_date', 'note')
    verbose_name = 'Qavat'
    verbose_name_plural = 'Qavatlar'
    ordering = ('number',)


class ProjectRenderInline(admin.TabularInline):
    model = ProjectRender
    extra = 1
    fields = ('order', 'image', 'image_url', 'caption')
    verbose_name = 'Render rasm'
    verbose_name_plural = 'Render rasmlar'


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'qurilish_foizi', 'is_featured', 'is_active', 'updated_at')
    list_filter = ('is_featured', 'is_active')
    list_editable = ('is_featured', 'is_active')
    search_fields = ('name', 'slug', 'tagline')
    search_help_text = 'Nomi, slug yoki qisqa tavsif bo\'yicha qidiring'
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at')
    inlines = [ProjectRenderInline]
    fieldsets = (
        ('Asosiy ma\'lumot', {
            'fields': ('name', 'slug', 'tagline', 'description'),
        }),
        ('Joylashuv', {
            'fields': ('address', 'location_label'),
        }),
        ('Raqamlar', {
            'fields': ('block_count', 'floor_count', 'apartment_count'),
        }),
        ('Qurilish holati', {
            'fields': ('construction_progress', 'estimated_delivery', 'estimated_delivery_label'),
        }),
        ('Ko\'rinish', {
            'fields': ('is_featured', 'is_active'),
        }),
        ('Sanalar', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    @admin.display(description='Qurilish foizi')
    def qurilish_foizi(self, obj):
        return f'{obj.construction_progress}%'


@admin.register(ConstructionBlock)
class ConstructionBlockAdmin(admin.ModelAdmin):
    list_display = ('loyiha', 'name', 'holat_belgisi', 'percentage', 'status', 'delivery_date', 'order')
    list_filter = ('status', 'project')
    list_editable = ('status', 'order')
    search_fields = ('name', 'project__name')
    search_help_text = 'Blok nomi yoki loyiha nomi bo\'yicha qidiring'
    readonly_fields = ('percentage',)
    inlines = [BlockFloorInline]
    fieldsets = (
        (None, {
            'fields': ('project', 'name', 'order'),
        }),
        ('Qurilish holati', {
            'fields': ('total_floors', 'completed_floors', 'percentage', 'status', 'delivery_date'),
            'description': 'Foiz completed_floors / total_floors dan avtomatik hisoblanadi.',
        }),
    )

    @admin.display(description='Loyiha')
    def loyiha(self, obj):
        return obj.project.name

    @admin.display(description='Holat')
    def holat_belgisi(self, obj):
        colors = {'planned': '#6b7280', 'active': '#2563eb', 'completed': '#16a34a'}
        labels = {'planned': 'Rejalashtirilgan', 'active': 'Qurilmoqda', 'completed': 'Tugatilgan'}
        color = colors.get(obj.status, '#6b7280')
        label = labels.get(obj.status, obj.status)
        return format_html(
            '<span style="color:{}; font-weight:600">{}</span>', color, label
        )


@admin.register(LotteryWinner)
class LotteryWinnerAdmin(admin.ModelAdmin):
    list_display = ('winner_name', 'lottery_name', 'prize', 'city', 'drawn_at')
    list_filter = ('drawn_at', 'city')
    search_fields = ('winner_name', 'ticket_number', 'lottery_name')
    search_help_text = 'G\'olib ismi, chipta raqami yoki tanlов nomi bo\'yicha qidiring'
    date_hierarchy = 'drawn_at'
    fieldsets = (
        ('G\'olib', {
            'fields': ('winner_name', 'city'),
        }),
        ('Tanlов', {
            'fields': ('lottery_name', 'ticket_number', 'drawn_at'),
        }),
        ('Sovrin va tasdiqlash', {
            'fields': ('prize', 'verification_hash'),
        }),
    )


@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ('label', 'kind', 'narx_belgisi', 'capacity', 'ish_vaqti', 'order')
    list_filter = ('is_free',)
    list_editable = ('order',)
    search_fields = ('label', 'description')
    search_help_text = 'Qulaylik nomi yoki tavsif bo\'yicha qidiring'
    fieldsets = (
        ('Asosiy', {
            'fields': ('kind', 'label', 'description', 'icon_name', 'image_url', 'color'),
        }),
        ('Jadval va narx', {
            'fields': ('hours_from', 'hours_to', 'capacity', 'is_free', 'price_per_hour'),
        }),
        ('Ko\'rinish', {
            'fields': ('order',),
        }),
    )

    @admin.display(description='Narx')
    def narx_belgisi(self, obj):
        if obj.is_free:
            return format_html('<span style="color:#16a34a;font-weight:600">Bepul</span>')
        return f'{obj.price_per_hour:,} so\'m/soat'

    @admin.display(description='Ish vaqti')
    def ish_vaqti(self, obj):
        return f'{obj.hours_from}:00 – {obj.hours_to}:00'


@admin.register(NewsItem)
class NewsItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'ohang_belgisi', 'is_pinned', 'is_active', 'published_at')
    list_filter = ('tone', 'is_pinned', 'is_active')
    list_editable = ('is_pinned', 'is_active')
    search_fields = ('title', 'body', 'kicker')
    search_help_text = 'Sarlavha, matn yoki kicker bo\'yicha qidiring'
    date_hierarchy = 'published_at'
    fieldsets = (
        ('Mazmun', {
            'fields': ('title', 'kicker', 'body'),
        }),
        ('Ko\'rinish', {
            'fields': ('tone', 'is_pinned', 'is_active', 'published_at'),
        }),
    )

    @admin.display(description='Ohang')
    def ohang_belgisi(self, obj):
        icons = {
            'info': ('ℹ️', 'Ma\'lumot'),
            'event': ('📅', 'Tadbir'),
            'celebration': ('🎉', 'Bayram'),
            'warning': ('⚠️', 'Ogohlantirish'),
        }
        icon, label = icons.get(obj.tone, ('•', obj.tone))
        return f'{icon} {label}'


@admin.register(MonthlyMedia)
class MonthlyMediaAdmin(admin.ModelAdmin):
    list_display = ('title', 'month', 'tur_belgisi', 'havola_belgisi', 'is_active', 'order')
    list_filter = ('media_type', 'is_active')
    list_editable = ('is_active', 'order')
    search_fields = ('title', 'description')
    search_help_text = 'Sarlavha yoki tavsif bo\'yicha qidiring'
    date_hierarchy = 'month'
    fieldsets = (
        ('Asosiy', {
            'fields': ('title', 'month', 'media_type', 'description'),
        }),
        ('Media fayl', {
            'fields': ('file', 'url', 'thumbnail_url'),
            'description': 'Fayl yuklang YOKI tashqi URL kiriting (ikkalasi emas).',
        }),
        ('Ko\'rinish', {
            'fields': ('is_active', 'order'),
        }),
    )

    @admin.display(description='Tur')
    def tur_belgisi(self, obj):
        if obj.media_type == 'video':
            return '🎬 Video'
        return '🖼️ Rasm'

    @admin.display(description='Havola')
    def havola_belgisi(self, obj):
        link = obj.get_url()
        if not link:
            return '—'
        return format_html('<a href="{}" target="_blank">Ochish ↗</a>', link)


@admin.register(ProjectStat)
class ProjectStatAdmin(admin.ModelAdmin):
    list_display = ('label', 'korinish', 'order')
    list_editable = ('order',)
    search_fields = ('label', 'key')
    search_help_text = 'Yorliq yoki kalit so\'z bo\'yicha qidiring'
    fieldsets = (
        ('Asosiy', {
            'fields': ('key', 'label', 'description', 'icon_name'),
        }),
        ('Qiymat', {
            'fields': ('value', 'prefix', 'suffix'),
        }),
        ('Ko\'rinish', {
            'fields': ('order',),
        }),
    )

    @admin.display(description='Ko\'rinishi')
    def korinish(self, obj):
        return f'{obj.prefix}{obj.value}{obj.suffix}'


# ── Admin sayt sarlavhasi ────────────────────────────────────────────────────
admin.site.site_header = 'Nuriddin Buildings — Boshqaruv paneli'
admin.site.site_title = 'Nuriddin Buildings'
admin.site.index_title = 'Xush kelibsiz!'
