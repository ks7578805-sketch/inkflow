// Central token map for semantic status colors.
// All status colors across the app resolve from here — never redefine locally.

export const STATUS_TOKENS = {
  success: {
    bg:     'bg-primary/10',
    text:   'text-primary',
    border: 'border-primary/20',
    dot:    'bg-primary',
  },
  warning: {
    bg:     'bg-amber-500/10',
    text:   'text-amber-400',
    border: 'border-amber-500/20',
    dot:    'bg-amber-400',
  },
  error: {
    bg:     'bg-destructive/10',
    text:   'text-destructive',
    border: 'border-destructive/20',
    dot:    'bg-destructive',
  },
  info: {
    bg:     'bg-blue-500/10',
    text:   'text-blue-400',
    border: 'border-blue-500/20',
    dot:    'bg-blue-400',
  },
  pending: {
    bg:     'bg-violet-500/10',
    text:   'text-violet-400',
    border: 'border-violet-500/20',
    dot:    'bg-violet-400',
  },
  neutral: {
    bg:     'bg-muted',
    text:   'text-muted-foreground',
    border: 'border-border',
    dot:    'bg-muted-foreground',
  },
};

// Returns space-joined Tailwind classes for a status variant.
// Default parts: bg + text + border. Pass ['bg', 'text'] to omit border, etc.
export function statusClasses(variant, parts = ['bg', 'text', 'border']) {
  const t = STATUS_TOKENS[variant] ?? STATUS_TOKENS.neutral;
  return parts.map((p) => t[p]).join(' ');
}

// Project pipeline status → semantic variant
export const PROJECT_STATUS_TOKENS = {
  'Em andamento':         'info',
  'Aguardando aprovação': 'warning',
  'Finalizado':           'success',
  'Pausado':              'neutral',
  'Pendente':             'pending',
  'Arquivado':            'neutral',
};

// Combined class strings for use as className — drop-in replacement for STATUS_COLORS in projects.js
export const PROJECT_STATUS_COLORS = Object.fromEntries(
  Object.entries(PROJECT_STATUS_TOKENS).map(([label, variant]) => [
    label,
    statusClasses(variant),
  ])
);

// Project badge label → semantic variant
export const PROJECT_BADGE_TOKENS = {
  'Healing em andamento': 'success',
  'Aguardando aprovação': 'warning',
  'Falta foto antes':     'error',
  'Materiais pendentes':  'warning',
  'Retoque sugerido':     'pending',
  'Falta stencil':        'info',
  'Falta foto final':     'error',
};

// bg + text only (badges have no visible border) — drop-in replacement for BADGE_COLORS in ProjectCard
export const PROJECT_BADGE_COLORS = Object.fromEntries(
  Object.entries(PROJECT_BADGE_TOKENS).map(([label, variant]) => {
    const t = STATUS_TOKENS[variant];
    return [label, `${t.bg} ${t.text}`];
  })
);
