'use client';

export type Theme = {
  background: string;
  cardBg: string;
  borderColor: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  purple: string;
  yellow: string;
};

export type Table<T> = {
  data: T[];
  create: (item: Omit<T, 'id'>) => Promise<T>;
  update: (id: string, patch: Partial<T>) => Promise<void>;
  delete_: (id: string) => Promise<void>;
};

export const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const fmtDia = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });

export const monthPrefix = (mes: Date) => `${mes.getFullYear()}-${String(mes.getMonth() + 1).padStart(2, '0')}`;

export const fieldStyles = (theme: Theme) => ({
  inputStyle: {
    width: '100%',
    padding: '10px 12px',
    background: theme.background,
    border: `1px solid ${theme.borderColor}`,
    borderRadius: '10px',
    color: theme.textPrimary,
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
  } as React.CSSProperties,
  labelStyle: { fontSize: '12px', fontWeight: 600, color: theme.textSecondary, display: 'block', marginBottom: '6px' } as React.CSSProperties,
});

export const primaryBtn: React.CSSProperties = {
  padding: '11px 18px',
  background: '#E6B23E',
  border: 'none',
  borderRadius: '12px',
  color: '#1A1A1A',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 700,
  fontFamily: 'inherit',
  whiteSpace: 'nowrap',
};

export function Modal({ theme, title, onClose, children }: { theme: Theme; title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}
      onClick={onClose}
    >
      <div
        style={{ background: theme.cardBg, border: `1px solid ${theme.borderColor}`, borderRadius: '18px', maxWidth: '600px', width: '100%', maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: `1px solid ${theme.borderColor}` }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: theme.textPrimary, margin: 0 }}>{title}</h2>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: `1px solid ${theme.borderColor}`, borderRadius: '8px', width: '32px', height: '32px', color: theme.textSecondary, cursor: 'pointer', fontSize: '14px' }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function FormFooter({ theme, submitLabel, onCancel, onDelete }: { theme: Theme; submitLabel: string; onCancel: () => void; onDelete?: () => void }) {
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '16px 24px', borderTop: `1px solid ${theme.borderColor}` }}>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          style={{ background: 'transparent', border: 'none', color: '#D9534F', cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit' }}
        >
          Excluir
        </button>
      )}
      <button
        type="button"
        onClick={onCancel}
        style={{ marginLeft: 'auto', padding: '10px 18px', background: 'transparent', border: `1px solid ${theme.borderColor}`, borderRadius: '10px', color: theme.textSecondary, cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'inherit' }}
      >
        Cancelar
      </button>
      <button type="submit" style={{ ...primaryBtn, padding: '10px 18px', borderRadius: '10px' }}>
        {submitLabel}
      </button>
    </div>
  );
}

export function FormError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div style={{ gridColumn: '1 / -1', background: 'rgba(217, 83, 79, 0.12)', color: '#D9534F', padding: '10px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}>
      {message}
    </div>
  );
}

export function MonthNav({ theme, mes, onChange }: { theme: Theme; mes: Date; onChange: (d: Date) => void }) {
  const hoje = new Date();
  const btn: React.CSSProperties = {
    background: theme.cardBg,
    border: `1px solid ${theme.borderColor}`,
    borderRadius: '10px',
    padding: '8px 12px',
    color: theme.textPrimary,
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    fontFamily: 'inherit',
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button style={btn} onClick={() => onChange(new Date(mes.getFullYear(), mes.getMonth() - 1, 1))} aria-label="Mês anterior">‹</button>
      <button style={btn} onClick={() => onChange(new Date(hoje.getFullYear(), hoje.getMonth(), 1))}>Hoje</button>
      <button style={btn} onClick={() => onChange(new Date(mes.getFullYear(), mes.getMonth() + 1, 1))} aria-label="Próximo mês">›</button>
      <h3 style={{ margin: '0 0 0 8px', fontSize: '18px', fontWeight: 700, color: theme.textPrimary, textTransform: 'capitalize' }}>
        {mes.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
      </h3>
    </div>
  );
}

export type CalEvent = {
  key: string;
  data: string;
  hora: string;
  label: string;
  color: string;
  cancelled?: boolean;
  done?: boolean;
  onClick: () => void;
};

export function MonthCalendar({
  theme,
  isDark,
  mes,
  events,
  onDayClick,
}: {
  theme: Theme;
  isDark: boolean;
  mes: Date;
  events: CalEvent[];
  onDayClick: (iso: string) => void;
}) {
  const prefixo = monthPrefix(mes);
  const hoje = new Date();
  const hojeISO = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
  const porDia = events.reduce<Record<string, CalEvent[]>>((acc, ev) => {
    (acc[ev.data] ||= []).push(ev);
    return acc;
  }, {});
  Object.values(porDia).forEach(list => list.sort((a, b) => a.hora.localeCompare(b.hora)));

  const offset = new Date(mes.getFullYear(), mes.getMonth(), 1).getDay();
  const diasNoMes = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: diasNoMes }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);

  return (
    <div style={{ background: theme.cardBg, border: `1px solid ${theme.borderColor}`, borderRadius: '16px', overflowX: 'auto', marginBottom: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(110px, 1fr))', minWidth: '770px' }}>
        {WEEKDAYS.map(w => (
          <div key={w} style={{ padding: '10px 12px', fontSize: '12px', fontWeight: 700, color: theme.textTertiary, textTransform: 'uppercase', borderBottom: `1px solid ${theme.borderColor}` }}>
            {w}
          </div>
        ))}
        {cells.map((dia, i) => {
          const iso = dia ? `${prefixo}-${String(dia).padStart(2, '0')}` : '';
          const doDia = dia ? porDia[iso] || [] : [];
          const isHoje = iso === hojeISO;
          return (
            <div
              key={i}
              onClick={() => dia && onDayClick(iso)}
              title={dia ? 'Clique para agendar neste dia' : undefined}
              style={{
                minHeight: '104px',
                padding: '8px',
                borderRight: (i + 1) % 7 ? `1px solid ${theme.borderColor}` : 'none',
                borderBottom: i < cells.length - 7 ? `1px solid ${theme.borderColor}` : 'none',
                background: dia ? 'transparent' : isDark ? 'rgba(0,0,0,.18)' : 'rgba(0,0,0,.025)',
                cursor: dia ? 'pointer' : 'default',
              }}
            >
              {dia && (
                <>
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '13px',
                      fontWeight: 700,
                      marginBottom: '6px',
                      background: isHoje ? '#E6B23E' : 'transparent',
                      color: isHoje ? '#1A1A1A' : theme.textSecondary,
                    }}
                  >
                    {dia}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {doDia.slice(0, 3).map(ev => (
                      <button
                        key={ev.key}
                        onClick={e => {
                          e.stopPropagation();
                          ev.onClick();
                        }}
                        title={`${ev.hora} · ${ev.label}`}
                        style={{
                          textAlign: 'left',
                          border: 'none',
                          borderLeft: `3px solid ${ev.color}`,
                          background: `${ev.color}1F`,
                          color: theme.textPrimary,
                          borderRadius: '6px',
                          padding: '4px 6px',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          fontFamily: 'inherit',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          textDecoration: ev.cancelled ? 'line-through' : 'none',
                          opacity: ev.cancelled ? 0.6 : 1,
                        }}
                      >
                        {ev.done ? '✓ ' : ''}
                        {ev.hora} {ev.label}
                      </button>
                    ))}
                    {doDia.length > 3 && <span style={{ fontSize: '11px', color: theme.textTertiary, fontWeight: 600 }}>+{doDia.length - 3} itens</span>}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
