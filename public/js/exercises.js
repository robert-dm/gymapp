// SVG stick-figure icons for each exercise, mimicking the gym chart style
// Each returns an SVG string with viewBox="0 0 80 80"
const EXERCISE_ICONS = {
  // ===== CHEST =====
  press_banca: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- bench -->
    <rect x="15" y="52" width="50" height="4" rx="1"/>
    <line x1="20" y1="56" x2="20" y2="68"/>
    <line x1="60" y1="56" x2="60" y2="68"/>
    <!-- person lying -->
    <circle cx="22" cy="44" r="5"/>
    <line x1="27" y1="44" x2="55" y2="44"/>
    <!-- arms up with barbell -->
    <line x1="32" y1="44" x2="32" y2="28"/>
    <line x1="48" y1="44" x2="48" y2="28"/>
    <line x1="24" y1="28" x2="56" y2="28"/>
    <circle cx="22" cy="28" r="3"/>
    <circle cx="58" cy="28" r="3"/>
    <!-- legs -->
    <line x1="55" y1="44" x2="62" y2="56"/>
    <line x1="62" y1="56" x2="62" y2="68"/>
  </svg>`,

  press_inclinado: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- incline bench -->
    <line x1="18" y1="65" x2="45" y2="65"/>
    <line x1="45" y1="65" x2="55" y2="35"/>
    <line x1="18" y1="65" x2="18" y2="72"/>
    <line x1="45" y1="65" x2="45" y2="72"/>
    <!-- person on incline -->
    <circle cx="50" cy="30" r="5"/>
    <line x1="48" y1="35" x2="32" y2="58"/>
    <!-- arms up with barbell -->
    <line x1="44" y1="38" x2="38" y2="18"/>
    <line x1="52" y1="35" x2="58" y2="18"/>
    <line x1="32" y1="18" x2="64" y2="18"/>
    <circle cx="30" cy="18" r="3"/>
    <circle cx="66" cy="18" r="3"/>
    <!-- legs -->
    <line x1="32" y1="58" x2="25" y2="68"/>
    <line x1="32" y1="58" x2="38" y2="68"/>
  </svg>`,

  press_declinado: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- decline bench -->
    <line x1="20" y1="40" x2="55" y2="55"/>
    <line x1="20" y1="40" x2="20" y2="68"/>
    <line x1="55" y1="55" x2="55" y2="68"/>
    <!-- person -->
    <circle cx="25" cy="34" r="5"/>
    <line x1="28" y1="38" x2="52" y2="50"/>
    <!-- arms up -->
    <line x1="34" y1="40" x2="30" y2="22"/>
    <line x1="44" y1="46" x2="50" y2="22"/>
    <line x1="24" y1="22" x2="56" y2="22"/>
    <circle cx="22" cy="22" r="3"/>
    <circle cx="58" cy="22" r="3"/>
    <!-- legs hooked -->
    <line x1="52" y1="50" x2="58" y2="42"/>
    <line x1="58" y1="42" x2="58" y2="36"/>
  </svg>`,

  aperturas: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- bench -->
    <rect x="15" y="50" width="50" height="4" rx="1"/>
    <line x1="20" y1="54" x2="20" y2="66"/>
    <line x1="60" y1="54" x2="60" y2="66"/>
    <!-- person lying -->
    <circle cx="22" cy="42" r="5"/>
    <line x1="27" y1="42" x2="55" y2="42"/>
    <!-- arms spread with dumbbells -->
    <line x1="34" y1="42" x2="20" y2="26"/>
    <line x1="46" y1="42" x2="60" y2="26"/>
    <rect x="16" y="22" width="8" height="4" rx="1"/>
    <rect x="56" y="22" width="8" height="4" rx="1"/>
    <!-- legs -->
    <line x1="55" y1="42" x2="62" y2="55"/>
    <line x1="62" y1="55" x2="62" y2="66"/>
  </svg>`,

  cruces_polea: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- cable towers -->
    <rect x="4" y="8" width="6" height="56" rx="1"/>
    <rect x="70" y="8" width="6" height="56" rx="1"/>
    <!-- cables -->
    <line x1="10" y1="14" x2="32" y2="38"/>
    <line x1="70" y1="14" x2="48" y2="38"/>
    <!-- person -->
    <circle cx="40" cy="24" r="5"/>
    <line x1="40" y1="29" x2="40" y2="52"/>
    <!-- arms pulling cables -->
    <line x1="40" y1="34" x2="32" y2="38"/>
    <line x1="40" y1="34" x2="48" y2="38"/>
    <!-- legs -->
    <line x1="40" y1="52" x2="33" y2="68"/>
    <line x1="40" y1="52" x2="47" y2="68"/>
  </svg>`,

  pullover: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- bench -->
    <rect x="20" y="48" width="40" height="4" rx="1"/>
    <line x1="25" y1="52" x2="25" y2="64"/>
    <line x1="55" y1="52" x2="55" y2="64"/>
    <!-- person lying -->
    <circle cx="28" cy="40" r="5"/>
    <line x1="33" y1="40" x2="55" y2="40"/>
    <!-- arms stretched back with dumbbell -->
    <line x1="28" y1="35" x2="18" y2="20"/>
    <rect x="14" y="16" width="8" height="4" rx="1"/>
    <!-- legs -->
    <line x1="55" y1="40" x2="62" y2="52"/>
    <line x1="62" y1="52" x2="62" y2="64"/>
  </svg>`,

  // ===== BACK =====
  dominadas: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- pull-up bar -->
    <line x1="10" y1="10" x2="70" y2="10"/>
    <line x1="10" y1="10" x2="10" y2="6"/>
    <line x1="70" y1="10" x2="70" y2="6"/>
    <!-- person hanging -->
    <circle cx="40" cy="22" r="5"/>
    <line x1="40" y1="27" x2="40" y2="50"/>
    <!-- arms up gripping bar -->
    <line x1="40" y1="32" x2="28" y2="12"/>
    <line x1="40" y1="32" x2="52" y2="12"/>
    <!-- legs -->
    <line x1="40" y1="50" x2="34" y2="68"/>
    <line x1="40" y1="50" x2="46" y2="68"/>
  </svg>`,

  jalon_pecho: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- machine frame -->
    <line x1="40" y1="4" x2="40" y2="12"/>
    <line x1="25" y1="12" x2="55" y2="12"/>
    <!-- cable -->
    <line x1="40" y1="12" x2="40" y2="24" stroke-dasharray="3,2"/>
    <!-- bar -->
    <line x1="24" y1="24" x2="56" y2="24"/>
    <!-- person seated -->
    <circle cx="40" cy="30" r="5"/>
    <line x1="40" y1="35" x2="40" y2="55"/>
    <!-- arms pulling down -->
    <line x1="40" y1="38" x2="26" y2="26"/>
    <line x1="40" y1="38" x2="54" y2="26"/>
    <!-- seat -->
    <rect x="32" y="55" width="16" height="3" rx="1"/>
    <!-- legs -->
    <line x1="40" y1="58" x2="34" y2="70"/>
    <line x1="40" y1="58" x2="46" y2="70"/>
  </svg>`,

  jalon_tras_nuca: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- machine frame -->
    <line x1="40" y1="4" x2="40" y2="12"/>
    <line x1="22" y1="12" x2="58" y2="12"/>
    <!-- cable -->
    <line x1="40" y1="12" x2="40" y2="20" stroke-dasharray="3,2"/>
    <!-- bar behind neck -->
    <line x1="22" y1="28" x2="58" y2="28"/>
    <!-- person seated -->
    <circle cx="40" cy="32" r="5"/>
    <line x1="40" y1="37" x2="40" y2="56"/>
    <!-- arms behind pulling -->
    <line x1="40" y1="38" x2="24" y2="28"/>
    <line x1="40" y1="38" x2="56" y2="28"/>
    <!-- seat -->
    <rect x="32" y="56" width="16" height="3" rx="1"/>
    <line x1="36" y1="59" x2="32" y2="70"/>
    <line x1="44" y1="59" x2="48" y2="70"/>
  </svg>`,

  remo_barra: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- person bent over -->
    <circle cx="36" cy="20" r="5"/>
    <line x1="38" y1="24" x2="48" y2="42"/>
    <!-- arms down holding barbell -->
    <line x1="42" y1="32" x2="36" y2="44"/>
    <line x1="42" y1="32" x2="48" y2="44"/>
    <!-- barbell -->
    <line x1="28" y1="44" x2="56" y2="44"/>
    <circle cx="26" cy="44" r="3"/>
    <circle cx="58" cy="44" r="3"/>
    <!-- legs -->
    <line x1="48" y1="42" x2="40" y2="65"/>
    <line x1="48" y1="42" x2="56" y2="65"/>
    <line x1="40" y1="65" x2="36" y2="68"/>
    <line x1="56" y1="65" x2="60" y2="68"/>
  </svg>`,

  remo_mancuerna: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- bench -->
    <rect x="10" y="46" width="35" height="4" rx="1"/>
    <line x1="14" y1="50" x2="14" y2="64"/>
    <line x1="42" y1="50" x2="42" y2="64"/>
    <!-- person bent, one knee on bench -->
    <circle cx="48" cy="22" r="5"/>
    <line x1="46" y1="26" x2="38" y2="44"/>
    <!-- support arm on bench -->
    <line x1="42" y1="34" x2="30" y2="44"/>
    <!-- pulling arm with dumbbell -->
    <line x1="42" y1="34" x2="52" y2="42"/>
    <rect x="50" y="40" width="8" height="4" rx="1"/>
    <!-- legs -->
    <line x1="38" y1="44" x2="28" y2="44"/>
    <line x1="38" y1="44" x2="42" y2="64"/>
  </svg>`,

  remo_polea: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- machine/pulley -->
    <rect x="4" y="30" width="6" height="20" rx="1"/>
    <!-- cable -->
    <line x1="10" y1="40" x2="30" y2="40" stroke-dasharray="3,2"/>
    <!-- handle -->
    <line x1="30" y1="36" x2="30" y2="44"/>
    <!-- person seated on floor -->
    <circle cx="48" cy="26" r="5"/>
    <line x1="48" y1="31" x2="48" y2="50"/>
    <!-- arms pulling -->
    <line x1="48" y1="38" x2="32" y2="38"/>
    <line x1="48" y1="38" x2="32" y2="42"/>
    <!-- legs forward -->
    <line x1="48" y1="50" x2="22" y2="54"/>
    <line x1="48" y1="50" x2="22" y2="50"/>
    <line x1="22" y1="54" x2="18" y2="50"/>
    <line x1="22" y1="50" x2="18" y2="46"/>
  </svg>`,

  peso_muerto: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- person standing bent slightly -->
    <circle cx="40" cy="14" r="5"/>
    <line x1="40" y1="19" x2="40" y2="42"/>
    <!-- arms down holding barbell -->
    <line x1="40" y1="30" x2="30" y2="50"/>
    <line x1="40" y1="30" x2="50" y2="50"/>
    <!-- barbell on ground -->
    <line x1="22" y1="50" x2="58" y2="50"/>
    <circle cx="20" cy="50" r="4"/>
    <circle cx="60" cy="50" r="4"/>
    <!-- legs -->
    <line x1="40" y1="42" x2="34" y2="64"/>
    <line x1="40" y1="42" x2="46" y2="64"/>
    <line x1="34" y1="64" x2="30" y2="68"/>
    <line x1="46" y1="64" x2="50" y2="68"/>
  </svg>`,

  hiperextensiones: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- roman chair -->
    <line x1="50" y1="68" x2="50" y2="40"/>
    <line x1="50" y1="40" x2="65" y2="40"/>
    <line x1="25" y1="68" x2="25" y2="50"/>
    <line x1="25" y1="50" x2="50" y2="50"/>
    <!-- person face down, bending -->
    <circle cx="22" cy="34" r="5"/>
    <line x1="26" y1="36" x2="50" y2="44"/>
    <!-- hands behind head -->
    <line x1="24" y1="30" x2="28" y2="26"/>
    <line x1="22" y1="30" x2="18" y2="26"/>
    <!-- legs locked -->
    <line x1="50" y1="44" x2="62" y2="40"/>
    <line x1="62" y1="40" x2="68" y2="44"/>
  </svg>`,

  pullover_mancuerna: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- bench -->
    <rect x="20" y="48" width="40" height="4" rx="1"/>
    <line x1="25" y1="52" x2="25" y2="64"/>
    <line x1="55" y1="52" x2="55" y2="64"/>
    <!-- person lying -->
    <circle cx="28" cy="40" r="5"/>
    <line x1="33" y1="40" x2="55" y2="40"/>
    <!-- arms stretched back with dumbbell -->
    <line x1="28" y1="35" x2="15" y2="18"/>
    <circle cx="13" cy="15" r="4"/>
    <!-- legs -->
    <line x1="55" y1="40" x2="62" y2="52"/>
    <line x1="62" y1="52" x2="62" y2="64"/>
  </svg>`,

  // ===== SHOULDERS =====
  press_militar: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- person standing -->
    <circle cx="40" cy="18" r="5"/>
    <line x1="40" y1="23" x2="40" y2="48"/>
    <!-- arms pressing barbell overhead -->
    <line x1="40" y1="30" x2="28" y2="22"/>
    <line x1="28" y1="22" x2="24" y2="8"/>
    <line x1="40" y1="30" x2="52" y2="22"/>
    <line x1="52" y1="22" x2="56" y2="8"/>
    <!-- barbell -->
    <line x1="18" y1="8" x2="62" y2="8"/>
    <circle cx="16" cy="8" r="3"/>
    <circle cx="64" cy="8" r="3"/>
    <!-- legs -->
    <line x1="40" y1="48" x2="34" y2="68"/>
    <line x1="40" y1="48" x2="46" y2="68"/>
  </svg>`,

  elevaciones_laterales: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- person standing -->
    <circle cx="40" cy="16" r="5"/>
    <line x1="40" y1="21" x2="40" y2="46"/>
    <!-- arms raised to sides with dumbbells -->
    <line x1="40" y1="28" x2="18" y2="28"/>
    <line x1="40" y1="28" x2="62" y2="28"/>
    <rect x="10" y="26" width="8" height="4" rx="1"/>
    <rect x="62" y="26" width="8" height="4" rx="1"/>
    <!-- legs -->
    <line x1="40" y1="46" x2="34" y2="68"/>
    <line x1="40" y1="46" x2="46" y2="68"/>
  </svg>`,

  elevaciones_frontales: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- person standing (side view) -->
    <circle cx="44" cy="16" r="5"/>
    <line x1="44" y1="21" x2="44" y2="46"/>
    <!-- one arm raised forward with dumbbell -->
    <line x1="44" y1="28" x2="22" y2="18"/>
    <rect x="16" y="16" width="6" height="4" rx="1"/>
    <!-- other arm down -->
    <line x1="44" y1="28" x2="50" y2="42"/>
    <rect x="48" y="40" width="6" height="4" rx="1"/>
    <!-- legs -->
    <line x1="44" y1="46" x2="38" y2="68"/>
    <line x1="44" y1="46" x2="50" y2="68"/>
  </svg>`,

  pajaros: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- person bent forward -->
    <circle cx="40" cy="22" r="5"/>
    <line x1="40" y1="27" x2="44" y2="44"/>
    <!-- trunk bent -->
    <line x1="40" y1="27" x2="40" y2="32"/>
    <!-- arms spread out to sides (rear delts) -->
    <line x1="42" y1="34" x2="18" y2="24"/>
    <line x1="42" y1="34" x2="66" y2="24"/>
    <rect x="12" y="22" width="6" height="4" rx="1"/>
    <rect x="64" y="22" width="6" height="4" rx="1"/>
    <!-- legs -->
    <line x1="44" y1="44" x2="36" y2="66"/>
    <line x1="44" y1="44" x2="52" y2="66"/>
  </svg>`,

  remo_menton: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- person standing -->
    <circle cx="40" cy="14" r="5"/>
    <line x1="40" y1="19" x2="40" y2="46"/>
    <!-- arms pulling barbell up to chin -->
    <line x1="40" y1="26" x2="30" y2="20"/>
    <line x1="30" y1="20" x2="32" y2="26"/>
    <line x1="40" y1="26" x2="50" y2="20"/>
    <line x1="50" y1="20" x2="48" y2="26"/>
    <!-- barbell at chin level -->
    <line x1="28" y1="26" x2="52" y2="26"/>
    <circle cx="26" cy="26" r="3"/>
    <circle cx="54" cy="26" r="3"/>
    <!-- legs -->
    <line x1="40" y1="46" x2="34" y2="68"/>
    <line x1="40" y1="46" x2="46" y2="68"/>
  </svg>`,

  encogimientos: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- person standing, shoulders raised -->
    <circle cx="40" cy="12" r="5"/>
    <line x1="40" y1="17" x2="40" y2="46"/>
    <!-- shoulders up (trapezius) -->
    <line x1="36" y1="17" x2="32" y2="15"/>
    <line x1="44" y1="17" x2="48" y2="15"/>
    <!-- arms down holding dumbbells -->
    <line x1="40" y1="24" x2="26" y2="42"/>
    <line x1="40" y1="24" x2="54" y2="42"/>
    <rect x="22" y="40" width="6" height="8" rx="1"/>
    <rect x="52" y="40" width="6" height="8" rx="1"/>
    <!-- legs -->
    <line x1="40" y1="46" x2="34" y2="68"/>
    <line x1="40" y1="46" x2="46" y2="68"/>
  </svg>`,

  // ===== BICEPS =====
  curl_barra: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- person standing -->
    <circle cx="40" cy="12" r="5"/>
    <line x1="40" y1="17" x2="40" y2="46"/>
    <!-- arms curling barbell -->
    <line x1="40" y1="26" x2="32" y2="30"/>
    <line x1="32" y1="30" x2="30" y2="22"/>
    <line x1="40" y1="26" x2="48" y2="30"/>
    <line x1="48" y1="30" x2="50" y2="22"/>
    <!-- barbell -->
    <line x1="24" y1="22" x2="56" y2="22"/>
    <circle cx="22" cy="22" r="3"/>
    <circle cx="58" cy="22" r="3"/>
    <!-- legs -->
    <line x1="40" y1="46" x2="34" y2="68"/>
    <line x1="40" y1="46" x2="46" y2="68"/>
  </svg>`,

  curl_alterno: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- person standing -->
    <circle cx="40" cy="12" r="5"/>
    <line x1="40" y1="17" x2="40" y2="46"/>
    <!-- right arm curling up -->
    <line x1="40" y1="26" x2="50" y2="30"/>
    <line x1="50" y1="30" x2="52" y2="20"/>
    <rect x="50" y="16" width="6" height="4" rx="1"/>
    <!-- left arm down -->
    <line x1="40" y1="26" x2="28" y2="40"/>
    <rect x="24" y="38" width="6" height="4" rx="1"/>
    <!-- legs -->
    <line x1="40" y1="46" x2="34" y2="68"/>
    <line x1="40" y1="46" x2="46" y2="68"/>
  </svg>`,

  curl_concentrado: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- person seated, leaning forward -->
    <circle cx="42" cy="18" r="5"/>
    <!-- seated bench -->
    <rect x="30" y="42" width="28" height="4" rx="1"/>
    <!-- torso leaning -->
    <line x1="42" y1="23" x2="44" y2="42"/>
    <!-- arm curling between legs -->
    <line x1="42" y1="32" x2="36" y2="40"/>
    <line x1="36" y1="40" x2="34" y2="30"/>
    <rect x="30" y="26" width="6" height="4" rx="1"/>
    <!-- other arm on knee -->
    <line x1="44" y1="32" x2="52" y2="40"/>
    <!-- legs spread -->
    <line x1="38" y1="46" x2="28" y2="66"/>
    <line x1="52" y1="46" x2="62" y2="66"/>
  </svg>`,

  curl_martillo: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- person standing -->
    <circle cx="40" cy="12" r="5"/>
    <line x1="40" y1="17" x2="40" y2="46"/>
    <!-- right arm curling (hammer grip - vertical dumbbell) -->
    <line x1="40" y1="26" x2="50" y2="30"/>
    <line x1="50" y1="30" x2="52" y2="20"/>
    <rect x="50" y="14" width="4" height="8" rx="1"/>
    <!-- left arm down (hammer grip) -->
    <line x1="40" y1="26" x2="28" y2="40"/>
    <rect x="26" y="36" width="4" height="8" rx="1"/>
    <!-- legs -->
    <line x1="40" y1="46" x2="34" y2="68"/>
    <line x1="40" y1="46" x2="46" y2="68"/>
  </svg>`,

  curl_scott: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- preacher bench pad -->
    <line x1="22" y1="28" x2="42" y2="48"/>
    <line x1="42" y1="48" x2="42" y2="64"/>
    <line x1="38" y1="64" x2="46" y2="64"/>
    <!-- person behind pad -->
    <circle cx="50" cy="20" r="5"/>
    <line x1="50" y1="25" x2="50" y2="50"/>
    <!-- arms on pad curling -->
    <line x1="50" y1="30" x2="36" y2="36"/>
    <line x1="36" y1="36" x2="28" y2="30"/>
    <!-- barbell -->
    <line x1="22" y1="30" x2="34" y2="30"/>
    <circle cx="20" cy="30" r="3"/>
    <!-- seat -->
    <line x1="50" y1="50" x2="44" y2="66"/>
    <line x1="50" y1="50" x2="56" y2="66"/>
  </svg>`,

  curl_misionero_maquina: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- machine frame -->
    <rect x="18" y="10" width="4" height="54" rx="1"/>
    <rect x="14" y="60" width="12" height="4" rx="1"/>
    <!-- pad -->
    <line x1="22" y1="30" x2="42" y2="48"/>
    <!-- person seated -->
    <circle cx="52" cy="22" r="5"/>
    <line x1="52" y1="27" x2="52" y2="50"/>
    <!-- arms on pad curling -->
    <line x1="52" y1="32" x2="38" y2="38"/>
    <line x1="38" y1="38" x2="30" y2="32"/>
    <!-- handle -->
    <rect x="26" y="30" width="8" height="3" rx="1"/>
    <!-- seat -->
    <line x1="52" y1="50" x2="46" y2="66"/>
    <line x1="52" y1="50" x2="58" y2="66"/>
  </svg>`,

  // ===== TRICEPS =====
  triceps_polea: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- cable machine -->
    <rect x="34" y="2" width="12" height="8" rx="1"/>
    <!-- cable -->
    <line x1="40" y1="10" x2="40" y2="28" stroke-dasharray="3,2"/>
    <!-- handle -->
    <line x1="36" y1="28" x2="44" y2="28"/>
    <!-- person standing -->
    <circle cx="40" cy="22" r="5"/>
    <line x1="40" y1="27" x2="40" y2="50"/>
    <!-- arms pushing down -->
    <line x1="40" y1="32" x2="36" y2="28"/>
    <line x1="36" y1="28" x2="36" y2="42"/>
    <line x1="40" y1="32" x2="44" y2="28"/>
    <line x1="44" y1="28" x2="44" y2="42"/>
    <!-- legs -->
    <line x1="40" y1="50" x2="34" y2="68"/>
    <line x1="40" y1="50" x2="46" y2="68"/>
  </svg>`,

  press_frances: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- bench -->
    <rect x="15" y="46" width="50" height="4" rx="1"/>
    <line x1="20" y1="50" x2="20" y2="62"/>
    <line x1="60" y1="50" x2="60" y2="62"/>
    <!-- person lying -->
    <circle cx="22" cy="38" r="5"/>
    <line x1="27" y1="38" x2="55" y2="38"/>
    <!-- arms: upper arm vertical, forearm back over head -->
    <line x1="35" y1="38" x2="35" y2="24"/>
    <line x1="35" y1="24" x2="22" y2="22"/>
    <line x1="45" y1="38" x2="45" y2="24"/>
    <line x1="45" y1="24" x2="22" y2="22"/>
    <!-- barbell near forehead -->
    <line x1="18" y1="20" x2="26" y2="24"/>
    <circle cx="16" cy="20" r="3"/>
    <!-- legs -->
    <line x1="55" y1="38" x2="62" y2="50"/>
    <line x1="62" y1="50" x2="62" y2="62"/>
  </svg>`,

  patada_triceps: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- person bent over -->
    <circle cx="30" cy="22" r="5"/>
    <line x1="32" y1="26" x2="46" y2="40"/>
    <!-- support arm on bench -->
    <line x1="36" y1="32" x2="28" y2="44"/>
    <!-- bench -->
    <rect x="14" y="44" width="20" height="3" rx="1"/>
    <!-- kicking arm back -->
    <line x1="40" y1="34" x2="42" y2="34"/>
    <line x1="42" y1="34" x2="62" y2="30"/>
    <rect x="60" y="28" width="6" height="4" rx="1"/>
    <!-- legs -->
    <line x1="46" y1="40" x2="38" y2="62"/>
    <line x1="46" y1="40" x2="54" y2="62"/>
  </svg>`,

  fondos: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- parallel bars -->
    <line x1="18" y1="24" x2="18" y2="60"/>
    <line x1="62" y1="24" x2="62" y2="60"/>
    <line x1="14" y1="24" x2="26" y2="24"/>
    <line x1="54" y1="24" x2="66" y2="24"/>
    <!-- person between bars -->
    <circle cx="40" cy="18" r="5"/>
    <line x1="40" y1="23" x2="40" y2="46"/>
    <!-- arms on bars -->
    <line x1="40" y1="28" x2="22" y2="24"/>
    <line x1="40" y1="28" x2="58" y2="24"/>
    <!-- legs hanging -->
    <line x1="40" y1="46" x2="36" y2="64"/>
    <line x1="40" y1="46" x2="44" y2="64"/>
  </svg>`,

  extension_triceps: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- person standing -->
    <circle cx="40" cy="16" r="5"/>
    <line x1="40" y1="21" x2="40" y2="48"/>
    <!-- arms overhead with dumbbell -->
    <line x1="40" y1="28" x2="36" y2="20"/>
    <line x1="36" y1="20" x2="38" y2="8"/>
    <line x1="40" y1="28" x2="44" y2="20"/>
    <line x1="44" y1="20" x2="42" y2="8"/>
    <rect x="35" y="4" width="10" height="4" rx="1"/>
    <!-- legs -->
    <line x1="40" y1="48" x2="34" y2="68"/>
    <line x1="40" y1="48" x2="46" y2="68"/>
  </svg>`,

  // ===== LEGS =====
  sentadillas: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- person squatting with barbell on shoulders -->
    <circle cx="40" cy="16" r="5"/>
    <line x1="40" y1="21" x2="40" y2="40"/>
    <!-- barbell on shoulders -->
    <line x1="22" y1="24" x2="58" y2="24"/>
    <circle cx="20" cy="24" r="3"/>
    <circle cx="60" cy="24" r="3"/>
    <!-- arms holding bar -->
    <line x1="40" y1="28" x2="30" y2="24"/>
    <line x1="40" y1="28" x2="50" y2="24"/>
    <!-- legs squatting -->
    <line x1="40" y1="40" x2="30" y2="52"/>
    <line x1="30" y1="52" x2="28" y2="66"/>
    <line x1="40" y1="40" x2="50" y2="52"/>
    <line x1="50" y1="52" x2="52" y2="66"/>
    <line x1="28" y1="66" x2="22" y2="68"/>
    <line x1="52" y1="66" x2="58" y2="68"/>
  </svg>`,

  prensa: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- leg press machine frame -->
    <line x1="10" y1="68" x2="70" y2="68"/>
    <line x1="60" y1="68" x2="70" y2="20"/>
    <!-- sled -->
    <line x1="40" y1="30" x2="65" y2="25"/>
    <line x1="40" y1="36" x2="65" y2="31"/>
    <!-- person seated reclined -->
    <circle cx="24" cy="38" r="5"/>
    <line x1="24" y1="43" x2="24" y2="60"/>
    <!-- legs pushing -->
    <line x1="24" y1="54" x2="36" y2="42"/>
    <line x1="36" y1="42" x2="44" y2="34"/>
    <line x1="24" y1="54" x2="38" y2="46"/>
    <line x1="38" y1="46" x2="44" y2="36"/>
    <!-- back rest -->
    <line x1="14" y1="66" x2="20" y2="34"/>
  </svg>`,

  extensiones_cuadriceps: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- machine seat -->
    <rect x="20" y="38" width="28" height="4" rx="1"/>
    <line x1="48" y1="42" x2="48" y2="66"/>
    <line x1="20" y1="42" x2="20" y2="66"/>
    <!-- back rest -->
    <line x1="20" y1="38" x2="20" y2="18"/>
    <!-- person seated -->
    <circle cx="30" cy="24" r="5"/>
    <line x1="30" y1="29" x2="34" y2="38"/>
    <!-- arms holding seat -->
    <line x1="30" y1="34" x2="24" y2="38"/>
    <line x1="30" y1="34" x2="40" y2="38"/>
    <!-- legs extending -->
    <line x1="40" y1="42" x2="48" y2="42"/>
    <line x1="48" y1="42" x2="60" y2="30"/>
    <!-- pad on ankles -->
    <circle cx="60" cy="30" r="3"/>
  </svg>`,

  curl_femoral: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- machine bench -->
    <rect x="10" y="34" width="50" height="4" rx="1"/>
    <line x1="14" y1="38" x2="14" y2="56"/>
    <line x1="56" y1="38" x2="56" y2="56"/>
    <!-- person lying face down -->
    <circle cx="18" cy="28" r="5"/>
    <line x1="22" y1="30" x2="54" y2="30"/>
    <!-- legs curling up -->
    <line x1="54" y1="30" x2="60" y2="30"/>
    <line x1="60" y1="30" x2="58" y2="16"/>
    <!-- pad on ankles -->
    <circle cx="58" cy="14" r="3"/>
    <!-- arms holding bench -->
    <line x1="18" y1="30" x2="14" y2="34"/>
  </svg>`,

  zancadas: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- person in lunge position -->
    <circle cx="40" cy="12" r="5"/>
    <line x1="40" y1="17" x2="40" y2="38"/>
    <!-- arms holding dumbbells at sides -->
    <line x1="40" y1="24" x2="30" y2="38"/>
    <line x1="40" y1="24" x2="50" y2="38"/>
    <rect x="26" y="36" width="6" height="4" rx="1"/>
    <rect x="48" y="36" width="6" height="4" rx="1"/>
    <!-- front leg bent -->
    <line x1="40" y1="38" x2="30" y2="52"/>
    <line x1="30" y1="52" x2="28" y2="66"/>
    <line x1="28" y1="66" x2="22" y2="68"/>
    <!-- back leg stretched -->
    <line x1="40" y1="38" x2="54" y2="50"/>
    <line x1="54" y1="50" x2="62" y2="62"/>
    <line x1="62" y1="62" x2="64" y2="68"/>
  </svg>`,

  elevacion_talones: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- person standing on toes -->
    <circle cx="40" cy="10" r="5"/>
    <line x1="40" y1="15" x2="40" y2="42"/>
    <!-- barbell on shoulders -->
    <line x1="26" y1="20" x2="54" y2="20"/>
    <circle cx="24" cy="20" r="3"/>
    <circle cx="56" cy="20" r="3"/>
    <!-- arms on bar -->
    <line x1="40" y1="24" x2="32" y2="20"/>
    <line x1="40" y1="24" x2="48" y2="20"/>
    <!-- legs straight, on toes -->
    <line x1="40" y1="42" x2="36" y2="60"/>
    <line x1="40" y1="42" x2="44" y2="60"/>
    <!-- elevated platform -->
    <rect x="28" y="64" width="24" height="4" rx="1"/>
    <!-- toes on edge -->
    <line x1="36" y1="60" x2="36" y2="64"/>
    <line x1="44" y1="60" x2="44" y2="64"/>
  </svg>`,

  aductores: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- machine seat -->
    <rect x="25" y="36" width="30" height="4" rx="1"/>
    <line x1="40" y1="40" x2="40" y2="60"/>
    <!-- back rest -->
    <line x1="25" y1="36" x2="25" y2="14"/>
    <!-- person seated -->
    <circle cx="36" cy="22" r="5"/>
    <line x1="36" y1="27" x2="38" y2="36"/>
    <!-- legs squeezing inward (arrows inward) -->
    <line x1="32" y1="40" x2="22" y2="56"/>
    <line x1="48" y1="40" x2="58" y2="56"/>
    <!-- pads -->
    <line x1="22" y1="50" x2="22" y2="62"/>
    <line x1="58" y1="50" x2="58" y2="62"/>
    <!-- arrows inward -->
    <polyline points="28,52 34,52 32,50"/>
    <polyline points="52,52 46,52 48,50"/>
  </svg>`,

  abductores: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- machine seat -->
    <rect x="25" y="36" width="30" height="4" rx="1"/>
    <line x1="40" y1="40" x2="40" y2="60"/>
    <!-- back rest -->
    <line x1="25" y1="36" x2="25" y2="14"/>
    <!-- person seated -->
    <circle cx="36" cy="22" r="5"/>
    <line x1="36" y1="27" x2="38" y2="36"/>
    <!-- legs pushing outward -->
    <line x1="32" y1="40" x2="18" y2="56"/>
    <line x1="48" y1="40" x2="62" y2="56"/>
    <!-- pads -->
    <line x1="18" y1="50" x2="18" y2="62"/>
    <line x1="62" y1="50" x2="62" y2="62"/>
    <!-- arrows outward -->
    <polyline points="22,52 16,52 18,50"/>
    <polyline points="58,52 64,52 62,50"/>
  </svg>`,

  // ===== ABS =====
  abdominales: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- floor -->
    <line x1="8" y1="62" x2="72" y2="62"/>
    <!-- person doing crunch -->
    <circle cx="38" cy="36" r="5"/>
    <!-- torso rising -->
    <line x1="38" y1="41" x2="42" y2="56"/>
    <!-- arms behind head -->
    <line x1="36" y1="34" x2="42" y2="30"/>
    <line x1="40" y1="34" x2="46" y2="30"/>
    <!-- legs bent -->
    <line x1="42" y1="56" x2="52" y2="46"/>
    <line x1="52" y1="46" x2="54" y2="58"/>
    <line x1="54" y1="58" x2="58" y2="62"/>
    <line x1="42" y1="56" x2="48" y2="50"/>
    <line x1="48" y1="50" x2="48" y2="58"/>
    <line x1="48" y1="58" x2="52" y2="62"/>
  </svg>`,

  elevacion_piernas: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- pull-up bar -->
    <line x1="10" y1="6" x2="70" y2="6"/>
    <!-- person hanging -->
    <circle cx="40" cy="16" r="5"/>
    <line x1="40" y1="21" x2="40" y2="42"/>
    <!-- arms up gripping bar -->
    <line x1="40" y1="26" x2="34" y2="8"/>
    <line x1="40" y1="26" x2="46" y2="8"/>
    <!-- legs raised forward -->
    <line x1="40" y1="42" x2="28" y2="42"/>
    <line x1="40" y1="42" x2="26" y2="46"/>
    <line x1="28" y1="42" x2="22" y2="42"/>
    <line x1="26" y1="46" x2="20" y2="46"/>
  </svg>`,

  oblicuos: `<svg viewBox="0 0 80 80" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- floor -->
    <line x1="8" y1="62" x2="72" y2="62"/>
    <!-- person doing side crunch -->
    <circle cx="34" cy="34" r="5"/>
    <!-- torso twisting -->
    <line x1="36" y1="38" x2="44" y2="54"/>
    <!-- arms: one behind head, one reaching across -->
    <line x1="32" y1="32" x2="38" y2="28"/>
    <line x1="38" y1="40" x2="52" y2="46"/>
    <!-- legs bent on floor -->
    <line x1="44" y1="54" x2="52" y2="48"/>
    <line x1="52" y1="48" x2="58" y2="58"/>
    <line x1="58" y1="58" x2="62" y2="62"/>
    <line x1="44" y1="54" x2="46" y2="58"/>
    <line x1="46" y1="58" x2="50" y2="62"/>
  </svg>`,
};
