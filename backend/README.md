# Nuriddin Buildings — Backend (Django REST Framework)

Asosiy sahifa uchun ochiq API. Mijoz kabineti uchun emas (u Uysot CRM'ga ulanadi).

## Stack

- Django 5
- Django REST Framework
- django-cors-headers
- SQLite (dev) — keyinroq Postgres

## Boshlash

```bash
cd backend

# 1. Virtual environment
python -m venv venv
venv\Scripts\activate            # Windows
# source venv/bin/activate       # macOS/Linux

# 2. Bog'liqliklar
pip install -r requirements.txt

# 3. .env yaratish
copy .env.example .env           # Windows
# cp .env.example .env           # macOS/Linux

# 4. Migration
python manage.py migrate

# 5. Boshlang'ich ma'lumot (idempotent — qayta-qayta ishlatish mumkin)
python manage.py seed

# 6. Admin uchun foydalanuvchi
python manage.py createsuperuser

# 7. Server
python manage.py runserver
```

Server: **http://localhost:8000**

## Endpointlar

Hammasi `/api/v1/public/` ostida — autentifikatsiyasiz public.

| Method | URL | Tavsif |
|--------|-----|--------|
| GET | `/api/v1/public/landing/` | **Bitta so'rovda hamma narsa** (frontend uchun optimal) |
| GET | `/api/v1/public/projects/` | Loyihalar ro'yxati |
| GET | `/api/v1/public/projects/nurli-diyor-residence/` | Loyiha detali + renders |
| GET | `/api/v1/public/construction/` | 5 ta blok progress |
| GET | `/api/v1/public/lottery-winners/` | G'oliblar tarixi |
| GET | `/api/v1/public/amenities/` | 10 ta qulaylik |
| GET | `/api/v1/public/news/` | Yangiliklar |
| GET | `/api/v1/public/stats/` | Counter raqamlar |

Admin: **http://localhost:8000/admin/**

## CORS

Frontend (Vite) `http://localhost:5173` dan kelishi ruxsat etilgan. Production'da `CORS_ALLOWED_ORIGINS` env variable orqali yangilang.

## Yangi ma'lumot qo'shish

Ikki yo'l:
1. **Admin panel** — `http://localhost:8000/admin/` ga kiring va WYSIWYG bilan tahrirlang
2. **Seed kengaytirish** — `public/management/commands/seed.py` da array'ga qo'shing va `python manage.py seed` qayta ishga tushiring
