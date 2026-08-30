# -*- coding: utf-8 -*-
"""Generate docs/demo.svg : an animated walkthrough of the Grandeur Hotel app.
Scenes and data mirror the real running application (seed / live DB)."""
import html, io, os

W, H = 1000, 712
CX0, CY0, CX1, CY1 = 20, 62, 980, 648          # clipped content area
SIDE_W = 232                                    # admin sidebar width inside content
MAIN_X = CX0 + SIDE_W

def esc(s): return html.escape(str(s), quote=True)

def T(x, y, s, txt, fill="#1f2d38", weight=None, anchor=None, family=None, ls=None, opacity=None, inner=""):
    a = f' text-anchor="{anchor}"' if anchor else ""
    w = f' font-weight="{weight}"' if weight else ""
    fam = f' font-family="{family}"' if family else ""
    l = f' letter-spacing="{ls}"' if ls else ""
    o = f' opacity="{opacity}"' if opacity is not None else ""
    return f'<text x="{x}" y="{y}" font-size="{s}" fill="{fill}"{w}{a}{fam}{l}{o}>{esc(txt)}{inner}</text>'

def clip(txt, colw, px_per_char=5.3):
    s = str(txt)
    m = max(3, int(colw / px_per_char))
    return s if len(s) <= m else s[:m - 1] + "…"

def rect(x, y, w, h, fill, rx=0, stroke=None, sw=1, opacity=None):
    st = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    o = f' opacity="{opacity}"' if opacity is not None else ""
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"{st}{o}/>'

SERIF = "Georgia, 'Times New Roman', serif"
SANS = "'Segoe UI', system-ui, sans-serif"

TEAL, NAVY, GOLD = "#0E7490", "#082F49", "#c9a24b"
CREAM, CREAMD = "#f4f8fa", "#e2edf1"
TXT, TXTL = "#1f2d38", "#5b6b76"
ADMIN_BG, HEADBG, ABORDER, ROWALT = "#eef4f7", "#e6f1f5", "#d6e6ec", "#fafcfd"

def status_pill(x, y, label):
    c = {
        "paid": ("#dcfce7", "#15803d"), "completed": ("#dcfce7", "#15803d"),
        "pending": ("#fef9c3", "#a16207"), "in_progress": ("#fef9c3", "#a16207"),
        "failed": ("#fee2e2", "#b91c1c"),
        "refunded": ("#e2e8f0", "#475569"), "not_started": ("#e2e8f0", "#475569"),
    }.get(label, ("#e2e8f0", "#475569"))
    txt = label.replace("_", " ")
    wpx = 8 + len(txt) * 6.2
    return rect(x, y - 12, wpx, 17, c[0], rx=8) + T(x + 6, y, 10.5, txt, fill=c[1], weight=700)

# ---------------------------------------------------------------- public chrome
NAV = [("Home", "/"), ("Rooms & Suites", "/rooms"), ("About", "/about"),
       ("Gallery", "/gallery"), ("Contact", "/contact")]

def navbar(active):
    o = [rect(CX0, CY0, 960, 46, "url(#grad)")]
    o.append(T(44, CY0 + 29, 20, "Grand", fill="#fff", weight=700, family=SERIF,
               inner='<tspan fill="rgba(255,255,255,0.55)">eur</tspan>'))
    x = 470
    for label, path in NAV:
        col = "#fff" if path == active else "rgba(255,255,255,0.72)"
        wt = 700 if path == active else 400
        o.append(T(x, CY0 + 29, 12.5, label, fill=col, weight=wt))
        if path == active:
            o.append(rect(x, CY0 + 34, len(label) * 6.6, 2, GOLD))
        x += len(label) * 7.2 + 22
    o.append(rect(x + 4, CY0 + 12, 92, 24, "rgba(255,255,255,0.9)", rx=12))
    o.append(T(x + 50, CY0 + 29, 11.5, "Book Now", fill=NAVY, weight=700, anchor="middle"))
    return "".join(o)

def page_hero(title, crumb, active=None):
    o = [navbar(active)]
    y = CY0 + 46
    o.append(rect(CX0, y, 960, 82, "url(#grad)"))
    o.append(T(500, y + 26, 11, "GRANDEUR HOTEL", fill=GOLD, weight=700, anchor="middle", ls="3"))
    o.append(T(500, y + 56, 26, title, fill="#fff", weight=700, anchor="middle", family=SERIF))
    o.append(T(500, y + 76, 11, crumb, fill="rgba(255,255,255,0.8)", anchor="middle"))
    return "".join(o), y + 82

def section_header(cx, y, eyebrow, h2):
    return (T(cx, y, 11.5, eyebrow.upper(), fill=TEAL, weight=700, anchor="middle", ls="2") +
            T(cx, y + 30, 24, h2, fill=NAVY, weight=700, anchor="middle", family=SERIF))

# --------------------------------------------------------------------- SCENE 1
def scene_home():
    o = [rect(CX0, CY0, 960, CY1 - CY0, CREAM)]
    o.append(navbar("/"))
    o.append(rect(CX0, CY0 + 46, 960, 300, "url(#gradsoft)"))
    o.append(T(70, 170, 12, "WELCOME TO GRANDEUR HOTEL", fill="#fff", weight=700, ls="2"))
    o.append(T(70, 214, 34, "An Address of ", fill="#fff", weight=700, family=SERIF,
               inner='<tspan font-style="italic">Timeless</tspan><tspan> Luxury</tspan>'))
    o.append(T(70, 248, 13, "Refined stays, heartfelt service and a landmark address in the heart of the city.",
               fill="rgba(255,255,255,0.85)"))
    o.append(rect(70, 270, 180, 42, GOLD, rx=5) + T(160, 296, 13, "Reserve Your Stay", fill=NAVY, weight=700, anchor="middle"))
    o.append(rect(264, 270, 150, 42, "none", rx=5, stroke="#fff") + T(339, 296, 13, "Explore Rooms", fill="#fff", anchor="middle"))
    # booking card (overlaps hero bottom, like the real site)
    o.append(rect(70, 330, 860, 132, "#fff", rx=4, stroke=CREAMD))
    fields = [("CHECK IN", "2026-08-30"), ("CHECK OUT", "2026-09-02"), ("GUESTS", "2 Guests"), ("ROOM TYPE", "Any Room Type")]
    fx = 94
    for lab, val in fields:
        o.append(T(fx, 364, 10.5, lab, fill=TXTL, weight=700, ls="1"))
        o.append(T(fx, 400, 12.5, val, fill=TXT))
        o.append(rect(fx, 410, 140, 2, CREAMD))
        fx += 156
    o.append(rect(fx, 374, 148, 42, "url(#grad)", rx=4) + T(fx + 74, 401, 12, "Check Availability", fill="#fff", weight=700, anchor="middle"))
    # featured rooms on the cream section
    o.append(section_header(500, 492, "Handpicked", "Featured Rooms & Suites"))
    for i, (name, rtype, price, guests, booked) in enumerate(ROOMS[:3]):
        cx = 70 + i * 297
        o.append(rect(cx, 540, 276, 94, "#fff", rx=10, stroke=CREAMD))
        o.append(rect(cx, 540, 92, 94, CARD_TINTS[i], rx=10))
        o.append(T(cx + 106, 570, 14, name, fill=NAVY, weight=700, family=SERIF))
        o.append(T(cx + 106, 590, 10.5, rtype, fill=TXTL))
        o.append(T(cx + 106, 610, 11, f"${price} / night", fill=TEAL, weight=700))
    return "".join(o)

# --------------------------------------------------------------------- SCENE 2
ROOMS = [("Room 101", "Deluxe Room", 180, 2, False), ("Room 103", "Family Room", 260, 5, False),
         ("Room 203", "Executive Suite", 320, 3, False), ("Room 301", "Garden Villa", 410, 4, True),
         ("Room 303", "Honeymoon Suite", 480, 2, False), ("Room PH1", "Presidential Suite", 750, 6, False)]
CARD_TINTS = ["#dbe7ec", "#e7dfce", "#d9e4d7", "#e3d9df", "#dde3ee", "#e9e2d2"]

def scene_rooms():
    hero, y = page_hero("Rooms & Suites", "Home  /  Rooms & Suites", "/rooms")
    o = [rect(CX0, CY0, 960, CY1 - CY0, "#fff"), hero]
    o.append(section_header(500, y + 20, "Find Your Perfect Stay", "Choose From Our Signature Rooms"))
    gx, gy, cw, ch = 70, y + 72, 290, 168
    for i, (name, rtype, price, guests, booked) in enumerate(ROOMS):
        cx = gx + (i % 3) * (cw + 15)
        cy = gy + (i // 3) * (ch + 14)
        o.append(rect(cx, cy, cw, ch, "#fff", rx=10, stroke=CREAMD))
        o.append(rect(cx, cy, cw, 80, CARD_TINTS[i], rx=10))
        o.append(rect(cx + 14, cy + 48, 100, 22, NAVY, rx=4) +
                 T(cx + 20, cy + 63, 11, f"${price} ", fill="#fff", weight=700,
                   inner='<tspan font-size="8" fill="rgba(255,255,255,0.7)">/ night</tspan>'))
        if booked:
            o.append(rect(cx + cw - 92, cy + 12, 80, 20, "rgba(8,47,73,0.85)", rx=4) +
                     T(cx + cw - 52, cy + 26, 9.5, "Fully Booked", fill="#fff", weight=700, anchor="middle"))
        o.append(T(cx + 18, cy + 104, 15, name, fill=NAVY, weight=700, family=SERIF))
        o.append(T(cx + 18, cy + 124, 11, rtype, fill=TXTL))
        o.append(T(cx + 18, cy + 144, 10.5, f"• {guests} Guests   • Free Wi-Fi", fill=TEAL))
        o.append(T(cx + 18, cy + 160, 9.5, "VIEW DETAILS", fill=NAVY, weight=700, ls="0.5"))
        o.append(rect(cx + cw - 88, cy + 146, 74, 20, NAVY, rx=4) + T(cx + cw - 51, cy + 160, 10, "Book Now", fill="#fff", weight=700, anchor="middle"))
    return "".join(o)

# --------------------------------------------------------------------- SCENE 3
def scene_booking():
    o = [rect(CX0, CY0, 960, CY1 - CY0, CREAM)]
    o.append(navbar(None))
    o.append(T(70, CY0 + 92, 22, "Reservation Details", fill=NAVY, weight=700, family=SERIF))
    o.append(T(70, CY0 + 116, 12, "Pick your dates and we'll check live room availability for you.", fill=TXTL))
    fx, fy = 70, CY0 + 138
    o.append(rect(fx, fy, 470, 372, "#fff", rx=10, stroke=CREAMD))
    o.append(T(fx + 24, fy + 30, 10.5, "CHECK-IN DATE", fill=TXTL, weight=700, ls="1"))
    o.append(rect(fx + 24, fy + 40, 300, 40, "#fff", rx=6, stroke=TEAL, sw=2))
    o.append(T(fx + 40, fy + 66, 14, "Thu, 14 Aug 2025", fill=TXT))
    # calendar popup
    px, py = fx + 24, fy + 92
    o.append(rect(px, py, 330, 252, "#fff", rx=10, stroke=CREAMD))
    o.append(T(px + 20, py + 30, 14, "August 2025", fill=NAVY, weight=700))
    o.append(T(px + 278, py + 31, 16, "‹", fill=NAVY) + T(px + 306, py + 31, 16, "›", fill=NAVY))
    wd = ["S", "M", "T", "W", "T", "F", "S"]
    for j, d in enumerate(wd):
        o.append(T(px + 28 + j * 40, py + 56, 11, d, fill="#64748b", weight=700, anchor="middle"))
    grid = [["", "", "", "", "", "1", "2"], ["3", "4", "5", "6", "7", "8", "9"],
            ["10", "11", "12", "13", "14", "15", "16"], ["17", "18", "19", "20", "21", "22", "23"],
            ["24", "25", "26", "27", "28", "29", "30"], ["31", "", "", "", "", "", ""]]
    for r, week in enumerate(grid):
        for c, day in enumerate(week):
            if not day:
                continue
            dx, dy = px + 28 + c * 40, py + 84 + r * 30
            if day == "14":
                o.append(f'<circle cx="{dx}" cy="{dy-4}" r="15" fill="{TEAL}"/>')
                o.append(T(dx, dy, 13, day, fill="#fff", weight=700, anchor="middle", family="Consolas, monospace"))
            else:
                o.append(T(dx, dy, 13, day, fill=TXT, anchor="middle", family="Consolas, monospace"))
    # summary card (real room 203)
    sx = fx + 495
    o.append(rect(sx, fy, 365, 372, NAVY, rx=10))
    o.append(T(sx + 24, fy + 36, 16, "Room 203 · Executive Suite", fill="#fff", weight=700, family=SERIF))
    o.append(T(sx + 24, fy + 62, 12, "$320 × 3 nights", fill="#9fb6c2"))
    for k, (lab, val) in enumerate([("Subtotal", "$960.00"), ("Taxes (10%)", "$96.00")]):
        o.append(T(sx + 24, fy + 96 + k * 26, 12.5, lab, fill="#9fb6c2"))
        o.append(T(sx + 341, fy + 96 + k * 26, 12.5, val, fill="#fff", anchor="end"))
    o.append(f'<line x1="{sx+24}" y1="{fy+150}" x2="{sx+341}" y2="{fy+150}" stroke="#1d4a63"/>')
    o.append(T(sx + 24, fy + 180, 15, "Total", fill=GOLD, weight=700))
    o.append(T(sx + 341, fy + 180, 15, "$1,056.00", fill=GOLD, weight=700, anchor="end"))
    o.append(rect(sx + 24, fy + 300, 317, 44, "url(#grad)", rx=6) +
             T(sx + 182, fy + 327, 14, "Confirm Reservation", fill="#fff", weight=700, anchor="middle"))
    return "".join(o)

# --------------------------------------------------------------------- SCENE 4
SPA = [("Grandeur Signature Massage", "80 min", 160), ("Hot Stone Therapy", "90 min", 185),
       ("Radiance Facial", "60 min", 140), ("Couples Retreat", "120 min", 320),
       ("Ayurvedic Abhyanga", "75 min", 150), ("Moroccan Hammam", "70 min", 130)]
SPA_ICONS = ["", "", "", "", "", ""]

def scene_spa():
    hero, y = page_hero("Spa & Wellness", "Home  /  Spa & Wellness", "/spa")
    o = [rect(CX0, CY0, 960, CY1 - CY0, "#fff"), hero]
    o.append(section_header(500, y + 20, "Signature Treatments", "Massages, Facials & Rituals"))
    gx, gy, cw, ch = 70, y + 72, 290, 168
    for i, (nm, dur, price) in enumerate(SPA):
        cx = gx + (i % 3) * (cw + 15)
        cy = gy + (i // 3) * (ch + 14)
        o.append(rect(cx, cy, cw, ch, CREAM, rx=10, stroke=CREAMD))
        o.append(f'<circle cx="{cx+38}" cy="{cy+40}" r="20" fill="#e0f2f7"/>')
        o.append(f'<circle cx="{cx+38}" cy="{cy+40}" r="7" fill="{TEAL}"/>')
        o.append(T(cx + 70, cy + 38, 14, clip(nm, cw - 80), fill=NAVY, weight=700, family=SERIF))
        o.append(T(cx + 70, cy + 58, 12, f"{dur} · ${price}", fill=TEAL, weight=700))
        o.append(T(cx + 20, cy + 92, 11, "A tailored ritual with warm aromatic oils,", fill=TXTL))
        o.append(T(cx + 20, cy + 110, 11, "expert pressure and a calming finish.", fill=TXTL))
        o.append(T(cx + 20, cy + 144, 10, "BOOK TREATMENT", fill=TEAL, weight=700, ls="0.5"))
    return "".join(o)

# --------------------------------------------------------------------- SCENE 5
DINING = [("Azure", "Modern European · Fine Dining", "Dinner · 6:30pm – 11pm"),
          ("Saffron", "Indian & Pan-Asian", "Lunch & Dinner · 12pm – 11pm"),
          ("The Terrace", "All-Day Dining · Buffet", "6am – midnight"),
          ("Grandeur Lobby Bar", "Cocktails & Small Plates", "Daily · 11am – 1am"),
          ("In-Room Dining", "24-Hour Service", "Round the clock")]

def scene_dining():
    hero, y = page_hero("Dining", "Home  /  Dining", "/dining")
    o = [rect(CX0, CY0, 960, CY1 - CY0, "#fff"), hero]
    o.append(section_header(500, y + 20, "Five Ways to Dine", "Restaurants & Bars"))
    gx, gy, cw, ch = 70, y + 72, 290, 168
    for i, (nm, cuisine, hours) in enumerate(DINING):
        cx = gx + (i % 3) * (cw + 15)
        cy = gy + (i // 3) * (ch + 14)
        o.append(rect(cx, cy, cw, ch, CREAM, rx=10, stroke=CREAMD))
        o.append(rect(cx, cy, cw, 56, CARD_TINTS[i], rx=10))
        o.append(T(cx + 18, cy + 88, 15, nm, fill=NAVY, weight=700, family=SERIF))
        o.append(T(cx + 18, cy + 108, 11.5, cuisine, fill=TEAL, weight=700))
        o.append(T(cx + 18, cy + 128, 11, hours, fill=NAVY))
        o.append(T(cx + 18, cy + 150, 10.5, "Open to hotel guests & visitors", fill=TXTL))
    return "".join(o)

# --------------------------------------------------------------------- SCENE 6
GALLERY = ["Grand Facade", "Deluxe Room", "Executive Suite", "Fine Dining", "Luxury Spa",
           "Infinity Pool", "Grand Lobby", "Presidential Suite", "Garden Villa"]

def scene_gallery():
    hero, y = page_hero("Gallery", "Home  /  Gallery", "/gallery")
    o = [rect(CX0, CY0, 960, CY1 - CY0, "#fff"), hero]
    o.append(section_header(500, y + 20, "Take a Look Inside", "Moments Captured at Grandeur"))
    gx, gy, cw, ch = 70, y + 72, 290, 172
    for i, label in enumerate(GALLERY[:6]):
        cx = gx + (i % 3) * (cw + 15)
        cy = gy + (i // 3) * (ch + 14)
        o.append(rect(cx, cy, cw, ch, CARD_TINTS[i], rx=10))
        o.append(rect(cx, cy + ch - 34, cw, 34, "rgba(8,47,73,0.72)", rx=0))
        o.append(T(cx + 16, cy + ch - 12, 12, label, fill="#fff", weight=700))
    return "".join(o)

# --------------------------------------------------------------------- SCENE 7
def scene_about():
    hero, y = page_hero("About Grandeur Hotel", "Home  /  About", "/about")
    o = [rect(CX0, CY0, 960, CY1 - CY0, "#fff"), hero]
    o.append(rect(70, y + 40, 360, 250, CREAM, rx=10, stroke=CREAMD))
    o.append(rect(88, y + 58, 150, 214, "#dbe7ec", rx=6))
    o.append(rect(250, y + 58, 162, 100, "#e7dfce", rx=6))
    o.append(rect(250, y + 172, 162, 100, "#d9e4d7", rx=6))
    o.append(rect(70, y + 246, 96, 60, NAVY, rx=8) + T(118, y + 274, 20, "25+", fill="#fff", weight=700, anchor="middle") +
             T(118, y + 292, 9, "Years", fill="rgba(255,255,255,0.8)", anchor="middle"))
    tx = 470
    o.append(T(tx, y + 66, 11.5, "SINCE 2001", fill=TEAL, weight=700, ls="2"))
    o.append(T(tx, y + 100, 23, "A Legacy Built on", fill=NAVY, weight=700, family=SERIF))
    o.append(T(tx, y + 130, 23, "Genuine Hospitality", fill=NAVY, weight=700, family=SERIF))
    for k, line in enumerate([
        "Grandeur Hotel opened over two decades ago with a simple",
        "mission: a home away from home where every guest feels",
        "truly valued. A single boutique property has grown into a",
        "landmark destination — without losing the personal touch."]):
        o.append(T(tx, y + 162 + k * 20, 12, line, fill=TXTL))
    o.append(rect(tx, y + 232, 150, 40, NAVY, rx=5) + T(tx + 75, y + 257, 12, "Book Your Stay", fill="#fff", weight=700, anchor="middle"))
    # our values row
    vy = y + 300
    o.append(section_header(500, vy, "Our Values", "What Guides Everything We Do"))
    vals = [("Genuine Care", "Every guest is treated like family."),
            ("Uncompromising Quality", "Every detail held to the highest standard."),
            ("Sustainable Luxury", "Eco-conscious without losing comfort.")]
    for i, (h, d) in enumerate(vals):
        vx = 70 + i * 297
        o.append(rect(vx, vy + 46, 276, 92, CREAM, rx=10, stroke=CREAMD))
        o.append(f'<circle cx="{vx+30}" cy="{vy+76}" r="12" fill="#e0f2f7"/><circle cx="{vx+30}" cy="{vy+76}" r="5" fill="{TEAL}"/>')
        o.append(T(vx + 52, vy + 74, 12.5, h, fill=NAVY, weight=700))
        o.append(T(vx + 52, vy + 94, 10, d, fill=TXTL))
    return "".join(o)

# --------------------------------------------------------------------- SCENE 8
def scene_contact():
    hero, y = page_hero("Contact Us", "Home  /  Contact", "/contact")
    o = [rect(CX0, CY0, 960, CY1 - CY0, "#fff"), hero]
    o.append(rect(70, y + 40, 360, 300, "url(#grad)", rx=10))
    o.append(T(94, y + 74, 17, "Let's Start a Conversation", fill="#fff", weight=700, family=SERIF))
    items = [("", "Our Location", "123 Grandeur Avenue, Metropolis"),
             ("", "Phone Number", "+1 (555) 123-4567"),
             ("", "Email Address", "info@grandeurhotel.com"),
             ("", "Front Desk", "Open 24 hours, 7 days a week")]
    for k, (_, hd, tx) in enumerate(items):
        yy = y + 108 + k * 52
        o.append(f'<circle cx="106" cy="{yy}" r="14" fill="rgba(255,255,255,0.16)"/>')
        o.append(T(130, yy - 4, 12, hd, fill="#fff", weight=700))
        o.append(T(130, yy + 14, 11, tx, fill="rgba(255,255,255,0.8)"))
    fx = 470
    o.append(rect(fx, y + 40, 460, 300, "#fff", rx=10, stroke=CREAMD))
    pairs = [("Full Name", "Email Address"), ("Phone Number", "Subject")]
    for r, (l1, l2) in enumerate(pairs):
        yy = y + 74 + r * 62
        for c, lab in enumerate((l1, l2)):
            xx = fx + 24 + c * 214
            o.append(T(xx, yy, 10, lab.upper(), fill=TXTL, weight=700, ls="0.5"))
            o.append(rect(xx, yy + 8, 196, 34, CREAM, rx=6, stroke=CREAMD))
    o.append(T(fx + 24, y + 210, 10, "MESSAGE", fill=TXTL, weight=700, ls="0.5"))
    o.append(rect(fx + 24, y + 218, 410, 54, CREAM, rx=6, stroke=CREAMD))
    o.append(rect(fx + 24, y + 284, 410, 40, "url(#grad)", rx=6) + T(fx + 229, y + 309, 13, "Send Message", fill="#fff", weight=700, anchor="middle"))
    return "".join(o)

# ---------------------------------------------------------------- admin chrome
NAVGROUPS = [
    (None, ["Dashboard"]),
    ("PROPERTY", ["Floors", "Room Types", "Amenities", "Rooms"]),
    ("GUESTS", ["Reservations", "Bookings", "Payments", "Reviews"]),
    ("FRONT DESK", ["Contact Forms", "Feedbacks"]),
    ("STAFF", ["Departments", "Staff Roles", "Employees", "Work Types", "Work Assignments"]),
    ("ACCESS", ["Users"]),
]

def admin_sidebar(active):
    o = [rect(CX0, CY0, SIDE_W, CY1 - CY0, "url(#gradV)")]
    o.append(T(CX0 + 22, CY0 + 34, 16, "Grandeur Admin", fill="#fff", weight=700))
    o.append(f'<line x1="{CX0+22}" y1="{CY0+46}" x2="{CX0+SIDE_W-18}" y2="{CY0+46}" stroke="rgba(255,255,255,0.16)"/>')
    yy = CY0 + 68
    for label, items in NAVGROUPS:
        if label:
            o.append(T(CX0 + 22, yy, 9, label, fill="rgba(255,255,255,0.5)", weight=700, ls="1"))
            yy += 16
        for it in items:
            if it == active:
                o.append(rect(CX0 + 12, yy - 13, SIDE_W - 24, 20, "rgba(255,255,255,0.18)", rx=6))
                o.append(T(CX0 + 24, yy, 11.5, it, fill="#fff", weight=700))
            else:
                o.append(T(CX0 + 24, yy, 11.5, it, fill="rgba(255,255,255,0.8)"))
            yy += 20
        yy += 8
    return "".join(o)

def admin_topbar():
    o = [rect(MAIN_X, CY0, CX1 - MAIN_X, 44, "#fff", stroke=ABORDER)]
    o.append(rect(CX1 - 190, CY0 + 9, 170, 26, "#fff", rx=13, stroke=ABORDER))
    o.append(f'<circle cx="{CX1-172}" cy="{CY0+22}" r="11" fill="url(#grad)"/>')
    o.append(T(CX1 - 172, CY0 + 26, 9, "VG", fill="#fff", weight=700, anchor="middle"))
    o.append(T(CX1 - 154, CY0 + 26, 11, "Varshitha GA", fill=TXT, weight=600))
    o.append(f'<path d="M{CX1-44} {CY0+19} L{CX1-36} {CY0+19} L{CX1-40} {CY0+25} Z" fill="{TXTL}"/>')
    return "".join(o)

def admin_table(active, title, add_label, search_ph, headers, rows, status_col, total, pages):
    o = [rect(CX0, CY0, 960, CY1 - CY0, ADMIN_BG), admin_sidebar(active), admin_topbar()]
    mx = MAIN_X + 22
    o.append(T(mx, CY0 + 78, 21, title, fill=NAVY, weight=700, family=SERIF))
    o.append(rect(mx, CY0 + 86, 42, 3, TEAL))
    o.append(rect(CX1 - 360, CY0 + 62, 210, 32, "#fff", rx=6, stroke=ABORDER))
    o.append(T(CX1 - 344, CY0 + 82, 11, search_ph, fill="#9db6bf"))
    o.append(rect(CX1 - 138, CY0 + 62, 118, 32, "url(#grad)", rx=6) + T(CX1 - 79, CY0 + 82, 11, add_label, fill="#fff", weight=700, anchor="middle"))
    tx, ty, tw = mx, CY0 + 104, CX1 - 20 - mx
    o.append(rect(tx, ty, tw, 34 + len(rows) * 30 + 4, "#fff", rx=10, stroke=ABORDER))
    ncol = len(headers) + 1
    colw = tw / ncol
    o.append(rect(tx, ty, tw, 34, HEADBG, rx=10))
    for i, hd in enumerate(headers + ["ACTIONS"]):
        o.append(T(tx + 14 + i * colw, ty + 22, 9.5, hd.upper(), fill=NAVY, weight=700, ls="0.5"))
    ry = ty + 34
    for r, row in enumerate(rows):
        if r % 2:
            o.append(rect(tx, ry, tw, 30, ROWALT))
        for i, cell in enumerate(list(row) + [None]):
            cxx = tx + 14 + i * colw
            if i == len(row):
                o.append(rect(cxx, ry + 7, 38, 16, "#fff", rx=4, stroke=ABORDER) + T(cxx + 6, ry + 19, 9, "Edit", fill=TEAL, weight=700))
                o.append(rect(cxx + 44, ry + 7, 46, 16, "#fff", rx=4, stroke=ABORDER) + T(cxx + 50, ry + 19, 9, "Delete", fill="#d6455d", weight=700))
            elif status_col is not None and i == status_col:
                o.append(status_pill(cxx, ry + 19, str(cell)))
            else:
                o.append(T(cxx, ry + 19, 10.5, clip(cell, colw - 16), fill=TXT))
        o.append(f'<line x1="{tx}" y1="{ry+30}" x2="{tx+tw}" y2="{ry+30}" stroke="#e9f2f5"/>')
        ry += 30
    o.append(rect(tx, ry + 12, tw, 38, "#fff", rx=10, stroke=ABORDER))
    o.append(T(tx + 16, ry + 35, 11, f"Page 1 of {pages} · {total} total", fill=TXTL))
    o.append(rect(tx + tw - 150, ry + 20, 66, 22, "#fff", rx=5, stroke=ABORDER) + T(tx + tw - 117, ry + 35, 10, "Previous", fill="#9db6bf", anchor="middle"))
    o.append(rect(tx + tw - 78, ry + 20, 58, 22, "#fff", rx=5, stroke=ABORDER) + T(tx + tw - 49, ry + 35, 10, "Next", fill=TEAL, weight=700, anchor="middle"))
    return "".join(o)

# --------------------------------------------------------------------- SCENE 9
def scene_login():
    o = [rect(CX0, CY0, 960, CY1 - CY0, "url(#grad)")]
    cw, ch = 360, 320
    cx, cy = CX0 + (960 - cw) / 2, CY0 + (CY1 - CY0 - ch) / 2
    o.append(rect(cx, cy, cw, ch, "#fff", rx=18))
    o.append(T(cx + 32, cy + 46, 20, "Grandeur Admin", fill=NAVY, weight=700, family=SERIF))
    o.append(T(cx + 32, cy + 70, 12, "Sign in to manage the hotel.", fill="#64748b"))
    for k, (lab, val) in enumerate([("USERNAME", "admin"), ("PASSWORD", "••••••••")]):
        yy = cy + 104 + k * 62
        o.append(T(cx + 32, yy, 10, lab, fill=TXTL, weight=700, ls="0.5"))
        o.append(rect(cx + 32, yy + 10, 296, 36, "#f8fafc", rx=6, stroke="#e2e8f0"))
        o.append(T(cx + 46, yy + 33, 12.5, val, fill=TXT))
    o.append(rect(cx + 32, cy + 236, 296, 42, "url(#grad)", rx=6) + T(cx + 180, cy + 263, 13, "Sign in", fill="#fff", weight=700, anchor="middle"))
    o.append(T(cx + 180, cy + 296, 11, "Don't have an account?  Sign up", fill="#64748b", anchor="middle"))
    return "".join(o)

# -------------------------------------------------------------------- SCENE 10
MODULES = [("Floors", "Building floors & wings"), ("Room Types", "Categories & descriptions"),
           ("Amenities", "In-room facilities"), ("Rooms", "Inventory, pricing, status"),
           ("Reservations", "Upcoming guest holds"), ("Bookings", "Confirmed stays"),
           ("Payments", "Transactions & status"), ("Reviews", "Guest ratings"),
           ("Contact Forms", "Enquiries from the site"), ("Feedback", "Guest suggestions"),
           ("Departments", "Operational teams"), ("Staff Roles", "Job titles"),
           ("Employees", "Team directory"), ("Work Types", "Maintenance categories"),
           ("Work Assignments", "Scheduled jobs"), ("Users", "Admin & staff accounts")]

def scene_dashboard():
    o = [rect(CX0, CY0, 960, CY1 - CY0, ADMIN_BG), admin_sidebar("Dashboard"), admin_topbar()]
    mx = MAIN_X + 22
    o.append(rect(mx, CY0 + 60, CX1 - 20 - mx, 66, "url(#grad)", rx=12))
    o.append(T(mx + 22, CY0 + 90, 17, "Welcome, Varshitha GA", fill="#fff", weight=700))
    o.append(T(mx + 22, CY0 + 112, 11, "Manage every part of the hotel from here. Pick a section to get started.", fill="rgba(255,255,255,0.82)"))
    gx, gy = mx, CY0 + 142
    cw = (CX1 - 20 - mx - 3 * 12) / 4
    ch = 74
    for i, (nm, desc) in enumerate(MODULES):
        cxx = gx + (i % 4) * (cw + 12)
        cyy = gy + (i // 4) * (ch + 12)
        o.append(rect(cxx, cyy, cw, ch, "#fff", rx=10, stroke=ABORDER))
        o.append(T(cxx + 14, cyy + 30, 12.5, nm, fill=NAVY, weight=700))
        o.append(T(cxx + 14, cyy + 50, 9.5, desc, fill=TXTL))
    return "".join(o)

# ---------------------------------------------------------- admin table scenes
def scene_reservations():
    rows = [
        ("1", "Aarav Sharma", "aarav.sharma@example.com", "2026-09-01", "2026-09-04", "570", "No"),
        ("2", "Priya Nair", "priya.nair@example.com", "2026-09-06", "2026-09-10", "2740", "No"),
        ("3", "John Carter", "john.carter@example.com", "2026-08-29", "2026-08-31", "1120", "No"),
        ("4", "Mei Lin", "mei.lin@example.com", "2026-08-17", "2026-08-20", "540", "No"),
        ("5", "Rohit Verma", "rohit.verma@example.com", "2026-09-02", "2026-09-05", "2250", "Yes"),
    ]
    return admin_table("Reservations", "Reservations", "+ Add Reservation", "Search reservations...",
                       ["ID", "Guest", "Email", "Check-in", "Check-out", "Total", "Canceled"], rows, None, 5, 1)

def scene_bookings():
    rows = [
        ("1", "Emily Stone", "2", "2026-08-24", "2026-08-26", "330"),
        ("2", "Carlos Mendez", "6", "2026-08-07", "2026-08-09", "665"),
        ("3", "Fatima Ali", "3", "2026-08-28", "2026-08-31", "750"),
        ("4", "Liam O'Brien", "5", "2026-08-26", "2026-08-29", "570"),
        ("5", "Sofia Rossi", "11", "2026-09-08", "2026-09-11", "1495"),
        ("6", "Kenji Tanaka", "9", "2026-07-28", "2026-08-02", "2300"),
    ]
    return admin_table("Bookings", "Bookings", "+ Add Booking", "Search bookings...",
                       ["ID", "Guest", "Room ID", "Check-in", "Check-out", "Total"], rows, None, 6, 1)

def scene_payments():
    rows = [
        ("1", "1", "330", "card", "paid", "TXN-1001"),
        ("2", "2", "665", "cash", "paid", "TXN-1002"),
        ("3", "3", "750", "upi", "pending", "TXN-1003"),
        ("4", "4", "570", "card", "failed", "TXN-1004"),
        ("5", "5", "1495", "bank_transfer", "paid", "TXN-1005"),
        ("6", "6", "2300", "card", "refunded", "TXN-1006"),
    ]
    return admin_table("Payments", "Payments", "+ Add Payment", "Search by reference...",
                       ["ID", "Booking", "Amount", "Method", "Status", "Reference"], rows, 4, 6, 1)

def scene_employees():
    rows = [
        ("1", "Nadia Okoro", "nadia.okoro@grandeurhotel.com", "+1 555 0301", "1", "1"),
        ("2", "Sam Whitfield", "sam.whitfield@grandeurhotel.com", "+1 555 0302", "1", "2"),
        ("3", "Ivy Chen", "ivy.chen@grandeurhotel.com", "+1 555 0303", "1", "2"),
        ("4", "Diego Alvarez", "diego.alvarez@grandeurhotel.com", "+1 555 0304", "2", "3"),
        ("5", "Marta Kowalski", "marta.kowalski@grandeurhotel.com", "+1 555 0305", "2", "3"),
        ("6", "Ben Carter", "ben.carter@grandeurhotel.com", "+1 555 0306", "2", "3"),
        ("7", "Pierre Dubois", "pierre.dubois@grandeurhotel.com", "+1 555 0307", "3", "4"),
        ("8", "Lucia Romano", "lucia.romano@grandeurhotel.com", "+1 555 0308", "3", "5"),
        ("9", "Omar Haddad", "omar.haddad@grandeurhotel.com", "+1 555 0309", "4", "6"),
        ("10", "Grace Park", "grace.park@grandeurhotel.com", "+1 555 0310", "5", "1"),
    ]
    return admin_table("Employees", "Employees", "+ Add Employee", "Search employees...",
                       ["ID", "Name", "Email", "Phone", "Department", "Role"], rows, None, 10, 1)

def scene_workassign():
    rows = [
        ("1", "1", "2026-08-26", "2026-08-27", "completed"),
        ("2", "2", "2026-08-28", "2026-08-28", "not_started"),
        ("3", "3", "2026-08-27", "2026-08-27", "in_progress"),
        ("4", "4", "2026-08-24", "2026-08-25", "completed"),
        ("5", "5", "2026-08-27", "2026-08-27", "in_progress"),
    ]
    return admin_table("Work Assignments", "Work Assignments", "+ Add Assignment", "Search by status...",
                       ["ID", "Work Type", "Start", "End", "Status"], rows, 4, 5, 1)

# --------------------------------------------------------------------- assemble
SCENES = [
    ("localhost:5173/", "Public site — hero and live availability search", scene_home),
    ("localhost:5173/rooms", "Rooms & Suites — live inventory from the API", scene_rooms),
    ("localhost:5173/booking?room=6", "Booking — built-in calendar picker with live pricing", scene_booking),
    ("localhost:5173/spa", "Spa & Wellness — treatment menu", scene_spa),
    ("localhost:5173/dining", "Dining — restaurants & bars", scene_dining),
    ("localhost:5173/gallery", "Gallery", scene_gallery),
    ("localhost:5173/about", "About — the hotel story", scene_about),
    ("localhost:5173/contact", "Contact — enquiry form & details", scene_contact),
    ("localhost:5173/admin/login", "Admin sign-in (JWT) — sign-up also available", scene_login),
    ("localhost:5173/admin", "Admin dashboard — all 16 modules", scene_dashboard),
    ("localhost:5173/admin/reservations", "Reservations — search, add, edit, delete", scene_reservations),
    ("localhost:5173/admin/bookings", "Bookings — sorted by id ascending", scene_bookings),
    ("localhost:5173/admin/payments", "Payments — method & status per booking", scene_payments),
    ("localhost:5173/admin/employees", "Employees — directory with department & role", scene_employees),
    ("localhost:5173/admin/work-assignments", "Work Assignments — scheduled maintenance jobs", scene_workassign),
]

N = len(SCENES)
DUR = round(3.8 * N, 1)
FADE = 0.004

def keytimes(i):
    a, b = i / N, (i + 1) / N
    pts = [0, round(a, 5), round(a + FADE, 5), round(b - FADE, 5), round(b, 5), 1]
    return ";".join(str(p) for p in pts)

def anim(i):
    return (f'<animate attributeName="opacity" dur="{DUR}s" repeatCount="indefinite" '
            f'calcMode="linear" keyTimes="{keytimes(i)}" values="0;0;1;1;0;0"/>')

buf = io.StringIO()
buf.write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" font-family="{SANS}">')
buf.write('<defs>')
buf.write(f'<linearGradient id="grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{TEAL}"/><stop offset="1" stop-color="{NAVY}"/></linearGradient>')
buf.write(f'<linearGradient id="gradV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{TEAL}"/><stop offset="1" stop-color="{NAVY}"/></linearGradient>')
buf.write(f'<linearGradient id="gradsoft" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{TEAL}" stop-opacity="0.93"/><stop offset="1" stop-color="{NAVY}" stop-opacity="0.97"/></linearGradient>')
buf.write(f'<clipPath id="screen"><rect x="{CX0}" y="{CY0}" width="960" height="{CY1-CY0}"/></clipPath>')
buf.write('</defs>')

# window frame
buf.write(rect(18, 18, 964, H - 34, "#ffffff", rx=14, stroke="#e2e8f0", sw=2))
buf.write(f'<path d="M18 32 A14 14 0 0 1 32 18 H968 A14 14 0 0 1 982 32 V62 H18 Z" fill="#f1f5f9"/>')
for i, c in enumerate(["#f87171", "#fbbf24", "#34d399"]):
    buf.write(f'<circle cx="{42+i*20}" cy="40" r="6" fill="{c}"/>')
buf.write(rect(116, 28, 620, 24, "#ffffff", rx=12, stroke="#e2e8f0"))
for i, (url, _, _) in enumerate(SCENES):
    buf.write(f'<text x="132" y="44" font-size="13" fill="#475569" opacity="0">{esc(url)}{anim(i)}</text>')

# scenes
buf.write('<g clip-path="url(#screen)">')
for i, (_, _, fn) in enumerate(SCENES):
    buf.write(f'<g opacity="0">{anim(i)}{fn()}</g>')
buf.write('</g>')

# caption bar
CAP_Y = CY1
buf.write(rect(18, CAP_Y, 964, 40, NAVY))
for i, (_, cap, _) in enumerate(SCENES):
    buf.write(f'<text x="500" y="{CAP_Y+25}" font-size="14.5" font-weight="600" fill="#ffffff" text-anchor="middle" opacity="0">{esc(cap)}{anim(i)}</text>')

# progress bar
PB_Y = CAP_Y + 40
buf.write(rect(18, PB_Y, 964, 4, "#0b3a56"))
buf.write(f'<rect x="18" y="{PB_Y}" width="0" height="4" fill="{GOLD}"><animate attributeName="width" dur="{DUR}s" repeatCount="indefinite" values="0;964;964" keyTimes="0;0.995;1"/></rect>')
buf.write('</svg>\n')

out = os.path.join(os.path.dirname(__file__), "demo.svg")
with open(out, "w", encoding="utf-8") as f:
    f.write(buf.getvalue())
print("wrote", out, len(buf.getvalue()), "bytes,", N, "scenes,", DUR, "s loop")
