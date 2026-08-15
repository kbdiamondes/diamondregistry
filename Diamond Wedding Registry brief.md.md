

---

# 🎁 Wedding Gift Registry — Product Brief

**Project:** ScaleFold Digital — Internal Build **Version:** 1.0 **Owner:** Keith & [Partner Name]

---

## 1. Overview

A private, shareable wedding gift registry web app styled like a lightweight e-commerce storefront. Guests browse gifts by category, claim one item to purchase as a gift, and self-identify with a privacy-redacted name. The couple manages the registry via a password-protected admin panel.

**Core problem it solves:** Eliminates double-gifting, keeps gift selection organized, and protects guest privacy publicly while still giving the couple full visibility.

---

## 2. User Roles

|Role|Access|Auth Method|
|---|---|---|
|**Guest**|Browse + claim gifts|No login. Name input on claim.|
|**Admin (Couple)**|Full CRUD on products + view real names|Password-protected. Single shared password is fine for MVP.|

---

## 3. Feature Specifications

### 3.1 — Public Registry Page (Guest View)

- **Header:** Wedding couple names + wedding date. Optional short welcome message.
- **Category Tabs:** Horizontal tab navigation. Clicking a tab filters products by that category. Default = "All" tab showing everything.
- **Product Card Grid:** Responsive grid (3 cols desktop / 2 cols tablet / 1 col mobile), each card contains:
    - Product image (cropped square or consistent aspect ratio)
    - Product name
    - Short description (truncated, expandable or tooltip on hover)
    - Price (optional field — couple may leave blank)
    - External link button → "View Product" (opens in new tab)
    - CTA button → **"Gift this to the couple"** (primary, branded color)

**Claimed State:**

- CTA button turns greyed out / disabled
- Button label changes to: `"Claimed by J** D**"` (redacted format, see §3.3)
- Clicking a claimed button shows a small toast/modal: `"This gift has already been claimed by J** D**"`
- Card gets a subtle visual treatment (e.g., faded overlay or "Claimed" badge) to signal unavailability at a glance

---

### 3.2 — Claim Flow (Guest)

**Step 1 — Confirm intent:** Guest clicks "Gift this to the couple" → Modal appears:

> _"You're about to claim [Product Name]. Please enter your name so we know who's getting this!"_ `[First Name]` `[Last Name]` input fields `[Confirm Claim]` button

**Step 2 — Submission:**

- On submit, product is marked claimed
- Guest's real full name is stored in the database (admin-visible)
- The public-facing display name is immediately redacted

**Step 3 — Confirmation:** Guest sees a success message:

> _"Thank you! You've claimed [Product Name] for Keith & [Partner]. 🎉"_

**Edge case — Race condition:** If two guests try to claim the same item simultaneously, only the first submission succeeds. The second receives an error:

> _"Someone just claimed this ahead of you! Please choose another gift."_

---

### 3.3 — Name Redaction Logic

**Rule:** Each word in the name → first character visible, rest replaced with `*`

|Real Name|Displayed As|
|---|---|
|John Doe|`J*** D**`|
|Maria Clara Santos|`M**** C**** S*****`|
|Al Yu|`A* Y*`|

- Single-character names stay as-is (e.g., "J" → "J")
- Redaction happens on submission, stored as computed display string
- Admin panel always shows the **real unredacted name**

---

### 3.4 — Admin Panel (Couple View)

**Access:** `/admin` route, protected by a simple password (hardcoded or env variable for MVP).

**Product Management:**

- Add product form with:
    - `Product Name` (text, required)
    - `Category` (dropdown of existing categories + option to create new)
    - `Product Image` (file upload or external image URL)
    - `External Link` (URL, optional)
    - `Description` (textarea, optional)
    - `Price` (text/number, optional)
- Edit existing products
- Delete products (with confirmation prompt)
- Drag-to-reorder products per category (nice-to-have, not MVP-blocking)

**Registry Overview:**

- Table view of all products showing:
    - Product name, category, claimed status
    - Real name of claimer (if claimed)
    - Date/time claimed
- Filter by: All / Claimed / Unclaimed
- Manual unclaim button per product (for corrections/mistakes)

---

## 4. Data Schema (Suggested)

**`products`**

|Field|Type|Notes|
|---|---|---|
|`id`|UUID|PK|
|`name`|String|Required|
|`description`|String|Optional|
|`price`|String|Optional, freeform|
|`image_url`|String|Uploaded or external|
|`external_link`|String|Optional|
|`category`|String|FK or plain string for MVP|
|`is_claimed`|Boolean|Default: false|
|`claimed_by_real`|String|Null until claimed|
|`claimed_by_display`|String|Redacted version|
|`claimed_at`|Timestamp|Null until claimed|
|`created_at`|Timestamp|Auto|

**`categories`** (optional separate table, or derive from products)

|Field|Type|
|---|---|
|`id`|UUID|
|`name`|String|
|`sort_order`|Integer|

---

## 5. Tech Stack Recommendation

|Layer|Recommendation|Notes|
|---|---|---|
|**Frontend**|React or Next.js|SSR optional; static is fine for MVP|
|**Backend/DB**|Supabase|Already in Keith's stack (used in ScaleFold)|
|**Hosting**|Cloudflare Pages|Already in Keith's stack|
|**Image Storage**|Supabase Storage|For uploaded product images|
|**Auth (Admin)**|Simple password check via env var or Supabase row-level|No OAuth needed for MVP|

---

## 6. UX & Design Direction

- **Tone:** Warm, celebratory, clean — not generic e-commerce
- **Palette:** Soft neutrals + 1 accent color (suggest couple's wedding color if known)
- **Typography:** Readable serif for headings, clean sans for body
- **Mobile-first:** Majority of guests will open this from a phone via shared link
- **No account creation for guests** — friction kills participation rate

---

## 7. Sharing & Distribution

- App lives at a single public URL (e.g., `gifts.yourdomain.com` or a Cloudflare Pages subdomain)
- No authentication wall for guests — link = access
- Couple shares the URL via invites, Viber, Instagram, etc.

---

## 8. Out of Scope (MVP)

- Payment processing (guests buy externally via the product link)
- Email notifications
- Guest accounts / login
- Multiple registry owners
- QR code generation (post-MVP)
- Gift messaging / notes from guest to couple

---

## 9. Success Criteria

- [ ] Guest can browse all products by category without friction
- [ ] Guest can claim a product in under 3 taps/clicks
- [ ] Claimed products are immediately locked and visually distinct
- [ ] No two guests can claim the same product
- [ ] Admin can add/edit/delete products and view real claimer names
- [ ] App is fully functional on mobile

---

That's a hand-off ready brief. Key things I added beyond your rough draft:

- **Race condition handling** — two people clicking simultaneously is a real edge case that'll cause a support headache on wedding day
- **Manual unclaim** in admin — guests make mistakes, you need an escape hatch
- **Data schema** — gives the AI team a concrete starting point, avoids back-and-forth on structure
- **Supabase + Cloudflare** — consistent with your existing stack so no new infra spin-up
- **Out of scope section** — prevents scope creep mid-build