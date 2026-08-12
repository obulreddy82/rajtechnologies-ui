# Raj Technologies — Test Cases

This document lists manual (QA) and automated test coverage for the Angular frontend.

**Prerequisites for manual tests**
- Frontend: `npm start` (default `http://localhost:4200`)
- Backend: Spring Boot API on `http://localhost:8070`
- Sample Excel: `public/Belgium_IT_Consultancy_Companies.xlsx`

**Run automated tests**
```bash
npm test
```

---

## 1. Header & Navigation

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| NAV-01 | Home link | Click **Home** in header | Navigates to `/` | High |
| NAV-02 | Employees link | Click **Employees** | Navigates to `/employee-list` | High |
| NAV-03 | Consultancy dropdown visible | Hover **Consultancy** | Submenu shows: Upload, Consultancy List, Add consultancy info | High |
| NAV-04 | Upload submenu (mouse) | Hover Consultancy → click **Upload** | Navigates to `/consultancy-upload` | High |
| NAV-05 | List submenu (mouse) | Hover Consultancy → click **Consultancy List** | Navigates to `/consultancy-list` | High |
| NAV-06 | Add submenu (mouse) | Hover Consultancy → click **Add consultancy info** | Navigates to `/consultancy-add` | High |
| NAV-07 | About Us link | Click **About Us** | Navigates to `/about-us` | Medium |
| NAV-08 | Contact Us link | Click **Contact Us** | Navigates to `/contact-us` | Medium |
| NAV-09 | Guest auth links | Sign out (if logged in) | Header shows **Sign Up** and **Sign In** | High |
| NAV-10 | Logged-in auth links | Sign in successfully | Header shows **My Profile** and **Sign Out** | High |
| NAV-11 | Mobile menu toggle | Resize to &lt; 900px, click hamburger | Nav opens/closes; submenu items visible | Medium |
| NAV-12 | Active route highlight | Visit `/consultancy-list` | **Consultancy List** link has active styling | Low |

---

## 2. Consultancy Upload (`/consultancy-upload`)

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| UP-01 | Page loads | Open `/consultancy-upload` | Title "Upload Consultancies", file picker visible | High |
| UP-02 | Select valid Excel | Choose `.xlsx` with correct columns | "Reading Excel file..." spinner, then preview table | High |
| UP-03 | Preview record count | Upload sample file | Preview shows record count and tab count | High |
| UP-04 | All sheets parsed | Use multi-tab Excel | Rows from all tabs appear in preview | High |
| UP-05 | Submit button visible | After successful parse | **Submit to Backend** button enabled | High |
| UP-06 | Submit to backend | Click **Submit to Backend** (backend running) | Upload spinner → "Process completed!" message | High |
| UP-07 | Submit without backend | Click submit with backend stopped | Error: upload failed / port 8070 message | High |
| UP-08 | Empty file / no rows | Upload file with no valid Company Name rows | Message: no valid records; submit disabled | Medium |
| UP-09 | Invalid file type | Upload non-Excel file | Error about invalid/unreadable file | Medium |
| UP-10 | Cancel re-upload | After success, upload another file | Previous messages cleared; new preview shown | Medium |
| UP-11 | List page link | Click **Consultancy List** footer link | Navigates to list page | Low |

**Expected Excel columns:** Company Name, Website, Address, Phone Number, Career / Jobs Link

---

## 3. Add Consultancy Info (`/consultancy-add`)

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| ADD-01 | Page loads | Open `/consultancy-add` | Form with 5 fields and submit button | High |
| ADD-02 | Required validation | Submit with empty Company Name | Error: "Company Name is required." | High |
| ADD-03 | Trim whitespace | Enter `"  Acme  "` as company name | Sends trimmed value to backend | Medium |
| ADD-04 | Successful add | Fill Company Name, submit (backend on) | Spinner → "Consultancy added successfully."; form cleared | High |
| ADD-05 | Backend error | Submit with backend off | Error message about port 8070 | High |
| ADD-06 | Optional fields empty | Only Company Name filled | Record saved with empty optional fields | Medium |
| ADD-07 | All fields filled | Fill all 5 fields and submit | All values stored; visible on list page | High |
| ADD-08 | List link | Click **Consultancy List** link | Navigates to `/consultancy-list` | Low |

---

## 4. Consultancy List (`/consultancy-list`)

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| LIST-01 | Load records | Open page (backend on) | Table shows consultancy rows | High |
| LIST-02 | Load failure | Open page (backend off) | Error message about port 8070 | High |
| LIST-03 | Refresh | Click **Refresh** | Data reloaded from API | Medium |
| LIST-04 | Search by company | Type company name in search | Table filters matching rows | High |
| LIST-05 | Search by website | Type part of website URL | Matching rows shown | Medium |
| LIST-06 | Clear search | Clear search box | Full list restored | Medium |
| LIST-07 | Sort ascending | Click **Company Name** header | Rows sorted A→Z; ↑ indicator | High |
| LIST-08 | Sort toggle | Click same column again | Sort direction toggles to desc (↓) | High |
| LIST-09 | Sort other column | Click **Website** header | Sorted by website; field indicator updates | Medium |
| LIST-10 | Edit row | Click **Edit** on a row | Row switches to inline input fields | High |
| LIST-11 | Cancel edit | Click **Cancel** while editing | Row returns to read-only view | Medium |
| LIST-12 | Update row | Edit fields, click **Update** | Success message; row shows new values | High |
| LIST-13 | Delete confirm | Click **Delete**, confirm dialog | Row removed; success message | High |
| LIST-14 | Delete cancel | Click **Delete**, cancel dialog | Row unchanged | Medium |
| LIST-15 | Upload Excel link | Click **Upload Excel** | Navigates to `/consultancy-upload` | Low |
| LIST-16 | Empty state | No records in DB | "No consultancy records found." | Medium |

---

## 5. Authentication

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| AUTH-01 | Sign in page | Open `/sign-in` | Login form visible | High |
| AUTH-02 | Valid sign in | Enter valid credentials | Redirect/profile; header shows logged-in links | High |
| AUTH-03 | Invalid sign in | Wrong password | Error shown; stays logged out | High |
| AUTH-04 | Profile guard | Open `/profile` while logged out | Redirect to `/sign-in` | High |
| AUTH-05 | Guest guard sign-in | Open `/sign-in` while logged in | Redirect to `/profile` | Medium |
| AUTH-06 | Guest guard sign-up | Open `/sign-up` while logged in | Redirect to `/profile` | Medium |
| AUTH-07 | Sign out | Click **Sign Out** | Session cleared; guest links in header | High |
| AUTH-08 | Session persistence | Sign in, refresh browser tab | Still logged in (sessionStorage) | Medium |

---

## 6. Other Pages

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| PAGE-01 | About Us | Open `/about-us` | Page renders without errors | Low |
| PAGE-02 | Contact Us | Open `/contact-us` | Page renders without errors | Low |
| PAGE-03 | Employee list | Open `/employee-list` | Employee list loads | Medium |
| PAGE-04 | Sign up | Open `/sign-up` | Registration form visible | Medium |
| PAGE-05 | Home | Open `/` | Home content / router outlet visible | Medium |

---

## 7. API Integration (Backend)

| ID | Endpoint | Method | Test | Expected |
|----|----------|--------|------|----------|
| API-01 | `/api/v1/consultancies` | GET | List page load | 200 + JSON array |
| API-02 | `/api/v1/consultancies/bulk` | POST | Upload / Add | 200 + saved records |
| API-03 | `/api/v1/consultancies/{id}` | PUT | List inline update | 200 + updated record |
| API-04 | `/api/v1/consultancies/{id}` | DELETE | List delete | 200/204 |
| API-05 | `/api/v1/signin` | POST | Sign in | 200 + user profile |

---

## 8. Automated Unit Tests (Vitest + Angular TestBed)

| Spec File | What It Tests |
|-----------|---------------|
| `src/app/services/consultancy.service.spec.ts` | HTTP GET/POST/PUT/DELETE to consultancy API |
| `src/app/guards/auth.guard.spec.ts` | `authGuard` and `guestGuard` redirect logic |
| `src/app/consultancy-add/consultancy-add.spec.ts` | Validation, submit success/error, form reset |
| `src/app/consultancy-upload/consultancy-upload.spec.ts` | Upload validation, bulk submit, error handling |
| `src/app/consultancy-list/consultancy-list.spec.ts` | Search, sort, edit, delete logic |
| `src/app/header/header.spec.ts` | Component creation, menu toggle |
| `src/app/app.spec.ts` | Root app bootstrap |

---

## 9. Regression Checklist (Release Smoke Test)

Run before each release:

- [ ] NAV-04, NAV-05, NAV-06 — Consultancy submenu mouse navigation
- [ ] UP-06 — Excel upload end-to-end
- [ ] ADD-04 — Manual add consultancy
- [ ] LIST-01, LIST-12, LIST-13 — List CRUD
- [ ] AUTH-02, AUTH-07 — Sign in / sign out
- [ ] `npm test` — All unit tests pass
- [ ] `npm run build` — Production build succeeds
