"""
Seed the public DB with Nuriddin Buildings + Nurli Diyor reference data.

Usage:
    python manage.py seed

Idempotent — re-run safely; existing rows update, missing ones are created.
"""

from datetime import date, datetime, timezone

from django.core.management.base import BaseCommand

from public.models import (
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


AMENITIES = [
    ('it_room', 'IT xonasi', "Zamonaviy kompyuterlar bilan jihozlangan zal",
     'Monitor', 8, 22, 12, True, 0,
     'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80&auto=format&fit=crop',
     'text-sky-600 bg-sky-50'),
    ('library', 'Kutubxona', "Mutolaa uchun shinam maskan, jim joy",
     'Library', 9, 22, 20, True, 0,
     'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80&auto=format&fit=crop',
     'text-amber-700 bg-amber-50'),
    ('gym', 'Sport zali', "Professional trenajyorlar, yopiq zal",
     'Dumbbell', 6, 23, 15, True, 0,
     'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80&auto=format&fit=crop',
     'text-red-600 bg-red-50'),
    ('chess', 'Shaxmat xonasi', "Intellektual hordiq, professional shaxmat to'plamlari",
     'Crown', 10, 22, 8, True, 0,
     'https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=1200&q=80&auto=format&fit=crop',
     'text-stone-700 bg-stone-100'),
    ('billiard', 'Bilyard xonasi', "Maroqli vaqt o'tkazish uchun, 2 ta stol",
     'Diamond', 10, 23, 8, True, 0,
     'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=1200&q=80&auto=format&fit=crop',
     'text-purple-600 bg-purple-50'),
    ('table_tennis', 'Tennis', "Faol dam olish zonasi, 4 ta stol",
     'Activity', 9, 22, 8, True, 0,
     'https://images.unsplash.com/photo-1611251135345-18c56206b863?w=1200&q=80&auto=format&fit=crop',
     'text-orange-600 bg-orange-50'),
    ('karaoke', 'Karaoke', "Ko'ngilochar markaz, professional tovush tizimi",
     'Mic2', 14, 23, 12, False, 80_000,
     'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&q=80&auto=format&fit=crop',
     'text-pink-600 bg-pink-50'),
    ('playstation', 'PlayStation xonasi', "O'yin ixlosmandlari uchun, PS5 + 4K TV",
     'Gamepad2', 10, 23, 6, False, 50_000,
     'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1200&q=80&auto=format&fit=crop',
     'text-indigo-600 bg-indigo-50'),
    ('piano', 'Pianino xonasi', "Musiqiy ijod maskani, akustik pianino",
     'Music', 10, 22, 4, True, 0,
     'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=1200&q=80&auto=format&fit=crop',
     'text-teal-600 bg-teal-50'),
    ('kids_playground', 'Bolalar maydonchasi', "Qishki va yozgi zonalar, nazoratchi bor",
     'Baby', 9, 20, 20, True, 0,
     'https://images.unsplash.com/photo-1593103916129-87e179a70c1f?w=1200&q=80&auto=format&fit=crop',
     'text-rose-600 bg-rose-50'),
]

LOTTERY_WINNERS = [
    ('May oylik omadli mijoz', 'Akbar A.', '#0341', 'Samsung Galaxy S24', 'Toshkent', date(2026, 5, 30),
     '0x4a7f9bc2e8d35f1a92bd5e7c08f4a3b6'),
    ('Aprel oylik omadli mijoz', 'Dilshod K.', '#0218', "50,000,000 so'm", 'Samarqand', date(2026, 4, 30),
     '0x8c1e3d7b4a92f5e6c0d8b3a7f1e9c4d2'),
    ('Mart oylik omadli mijoz', 'Marjona Y.', '#0179', 'MacBook Air M3', 'Toshkent', date(2026, 3, 30),
     '0x2f9b6d4e8c7a1f3b5d0e9c8a4f7b2d1e'),
]

NEWS = [
    ('Basseyn bugundan boshlab faol — birinchi hafta bepul', 'celebration', 'Yangilik',
     'Mijozlar uchun 25m basseyn ochildi. Birinchi hafta bepul foydalanish.'),
    ('Iyun omadli mijoz tanlovi · bosh sovrin iPhone 16 Pro', 'event', 'Aksiya',
     "Har oylik to'lov amalga oshirilganda avtomatik chipta beriladi."),
    ('Haftalik bosh injener videosi har juma kuni', 'info', 'Hisobot',
     'Qurilish jarayoni haqida shaffof hisobotlar.'),
    ('320+ mamnun mijoz portal orqali kuzatadi', 'info', 'Statistika',
     '98% mamnunlik koeffitsienti.'),
    ('2 ta yangi blok rejada — 2027-yil ochilishi', 'info', 'Loyiha',
     'Hozirda Nurli Diyor — birinchi loyihamiz.'),
]

# (key, label, desc, value, prefix, suffix, icon, order)
STATS = [
    ('first_project', 'Birinchi loyiha', 'Nurli Diyor Residence',   1,    '',  '',      'Building',      0),
    ('floors',        'Qavat',           'zamonaviy arxitektura',    9,    '',  ' qavat','Layers',        1),
    ('amenities',     'Maxsus qulaylik', '−1 qavatda',              10,    '',  ' ta',   'Sparkles',      2),
    ('delivery_year', 'Topshirish',      '2027 oxiri / 2028 boshi', 2027,  '',  '-yil',  'CalendarCheck', 3),
]

BLOCKS = [
    ('1-blok', 9, 7, date(2027, 12, 31), 'active',    0),
    ('2-blok', 9, 5, date(2028, 1, 15),  'active',    1),
    ('3-blok', 9, 1, date(2028, 6, 30),  'active',    2),
    ('4-blok', 9, 0, date(2028, 8, 30),  'planned',   3),
    ('5-blok', 9, 0, date(2028, 12, 31), 'planned',   4),
]

# completed_floors soni BLOCKS dagi bilan mos bo'lsin
BLOCK_FLOORS = {
    '1-blok': [
        (1, 'done',        date(2025, 8,  10), ''),
        (2, 'done',        date(2025, 11,  5), ''),
        (3, 'done',        date(2026, 2,  12), ''),
        (4, 'done',        date(2026, 4,  20), ''),
        (5, 'done',        date(2026, 5,  15), ''),
        (6, 'done',        date(2026, 6,   1), ''),
        (7, 'done',        date(2026, 6,  20), ''),
        (8, 'in_progress', None,               'Devor terish bosqichida'),
        (9, 'not_started', None,               ''),
    ],
    '2-blok': [
        (1, 'done',        date(2025, 12, 20), ''),
        (2, 'done',        date(2026, 3,  10), ''),
        (3, 'done',        date(2026, 5,   5), ''),
        (4, 'done',        date(2026, 6,  10), ''),
        (5, 'done',        date(2026, 6,  25), ''),
        (6, 'in_progress', None,               'Tom pardozlash'),
        (7, 'not_started', None,               ''),
        (8, 'not_started', None,               ''),
        (9, 'not_started', None,               ''),
    ],
    '3-blok': [
        (1, 'in_progress', None, 'Poydevor betonlash'),
        *[(i, 'not_started', None, '') for i in range(2, 10)],
    ],
    '4-blok': [
        *[(i, 'not_started', None, '') for i in range(1, 10)],
    ],
    '5-blok': [
        *[(i, 'not_started', None, '') for i in range(1, 10)],
    ],
}

MONTHLY_MEDIA = [
    (
        'May 2026 — Omadli mijoz tantanasi',
        date(2026, 5, 1),
        'video',
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        '',
        "May oyida iPhone 15 Pro yutib olgan g'olib bilan suhbat va tantana",
        0,
    ),
    (
        "Aprel 2026 — G'olib bilan uchrashuv",
        date(2026, 4, 1),
        'video',
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        '',
        "Aprel oylik omadli mijoz — 50 mln so'm yutdi",
        1,
    ),
    (
        'Mart 2026 — MacBook Air M3 topshirish marosimi',
        date(2026, 3, 1),
        'photo',
        '',
        '',
        'Mart oylik omadli mijoz MacBook Air M3 sovrinini qabul qildi',
        2,
    ),
]

# Render rasmlari admin paneldan image maydoni orqali yuklanadi.
# image_url bo'sh — fayl yuklanmagan holda frontend ko'rsatmaydi.
RENDERS = [
    ('', "Asosiy fasad · aerial ko'rinish",           1),
    ('', 'Hovli · bolalar zonasi',                    2),
    ('', 'Yon fasad · landshaft',                     3),
    ("", "Burchak · ko'cha sathidan",                 4),
    ('', 'Orqa · quyosh panellari + sport maydoni',   5),
]


class Command(BaseCommand):
    help = 'Seed Nuriddin Buildings reference data (idempotent).'

    def handle(self, *args, **options):
        self.stdout.write('Seeding...')

        # ── Project ──────────────────────────────────────────────────────────
        project, _ = Project.objects.update_or_create(
            slug='nurli-diyor-residence',
            defaults={
                'name': 'Nurli Diyor Residence',
                'tagline': "Uy emas, orzu quramiz",
                'description': "Qadriyatli qo'shnilar — hammaga sotilmaydi. Premium turar-joy majmuasi.",
                'address': 'Lakatsiya, Toshkent shahri',
                'location_label': 'Lakatsiya',
                'block_count': 5,
                'floor_count': 9,
                'apartment_count': 0,
                'construction_progress': 72,
                'estimated_delivery': date(2027, 12, 31),
                'estimated_delivery_label': '2027 oxiri / 2028 boshi',
                'is_featured': True,
                'is_active': True,
            },
        )

        # ── Renders ───────────────────────────────────────────────────────────
        ProjectRender.objects.filter(project=project).delete()
        for image_url, caption, order in RENDERS:
            ProjectRender.objects.create(
                project=project, image_url=image_url, caption=caption, order=order,
            )

        # ── Blocks + Floors ───────────────────────────────────────────────────
        ConstructionBlock.objects.filter(project=project).delete()
        for name, total_floors, completed_floors, delivery, status, order in BLOCKS:
            block_obj = ConstructionBlock.objects.create(
                project=project,
                name=name,
                total_floors=total_floors,
                completed_floors=completed_floors,
                # percentage avtomatik save() da hisoblanadi
                delivery_date=delivery,
                status=status,
                order=order,
            )
            for num, fl_status, comp_date, note in BLOCK_FLOORS.get(name, []):
                BlockFloor.objects.create(
                    block=block_obj,
                    number=num,
                    status=fl_status,
                    completion_date=comp_date,
                    note=note,
                )

        # ── Amenities ─────────────────────────────────────────────────────────
        kind_list = [a[0] for a in AMENITIES]
        for kind, label, desc, icon, hf, ht, cap, free, price, image, color in AMENITIES:
            Amenity.objects.update_or_create(
                kind=kind,
                defaults={
                    'label': label, 'description': desc, 'icon_name': icon,
                    'hours_from': hf, 'hours_to': ht, 'capacity': cap,
                    'is_free': free, 'price_per_hour': price,
                    'image_url': image, 'color': color,
                    'order': kind_list.index(kind),
                },
            )

        # ── Lottery winners ───────────────────────────────────────────────────
        # To'liq qayta yaratish — ma'lumot ommaviy, nozik yo'q
        LotteryWinner.objects.all().delete()
        for lottery_name, winner, ticket, prize, city, drawn, hash_ in LOTTERY_WINNERS:
            LotteryWinner.objects.create(
                lottery_name=lottery_name,
                winner_name=winner,
                ticket_number=ticket,
                prize=prize,
                city=city,
                drawn_at=drawn,
                verification_hash=hash_,
            )

        # ── News ─────────────────────────────────────────────────────────────
        # is_pinned ni KIRMAYDI — admin belgilagan qiymat saqlansin
        for title, tone, kicker, body in NEWS:
            NewsItem.objects.update_or_create(
                title=title,
                defaults={
                    'body': body,
                    'tone': tone,
                    'kicker': kicker,
                    'published_at': datetime.now(timezone.utc),
                    'is_active': True,
                },
            )

        # ── Stats ─────────────────────────────────────────────────────────────
        for key, label, desc, value, prefix, suffix, icon, order in STATS:
            ProjectStat.objects.update_or_create(
                key=key,
                defaults={
                    'label': label,
                    'description': desc,
                    'value': value,
                    'prefix': prefix,
                    'suffix': suffix,
                    'icon_name': icon,
                    'order': order,
                },
            )

        # ── Monthly Media ─────────────────────────────────────────────────────
        MonthlyMedia.objects.all().delete()
        for title, month, mtype, url, thumb, desc, order in MONTHLY_MEDIA:
            MonthlyMedia.objects.create(
                title=title,
                month=month,
                media_type=mtype,
                url=url,
                thumbnail_url=thumb,
                description=desc,
                order=order,
                is_active=True,
            )

        self.stdout.write(self.style.SUCCESS('Seed complete.'))
