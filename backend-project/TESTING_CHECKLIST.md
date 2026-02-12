# Week 3 - Admin CRUD API Testing Checklist

## Admin Services

### Create Service
- [ ] POST /api/admin/services dengan data valid
- [ ] POST dengan slug yang sudah ada (expect error)
- [ ] POST tanpa auth token (expect 401)
- [ ] POST dengan data invalid - title pendek (expect validation error)
- [ ] POST dengan data invalid - description pendek (expect validation error)

### Get Services
- [ ] GET /api/admin/services dengan auth token
- [ ] GET tanpa auth token (expect 401)

### Update Service
- [ ] PUT /api/admin/services/:id dengan data valid
- [ ] PUT dengan ID yang tidak ada (expect 404)
- [ ] PUT dengan slug yang sudah dipakai service lain (expect error)
- [ ] PUT tanpa auth token (expect 401)

### Delete Service
- [ ] DELETE /api/admin/services/:id dengan ID valid
- [ ] DELETE dengan ID yang tidak ada (expect 404)
- [ ] DELETE tanpa auth token (expect 401)

---

## Admin Portfolio

### Create Portfolio
- [ ] POST /api/admin/portfolio dengan data valid
- [ ] POST dengan slug yang sudah ada (expect error)
- [ ] POST tanpa auth token (expect 401)
- [ ] POST dengan URL invalid untuk image (expect validation error)
- [ ] POST dengan URL invalid untuk projectUrl (expect validation error)
- [ ] POST dengan title & description pendek (expect validation error)

### Get Portfolios
- [ ] GET /api/admin/portfolio dengan auth token
- [ ] GET dengan pagination ?page=1&limit=5
- [ ] GET dengan filter ?category=web
- [ ] GET tanpa auth token (expect 401)

### Update Portfolio
- [ ] PUT /api/admin/portfolio/:id dengan data valid
- [ ] PUT dengan ID yang tidak ada (expect 404)
- [ ] PUT tanpa auth token (expect 401)

### Delete Portfolio
- [ ] DELETE /api/admin/portfolio/:id dengan ID valid
- [ ] DELETE dengan ID yang tidak ada (expect 404)
- [ ] DELETE tanpa auth token (expect 401)

---

## Admin Blog

### Create Blog
- [ ] POST /api/admin/blog dengan data valid
- [ ] POST dengan slug yang sudah ada (expect error)
- [ ] POST tanpa auth token (expect 401)
- [ ] POST dengan content pendek <50 chars (expect validation error)
- [ ] POST dengan excerpt pendek <20 chars (expect validation error)
- [ ] POST dengan image URL invalid (expect validation error)

### Get Blogs
- [ ] GET /api/admin/blog dengan auth token
- [ ] GET dengan pagination ?page=1&limit=5
- [ ] GET dengan filter ?isPublished=true
- [ ] GET dengan filter ?author=John
- [ ] GET tanpa auth token (expect 401)

### Get Blog by ID
- [ ] GET /api/admin/blog/:id dengan ID valid
- [ ] GET dengan ID invalid (expect 404)
- [ ] GET tanpa auth token (expect 401)

### Update Blog
- [ ] PUT /api/admin/blog/:id dengan data valid
- [ ] PUT dengan ID yang tidak ada (expect 404)
- [ ] PUT tanpa auth token (expect 401)

### Delete Blog
- [ ] DELETE /api/admin/blog/:id dengan ID valid
- [ ] DELETE dengan ID yang tidak ada (expect 404)
- [ ] DELETE tanpa auth token (expect 401)

---

## Error Handling

- [ ] Test invalid ObjectId (expect "Resource not found")
- [ ] Test route not found (expect 404)
- [ ] Test expired token (expect 401)
- [ ] Test invalid token (expect 401)

---

## Authentication

- [ ] POST /api/auth/register dengan data valid
- [ ] POST /api/auth/register dengan email yang sudah ada (expect error)
- [ ] POST /api/auth/login dengan credentials benar
- [ ] POST /api/auth/login dengan credentials salah (expect 401)
- [ ] GET /api/auth/me dengan token valid
- [ ] GET /api/auth/me tanpa token (expect 401)
- [ ] POST /api/auth/logout dengan token valid

---

## Multi-Language

- [ ] POST /api/contact?lang=id (expect Indonesian response)
- [ ] POST /api/contact?lang=en (expect English response)
- [ ] POST /api/contact?lang=nl (expect Dutch response)
- [ ] POST /api/newsletter?lang=id
- [ ] POST /api/auth/login?lang=id

---

## Status: __/__ Tests Passed