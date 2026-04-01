(async function() {
  function localToday() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  const loginScreen = document.getElementById('login-screen');
  const appContainer = document.getElementById('app-container');
  const googleBtn = document.getElementById('google-signin-btn');

  // --- Auth ---
  let currentUser = null;

  function showLogin() {
    loginScreen.classList.remove('hidden');
    appContainer.classList.add('hidden');
    renderGoogleButton();
  }

  function renderGoogleButton() {
    if (typeof google === 'undefined' || !google.accounts) {
      // GSI library not loaded yet, retry shortly
      setTimeout(renderGoogleButton, 200);
      return;
    }
    google.accounts.id.initialize({
      client_id: APP_CONFIG.GOOGLE_CLIENT_ID,
      callback: handleGoogleLogin,
    });
    google.accounts.id.renderButton(googleBtn, {
      theme: 'outline',
      size: 'large',
      width: 280,
      text: 'signin_with',
    });
  }

  async function handleGoogleLogin(response) {
    try {
      currentUser = await API.loginWithGoogle(response.credential);
      showApp();
    } catch (err) {
      console.error('Login failed:', err);
      alert('Login failed. Please try again.');
    }
  }

  async function tryAutoLogin() {
    if (!API.getToken()) return showLogin();
    try {
      currentUser = await API.getMe();
      showApp();
    } catch {
      API.logout();
      showLogin();
    }
  }

  function showApp() {
    loginScreen.classList.add('hidden');
    appContainer.classList.remove('hidden');
    setupUserMenu();
    initApp();
  }

  function setupUserMenu() {
    const avatar = document.getElementById('user-avatar');
    const menuAvatar = document.getElementById('menu-avatar');
    const menuName = document.getElementById('menu-name');
    const menuEmail = document.getElementById('menu-email');
    const userMenu = document.getElementById('user-menu');
    const btnUser = document.getElementById('btn-user');
    const btnLogout = document.getElementById('btn-logout');

    if (currentUser.picture) {
      avatar.src = currentUser.picture;
      menuAvatar.src = currentUser.picture;
    }
    menuName.textContent = currentUser.name || '';
    menuEmail.textContent = currentUser.email || '';

    btnUser.addEventListener('click', (e) => {
      e.stopPropagation();
      userMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', () => userMenu.classList.add('hidden'));
    userMenu.addEventListener('click', (e) => e.stopPropagation());

    // Admin button
    const btnAdmin = document.getElementById('btn-admin');
    if (currentUser.is_admin) {
      btnAdmin.classList.remove('hidden');
      btnAdmin.textContent = t('admin');
      btnAdmin.addEventListener('click', () => {
        userMenu.classList.add('hidden');
        openAdminModal();
      });
    }

    btnLogout.addEventListener('click', () => {
      API.logout();
      currentUser = null;
      userMenu.classList.add('hidden');
      showLogin();
    });
  }

  // --- Main App (same logic, just wrapped) ---
  let exercises = [];
  let todayLogs = [];
  let completedIds = new Set();
  let currentExercise = null;
  let activeCategory = 'all';
  let selectedDate = localToday();
  let appInitialized = false;
  let userRoutine = null;
  let activeRoutineDay = 'all';

  async function initApp() {
    if (appInitialized) {
      const [logs, completed] = await Promise.all([API.getLogs(), API.getCompleted()]);
      todayLogs = logs;
      completedIds = new Set(completed);
      renderGrid();
      return;
    }
    appInitialized = true;

    // DOM refs
    const grid = document.getElementById('exercise-grid');
    const categoryFilter = document.getElementById('category-filter');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalIcon = document.getElementById('modal-icon');
    const setsBody = document.getElementById('sets-body');
    const inputReps = document.getElementById('input-reps');
    const inputWeight = document.getElementById('input-weight');
    const btnAddSet = document.getElementById('btn-add-set');
    const btnPerSide = document.getElementById('btn-per-side');
    const perSideTotal = document.getElementById('per-side-total');
    let perSideActive = false;
    const btnInstructions = document.getElementById('btn-instructions');
    const instructionsPanel = document.getElementById('instructions-panel');
    const instructionsSteps = document.getElementById('instructions-steps');
    const instructionsLabel = document.getElementById('instructions-label');
    const btnBack = document.getElementById('modal-back');
    const historySection = document.getElementById('history-section');
    const btnComplete = document.getElementById('btn-complete');
    const btnLang = document.getElementById('btn-lang');
    const btnCalendar = document.getElementById('btn-calendar');
    const btnHistory = document.getElementById('btn-history');
    const historyModal = document.getElementById('history-modal');
    const historyBack = document.getElementById('history-back');
    const historyDate = document.getElementById('history-date');
    const historyLog = document.getElementById('history-log');
    const modalDate = document.getElementById('modal-date');
    const exerciseNoteInput = document.getElementById('exercise-note');

    // Routine DOM refs
    const routineBar = document.getElementById('routine-bar');
    const routineSelect = document.getElementById('routine-select');
    const btnRoutine = document.getElementById('btn-routine');
    const routineModal = document.getElementById('routine-modal');
    const routineBack = document.getElementById('routine-back');
    const routineModalTitle = document.getElementById('routine-modal-title');
    const routineDaysEditor = document.getElementById('routine-days-editor');
    const btnAddDay = document.getElementById('btn-add-day');
    const btnSaveRoutine = document.getElementById('btn-save-routine');
    const btnDeleteRoutine = document.getElementById('btn-delete-routine');

    // Init — parallel fetch
    const [ex, logs, completed, routine] = await Promise.all([
      API.getExercises(),
      API.getLogs(selectedDate),
      API.getCompleted(selectedDate),
      API.getRoutine(),
    ]);
    exercises = ex;
    todayLogs = logs;
    completedIds = new Set(completed);
    userRoutine = routine;
    renderAll();

    // --- Body Weight ---
    const bwInput = document.getElementById('bw-input');
    const bwSave = document.getElementById('bw-save');
    const bwFeedback = document.getElementById('bw-feedback');
    let bwFeedbackTimer = null;

    function showBwFeedback(msg) {
      bwFeedback.textContent = msg;
      bwFeedback.classList.remove('hidden');
      clearTimeout(bwFeedbackTimer);
      bwFeedbackTimer = setTimeout(() => bwFeedback.classList.add('hidden'), 2000);
    }

    async function loadBodyWeight() {
      const data = await API.getBodyWeight(localToday());
      if (data && data.weight) {
        bwInput.value = data.weight;
        bwSave.classList.add('saved');
      } else {
        bwInput.value = '';
        bwSave.classList.remove('saved');
      }
    }

    bwSave.addEventListener('click', async () => {
      const val = parseFloat(bwInput.value);
      if (!val) {
        await API.deleteBodyWeight(localToday());
        bwSave.classList.remove('saved');
        showBwFeedback(getLang() === 'es' ? 'Eliminado' : 'Deleted');
      } else {
        await API.saveBodyWeight(val, localToday());
        bwSave.classList.add('saved');
        showBwFeedback(getLang() === 'es' ? 'Guardado!' : 'Saved!');
      }
    });

    bwInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') bwSave.click();
    });

    bwInput.addEventListener('input', () => {
      bwSave.classList.remove('saved');
    });

    loadBodyWeight();

    // Modal date picker
    modalDate.addEventListener('change', async () => {
      selectedDate = modalDate.value;
      todayLogs = await API.getLogs(selectedDate);
      completedIds = new Set(await API.getCompleted(selectedDate));
      renderSets();
      updateCompleteButton();
    });

    // Auto-save exercise note on blur
    let noteSaveTimer = null;
    exerciseNoteInput.addEventListener('blur', () => {
      if (!currentExercise) return;
      const exId = currentExercise.id;
      clearTimeout(noteSaveTimer);
      API.saveNote(exId, exerciseNoteInput.value);
    });

    // Per-side toggle
    function updatePerSideUI() {
      const lang = getLang();
      if (perSideActive) {
        btnPerSide.textContent = lang === 'es' ? '/ lado' : '/ side';
        btnPerSide.classList.add('active');
      } else {
        btnPerSide.textContent = 'total';
        btnPerSide.classList.remove('active');
      }
      updatePerSideTotal();
    }

    function updatePerSideTotal() {
      if (perSideActive) {
        const val = parseFloat(inputWeight.value);
        if (val > 0) {
          perSideTotal.textContent = `= ${val * 2} kg total`;
          perSideTotal.classList.remove('hidden');
        } else {
          perSideTotal.classList.add('hidden');
        }
      } else {
        perSideTotal.classList.add('hidden');
      }
    }

    btnPerSide.addEventListener('click', () => {
      perSideActive = !perSideActive;
      updatePerSideUI();
    });

    inputWeight.addEventListener('input', updatePerSideTotal);

    // Instructions toggle
    btnInstructions.addEventListener('click', () => {
      const isOpen = !instructionsPanel.classList.contains('hidden');
      instructionsPanel.classList.toggle('hidden');
      btnInstructions.classList.toggle('active', !isOpen);
    });

    function renderInstructions(steps) {
      const lang = getLang();
      instructionsSteps.innerHTML = steps.map((step, i) => `
        <div class="instruction-step">
          <div class="instruction-step-number">${i + 1}</div>
          <div class="instruction-step-icon">${step.icon}</div>
          <div class="instruction-step-text">${step[lang]}</div>
        </div>
      `).join('');
    }


    // --- Routine ---
    routineSelect.addEventListener('change', () => {
      activeRoutineDay = routineSelect.value;
      renderGrid();
    });

    function renderRoutineBar() {
      if (!userRoutine || !userRoutine.days || userRoutine.days.length === 0) {
        routineBar.classList.add('hidden');
        activeRoutineDay = 'all';
        return;
      }
      routineBar.classList.remove('hidden');
      const lang = getLang();
      let html = `<option value="all">${t('allExercises')}</option>`;
      userRoutine.days.forEach((day, i) => {
        const name = lang === 'es' ? day.name_es : day.name_en;
        html += `<option value="${i}" ${activeRoutineDay === String(i) ? 'selected' : ''}>${name}</option>`;
      });
      routineSelect.innerHTML = html;
    }

    btnRoutine.addEventListener('click', () => {
      routineModalTitle.textContent = t('routine');
      btnAddDay.textContent = t('addDay');
      btnSaveRoutine.textContent = t('saveRoutine');
      btnDeleteRoutine.textContent = t('deleteRoutine');
      // Clone routine for editing
      editorDays = userRoutine && userRoutine.days ? JSON.parse(JSON.stringify(userRoutine.days)) : [];
      renderRoutineEditor();
      routineModal.classList.remove('hidden');
    });

    routineBack.addEventListener('click', () => {
      routineModal.classList.add('hidden');
    });

    let editorDays = [];

    btnAddDay.addEventListener('click', () => {
      const n = editorDays.length + 1;
      editorDays.push({ name_es: `Día ${n}`, name_en: `Day ${n}`, exercises: [] });
      renderRoutineEditor();
    });

    btnSaveRoutine.addEventListener('click', async () => {
      // Read current names from inputs
      routineDaysEditor.querySelectorAll('.routine-day-card').forEach((card, i) => {
        editorDays[i].name_es = card.querySelector('.rday-name-es').value.trim() || `Día ${i + 1}`;
        editorDays[i].name_en = card.querySelector('.rday-name-en').value.trim() || `Day ${i + 1}`;
      });
      await API.saveRoutine(editorDays);
      userRoutine = await API.getRoutine();
      renderRoutineBar();
      renderGrid();
      routineModal.classList.add('hidden');
    });

    btnDeleteRoutine.addEventListener('click', async () => {
      if (!confirm(t('confirmDeleteRoutine'))) return;
      await API.deleteRoutine();
      userRoutine = null;
      activeRoutineDay = 'all';
      renderRoutineBar();
      renderGrid();
      routineModal.classList.add('hidden');
    });

    function renderRoutineEditor() {
      const lang = getLang();
      const categories = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'abs'];
      routineDaysEditor.innerHTML = editorDays.map((day, di) => {
        const exercisesByCategory = categories.map(cat => {
          const catExercises = exercises.filter(e => e.category === cat);
          if (catExercises.length === 0) return '';
          const chips = catExercises.map(ex => {
            const name = lang === 'es' ? ex.name_es : ex.name_en;
            const sel = day.exercises.includes(ex.id) ? 'selected' : '';
            return `<span class="routine-exercise-chip ${sel}" data-day="${di}" data-ex="${ex.id}">${name}</span>`;
          }).join('');
          return `<div class="routine-category-label">${t(cat)}</div><div class="routine-exercise-grid">${chips}</div>`;
        }).join('');

        return `
          <div class="routine-day-card">
            <div class="routine-day-header">
              <h4>${lang === 'es' ? day.name_es : day.name_en}</h4>
              <button class="btn-remove-day" data-day="${di}">${t('removeDay')}</button>
            </div>
            <div class="routine-day-inputs">
              <input class="rday-name-es" type="text" value="${day.name_es}" placeholder="${t('dayNameEs')}">
              <input class="rday-name-en" type="text" value="${day.name_en}" placeholder="${t('dayNameEn')}">
            </div>
            ${exercisesByCategory}
          </div>
        `;
      }).join('');

      // Chip click toggles
      routineDaysEditor.querySelectorAll('.routine-exercise-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const di = parseInt(chip.dataset.day);
          const exId = chip.dataset.ex;
          const idx = editorDays[di].exercises.indexOf(exId);
          if (idx >= 0) {
            editorDays[di].exercises.splice(idx, 1);
            chip.classList.remove('selected');
          } else {
            editorDays[di].exercises.push(exId);
            chip.classList.add('selected');
          }
        });
      });

      // Remove day buttons
      routineDaysEditor.querySelectorAll('.btn-remove-day').forEach(btn => {
        btn.addEventListener('click', () => {
          if (!confirm(t('confirmDeleteDay'))) return;
          // Save current input values before re-rendering
          routineDaysEditor.querySelectorAll('.routine-day-card').forEach((card, i) => {
            editorDays[i].name_es = card.querySelector('.rday-name-es').value.trim() || editorDays[i].name_es;
            editorDays[i].name_en = card.querySelector('.rday-name-en').value.trim() || editorDays[i].name_en;
          });
          editorDays.splice(parseInt(btn.dataset.day), 1);
          renderRoutineEditor();
        });
      });

      // Update header on name input change
      routineDaysEditor.querySelectorAll('.rday-name-es, .rday-name-en').forEach(input => {
        input.addEventListener('input', () => {
          const card = input.closest('.routine-day-card');
          const di = [...routineDaysEditor.querySelectorAll('.routine-day-card')].indexOf(card);
          const nameEs = card.querySelector('.rday-name-es').value;
          const nameEn = card.querySelector('.rday-name-en').value;
          card.querySelector('h4').textContent = lang === 'es' ? nameEs : nameEn;
        });
      });
    }

    // --- Calendar ---
    const calendarModal = document.getElementById('calendar-modal');
    // --- Dashboard ---
    const btnDashboard = document.getElementById('btn-dashboard');
    const dashboardModal = document.getElementById('dashboard-modal');
    const dashboardBack = document.getElementById('dashboard-back');
    const dashboardTitle = document.getElementById('dashboard-title');
    const dashPeriod = document.getElementById('dashboard-period');
    const dashContent = document.getElementById('dashboard-content');
    let dashDays = 30;

    btnDashboard.addEventListener('click', () => {
      dashboardTitle.textContent = t('dashboard');
      dashboardModal.classList.remove('hidden');
      renderDashPeriod();
      loadDashboard();
    });

    dashboardBack.addEventListener('click', () => {
      dashboardModal.classList.add('hidden');
    });

    function renderDashPeriod() {
      const periods = [
        { days: 30, label: 'dashLast30' },
        { days: 60, label: 'dashLast60' },
        { days: 90, label: 'dashLast90' },
      ];
      dashPeriod.innerHTML = periods.map(p =>
        `<button data-days="${p.days}" class="${p.days === dashDays ? 'active' : ''}">${t(p.label)}</button>`
      ).join('');
      dashPeriod.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
          dashDays = parseInt(btn.dataset.days);
          renderDashPeriod();
          loadDashboard();
        });
      });
    }

    async function loadDashboard() {
      dashContent.innerHTML = '<div class="dash-empty">...</div>';
      const data = await API.getDashboard(dashDays);
      renderDashboard(data);
    }

    function dashChange(current, previous) {
      if (!previous || previous === 0) return { cls: 'dash-neutral', text: '--' };
      const pct = Math.round(((current - previous) / previous) * 100);
      if (pct > 0) return { cls: 'dash-up', text: `+${pct}%` };
      if (pct < 0) return { cls: 'dash-down', text: `${pct}%` };
      return { cls: 'dash-neutral', text: '0%' };
    }

    function renderDashboard(data) {
      const lang = getLang();
      const s = data.summary;

      if (s.totalWorkouts === 0 && s.prevWorkouts === 0) {
        dashContent.innerHTML = `<div class="dash-empty">${t('dashNoData')}</div>`;
        return;
      }

      let html = '';

      // Summary cards
      const volChange = dashChange(s.totalVolume, s.prevVolume);
      const workChange = dashChange(s.totalWorkouts, s.prevWorkouts);
      const setChange = dashChange(s.totalSets, s.prevSets);

      html += `<div class="dash-summary">
        <div class="dash-stat-card">
          <div class="dash-stat-value">${s.totalWorkouts}</div>
          <div class="dash-stat-label">${t('dashWorkouts')}</div>
          <div class="dash-stat-change ${workChange.cls}">${workChange.text}</div>
        </div>
        <div class="dash-stat-card">
          <div class="dash-stat-value">${s.totalSets}</div>
          <div class="dash-stat-label">${t('dashSets')}</div>
          <div class="dash-stat-change ${setChange.cls}">${setChange.text}</div>
        </div>
        <div class="dash-stat-card">
          <div class="dash-stat-value">${s.totalVolume.toLocaleString()}</div>
          <div class="dash-stat-label">${t('dashVolume')}</div>
          <div class="dash-stat-change ${volChange.cls}">${volChange.text}</div>
        </div>
        <div class="dash-stat-card">
          <div class="dash-stat-value">${s.currentStreak}</div>
          <div class="dash-stat-label">${t('dashStreak')}</div>
          <div class="dash-stat-change dash-neutral">${t('dashDays')}</div>
        </div>
      </div>`;

      // Category bars
      if (data.categories.length > 0) {
        const maxSets = Math.max(...data.categories.map(c => c.sets));
        html += `<div class="dash-section-title">${t('dashCategories')}</div>`;
        data.categories.forEach(c => {
          const pct = Math.round((c.sets / maxSets) * 100);
          const prevPct = maxSets > 0 ? Math.round((c.prevSets / maxSets) * 100) : 0;
          html += `<div class="dash-bar-row">
            <span class="dash-bar-label">${t(c.category)}</span>
            <div class="dash-bar-track">
              <div class="dash-bar-fill" style="width:${pct}%"></div>
              ${c.prevSets > 0 ? `<div class="dash-bar-prev" style="left:${prevPct}%"></div>` : ''}
            </div>
            <span class="dash-bar-value">${c.sets}</span>
          </div>`;
        });
      }

      // Volume trend chart
      if (data.volumeTrend && data.volumeTrend.length > 1) {
        const maxVol = Math.max(...data.volumeTrend.map(v => v.volume));
        html += `<div class="dash-section-title">${t('dashVolumeTrend')}</div>`;
        html += `<div class="dash-vol-chart"><div class="dash-vol-bars">`;
        data.volumeTrend.forEach(v => {
          const h = maxVol > 0 ? Math.max(5, (v.volume / maxVol) * 100) : 5;
          const inCurrent = v.date > data.period.currentStart;
          const color = inCurrent ? 'var(--primary)' : 'var(--border)';
          html += `<div class="dash-vol-bar" style="height:${h}%;background:${color}" data-tip="${v.date.slice(5)}: ${v.volume.toLocaleString()}kg"></div>`;
        });
        html += `</div></div>`;
      }

      // Exercise progress with mini charts
      if (data.exercises.length > 0) {
        html += `<div class="dash-section-title">${t('dashExerciseProgress')}</div>`;
        data.exercises.forEach(ex => {
          const name = lang === 'es' ? ex.name_es : ex.name_en;
          const vc = ex.volumeChange;
          const arrow = vc > 0 ? '&#9650;' : vc < 0 ? '&#9660;' : '&#9679;';
          const cls = vc > 0 ? 'dash-up' : vc < 0 ? 'dash-down' : 'dash-neutral';
          const prBadge = ex.isPR ? `<span class="dash-pr-badge">${t('dashPR')}</span>` : '';

          html += `<div class="dash-ex-card">
            <div class="dash-ex-header">
              <span class="dash-ex-name-lg">${name}${prBadge}</span>
              <div class="dash-ex-meta">
                <span class="dash-ex-weight">${ex.current.maxWeight}kg</span>
                <span class="${cls}">${arrow} ${vc > 0 ? '+' : ''}${vc}%</span>
              </div>
            </div>`;

          // Mini weight trend chart
          if (ex.trend && ex.trend.length > 1) {
            const tWeights = ex.trend.map(t => t.weight);
            const tMin = Math.min(...tWeights.filter(w => w > 0));
            const tMax = Math.max(...tWeights);
            const tRange = tMax - tMin || 1;
            html += `<div class="dash-mini-chart">`;
            ex.trend.forEach(pt => {
              const h = pt.weight > 0 ? Math.max(10, ((pt.weight - tMin + tRange * 0.1) / (tRange * 1.1)) * 100) : 5;
              const inCurrent = pt.date > data.period.currentStart;
              const color = inCurrent ? 'var(--primary)' : 'var(--border)';
              html += `<div class="dash-mini-bar" style="height:${h}%;background:${color}"></div>`;
            });
            html += `</div>`;
          }

          html += `</div>`;
        });
      }

      // Body weight sparkline
      if (data.bodyweight.length > 1) {
        const weights = data.bodyweight.map(b => b.weight);
        const minW = Math.min(...weights);
        const maxW = Math.max(...weights);
        const range = maxW - minW || 1;
        const first = weights[0];
        const last = weights[weights.length - 1];
        const diff = (last - first).toFixed(1);
        const diffStr = diff > 0 ? `+${diff}` : diff;

        html += `<div class="dash-section-title">${t('dashBodyweight')}</div>`;
        html += `<div class="dash-sparkline">`;
        data.bodyweight.forEach(b => {
          const h = Math.max(10, ((b.weight - minW) / range) * 100);
          html += `<div class="dash-spark-bar" style="height:${h}%" title="${b.date}: ${b.weight}kg"></div>`;
        });
        html += `</div>`;
        html += `<div class="dash-bw-range">
          <span>${first} kg</span>
          <span>${last} kg (${diffStr})</span>
        </div>`;
      }

      dashContent.innerHTML = html;
    }

    // --- Calendar ---
    const calendarBack = document.getElementById('calendar-back');
    const calMonthLabel = document.getElementById('cal-month-label');
    const calHeader = document.getElementById('cal-header');
    const calDays = document.getElementById('cal-days');
    const calPrev = document.getElementById('cal-prev');
    const calNext = document.getElementById('cal-next');
    const calDayDetail = document.getElementById('cal-day-detail');
    const calDayTitle = document.getElementById('cal-day-title');
    const calDayPhotos = document.getElementById('cal-day-photos');
    const btnUploadPhoto = document.getElementById('btn-upload-photo');
    const calendarTitle = document.getElementById('calendar-title');

    // Lightbox
    const lightbox = document.getElementById('photo-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxDelete = document.getElementById('lightbox-delete');

    let calYear = new Date().getFullYear();
    let calMonth = new Date().getMonth() + 1;
    let calData = { trainingDates: [], photoDates: [] };
    let calSelectedDate = null;
    let calPhotos = [];
    let lightboxPhotoId = null;

    btnCalendar.addEventListener('click', () => {
      calYear = new Date().getFullYear();
      calMonth = new Date().getMonth() + 1;
      calSelectedDate = null;
      calDayDetail.classList.add('hidden');
      calendarModal.classList.remove('hidden');
      calendarTitle.textContent = t('calendar');
      loadCalendar();
    });

    calendarBack.addEventListener('click', () => {
      calendarModal.classList.add('hidden');
    });

    calPrev.addEventListener('click', () => {
      calMonth--;
      if (calMonth < 1) { calMonth = 12; calYear--; }
      calSelectedDate = null;
      calDayDetail.classList.add('hidden');
      loadCalendar();
    });

    calNext.addEventListener('click', () => {
      calMonth++;
      if (calMonth > 12) { calMonth = 1; calYear++; }
      calSelectedDate = null;
      calDayDetail.classList.add('hidden');
      loadCalendar();
    });

    async function loadCalendar() {
      calData = await API.getCalendar(calYear, calMonth);
      renderCalendar();
    }

    function renderCalendar() {
      const lang = getLang();
      const months = t('months');
      calMonthLabel.textContent = `${months[calMonth - 1]} ${calYear}`;

      const dayNames = [t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat'), t('sun')];
      calHeader.innerHTML = dayNames.map(d => `<div class="cal-header-cell">${d}</div>`).join('');

      const firstDay = new Date(calYear, calMonth - 1, 1).getDay();
      const offset = (firstDay === 0 ? 6 : firstDay - 1);
      const daysInMonth = new Date(calYear, calMonth, 0).getDate();
      const todayStr = localToday();

      let html = '';
      for (let i = 0; i < offset; i++) {
        html += '<div class="cal-day empty"></div>';
      }
      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${calYear}-${String(calMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isTrained = calData.trainingDates.includes(dateStr);
        const hasPhotos = calData.photoDates.includes(dateStr);
        const isToday = dateStr === todayStr;
        const isSelected = dateStr === calSelectedDate;
        let cls = 'cal-day';
        if (isTrained) cls += ' trained';
        if (isToday) cls += ' today';
        if (isSelected) cls += ' selected';
        html += `<div class="${cls}" data-date="${dateStr}">${d}${hasPhotos ? '<span class="photo-dot"></span>' : ''}</div>`;
      }
      calDays.innerHTML = html;

      calDays.querySelectorAll('.cal-day:not(.empty)').forEach(el => {
        el.addEventListener('click', () => selectCalDay(el.dataset.date));
      });
    }

    const calDaySummary = document.getElementById('cal-day-summary');
    const calDayPhotosTitle = document.getElementById('cal-day-photos-title');

    async function selectCalDay(dateStr) {
      calSelectedDate = dateStr;
      renderCalendar();

      calDayTitle.textContent = dateStr;
      calDayPhotosTitle.textContent = t('photos');
      btnUploadPhoto.textContent = t('uploadPhoto');
      calDayDetail.classList.remove('hidden');

      // Load summary, photos, and body weight in parallel
      const [dayLogs, dayCompleted, photos, bw] = await Promise.all([
        API.getLogs(dateStr),
        API.getCompleted(dateStr),
        API.getPhotos(dateStr),
        API.getBodyWeight(dateStr),
      ]);
      calPhotos = photos;
      renderCalDaySummary(dayLogs, dayCompleted, bw);
      renderCalPhotos();
    }

    function renderCalDaySummary(logs, completedIds, bodyWeight) {
      const lang = getLang();
      let bwHtml = '';
      if (bodyWeight && bodyWeight.weight) {
        const label = lang === 'es' ? 'Peso corporal' : 'Body weight';
        bwHtml = `<div class="cal-summary-bodyweight">&#9878; ${label}: <strong>${bodyWeight.weight} kg</strong></div>`;
      }

      if (logs.length === 0 && completedIds.length === 0 && !bwHtml) {
        calDaySummary.innerHTML = `<div class="empty-state">${t('noLogsDate')}</div>`;
        return;
      }
      // Group logs by exercise
      const grouped = {};
      logs.forEach(log => {
        if (!grouped[log.exercise_id]) {
          grouped[log.exercise_id] = {
            name: lang === 'es' ? log.name_es : log.name_en,
            sets: [],
            completed: completedIds.includes(log.exercise_id),
          };
        }
        grouped[log.exercise_id].sets.push(log);
      });
      // Add completed exercises with no logs
      completedIds.forEach(id => {
        if (!grouped[id]) {
          const ex = exercises.find(e => e.id === id);
          if (ex) {
            grouped[id] = {
              name: lang === 'es' ? ex.name_es : ex.name_en,
              sets: [],
              completed: true,
            };
          }
        }
      });

      const exercisesHtml = Object.values(grouped).map(g => {
        const check = g.completed ? `<span class="completed-check">&#10003;</span>` : '';
        const setsHtml = g.sets.map(s => {
          let w = s.weight || '-';
          if (s.per_side && s.weight) w = `${s.weight}/${lang === 'es' ? 'lado' : 'side'} (${s.weight * 2} total)`;
          else if (s.weight) w = `${s.weight} total`;
          return `${t('set')} ${s.set_number}: ${s.reps || '-'} reps x ${w}`;
        }).join('<br>');
        return `
          <div class="cal-summary-exercise">
            <div class="exercise-name">${check}${g.name}</div>
            ${setsHtml ? `<div class="exercise-sets">${setsHtml}</div>` : ''}
          </div>`;
      }).join('');
      calDaySummary.innerHTML = bwHtml + exercisesHtml;
    }

    function renderCalPhotos() {
      if (calPhotos.length === 0) {
        calDayPhotos.innerHTML = `<div class="empty-state" style="grid-column:1/-1">${t('noPhotos')}</div>`;
      } else {
        calDayPhotos.innerHTML = calPhotos.map(p =>
          `<div class="cal-photo-thumb" data-id="${p.id}" data-url="${p.url}"><img src="${p.url}" alt=""></div>`
        ).join('');

        calDayPhotos.querySelectorAll('.cal-photo-thumb').forEach(thumb => {
          thumb.addEventListener('click', () => {
            lightboxPhotoId = thumb.dataset.id;
            lightboxImg.src = thumb.dataset.url;
            lightboxDelete.textContent = t('deletePhoto');
            lightbox.classList.remove('hidden');
          });
        });
      }
    }

    // Upload photo
    const photoInput = document.getElementById('photo-input');

    btnUploadPhoto.addEventListener('click', () => {
      photoInput.click();
    });

    photoInput.addEventListener('change', async () => {
      const files = photoInput.files;
      if (!files.length) return;
      btnUploadPhoto.disabled = true;
      btnUploadPhoto.textContent = '...';
      for (const file of files) {
        await API.uploadPhoto(file, calSelectedDate);
      }
      photoInput.value = '';
      btnUploadPhoto.disabled = false;
      btnUploadPhoto.textContent = t('uploadPhoto');
      calPhotos = await API.getPhotos(calSelectedDate);
      renderCalPhotos();
      calData = await API.getCalendar(calYear, calMonth);
      renderCalendar();
    });

    // Lightbox
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.add('hidden');
      lightboxPhotoId = null;
    });

    lightboxDelete.addEventListener('click', async () => {
      if (!lightboxPhotoId) return;
      if (!confirm(t('confirmDeletePhoto'))) return;
      await API.deletePhoto(lightboxPhotoId);
      lightbox.classList.add('hidden');
      lightboxPhotoId = null;
      calPhotos = await API.getPhotos(calSelectedDate);
      renderCalPhotos();
      calData = await API.getCalendar(calYear, calMonth);
      renderCalendar();
    });

    // Language toggle
    btnLang.addEventListener('click', () => {
      const newLang = getLang() === 'es' ? 'en' : 'es';
      setLang(newLang);
      renderAll();
      if (!modal.classList.contains('hidden') && currentExercise) {
        openExercise(currentExercise);
      }
    });

    // History modal
    btnHistory.addEventListener('click', () => {
      historyModal.classList.remove('hidden');
      historyDate.value = localToday();
      loadHistoryDate();
    });

    historyBack.addEventListener('click', () => {
      historyModal.classList.add('hidden');
    });

    historyDate.addEventListener('change', loadHistoryDate);

    async function loadHistoryDate() {
      const date = historyDate.value;
      const logs = await API.getLogs(date);
      renderHistoryLog(logs);
    }

    function renderHistoryLog(logs) {
      const lang = getLang();
      if (logs.length === 0) {
        historyLog.innerHTML = `<div class="empty-state">${t('noLogsDate')}</div>`;
        return;
      }
      const grouped = {};
      logs.forEach(log => {
        if (!grouped[log.exercise_id]) {
          grouped[log.exercise_id] = { name: lang === 'es' ? log.name_es : log.name_en, sets: [] };
        }
        grouped[log.exercise_id].sets.push(log);
      });

      historyLog.innerHTML = Object.values(grouped).map(g => `
        <div class="history-log-entry">
          <div class="exercise-name">${g.name}</div>
          <div class="exercise-sets">${g.sets.map(s =>
            `${t('set')} ${s.set_number}: ${s.reps || '-'} reps x ${s.weight || '-'} kg`
          ).join('<br>')}</div>
        </div>
      `).join('');
    }

    // Modal back
    btnBack.addEventListener('click', closeModal);

    function closeModal() {
      modal.classList.add('hidden');
      currentExercise = null;
      selectedDate = localToday();
      Promise.all([API.getLogs(selectedDate), API.getCompleted(selectedDate)]).then(([logs, completed]) => {
        todayLogs = logs;
        completedIds = new Set(completed);
        renderGrid();
      });
    }

    // Complete/uncomplete toggle
    btnComplete.addEventListener('click', async () => {
      if (!currentExercise) return;
      try {
        if (completedIds.has(currentExercise.id)) {
          await API.unmarkCompleted(currentExercise.id, selectedDate);
          completedIds.delete(currentExercise.id);
        } else {
          await API.markCompleted(currentExercise.id, selectedDate);
          completedIds.add(currentExercise.id);
        }
        updateCompleteButton();
      } catch (err) {
        console.error('Complete toggle failed:', err);
        const msg = getLang() === 'es' ? 'Error al guardar. Intentá de nuevo.' : 'Failed to save. Please try again.';
        alert(msg);
      }
    });

    // Add set
    btnAddSet.addEventListener('click', async () => {
      if (!currentExercise) return;
      const reps = parseInt(inputReps.value) || null;
      const weight = parseFloat(inputWeight.value) || null;
      if (!reps && !weight) return;

      try {
        const exerciseLogs = todayLogs.filter(l => l.exercise_id === currentExercise.id);
        const nextSet = exerciseLogs.length + 1;

        const result = await API.addLog(currentExercise.id, nextSet, reps, weight, selectedDate, perSideActive);

        // Append locally instead of refetching all logs
        todayLogs.push({
          id: result.id,
          exercise_id: currentExercise.id,
          set_number: nextSet,
          reps,
          weight,
          per_side: perSideActive,
          date: selectedDate,
        });
        renderSets();
        inputReps.focus();
      } catch (err) {
        console.error('Add set failed:', err);
        const msg = getLang() === 'es' ? 'Error al guardar serie. Intentá de nuevo.' : 'Failed to save set. Please try again.';
        alert(msg);
      }
    });

    [inputReps, inputWeight].forEach(input => {
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') btnAddSet.click();
      });
    });

    // Render everything
    function renderAll() {
      const lang = getLang();
      btnLang.textContent = lang === 'es' ? 'EN' : 'ES';
      document.getElementById('app-title').textContent = t('appTitle');
      document.getElementById('today-title').textContent = t('today');
      document.getElementById('history-title').textContent = t('recentHistory');
      document.getElementById('th-set').textContent = t('set');
      document.getElementById('th-reps').textContent = t('reps');
      document.getElementById('th-weight').textContent = t('weight');
      document.getElementById('history-modal-title').textContent = t('history');
      document.getElementById('progression-title').textContent = t('progression');
      btnAddSet.textContent = t('addSet');
      inputReps.placeholder = t('repsPlaceholder');
      inputWeight.placeholder = t('weightPlaceholder');

      renderRoutineBar();
      renderCategories();
      renderGrid();
    }

    function renderCategories() {
      const categories = ['all', 'chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'abs'];
      categoryFilter.innerHTML = categories.map(cat => `
        <button data-cat="${cat}" class="${cat === activeCategory ? 'active' : ''}">${t(cat)}</button>
      `).join('');

      categoryFilter.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
          activeCategory = btn.dataset.cat;
          renderCategories();
          renderGrid();
        });
      });
    }

    function renderGrid() {
      const lang = getLang();
      let filtered = activeCategory === 'all'
        ? exercises
        : exercises.filter(e => e.category === activeCategory);

      // Filter by routine day
      if (activeRoutineDay !== 'all' && userRoutine && userRoutine.days[activeRoutineDay]) {
        const dayExercises = new Set(userRoutine.days[activeRoutineDay].exercises);
        filtered = filtered.filter(e => dayExercises.has(e.id));
      }

      const todayExerciseIds = new Set(todayLogs.map(l => l.exercise_id));

      grid.innerHTML = filtered.map(ex => {
        const name = lang === 'es' ? ex.name_es : ex.name_en;
        const isCompleted = completedIds.has(ex.id);
        const hasLogs = todayExerciseIds.has(ex.id);
        const statusClass = isCompleted ? 'completed' : hasLogs ? 'has-logs' : '';
        const icon = ex.icon_svg || EXERCISE_ICONS[ex.id] || '';
        return `
          <div class="exercise-card ${statusClass}" data-id="${ex.id}">
            ${icon}
            <span class="name">${name}</span>
          </div>
        `;
      }).join('');

      grid.querySelectorAll('.exercise-card').forEach(card => {
        card.addEventListener('click', () => {
          const ex = exercises.find(e => e.id === card.dataset.id);
          if (ex) openExercise(ex);
        });
      });
    }

    async function openExercise(ex) {
      currentExercise = ex;
      const lang = getLang();
      const name = lang === 'es' ? ex.name_es : ex.name_en;

      modalTitle.textContent = name;
      modalIcon.innerHTML = ex.icon_svg || EXERCISE_ICONS[ex.id] || '';
      modalDate.value = selectedDate;
      modal.classList.remove('hidden');

      // Instructions
      instructionsPanel.classList.add('hidden');
      btnInstructions.classList.remove('active');
      const steps = EXERCISE_INSTRUCTIONS[ex.id];
      if (steps) {
        btnInstructions.classList.remove('hidden');
        instructionsLabel.textContent = t('instructions');
        renderInstructions(steps);
      } else {
        btnInstructions.classList.add('hidden');
      }

      // Note
      exerciseNoteInput.value = '';
      exerciseNoteInput.placeholder = t('notePlaceholder');

      // Per-side default from exercise
      perSideActive = ex.per_side || false;
      updatePerSideUI();

      const [logs, completed, history, noteData] = await Promise.all([
        API.getLogs(selectedDate),
        API.getCompleted(selectedDate),
        API.getHistory(ex.id),
        API.getNote(ex.id),
      ]);
      if (!currentExercise) return;
      todayLogs = logs;
      completedIds = new Set(completed);
      exerciseNoteInput.value = noteData.note || '';
      renderSets();
      updateCompleteButton();
      renderProgressionChart(history);
      renderExerciseHistory(history);

      inputReps.focus();
    }

    function updateCompleteButton() {
      if (!currentExercise) return;
      const done = completedIds.has(currentExercise.id);
      btnComplete.innerHTML = done ? t('markIncomplete') : t('markComplete');
      btnComplete.classList.toggle('is-completed', done);
    }

    function renderSets() {
      if (!currentExercise) return;
      const exerciseLogs = todayLogs.filter(l => l.exercise_id === currentExercise.id);
      if (exerciseLogs.length === 0) {
        setsBody.innerHTML = `<tr><td colspan="4" class="empty-state">${t('noSetsToday')}</td></tr>`;
        return;
      }
      const lang = getLang();
      setsBody.innerHTML = exerciseLogs.map(log => {
        let weightDisplay = log.weight || '-';
        if (log.weight) {
          if (log.per_side) {
            weightDisplay = `${log.weight} <span class="per-side-badge">/${lang === 'es' ? 'lado' : 'side'}</span> <span style="color:var(--text-secondary);font-size:0.8rem">(${log.weight * 2} total)</span>`;
          } else {
            weightDisplay = `${log.weight} <span class="per-side-badge">total</span>`;
          }
        }
        return `
        <tr>
          <td class="set-num">${log.set_number}</td>
          <td>${log.reps || '-'}</td>
          <td>${weightDisplay}</td>
          <td><button class="btn-delete" data-id="${log.id}">&times;</button></td>
        </tr>
        `;
      }).join('');

      setsBody.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (!confirm(t('confirmDelete'))) return;
          await API.deleteLog(btn.dataset.id);
          todayLogs = todayLogs.filter(l => l.id !== btn.dataset.id);
          renderSets();
        });
      });
    }

    const progressionChart = document.getElementById('progression-chart');
    const progressionTitle = document.getElementById('progression-title');

    function renderProgressionChart(history) {
      progressionTitle.textContent = t('progression');
      if (history.length === 0) {
        progressionChart.innerHTML = '';
        return;
      }

      // Group by date, get max weight per session
      const sessionMap = {};
      history.forEach(h => {
        const w = h.weight || 0;
        if (!sessionMap[h.date] || w > sessionMap[h.date]) sessionMap[h.date] = w;
      });

      const sessions = Object.entries(sessionMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, weight]) => ({ date, weight }));

      if (sessions.length < 2 || sessions.every(s => s.weight === 0)) {
        progressionChart.innerHTML = `<div class="prog-empty">${t('progressionNoData')}</div>`;
        return;
      }

      const weights = sessions.map(s => s.weight);
      const minW = Math.min(...weights.filter(w => w > 0));
      const maxW = Math.max(...weights);
      const range = maxW - minW || 1;
      const first = sessions.find(s => s.weight > 0);
      const last = sessions[sessions.length - 1];
      const diff = first ? last.weight - first.weight : 0;
      const diffStr = diff > 0 ? `+${diff}` : `${diff}`;
      const totalSessions = sessions.length;

      // Volume per session (total reps × weight)
      const volMap = {};
      history.forEach(h => {
        const v = (h.reps || 0) * (h.weight || 0) * (h.per_side ? 2 : 1);
        volMap[h.date] = (volMap[h.date] || 0) + v;
      });

      let html = '<div class="prog-chart-container">';
      html += '<div class="prog-chart-bars">';
      sessions.forEach(s => {
        const h = s.weight > 0 ? Math.max(12, ((s.weight - minW + range * 0.1) / (range * 1.1)) * 100) : 5;
        const isPR = s.weight === maxW && s.weight > 0;
        const shortDate = s.date.slice(5);
        html += `<div class="prog-bar${isPR ? ' prog-bar-pr' : ''}" style="height:${h}%">
          <span class="prog-tip">${shortDate}: ${s.weight}kg${isPR ? ' PR!' : ''}</span>
        </div>`;
      });
      html += '</div>';

      // Labels
      if (sessions.length > 0) {
        html += `<div class="prog-labels">
          <span>${sessions[0].date.slice(5)}</span>
          <span>${sessions[sessions.length - 1].date.slice(5)}</span>
        </div>`;
      }

      // Summary stats
      const lang = getLang();
      html += `<div class="prog-summary">
        <div class="prog-stat">
          <div class="prog-stat-value">${maxW}<span style="font-size:0.7rem">kg</span></div>
          <div class="prog-stat-label">${t('dashMaxWeight')}</div>
        </div>
        <div class="prog-stat">
          <div class="prog-stat-value ${diff > 0 ? 'dash-up' : diff < 0 ? 'dash-down' : ''}">${diffStr}<span style="font-size:0.7rem">kg</span></div>
          <div class="prog-stat-label">${lang === 'es' ? 'Cambio' : 'Change'}</div>
        </div>
        <div class="prog-stat">
          <div class="prog-stat-value">${totalSessions}</div>
          <div class="prog-stat-label">${lang === 'es' ? 'Sesiones' : 'Sessions'}</div>
        </div>
      </div>`;

      html += '</div>';
      progressionChart.innerHTML = html;
    }

    function renderExerciseHistory(history) {
      if (history.length === 0) {
        historySection.innerHTML = `<div class="empty-state">${t('noHistory')}</div>`;
        return;
      }

      const today = localToday();
      const grouped = {};
      history.forEach(h => {
        if (h.date === today) return;
        if (!grouped[h.date]) grouped[h.date] = [];
        grouped[h.date].push(h);
      });

      const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a)).slice(0, 5);

      if (dates.length === 0) {
        historySection.innerHTML = `<div class="empty-state">${t('noHistory')}</div>`;
        return;
      }

      const lang = getLang();
      historySection.innerHTML = dates.map(date => `
        <div class="history-day">
          <div class="date">${date}</div>
          <div class="sets">${grouped[date].map(s => {
            let w = s.weight || '-';
            if (s.per_side && s.weight) w = `${s.weight}/${lang === 'es' ? 'lado' : 'side'} (${s.weight * 2} total)`;
            else if (s.weight) w = `${s.weight} total`;
            return `${t('set')} ${s.set_number}: ${s.reps || '-'} reps x ${w}`;
          }).join(' | ')}</div>
        </div>
      `).join('');
    }
  }

  // --- Admin Panel ---
  let adminExercises = [];
  let editingExerciseId = null;

  function openAdminModal() {
    const modal = document.getElementById('admin-modal');
    modal.classList.remove('hidden');
    document.getElementById('admin-title').textContent = t('admin');
    document.getElementById('admin-tab-users').textContent = t('adminUsers');
    document.getElementById('admin-tab-exercises').textContent = t('adminExercises');
    switchAdminTab('users');
  }

  document.getElementById('admin-back').addEventListener('click', () => {
    document.getElementById('admin-modal').classList.add('hidden');
  });

  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => switchAdminTab(tab.dataset.tab));
  });

  function switchAdminTab(tab) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    document.getElementById('admin-users').classList.toggle('hidden', tab !== 'users');
    document.getElementById('admin-exercises').classList.toggle('hidden', tab !== 'exercises');
    if (tab === 'users') loadAdminUsers();
    else loadAdminExercises();
  }

  async function loadAdminUsers() {
    const container = document.getElementById('admin-users');
    container.innerHTML = '<div class="empty-state">Loading...</div>';
    try {
      const users = await API.getAdminUsers();
      if (!users.length) {
        container.innerHTML = `<div class="empty-state">${t('adminNoUsers')}</div>`;
        return;
      }
      const lang = getLang();
      container.innerHTML = users.map(u => {
        const created = u.created_at ? new Date(u.created_at).toLocaleDateString() : '-';
        const lastLogin = u.last_login ? new Date(u.last_login).toLocaleDateString() : '-';
        return `
          <div class="admin-user-card" data-id="${u.id}">
            <img class="admin-user-avatar" src="${u.picture || ''}" alt="" onerror="this.style.display='none'">
            <div class="admin-user-info">
              <div class="admin-user-name">${u.name || '-'}</div>
              <div class="admin-user-email">${u.email}</div>
              <div class="admin-user-meta">${t('adminCreatedAt')}: ${created} · ${t('adminLastLogin')}: ${lastLogin}</div>
            </div>
            <div class="admin-user-actions">
              <button class="admin-toggle-admin ${u.is_admin ? 'is-admin' : ''}" data-id="${u.id}" data-admin="${u.is_admin}">${t('adminIsAdmin')}</button>
              <button class="admin-btn-del-user" data-id="${u.id}">${t('adminDeleteUser')}</button>
            </div>
          </div>
        `;
      }).join('');

      container.querySelectorAll('.admin-toggle-admin').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const id = btn.dataset.id;
          const newVal = btn.dataset.admin !== 'true';
          await API.updateAdminUser(id, { is_admin: newVal });
          showAdminToast(t('adminSaved'));
          loadAdminUsers();
        });
      });

      container.querySelectorAll('.admin-btn-del-user').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.stopPropagation();
          if (!confirm(t('adminConfirmDeleteUser'))) return;
          await API.deleteAdminUser(btn.dataset.id);
          loadAdminUsers();
        });
      });
    } catch (err) {
      console.error('Admin users error:', err);
      container.innerHTML = '<div class="empty-state">Error loading users</div>';
    }
  }

  async function loadAdminExercises() {
    const container = document.getElementById('admin-exercises');
    container.innerHTML = '<div class="empty-state">Loading...</div>';
    try {
      adminExercises = await API.getAdminExercises();
      const lang = getLang();
      const header = `<div class="admin-exercises-header">
        <span style="color:#94a3b8;font-size:0.85rem">${adminExercises.length} ${t('adminExercises').toLowerCase()}</span>
        <button class="admin-btn-add" id="admin-add-ex">${t('adminAddExercise')}</button>
      </div>`;

      const cards = adminExercises.map(ex => {
        const name = lang === 'es' ? ex.name_es : ex.name_en;
        const iconHtml = ex.icon_svg || (typeof EXERCISE_ICONS !== 'undefined' && EXERCISE_ICONS[ex._id]) || '';
        return `
          <div class="admin-ex-card" data-id="${ex._id}">
            <div class="admin-ex-icon">${iconHtml}</div>
            <div class="admin-ex-info">
              <div class="admin-ex-name">${name}</div>
              <div class="admin-ex-detail">${ex._id}${ex.per_side ? ' · per side' : ''}</div>
            </div>
            <span class="admin-ex-category">${ex.category}</span>
          </div>
        `;
      }).join('');

      container.innerHTML = header + cards;

      document.getElementById('admin-add-ex').addEventListener('click', () => openExerciseEditor(null));
      container.querySelectorAll('.admin-ex-card').forEach(card => {
        card.addEventListener('click', () => {
          const ex = adminExercises.find(e => e._id === card.dataset.id);
          if (ex) openExerciseEditor(ex);
        });
      });
    } catch (err) {
      console.error('Admin exercises error:', err);
      container.innerHTML = '<div class="empty-state">Error loading exercises</div>';
    }
  }

  function openExerciseEditor(ex) {
    editingExerciseId = ex ? ex._id : null;
    const modal = document.getElementById('admin-exercise-modal');
    const title = document.getElementById('admin-exercise-title');
    const idInput = document.getElementById('admin-ex-id');
    const nameEs = document.getElementById('admin-ex-name-es');
    const nameEn = document.getElementById('admin-ex-name-en');
    const category = document.getElementById('admin-ex-category');
    const perSide = document.getElementById('admin-ex-perside');
    const svgInput = document.getElementById('admin-ex-svg');
    const preview = document.getElementById('admin-ex-preview');
    const deleteBtn = document.getElementById('admin-ex-delete');

    title.textContent = ex ? t('adminEditExercise') : t('adminAddExercise');
    idInput.value = ex ? ex._id : '';
    idInput.disabled = !!ex;
    nameEs.value = ex ? ex.name_es : '';
    nameEn.value = ex ? ex.name_en : '';
    category.value = ex ? ex.category : 'chest';
    perSide.checked = ex ? ex.per_side : false;

    const currentSvg = ex?.icon_svg || (typeof EXERCISE_ICONS !== 'undefined' && ex && EXERCISE_ICONS[ex._id]) || '';
    svgInput.value = currentSvg;
    preview.innerHTML = currentSvg;

    deleteBtn.classList.toggle('hidden', !ex);
    modal.classList.remove('hidden');
  }

  document.getElementById('admin-ex-svg').addEventListener('input', function() {
    document.getElementById('admin-ex-preview').innerHTML = this.value;
  });

  document.getElementById('admin-exercise-back').addEventListener('click', () => {
    document.getElementById('admin-exercise-modal').classList.add('hidden');
  });

  document.getElementById('admin-ex-cancel').addEventListener('click', () => {
    document.getElementById('admin-exercise-modal').classList.add('hidden');
  });

  document.getElementById('admin-ex-delete').addEventListener('click', async () => {
    if (!editingExerciseId) return;
    if (!confirm(t('adminConfirmDeleteExercise'))) return;
    await API.deleteAdminExercise(editingExerciseId);
    document.getElementById('admin-exercise-modal').classList.add('hidden');
    showAdminToast(t('adminSaved'));
    loadAdminExercises();
  });

  document.getElementById('admin-exercise-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('admin-ex-id').value.trim();
    const name_es = document.getElementById('admin-ex-name-es').value.trim();
    const name_en = document.getElementById('admin-ex-name-en').value.trim();
    const category = document.getElementById('admin-ex-category').value;
    const per_side = document.getElementById('admin-ex-perside').checked;
    const icon_svg = document.getElementById('admin-ex-svg').value.trim();

    try {
      if (editingExerciseId) {
        await API.updateAdminExercise(editingExerciseId, { name_es, name_en, category, per_side });
        if (icon_svg !== undefined) {
          await API.updateExerciseIcon(editingExerciseId, icon_svg);
        }
      } else {
        await API.createAdminExercise({ _id: id, name_es, name_en, category, per_side, icon_svg });
      }
      document.getElementById('admin-exercise-modal').classList.add('hidden');
      showAdminToast(t('adminSaved'));
      loadAdminExercises();
      // Refresh main exercise list
      exercises = await API.getExercises();
      renderExercises();
    } catch (err) {
      console.error('Save exercise error:', err);
      alert('Error saving exercise');
    }
  });

  function showAdminToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'admin-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1500);
  }

  // Start
  tryAutoLogin();
})();
