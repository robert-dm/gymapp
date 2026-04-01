// Step-by-step exercise instructions with SVG step icons
// Each exercise has steps: { icon: SVG string, es: Spanish text, en: English text }
const EXERCISE_INSTRUCTIONS = {

  // ===== CHEST =====

  press_banca: [
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><rect x="5" y="24" width="30" height="3" rx="1"/><circle cx="12" cy="20" r="3"/><line x1="15" y1="20" x2="30" y2="20"/><line x1="30" y1="20" x2="34" y2="26"/></svg>`,
      es: 'Acuéstate en el banco plano con los pies firmes en el suelo. Los ojos deben quedar debajo de la barra.',
      en: 'Lie flat on the bench with feet firmly on the floor. Your eyes should be directly under the bar.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><line x1="8" y1="14" x2="32" y2="14"/><circle cx="6" cy="14" r="2"/><circle cx="34" cy="14" r="2"/><line x1="14" y1="14" x2="14" y2="22"/><line x1="26" y1="14" x2="26" y2="22"/></svg>`,
      es: 'Agarra la barra con las manos un poco más anchas que los hombros. Aprieta las escápulas contra el banco.',
      en: 'Grip the bar slightly wider than shoulder-width. Squeeze your shoulder blades together against the bench.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><line x1="8" y1="10" x2="32" y2="10"/><circle cx="6" cy="10" r="2"/><circle cx="34" cy="10" r="2"/><line x1="14" y1="10" x2="16" y2="20"/><line x1="26" y1="10" x2="24" y2="20"/><path d="M16 20 L20 24 L24 20" stroke-dasharray="2,1"/></svg>`,
      es: 'Desenganchá la barra y bajala controladamente hasta el pecho medio, codos a ~75 grados.',
      en: 'Unrack the bar and lower it in a controlled manner to your mid-chest, elbows at ~75 degrees.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><line x1="8" y1="10" x2="32" y2="10"/><circle cx="6" cy="10" r="2"/><circle cx="34" cy="10" r="2"/><line x1="14" y1="10" x2="14" y2="22"/><line x1="26" y1="10" x2="26" y2="22"/><path d="M18 18 L20 14 L22 18" fill="none"/></svg>`,
      es: 'Empujá la barra hacia arriba hasta extender los brazos completamente. Exhalá al subir.',
      en: 'Push the bar up until arms are fully extended. Exhale on the way up.'
    },
  ],

  press_banca_mancuernas: [
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><rect x="5" y="24" width="30" height="3" rx="1"/><circle cx="12" cy="20" r="3"/><line x1="15" y1="20" x2="30" y2="20"/><rect x="8" y="12" width="5" height="3" rx="1"/><rect x="26" y="12" width="5" height="3" rx="1"/></svg>`,
      es: 'Sentate en el banco con una mancuerna en cada mano sobre los muslos. Acuéstate llevándolas al pecho.',
      en: 'Sit on the bench with a dumbbell on each thigh. Lie back bringing them to chest level.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><rect x="8" y="10" width="6" height="3" rx="1"/><rect x="26" y="10" width="6" height="3" rx="1"/><line x1="14" y1="12" x2="16" y2="22"/><line x1="26" y1="12" x2="24" y2="22"/></svg>`,
      es: 'Con las palmas mirando hacia adelante, empujá las mancuernas hacia arriba hasta extender los brazos.',
      en: 'With palms facing forward, press the dumbbells up until arms are fully extended.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><rect x="6" y="18" width="6" height="3" rx="1"/><rect x="28" y="18" width="6" height="3" rx="1"/><line x1="12" y1="19" x2="16" y2="24"/><line x1="28" y1="19" x2="24" y2="24"/><path d="M16 24 L20 28 L24 24" stroke-dasharray="2,1"/></svg>`,
      es: 'Bajá las mancuernas de forma controlada hasta que los codos queden a la altura del pecho.',
      en: 'Lower the dumbbells in a controlled manner until elbows are at chest level.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><rect x="8" y="10" width="6" height="3" rx="1"/><rect x="26" y="10" width="6" height="3" rx="1"/><path d="M18 18 L20 14 L22 18" fill="none"/></svg>`,
      es: 'Empujá hacia arriba juntando ligeramente las mancuernas en la parte superior. Repetí.',
      en: 'Press up, bringing the dumbbells slightly together at the top. Repeat.'
    },
  ],

  press_inclinado: [
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><line x1="8" y1="32" x2="22" y2="32"/><line x1="22" y1="32" x2="30" y2="16"/><circle cx="28" cy="12" r="3"/></svg>`,
      es: 'Ajustá el banco a 30-45 grados. Acuéstate con la espalda bien apoyada y los pies en el suelo.',
      en: 'Set the bench to 30-45 degrees. Lie back with your back firmly against the pad, feet on the floor.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><line x1="10" y1="8" x2="30" y2="8"/><circle cx="8" cy="8" r="2"/><circle cx="32" cy="8" r="2"/><line x1="16" y1="8" x2="18" y2="16"/><line x1="24" y1="8" x2="22" y2="16"/></svg>`,
      es: 'Agarrá la barra con agarre medio, desenganchá y sostenela con los brazos extendidos sobre el pecho superior.',
      en: 'Grip the bar at medium width, unrack and hold with extended arms above the upper chest.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><line x1="10" y1="16" x2="30" y2="16"/><circle cx="8" cy="16" r="2"/><circle cx="32" cy="16" r="2"/><path d="M16 20 L20 24 L24 20" stroke-dasharray="2,1"/></svg>`,
      es: 'Bajá la barra hasta la parte superior del pecho, controlando la bajada.',
      en: 'Lower the bar to the upper chest area, controlling the descent.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><line x1="10" y1="8" x2="30" y2="8"/><circle cx="8" cy="8" r="2"/><circle cx="32" cy="8" r="2"/><path d="M18 16 L20 10 L22 16" fill="none"/></svg>`,
      es: 'Empujá la barra hacia arriba hasta la extensión completa. Exhalá al empujar.',
      en: 'Push the bar up to full extension. Exhale as you push.'
    },
  ],

  press_inclinado_mancuernas: [
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><line x1="8" y1="32" x2="22" y2="32"/><line x1="22" y1="32" x2="30" y2="16"/><circle cx="28" cy="12" r="3"/><rect x="24" y="6" width="5" height="3" rx="1"/></svg>`,
      es: 'Ajustá el banco a 30-45 grados. Sentate con las mancuernas en los muslos y acuéstate llevándolas arriba.',
      en: 'Set bench to 30-45 degrees. Sit with dumbbells on thighs, lie back bringing them up.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><rect x="8" y="8" width="6" height="3" rx="1"/><rect x="26" y="8" width="6" height="3" rx="1"/><line x1="14" y1="10" x2="16" y2="20"/><line x1="26" y1="10" x2="24" y2="20"/></svg>`,
      es: 'Empujá las mancuernas hacia arriba con las palmas mirando al frente hasta extender los brazos.',
      en: 'Press dumbbells up with palms facing forward until arms are fully extended.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><rect x="6" y="16" width="6" height="3" rx="1"/><rect x="28" y="16" width="6" height="3" rx="1"/><path d="M16 22 L20 26 L24 22" stroke-dasharray="2,1"/></svg>`,
      es: 'Bajá controladamente hasta que los codos queden a 90 grados. Sentí el estiramiento en el pecho.',
      en: 'Lower in a controlled manner until elbows are at 90 degrees. Feel the stretch in the chest.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><rect x="8" y="8" width="6" height="3" rx="1"/><rect x="26" y="8" width="6" height="3" rx="1"/><path d="M18 16 L20 10 L22 16" fill="none"/></svg>`,
      es: 'Empujá hacia arriba contrayendo el pecho. Las mancuernas se juntan levemente arriba.',
      en: 'Press up squeezing the chest. Dumbbells come slightly together at the top.'
    },
  ],

  press_declinado: [
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><line x1="8" y1="16" x2="30" y2="26"/><circle cx="10" cy="12" r="3"/><line x1="30" y1="26" x2="32" y2="20"/></svg>`,
      es: 'Ajustá el banco en declinación (15-30 grados). Asegurá los pies en los soportes y acuéstate.',
      en: 'Set the bench to a decline (15-30 degrees). Secure your feet under the pads and lie down.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><line x1="10" y1="10" x2="30" y2="10"/><circle cx="8" cy="10" r="2"/><circle cx="32" cy="10" r="2"/><line x1="16" y1="10" x2="16" y2="18"/><line x1="24" y1="10" x2="24" y2="18"/></svg>`,
      es: 'Agarrá la barra a la anchura de los hombros. Desenganchá y sostenela sobre el pecho inferior.',
      en: 'Grip the bar at shoulder width. Unrack and hold it above the lower chest.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><line x1="10" y1="18" x2="30" y2="18"/><circle cx="8" cy="18" r="2"/><circle cx="32" cy="18" r="2"/><path d="M16 22 L20 26 L24 22" stroke-dasharray="2,1"/></svg>`,
      es: 'Bajá la barra al pecho inferior de forma controlada.',
      en: 'Lower the bar to the lower chest in a controlled manner.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><line x1="10" y1="10" x2="30" y2="10"/><circle cx="8" cy="10" r="2"/><circle cx="32" cy="10" r="2"/><path d="M18 18 L20 12 L22 18" fill="none"/></svg>`,
      es: 'Empujá hacia arriba hasta la extensión completa. Enfocate en la contracción del pecho inferior.',
      en: 'Push up to full extension. Focus on the lower chest contraction.'
    },
  ],

  aperturas: [
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><rect x="5" y="24" width="30" height="3" rx="1"/><circle cx="12" cy="20" r="3"/><line x1="15" y1="20" x2="30" y2="20"/><rect x="14" y="14" width="5" height="3" rx="1"/><rect x="22" y="14" width="5" height="3" rx="1"/></svg>`,
      es: 'Acuéstate en banco plano con una mancuerna en cada mano, brazos extendidos sobre el pecho.',
      en: 'Lie on a flat bench with a dumbbell in each hand, arms extended above the chest.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><rect x="4" y="16" width="5" height="3" rx="1"/><rect x="31" y="16" width="5" height="3" rx="1"/><line x1="9" y1="17" x2="16" y2="24"/><line x1="31" y1="17" x2="24" y2="24"/></svg>`,
      es: 'Abrí los brazos en arco hacia los lados, con los codos ligeramente flexionados. Bajá hasta sentir estiramiento.',
      en: 'Open your arms in an arc to the sides, elbows slightly bent. Lower until you feel a stretch.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><rect x="14" y="10" width="5" height="3" rx="1"/><rect x="22" y="10" width="5" height="3" rx="1"/><path d="M10 20 Q20 8 30 20" fill="none" stroke-dasharray="2,1"/></svg>`,
      es: 'Volvé a subir las mancuernas en arco, como abrazando un árbol. Contraé el pecho arriba.',
      en: 'Bring the dumbbells back up in an arc, like hugging a tree. Squeeze the chest at the top.'
    },
  ],

  aperturas_inclinadas: [
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><line x1="8" y1="32" x2="22" y2="32"/><line x1="22" y1="32" x2="30" y2="16"/><circle cx="28" cy="12" r="3"/></svg>`,
      es: 'Ajustá el banco a 30-45 grados. Acuéstate con una mancuerna en cada mano, brazos extendidos arriba.',
      en: 'Set bench to 30-45 degrees. Lie back with a dumbbell in each hand, arms extended above.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><rect x="4" y="16" width="5" height="3" rx="1"/><rect x="31" y="16" width="5" height="3" rx="1"/><line x1="9" y1="17" x2="16" y2="24"/><line x1="31" y1="17" x2="24" y2="24"/></svg>`,
      es: 'Abrí los brazos en arco a los lados manteniendo los codos levemente flexionados.',
      en: 'Open arms in an arc to the sides keeping elbows slightly bent.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><rect x="14" y="10" width="5" height="3" rx="1"/><rect x="22" y="10" width="5" height="3" rx="1"/><path d="M10 20 Q20 8 30 20" fill="none" stroke-dasharray="2,1"/></svg>`,
      es: 'Subí las mancuernas en arco contrayendo el pecho superior. Enfocate en el pecho alto.',
      en: 'Bring dumbbells up in an arc squeezing the upper chest. Focus on the upper chest.'
    },
  ],

  cruces_polea: [
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="4" width="4" height="30" rx="1"/><rect x="34" y="4" width="4" height="30" rx="1"/><circle cx="20" cy="14" r="3"/><line x1="20" y1="17" x2="20" y2="30"/></svg>`,
      es: 'Parate en el centro de la máquina de poleas con un pie adelante. Agarrá las asas de las poleas altas.',
      en: 'Stand in the center of the cable machine with one foot forward. Grab the high pulley handles.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><line x1="6" y1="6" x2="16" y2="20"/><line x1="34" y1="6" x2="24" y2="20"/><circle cx="20" cy="14" r="3"/></svg>`,
      es: 'Incliná el torso ligeramente hacia adelante. Abrí los brazos con los codos levemente flexionados.',
      en: 'Lean your torso slightly forward. Open arms with elbows slightly bent.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><circle cx="20" cy="14" r="3"/><line x1="20" y1="17" x2="20" y2="30"/><line x1="20" y1="20" x2="18" y2="26"/><line x1="20" y1="20" x2="22" y2="26"/></svg>`,
      es: 'Llevá las manos hacia abajo y al centro en arco, cruzando ligeramente frente al cuerpo. Contraé el pecho.',
      en: 'Bring hands down and to the center in an arc, crossing slightly in front. Squeeze the chest.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><line x1="6" y1="6" x2="16" y2="20"/><line x1="34" y1="6" x2="24" y2="20"/><path d="M16 20 Q20 16 24 20" fill="none" stroke-dasharray="2,1"/></svg>`,
      es: 'Volvé a abrir los brazos controladamente hasta sentir el estiramiento. Repetí.',
      en: 'Open arms back in a controlled manner until you feel the stretch. Repeat.'
    },
  ],

  pullover: [
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><rect x="10" y="22" width="20" height="3" rx="1"/><circle cx="16" cy="18" r="3"/><line x1="19" y1="18" x2="30" y2="18"/></svg>`,
      es: 'Acuéstate cruzado en un banco plano con los hombros apoyados. Caderas abajo del banco.',
      en: 'Lie across a flat bench with shoulders supported. Hips below the bench level.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><rect x="16" y="8" width="8" height="4" rx="1"/><line x1="20" y1="12" x2="20" y2="20"/></svg>`,
      es: 'Sosteneel la mancuerna con ambas manos sobre el pecho, brazos casi extendidos.',
      en: 'Hold the dumbbell with both hands above the chest, arms nearly extended.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><rect x="4" y="8" width="8" height="4" rx="1"/><path d="M12 10 Q20 6 20 18" fill="none" stroke-dasharray="2,1"/></svg>`,
      es: 'Bajá la mancuerna por detrás de la cabeza en arco, manteniendo los codos firmes. Sentí el estiramiento.',
      en: 'Lower the dumbbell behind your head in an arc, keeping elbows firm. Feel the stretch.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><rect x="16" y="8" width="8" height="4" rx="1"/><path d="M12 24 Q20 20 20 12" fill="none"/></svg>`,
      es: 'Volvé al inicio en arco contrayendo pecho y dorsales. No dobles los codos.',
      en: 'Return to start in an arc, squeezing chest and lats. Do not bend elbows.'
    },
  ],

  contractora: [
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><rect x="16" y="4" width="8" height="32" rx="2"/><circle cx="20" cy="16" r="3"/><line x1="20" y1="19" x2="20" y2="30"/></svg>`,
      es: 'Sentate en la máquina con la espalda apoyada. Ajustá el asiento para que las asas queden a la altura del pecho.',
      en: 'Sit with your back against the pad. Adjust the seat so handles are at chest height.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><line x1="20" y1="20" x2="8" y2="14"/><line x1="20" y1="20" x2="32" y2="14"/><circle cx="20" cy="16" r="3"/></svg>`,
      es: 'Colocá los antebrazos en las almohadillas. Los codos quedan a 90 grados.',
      en: 'Place your forearms on the pads. Elbows should be at 90 degrees.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><line x1="20" y1="20" x2="16" y2="14"/><line x1="20" y1="20" x2="24" y2="14"/><circle cx="20" cy="16" r="3"/><path d="M14 12 Q20 8 26 12" fill="none" stroke-dasharray="2,1"/></svg>`,
      es: 'Juntá los brazos frente al pecho apretando fuerte. Mantené la contracción un segundo.',
      en: 'Bring arms together in front of your chest, squeezing hard. Hold the contraction for a second.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><line x1="20" y1="20" x2="8" y2="14"/><line x1="20" y1="20" x2="32" y2="14"/><path d="M8 14 L6 12" fill="none"/><path d="M32 14 L34 12" fill="none"/></svg>`,
      es: 'Volvé a abrir controladamente hasta sentir estiramiento en el pecho. Repetí.',
      en: 'Open back in a controlled manner until you feel a stretch in the chest. Repeat.'
    },
  ],

  press_maquina_pecho: [
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><rect x="30" y="4" width="4" height="32" rx="1"/><rect x="12" y="26" width="14" height="3" rx="1"/><circle cx="20" cy="16" r="3"/></svg>`,
      es: 'Sentate en la máquina con la espalda bien apoyada. Ajustá la altura del asiento.',
      en: 'Sit with your back firmly against the pad. Adjust the seat height.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><circle cx="20" cy="16" r="3"/><line x1="20" y1="20" x2="28" y2="16"/><line x1="20" y1="20" x2="28" y2="22"/></svg>`,
      es: 'Agarrá las asas con las manos a la altura del pecho. Pies firmes en el suelo.',
      en: 'Grip the handles at chest height. Feet firmly on the floor.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><circle cx="20" cy="16" r="3"/><line x1="20" y1="20" x2="34" y2="16"/><line x1="20" y1="20" x2="34" y2="22"/><path d="M30 14 L34 16 L30 18" fill="none"/></svg>`,
      es: 'Empujá hacia adelante hasta extender los brazos. Exhalá al empujar.',
      en: 'Push forward until arms are extended. Exhale as you push.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><circle cx="20" cy="16" r="3"/><line x1="20" y1="20" x2="28" y2="16"/><line x1="20" y1="20" x2="28" y2="22"/><path d="M32 14 L28 16 L32 18" fill="none" stroke-dasharray="2,1"/></svg>`,
      es: 'Volvé controladamente sin soltar la tensión. No dejes que las placas se toquen.',
      en: 'Return in a controlled manner without releasing tension. Don\'t let the plates touch.'
    },
  ],

  fondos_pecho: [
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><line x1="6" y1="14" x2="16" y2="14"/><line x1="24" y1="14" x2="34" y2="14"/><circle cx="20" cy="12" r="3"/><line x1="20" y1="15" x2="20" y2="26"/></svg>`,
      es: 'Subite a las barras paralelas con los brazos extendidos. Incliná el torso hacia adelante.',
      en: 'Mount the parallel bars with arms extended. Lean your torso forward.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><line x1="6" y1="14" x2="16" y2="14"/><line x1="24" y1="14" x2="34" y2="14"/><circle cx="20" cy="18" r="3"/><line x1="20" y1="21" x2="20" y2="30"/><line x1="20" y1="22" x2="16" y2="15"/><line x1="20" y1="22" x2="24" y2="15"/></svg>`,
      es: 'Bajá doblando los codos hasta que los brazos queden a 90 grados. Mantené la inclinación hacia adelante.',
      en: 'Lower by bending elbows until arms are at 90 degrees. Keep the forward lean.'
    },
    {
      icon: `<svg viewBox="0 0 40 40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"><line x1="6" y1="14" x2="16" y2="14"/><line x1="24" y1="14" x2="34" y2="14"/><circle cx="20" cy="12" r="3"/><path d="M18 22 L20 16 L22 22" fill="none"/></svg>`,
      es: 'Empujá hacia arriba hasta extender los brazos. La inclinación trabaja más el pecho que el tríceps.',
      en: 'Push up until arms are extended. The forward lean targets chest more than triceps.'
    },
  ],
};
