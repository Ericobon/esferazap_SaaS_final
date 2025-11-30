/**
 * Logo Component - EsferaZap
 * Componente de logo com variações (full, icon, light/dark)
 */

export function Logo({ variant = 'full', size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
    xl: 'h-16'
  };

  if (variant === 'icon') {
    return (
      <div className={`${sizes[size]} ${className}`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-auto"
        >
          {/* Raio (símbolo de energia/automação) */}
          <path
            d="M20 4L12 20H20L16 36L28 18H20L24 4H20Z"
            className="fill-primary"
          />
          {/* Círculo externo (esfera) */}
          <circle
            cx="20"
            cy="20"
            r="18"
            className="stroke-secondary stroke-2"
            fill="none"
          />
          {/* Pontos de conexão (rede) */}
          <circle cx="20" cy="4" r="2" className="fill-accent" />
          <circle cx="36" cy="20" r="2" className="fill-accent" />
          <circle cx="20" cy="36" r="2" className="fill-accent" />
          <circle cx="4" cy="20" r="2" className="fill-accent" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon */}
      <div className={sizes[size]}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-auto"
        >
          <path
            d="M20 4L12 20H20L16 36L28 18H20L24 4H20Z"
            className="fill-primary"
          />
          <circle
            cx="20"
            cy="20"
            r="18"
            className="stroke-secondary stroke-2"
            fill="none"
          />
          <circle cx="20" cy="4" r="2" className="fill-accent" />
          <circle cx="36" cy="20" r="2" className="fill-accent" />
          <circle cx="20" cy="36" r="2" className="fill-accent" />
          <circle cx="4" cy="20" r="2" className="fill-accent" />
        </svg>
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span className="font-bold text-2xl leading-none text-foreground">
          EsferaZap
        </span>
        <span className="text-xs text-muted-foreground leading-none mt-0.5">
          Automação Inteligente
        </span>
      </div>
    </div>
  );
}

export default Logo;
