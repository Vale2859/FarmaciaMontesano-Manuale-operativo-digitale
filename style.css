/* RESET BASE */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
    "Segoe UI", sans-serif;
  background: radial-gradient(circle at top left, #0fd9c1, #09527a 50%, #01304b);
  color: #ffffff;
  overflow-x: hidden;
}

/* UTILI */
.hidden {
  display: none !important;
}

/* ========== LOGIN & REGISTRAZIONE ========== */

.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 12px;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: linear-gradient(135deg, rgba(15, 40, 60, 0.95), rgba(2, 10, 20, 0.98));
  border-radius: 28px;
  padding: 22px 22px 20px;
  box-shadow:
    0 18px 40px rgba(0, 0, 0, 0.85),
    inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(18px);
}

.auth-card h1 {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 4px;
}

.auth-card h2 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 6px;
}

.auth-intro {
  font-size: 13px;
  opacity: 0.9;
  margin-bottom: 12px;
}

.auth-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.auth-tab {
  flex: 1;
  border-radius: 999px;
  border: none;
  padding: 6px 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.35);
  color: #e5f7ff;
}

.auth-tab.active {
  background: linear-gradient(145deg, #2cd079, #0a8f55);
  color: #ffffff;
}

.auth-subtitle {
  font-size: 13px;
  margin-bottom: 10px;
  opacity: 0.9;
}

.auth-subtitle span {
  font-weight: 700;
}

.auth-form {
  margin-top: 4px;
}

.link-as-button {
  margin-top: 10px;
  background: none;
  border: none;
  color: #c6e6ff;
  font-size: 13px;
  text-decoration: underline;
  cursor: pointer;
}

.auth-submit {
  width: 100%;
}

/* ========== APP LAYOUT ========== */

.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 16px 40px;
  position: relative;
}

/* HAMBURGER */
.hamburger {
  position: fixed;
  top: 14px;
  left: 16px;
  z-index: 40;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: none;
  background: rgba(10, 25, 40, 0.8);
  color: #ffffff;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.45);
}

/* SIDEBAR */
.sidebar {
  position: fixed;
  top: 0;
  left: -260px;
  width: 260px;
  height: 100vh;
  background: rgba(5, 20, 35, 0.96);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.6);
  padding: 16px 18px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  transition: left 0.25s ease-out;
}

.sidebar.open {
  left: 0;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.sidebar-header h2 {
  font-size: 20px;
}

.icon-button {
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 18px;
  cursor: pointer;
}

.sidebar-list {
  list-style: none;
  margin-top: 8px;
}

.sidebar-list li {
  padding: 10px 6px;
  border-radius: 8px;
  margin-bottom: 4px;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.15s;
}

.sidebar-list li:hover {
  background: rgba(255, 255, 255, 0.08);
}

.sidebar-list li.logout {
  margin-top: 12px;
  color: #ff9c9c;
}

/* HEADER APP */
.app-header {
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app-header h1 {
  font-size: 40px;
  letter-spacing: 0.08em;
  font-weight: 800;
  text-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
}

.user-badge {
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.4);
  font-size: 12px;
  opacity: 0.95;
}

/* GRID CARDS DASHBOARD */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

/* CARD BASE */
.card {
  position: relative;
  padding: 18px 20px 16px;
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.16), rgba(0, 0, 0, 0.35));
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.7),
    inset 0 0 0 1px rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(18px);
}

/* CARD COLORI SPECIFICI */
.card-assenze {
  background: linear-gradient(145deg, #2cd079, #0a8f55);
}
.card-turno {
  background: linear-gradient(145deg, #1aa3ff, #0060c7);
}
.card-comunicazioni {
  background: linear-gradient(145deg, #ff3b8d, #b21762);
}
.card-procedure {
  background: linear-gradient(145deg, #1fb58c, #078062);
}
.card-logistica {
  background: linear-gradient(145deg, #ffcc35, #ff9d00);
}
.card-magazziniera {
  background: linear-gradient(145deg, #1f7cff, #0343a3);
}

/* CARD DETTAGLI */
.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.card-icon {
  width: 46px;
  height: 46px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-right: 12px;
}

.card-title-group h2 {
  font-size: 18px;
  font-weight: 700;
}

.chip {
  display: inline-block;
  margin-top: 4px;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.12);
}

.chip-today {
  background: rgba(0, 0, 0, 0.3);
}

.chip-turno {
  background: rgba(0, 0, 0, 0.32);
}

.card-body {
  margin-top: 4px;
}

.caption {
  font-size: 13px;
  margin-bottom: 6px;
  opacity: 0.95;
}

.small-text {
  font-size: 13px;
  line-height: 1.4;
  opacity: 0.95;
}

.card-footer {
  margin-top: 14px;
}

/* BADGE NOTIFICHE */
.card-badge {
  position: absolute;
  top: 12px;
  right: 14px;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: #ff3152;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.25);
}

/* BOTTONI */
.btn-primary,
.btn-secondary {
  border: none;
  border-radius: 999px;
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.08s ease-out, box-shadow 0.08s ease-out,
    background 0.15s;
  white-space: nowrap;
}

.btn-primary {
  background: rgba(255, 255, 255, 0.9);
  color: #064259;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.45);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.55);
}

.btn-secondary {
  background: rgba(0, 0, 0, 0.3);
  color: #ffffff;
}

.btn-secondary:hover {
  background: rgba(0, 0, 0, 0.45);
}

/* LISTA COMUNICAZIONI */
.card-body-list .list-item {
  background: rgba(0, 0, 0, 0.18);
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 13px;
  margin-bottom: 6px;
}

/* DIVIDER */
.divider {
  margin: 8px 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
}

/* PAGINA ASSENZE */
.page-assenze {
  margin-top: -12px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.page-title-block h1 {
  font-size: 28px;
  font-weight: 800;
}

.page-title-block p {
  font-size: 14px;
  opacity: 0.9;
  margin-top: 4px;
}

.back-button {
  border: none;
  border-radius: 999px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.4);
  color: #ffffff;
  cursor: pointer;
  font-size: 13px;
  white-space: nowrap;
}

.summary-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: flex-end;
}

.badge {
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.45);
}

.badge-pending {
  background: rgba(255, 196, 0, 0.85);
  color: #2b1d00;
}
.badge-approved {
  background: rgba(111, 255, 190, 0.9);
  color: #00351d;
}
.badge-rejected {
  background: rgba(255, 115, 144, 0.9);
  color: #3b0210;
}

/* MINI CARD SUPERIORI */
.assenze-top-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.mini-card {
  padding: 14px 16px;
  border-radius: 24px;
  background: radial-gradient(circle at top left, #30d184, #087852);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.7);
}

.mini-card:nth-child(2) {
  background: radial-gradient(circle at top left, #ffca3a, #ff9100);
}

.mini-card:nth-child(3) {
  background: radial-gradient(circle at top left, #5b8dff, #003c9a);
}

.mini-card h3 {
  font-size: 15px;
  margin-bottom: 4px;
}

.big-number {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 2px;
}

/* LAYOUT CALENDARIO + OGGI */
.assenze-layout {
  display: grid;
  grid-template-columns: minmax(0, 2.1fr) minmax(0, 1.2fr);
  gap: 18px;
  margin-bottom: 20px;
}

/* CALENDARIO */
.calendar-card {
  padding-bottom: 18px;
}

.calendar-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.calendar-header h2 {
  font-size: 18px;
  margin-bottom: 2px;
}

.calendar-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.calendar-controls select {
  border-radius: 999px;
  border: none;
  padding: 6px 10px;
  font-size: 13px;
  background: rgba(0, 0, 0, 0.35);
  color: #ffffff;
}

.filter-check {
  display: flex;
  align-items: center;
  font-size: 12px;
  gap: 6px;
}

.filter-check input {
  accent-color: #34d58a;
}

/* GRIGLIA CALENDARIO */
.calendar-grid {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  padding: 8px 10px 10px;
}

.calendar-row {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  text-align: center;
  gap: 4px;
  margin-bottom: 4px;
}

.calendar-header-row span {
  font-size: 11px;
  font-weight: 600;
  opacity: 0.85;
}

.calendar-row .day,
.calendar-row .empty {
  min-height: 32px;
  border-radius: 10px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.calendar-row .day {
  background: rgba(255, 255, 255, 0.06);
}

.calendar-row .day.today {
  background: rgba(0, 0, 0, 0.6);
  font-weight: 700;
}

.day-holiday {
  background: rgba(255, 255, 255, 0.08);
}

/* PUNTINI CALENDARIO */
.dot {
  position: absolute;
  bottom: 4px;
  right: 6px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.dot-ferie {
  background: #ffeb3b;
}
.dot-oggi {
  background: #34d58a;
}

/* LEGENDA CALENDARIO */
.calendar-legend {
  display: flex;
  gap: 10px;
  margin-top: 8px;
  font-size: 11px;
}

.legend-dot {
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  margin-right: 4px;
}

.legend-dot.ferie {
  background: #ffeb3b;
}
.legend-dot.permesso {
  background: #ff9e3b;
}
.legend-dot.oggi {
  background: #34d58a;
}

/* CARD OGGI */
.oggi-card h2 {
  font-size: 18px;
  margin-bottom: 4px;
}

.assenze-list {
  list-style: none;
  margin-top: 10px;
}

.assenze-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.25);
  font-size: 13px;
  margin-bottom: 6px;
}

.assenze-list.small li {
  font-size: 12px;
}

.assenze-list .name {
  font-weight: 600;
}

.tag {
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
}

.tag-ferie {
  background: rgba(255, 235, 59, 0.9);
  color: #3b3600;
}
.tag-permesso {
  background: rgba(255, 152, 0, 0.9);
  color: #3b2200;
}
.tag-malattia {
  background: rgba(244, 67, 54, 0.9);
  color: #fff;
}

.details {
  opacity: 0.9;
}

/* RICHIESTE PERSONALI */
.requests-card {
  margin-bottom: 18px;
}

.requests-header h2 {
  font-size: 18px;
  margin-bottom: 2px;
}

.requests-table {
  margin-top: 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 18px;
  padding: 8px 10px;
  font-size: 13px;
}

.requests-row {
  display: grid;
  grid-template-columns: 1.1fr 1.1fr 1.1fr 1.1fr 1.3fr;
  gap: 4px;
  padding: 6px 4px;
  align-items: center;
  border-radius: 10px;
}

.requests-row.header {
  font-size: 11px;
  text-transform: uppercase;
  opacity: 0.8;
}

.requests-row:not(.header):nth-child(odd) {
  background: rgba(255, 255, 255, 0.04);
}

.status {
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
}

.status-approved {
  background: rgba(76, 175, 80, 0.9);
}
.status-pending {
  background: rgba(255, 193, 7, 0.9);
  color: #2b1d00;
}
.status-rejected {
  background: rgba(244, 67, 54, 0.9);
}

.actions {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
}

.link-button {
  border: none;
  background: transparent;
  color: #e7f3ff;
  font-size: 11px;
  text-decoration: underline;
  cursor: pointer;
}

.link-button.danger {
  color: #ffb3b3;
}

/* FORM GENERICO (LOGIN + ASSENZE) */
.form-row {
  margin-bottom: 10px;
}

.form-row label {
  display: block;
  font-size: 13px;
  margin-bottom: 4px;
}

.form-row input[type="text"],
.form-row input[type="password"],
.form-row input[type="date"],
.form-row select,
.form-row textarea {
  width: 100%;
  border-radius: 12px;
  border: none;
  padding: 7px 10px;
  font-size: 13px;
  background: rgba(0, 0, 0, 0.4);
  color: #ffffff;
  outline: none;
}

.form-row textarea {
  resize: vertical;
}

.form-row.two-cols {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.checkbox-inline {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.checkbox-inline input {
  accent-color: #34d58a;
}

.form-actions {
  margin-top: 6px;
}

.form-feedback {
  margin-top: 6px;
  font-size: 13px;
  color: #c5ffd6;
}

.form-feedback.error {
  color: #ffb3b3;
}

/* RESPONSIVE */
@media (max-width: 960px) {
  .cards-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .assenze-top-cards {
    grid-template-columns: 1fr;
  }

  .assenze-layout {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .summary-badges {
    justify-content: flex-start;
  }
}

@media (max-width: 680px) {
  .app {
    padding: 70px 12px 28px;
  }

  .app-header h1 {
    font-size: 30px;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .requests-row {
    grid-template-columns: 1.2fr 1.2fr 1.3fr 1.1fr;
  }
  .requests-row span:nth-child(5) {
    display: none; /* nasconde colonna Azioni su schermi piccoli */
  }

  .hamburger {
    top: 10px;
    left: 10px;
  }
}
