---
title: Winosa ML Service
emoji: 🤖
colorFrom: blue
colorTo: purple
sdk: docker
app_port: 7860
pinned: false
---

# Winosa ML Service

Blog recommendation service untuk Winosa platform.

## Endpoints

- GET /health
- POST /train
- GET /recommendations/<slug>?limit=3
- GET /trending?limit=5
- GET /stats
- POST /classify/service
- POST /classify/plan