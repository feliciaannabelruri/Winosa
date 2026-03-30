# UptimeRobot Setup Guide

Tidak ada kode yang perlu ditulis — setup dilakukan di dashboard UptimeRobot.

## Langkah Setup

1. Buka https://uptimerobot.com dan daftar (free tier: 50 monitors)

2. Klik "Add New Monitor"

3. Buat 2 monitor:

### Monitor 1: API Health
- Monitor Type: **HTTP(s)**
- Friendly Name: `Winosa Backend`
- URL: `https://your-backend.railway.app/health`
- Monitoring Interval: **5 minutes** (free tier minimum)
- Alert When: Down
- Alert Contacts: email kamu

### Monitor 2: Homepage
- Monitor Type: **HTTP(s)**
- Friendly Name: `Winosa Frontend`  
- URL: `https://winosa.com` (atau URL frontend)
- Monitoring Interval: 5 minutes

## Alert Setup (Email / Telegram)

Di "My Settings" → "Alert Contacts":
- Email: sudah otomatis
- Telegram: bisa tambah bot telegram untuk notif instant

## Status Page (Public)

UptimeRobot bisa generate public status page gratis:
- Settings → Status Pages → Create Status Page
- URL: `stats.uptimerobot.com/XXXXXXX`
- Bisa embed di website: "Service Status: All systems operational ✓"

## Verifikasi

Setelah setup, UptimeRobot akan ping /health setiap 5 menit.
Response yang dianggap "up": HTTP 200-299.

Health endpoint kamu sudah return 200 + JSON — langsung works.
