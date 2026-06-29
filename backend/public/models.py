"""
Public landing models — marketing sayt uchun DRF orqali ochilgan.

Tahrirlash qoidalari:
- Barcha maydonlar ataylab ommaviy — bu yerda mijozning maxfiy ma'lumotlari yo'q.
- Yangi modellar uchun: manage.py makemigrations public && migrate.
"""

from django.db import models


class Project(models.Model):
    """Asosiy turar-joy loyihasi (Nurli Diyor)."""

    name = models.CharField('Nomi', max_length=120)
    slug = models.SlugField('Slug', max_length=140, unique=True)
    tagline = models.CharField('Qisqa tavsif', max_length=240, blank=True)
    description = models.TextField('To\'liq tavsif', blank=True)

    address = models.CharField('Manzil', max_length=240, blank=True)
    location_label = models.CharField('Joylashuv belgisi', max_length=120, blank=True)

    block_count = models.PositiveIntegerField('Bloklar soni', default=5)
    floor_count = models.PositiveIntegerField('Qavatlar soni', default=9)
    apartment_count = models.PositiveIntegerField('Xonadonlar soni', default=0)

    construction_progress = models.PositiveSmallIntegerField('Qurilish foizi (0–100)', default=0)
    estimated_delivery = models.DateField('Taxminiy topshirish sanasi', null=True, blank=True)
    estimated_delivery_label = models.CharField('Topshirish yorlig\'i', max_length=80, blank=True)

    is_featured = models.BooleanField('Tanlangan', default=True)
    is_active = models.BooleanField('Faol', default=True)

    created_at = models.DateTimeField('Yaratilgan', auto_now_add=True)
    updated_at = models.DateTimeField('Yangilangan', auto_now=True)

    class Meta:
        ordering = ['-is_featured', 'name']
        verbose_name = 'Loyiha'
        verbose_name_plural = 'Loyihalar'

    def __str__(self) -> str:
        return self.name


class ProjectRender(models.Model):
    """Loyiha vitrinasidagi 3D render rasmlari."""

    project = models.ForeignKey(Project, verbose_name='Loyiha', related_name='renders', on_delete=models.CASCADE)
    image = models.ImageField('Rasm fayli', upload_to='renders/', blank=True, null=True)
    image_url = models.URLField('Tashqi URL', blank=True, help_text='Fayl yuklanmagan bo\'lsa ishlatiladi')
    caption = models.CharField('Izoh', max_length=160, blank=True)
    order = models.PositiveSmallIntegerField('Tartib', default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Render rasm'
        verbose_name_plural = 'Render rasmlar'

    def __str__(self) -> str:
        return f'{self.project.name} — render {self.order}'


class ConstructionBlock(models.Model):
    """Har bir blok bo\'yicha qurilish jarayoni (1-blok, 2-blok, ...)."""

    STATUS_CHOICES = [
        ('planned', 'Rejalashtirilgan'),
        ('active', 'Qurilmoqda'),
        ('completed', 'Tugatilgan'),
    ]

    project = models.ForeignKey(Project, verbose_name='Loyiha', related_name='blocks', on_delete=models.CASCADE)
    name = models.CharField('Blok nomi', max_length=40)
    total_floors = models.PositiveSmallIntegerField('Jami qavatlar', default=9)
    completed_floors = models.PositiveSmallIntegerField('Tugallangan qavatlar', default=0)
    percentage = models.PositiveSmallIntegerField('Foiz (0–100)', default=0)
    delivery_date = models.DateField('Topshirish sanasi', null=True, blank=True)
    status = models.CharField('Holat', max_length=12, choices=STATUS_CHOICES, default='active')
    order = models.PositiveSmallIntegerField('Tartib', default=0)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Qurilish bloki'
        verbose_name_plural = 'Qurilish bloklari'

    def save(self, *args, **kwargs):
        if self.total_floors > 0:
            self.percentage = round(self.completed_floors / self.total_floors * 100)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f'{self.project.name} · {self.name}'


class BlockFloor(models.Model):
    """Har bir blokdagi alohida qavatning qurilish holati."""

    STATUS_CHOICES = [
        ('done', 'Tugatilgan'),
        ('in_progress', 'Qurilmoqda'),
        ('not_started', 'Boshlanmagan'),
    ]

    block = models.ForeignKey(
        ConstructionBlock, related_name='floors',
        on_delete=models.CASCADE, verbose_name='Blok',
    )
    number = models.PositiveSmallIntegerField('Qavat raqami')
    status = models.CharField('Holat', max_length=16, choices=STATUS_CHOICES, default='not_started')
    completion_date = models.DateField('Tugatilgan sana', null=True, blank=True)
    note = models.CharField('Izoh', max_length=200, blank=True)

    class Meta:
        ordering = ['number']
        unique_together = [('block', 'number')]
        verbose_name = 'Qavat'
        verbose_name_plural = 'Qavatlar'

    def __str__(self) -> str:
        return f'{self.block.name} · {self.number}-qavat'


class LotteryWinner(models.Model):
    """Shaffoflik uchun ommaviy ko\'rsatiladigan omadli mijozlar."""

    lottery_name = models.CharField('Tanlов nomi', max_length=120)
    winner_name = models.CharField(
        'G\'olib ismi', max_length=120,
        help_text='Yopiq nom ishlatng, masalan: "Akbar A."',
    )
    ticket_number = models.CharField('Chipta raqami', max_length=20)
    prize = models.CharField('Sovrin', max_length=160)
    city = models.CharField('Shahar', max_length=80, blank=True)
    drawn_at = models.DateField('O\'tkazilgan sana')
    verification_hash = models.CharField('Tasdiqlash kodi (hash)', max_length=128, blank=True)

    class Meta:
        ordering = ['-drawn_at']
        verbose_name = 'Omadli mijoz'
        verbose_name_plural = 'Omadli mijozlar'

    def __str__(self) -> str:
        return f'{self.winner_name} — {self.prize}'


class Amenity(models.Model):
    """−1 qavatdagi 10 ta jamoat qulayligi."""

    KIND_CHOICES = [
        ('it_room', 'IT xonasi'),
        ('library', 'Kutubxona'),
        ('gym', 'Sport zali'),
        ('chess', 'Shaxmat xonasi'),
        ('billiard', 'Bilyard xonasi'),
        ('table_tennis', 'Tennis'),
        ('karaoke', 'Karaoke'),
        ('playstation', 'PlayStation xonasi'),
        ('piano', 'Pianino xonasi'),
        ('kids_playground', 'Bolalar maydonchasi'),
    ]

    kind = models.CharField('Tur', max_length=24, choices=KIND_CHOICES, unique=True)
    label = models.CharField('Nomi', max_length=80)
    description = models.CharField('Tavsif', max_length=240, blank=True)
    icon_name = models.CharField('Lucide ikonka nomi', max_length=40, blank=True)
    image_url = models.URLField('Rasm URL', blank=True)
    color = models.CharField('Rang (Tailwind klasslari)', max_length=80, blank=True)
    hours_from = models.PositiveSmallIntegerField('Ochilish vaqti (soat)', default=8)
    hours_to = models.PositiveSmallIntegerField('Yopilish vaqti (soat)', default=22)
    capacity = models.PositiveSmallIntegerField('Sig\'im (kishi)', default=8)
    is_free = models.BooleanField('Bepul', default=True)
    price_per_hour = models.PositiveIntegerField('Narx (soatiga, so\'m)', default=0)
    order = models.PositiveSmallIntegerField('Tartib', default=0)

    class Meta:
        ordering = ['order', 'label']
        verbose_name = 'Qulaylik'
        verbose_name_plural = 'Qulayliklar'

    def __str__(self) -> str:
        return self.label


class NewsItem(models.Model):
    """E\'lonlar va yangiliklar (jonli lenta va yangiliklar bo\'limida ko\'rinadi)."""

    TONE_CHOICES = [
        ('info', 'Ma\'lumot'),
        ('event', 'Tadbir'),
        ('celebration', 'Bayram'),
        ('warning', 'Ogohlantirish'),
    ]

    title = models.CharField('Sarlavha', max_length=160)
    body = models.TextField('Matn', blank=True)
    tone = models.CharField('Ohang', max_length=16, choices=TONE_CHOICES, default='info')
    kicker = models.CharField('Kicker (qisqa tag)', max_length=40, blank=True)
    published_at = models.DateTimeField('E\'lon qilingan vaqt')
    is_pinned = models.BooleanField('Yuqorida qoldirilsin', default=False)
    is_active = models.BooleanField('Faol', default=True)

    class Meta:
        ordering = ['-is_pinned', '-published_at']
        verbose_name = 'Yangilik'
        verbose_name_plural = 'Yangiliklar'

    def __str__(self) -> str:
        return self.title


class MonthlyMedia(models.Model):
    """Har oylik omadli mijoz tanlovi uchun video/rasm materiallari."""

    MEDIA_TYPE_CHOICES = [
        ('video', 'Video'),
        ('photo', 'Rasm'),
    ]

    title = models.CharField('Sarlavha', max_length=160)
    month = models.DateField('Oy', help_text='Oy boshi sanasi (1-kuni), masalan: 2026-06-01')
    media_type = models.CharField('Tur', max_length=8, choices=MEDIA_TYPE_CHOICES, default='video')
    file = models.FileField('Fayl', upload_to='monthly_media/', blank=True, null=True)
    url = models.URLField('Tashqi URL', blank=True, help_text='YouTube yoki CDN havolasi (fayl bo\'lmasa)')
    thumbnail_url = models.URLField('Muqova rasmi (URL)', blank=True)
    description = models.CharField('Tavsif', max_length=300, blank=True)
    is_active = models.BooleanField('Faol', default=True)
    order = models.PositiveSmallIntegerField('Tartib', default=0)

    created_at = models.DateTimeField('Yaratilgan', auto_now_add=True)

    class Meta:
        ordering = ['-month', 'order']
        verbose_name = 'Oylik media'
        verbose_name_plural = 'Oylik medialar'

    def get_url(self) -> str:
        if self.file:
            return self.file.url
        return self.url

    def __str__(self) -> str:
        return f'{self.month:%Y-%m} — {self.title}'


class ProjectStat(models.Model):
    """Landing sahifasidagi statistika raqamlari (1 loyiha, 9 qavat, ...)."""

    key = models.SlugField('Kalit', max_length=40, unique=True)
    label = models.CharField('Yorliq', max_length=80)
    description = models.CharField('Tavsif', max_length=200, blank=True)
    value = models.IntegerField('Qiymat', default=0)
    prefix = models.CharField('Prefiks', max_length=10, blank=True)
    suffix = models.CharField('Suffiks', max_length=10, blank=True)
    icon_name = models.CharField('Ikonka nomi', max_length=40, blank=True)
    order = models.PositiveSmallIntegerField('Tartib', default=0)

    class Meta:
        ordering = ['order', 'key']
        verbose_name = 'Statistika'
        verbose_name_plural = 'Statistikalar'

    def __str__(self) -> str:
        return f'{self.label} = {self.prefix}{self.value}{self.suffix}'
