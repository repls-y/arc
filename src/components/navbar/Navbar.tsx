'use client';

import Link from 'next/link';
import { useEffect, useId, useMemo, useState } from 'react';

import styles from './Navbar.module.css';

type DownloadTarget = 'mac' | 'windows' | 'other';

type DownloadOption = {
  label: string;
  href: string;
};

type NavLink = {
  href: string;
  label: string;
  icon?: (idPrefix: string) => JSX.Element;
};

const DOWNLOAD_OPTIONS: Record<DownloadTarget, DownloadOption> = {
  mac: {
    label: 'Download Arc for Mac',
    href: 'https://releases.arc.net/release/Arc-latest.dmg',
  },
  windows: {
    label: 'Download Arc for Windows',
    href: 'https://releases.arc.net/windows/ArcInstaller.exe',
  },
  other: {
    label: 'Download Arc',
    href: 'https://arc.net/download',
  },
};

const NAV_LINKS: NavLink[] = [
  { href: '/max', label: 'Max', icon: (id) => <ArcMarkIcon idPrefix={id} /> },
  { href: '/search', label: 'Mobile', icon: () => <MobileIcon /> },
  { href: '/developers', label: 'Developers' },
  { href: '/students', label: 'Students' },
  { href: '/blog', label: 'Blog' },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [target, setTarget] = useState<DownloadTarget>('other');

  const menuId = useId();
  const brandId = useId();
  const arcMarkId = useId();
  const waveMaskId = useId();

  const sanitizedBrandId = useMemo(() => sanitizeId(brandId), [brandId]);
  const sanitizedArcMarkId = useMemo(() => sanitizeId(arcMarkId), [arcMarkId]);
  const sanitizedWaveMaskId = useMemo(() => sanitizeId(waveMaskId), [waveMaskId]);

  const sanitizedBrandId = useMemo(() => sanitizeId(brandId), [brandId]);
  const sanitizedArcMarkId = useMemo(() => sanitizeId(arcMarkId), [arcMarkId]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const ua = window.navigator.userAgent.toLowerCase();
    const platform = (window.navigator.platform || '').toLowerCase();
    if (platform.includes('mac') || ua.includes('mac os')) {
      setTarget('mac');
    } else if (platform.includes('win') || ua.includes('windows')) {
      setTarget('windows');
    } else {
      setTarget('other');
    }
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const download = DOWNLOAD_OPTIONS[target] ?? DOWNLOAD_OPTIONS.other;
  const navClassName = [styles.nav, isMenuOpen ? styles.navOpen : ''].filter(Boolean).join(' ');

  const handleToggle = () => setIsMenuOpen((prev) => !prev);
  const handleClose = () => setIsMenuOpen(false);

  const handleNavLinkClick = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <header className={styles.wrapper}>
      <div className={styles.wave} aria-hidden="true">
        <WaveBackdrop maskId={sanitizedWaveMaskId} />
      </div>
      <div className={styles.inner}>
        <Link className={styles.brand} href="/" onClick={handleClose}>
          <ArcMark idPrefix={sanitizedBrandId} size={32} />
          <span>Arc</span>
        </Link>
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={isMenuOpen}
          aria-controls={menuId}
          onClick={handleToggle}
        >
          <span className={styles.srOnly}>Toggle navigation</span>
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
        <nav id={menuId} aria-label="Site navigation" className={navClassName}>
          <ul className={styles.navList}>
            {NAV_LINKS.map((item) => (
              <li className={styles.navItem} key={item.href}>
                <Link className={styles.navLink} href={item.href} onClick={handleNavLinkClick}>
                  {item.icon ? <span className={styles.navLinkIcon}>{item.icon(sanitizedArcMarkId)}</span> : null}
                  <span className={styles.navLinkText}>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.ctaGroup}>
            <a className={styles.secondaryLink} href="https://arc.net/releases" onClick={handleNavLinkClick}>
              View release notes
            </a>
            <a className={styles.downloadButton} href={download.href} onClick={handleNavLinkClick} rel="noreferrer">
              <DownloadIcon />
              <span>{download.label}</span>
            </a>
          </div>
        </nav>
      </div>
      {isMenuOpen ? (
        <button type="button" className={styles.backdrop} aria-label="Close navigation" onClick={handleClose} />
      ) : null}
    </header>
  );
}

function sanitizeId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, '');
}

type WaveBackdropProps = {
  maskId: string;
};

function WaveBackdrop({ maskId }: WaveBackdropProps) {
  const maskUrl = `url(#${maskId})`;

  return (
    <svg
      viewBox="0 0 120 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <mask
        id={maskId}
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="120"
        height="88"
      >
        <path
          d="M0 0C3.766 0 5.407 1.455 6.726 2.623C8.026 3.775 8.844 4.428 10.527 4.428C12.21 4.428 13.028 3.775 14.328 2.623C15.646 1.455 17.288 0 20.519 0C23.746 0 25.386 1.455 26.702 2.623C28.001 3.775 28.82 4.428 30.501 4.428C32.184 4.428 33.001 3.775 34.301 2.623C35.62 1.455 37.259 0 40.487 0C43.718 0 45.36 1.455 46.678 2.623C47.978 3.775 48.796 4.428 50.479 4.428C52.163 4.428 52.982 3.775 54.282 2.623C55.6 1.455 57.241 0 60.471 0C63.701 0 65.342 1.455 66.66 2.623C67.96 3.775 68.779 4.428 70.462 4.428C72.148 4.428 72.966 3.775 74.266 2.623C75.587 1.455 77.228 0 80.456 0C83.685 0 85.326 1.455 86.645 2.623C87.944 3.775 88.763 4.428 90.445 4.428C92.13 4.428 92.95 3.775 94.25 2.623C95.57 1.455 97.213 0 100.443 0C103.676 0 105.318 1.455 106.638 2.623C107.941 3.775 108.759 4.428 110.446 4.428C112.134 4.428 112.954 3.775 114.257 2.623C115.576 1.455 117.219 0 120 0V88C117.219 88 115.576 86.372 114.257 85.203C112.954 84.051 112.134 83.398 110.446 83.398C108.759 83.398 107.941 84.051 106.638 85.203C105.318 86.372 103.676 87.826 100.443 87.826C97.213 87.826 95.57 86.372 94.25 85.203C92.95 84.051 92.13 83.398 90.445 83.398C88.763 83.398 87.944 84.051 86.645 85.203C85.326 86.372 83.685 87.826 80.456 87.826C77.228 87.826 75.587 86.372 74.266 85.203C72.966 84.051 72.148 83.398 70.462 83.398C68.779 83.398 67.96 84.051 66.66 85.203C65.342 86.372 63.701 87.826 60.471 87.826C57.241 87.826 55.6 86.372 54.282 85.203C52.982 84.051 52.163 83.398 50.479 83.398C48.796 83.398 47.978 84.051 46.678 85.203C45.36 86.372 43.718 87.826 40.487 87.826C37.259 87.826 35.62 86.372 34.302 85.203C33.001 84.051 32.184 83.398 30.501 83.398C28.82 83.398 28.001 84.051 26.702 85.203C25.386 86.372 23.746 87.826 20.519 87.826C17.288 87.826 15.646 86.372 14.328 85.203C13.028 84.051 12.21 83.398 10.527 83.398C8.844 83.398 8.026 84.051 6.726 85.203C5.407 86.372 3.766 87.826 0 87.826V0Z"
          fill="#26069C"
        />
      </mask>
      <g mask={maskUrl}>
        <rect x="0" y="-34.1738" width="120" height="157" fill="#2702C2" />
      </g>
    </svg>
  );
}

type ArcMarkProps = {
  idPrefix: string;
  size?: number;
};

function ArcMark({ idPrefix, size = 32 }: ArcMarkProps) {
  const width = size;
  const height = (size * 35) / 40;
  const filterA = `${idPrefix}-filter-a`;
  const filterB = `${idPrefix}-filter-b`;
  const filterC = `${idPrefix}-filter-c`;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <g filter={`url(#${filterA})`}>
        <path
          d="m26.906 8.075-1.917-3.947a6.623 6.623 0 0 0-11.958.099l-2.644 5.676a6.617 6.617 0 0 0-6.431-.147c-3.162 1.652-4.271 5.564-2.95 8.602.755 1.747 1.857 3.37 3.207 4.808l-.696 1.495a6.612 6.612 0 0 0 .259 6.089 6.526 6.526 0 0 0 2.409 2.425 6.613 6.613 0 0 0 4.09.86l.02-.003.018-.002a6.7 6.7 0 0 0 5.252-3.874l.348-.747c1.014.163 2.04.244 3.07.241h.028a19.277 19.277 0 0 0 3.483-.36l.435.895.002.004a6.637 6.637 0 0 0 6 3.723h.015a6.63 6.63 0 0 0 6.407-5.204l.005-.025.005-.024a6.706 6.706 0 0 0-.574-4.334l-.781-1.616c2.557-2.793 4.433-6.282 5.17-10.145A6.59 6.59 0 0 0 38.14 7.59a6.63 6.63 0 0 0-5.524-2.891h-.014a6.628 6.628 0 0 0-5.697 3.377Zm-7.27 8.277-.15-.307.15.307Zm-1.078.045.173-.37-.173.37Zm-9.487-3.669a3.522 3.522 0 0 0-3.679-.235 3.523 3.523 0 0 1 3.679.235Zm8.125 6.593ZM6.613 25.334l-.294.632.294-.632Zm25.404.358ZM22.209 5.479Zm7.976 3.342a3.535 3.535 0 0 1 2.455-1.032 3.539 3.539 0 0 1 2.95 1.546 3.498 3.498 0 0 1 .608 2.225l-6.013-2.74Z"
          fill="#FFFCEA"
        />
      </g>
      <path
        d="m11.12 15.662-1.546 3.325-1.615 3.47a18.27 18.27 0 0 0 1.914 1.39 18.317 18.317 0 0 0 4.302 1.984l1.56-3.35 1.465-3.15c-2.359-.493-4.72-1.916-6.08-3.67Z"
        fill="#210784"
      />
      <path
        d="m30.252 22.063-3.27-6.736a11.892 11.892 0 0 1-2.494 2.306 10.684 10.684 0 0 1-3.459 1.591l3.125 6.42a18.08 18.08 0 0 0 4.312-2.193 18.72 18.72 0 0 0 1.786-1.388Z"
        fill="#26069C"
      />
      <path
        d="M9.867 23.844a18.1 18.1 0 0 1-1.914-1.39l-1.634 3.512a3.522 3.522 0 0 0 .14 3.25c.303.535.745.98 1.278 1.285.659.387 1.426.55 2.185.462a3.61 3.61 0 0 0 2.834-2.097l1.413-3.037a18.32 18.32 0 0 1-4.302-1.985Z"
        fill="#2404AA"
      />
      <path
        d="M35.59 9.335a3.538 3.538 0 0 0-2.95-1.546 3.537 3.537 0 0 0-3.433 2.877 10.647 10.647 0 0 1-2.22 4.662l3.27 6.735c2.96-2.603 5.134-6.14 5.885-10.081a3.5 3.5 0 0 0-.552-2.647Z"
        fill="#FF9999"
      />
      <g filter={`url(#${filterB})`}>
        <path
          d="m32.017 25.692-1.758-3.634-3.27-6.735-4.78-9.844a3.53 3.53 0 0 0-6.376.053l-4.717 10.125c1.359 1.754 3.726 3.184 6.079 3.667l1.535-3.298a.412.412 0 0 1 .744-.006l1.562 3.204 3.125 6.42 1.547 3.188a3.547 3.547 0 0 0 3.206 1.99 3.538 3.538 0 0 0 3.42-2.778 3.615 3.615 0 0 0-.317-2.352Z"
          fill="#FF5060"
        />
      </g>
      <g filter={`url(#${filterC})`}>
        <path
          d="M21.033 19.223a9.02 9.02 0 0 1-2.123.276 8.23 8.23 0 0 1-1.712-.178c-2.353-.489-4.715-1.912-6.073-3.665a6.195 6.195 0 0 1-.806-1.337 3.523 3.523 0 0 0-4.927-1.826c-1.616.84-2.28 2.962-1.55 4.635.844 1.955 2.272 3.792 4.12 5.328.608.505 1.247.97 1.915 1.39a18.316 18.316 0 0 0 4.302 1.985c1.552.487 3.169.733 4.795.728a16.19 16.19 0 0 0 5.177-.916l-3.118-6.42Z"
          fill="#0034FE"
        />
      </g>
      <defs>
        <filter id={filterA} x="-.531" y="-.59" width="40.819" height="35.658" filterUnits="userSpaceOnUse">
          <feFlood result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation=".495" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_259_65398" />
          <feBlend in="SourceGraphic" in2="effect1_backgroundBlur_259_65398" result="shape" />
        </filter>
        <filter id={filterB} x="10.125" y="2.501" width="23.271" height="29.311" filterUnits="userSpaceOnUse">
          <feFlood result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation=".495" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_259_65398" />
          <feBlend in="SourceGraphic" in2="effect1_backgroundBlur_259_65398" result="shape" />
        </filter>
        <filter id={filterC} x="2.556" y="11.093" width="22.585" height="16.456" filterUnits="userSpaceOnUse">
          <feFlood result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation=".495" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_259_65398" />
          <feBlend in="SourceGraphic" in2="effect1_backgroundBlur_259_65398" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}

function ArcMarkIcon({ idPrefix }: { idPrefix: string }) {
  return <ArcMark idPrefix={idPrefix} size={20} />;
}

function MobileIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M5.61426 15.0918C5.06283 15.0918 4.6276 14.9391 4.30859 14.6338C3.99414 14.3285 3.83691 13.9069 3.83691 13.3691V2.75293C3.83691 2.21973 3.99414 1.80046 4.30859 1.49512C4.6276 1.18522 5.06283 1.03027 5.61426 1.03027H10.3789C10.9303 1.03027 11.3633 1.18522 11.6777 1.49512C11.9967 1.80046 12.1562 2.21973 12.1562 2.75293V13.3691C12.1562 13.9069 11.9967 14.3285 11.6777 14.6338C11.3633 14.9391 10.9303 15.0918 10.3789 15.0918H5.61426ZM5.70996 14.2578H10.2832C10.625 14.2578 10.8825 14.1735 11.0557 14.0049C11.2288 13.8363 11.3154 13.5856 11.3154 13.2529V2.87598C11.3154 2.53874 11.2288 2.28809 11.0557 2.12402C10.8825 1.9554 10.625 1.87109 10.2832 1.87109H5.70996C5.36816 1.87109 5.11068 1.9554 4.9375 2.12402C4.76432 2.28809 4.67773 2.53874 4.67773 2.87598V13.2529C4.67773 13.5856 4.76432 13.8363 4.9375 14.0049C5.11068 14.1735 5.36816 14.2578 5.70996 14.2578ZM6.58496 13.7793C6.50749 13.7793 6.44141 13.752 6.38672 13.6973C6.33659 13.6471 6.31152 13.5833 6.31152 13.5059C6.31152 13.4284 6.33659 13.3646 6.38672 13.3145C6.44141 13.2643 6.50749 13.2393 6.58496 13.2393H9.42188C9.49479 13.2393 9.55631 13.2643 9.60645 13.3145C9.65658 13.3646 9.68164 13.4284 9.68164 13.5059C9.68164 13.5833 9.65658 13.6471 9.60645 13.6973C9.55631 13.752 9.49479 13.7793 9.42188 13.7793H6.58496ZM7.2002 3.12207C7.08171 3.12207 6.98372 3.08333 6.90625 3.00586C6.82878 2.92839 6.79004 2.8304 6.79004 2.71191C6.79004 2.60254 6.82878 2.50911 6.90625 2.43164C6.98372 2.35417 7.08171 2.31543 7.2002 2.31543H8.7998C8.90918 2.31543 9.0026 2.35417 9.08008 2.43164C9.16211 2.50911 9.20312 2.60254 9.20312 2.71191C9.20312 2.8304 9.16211 2.92839 9.08008 3.00586C9.0026 3.08333 8.90918 3.12207 8.7998 3.12207H7.2002Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.1"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 3.75V15.25M12 15.25L16.5 10.75M12 15.25L7.5 10.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 18.25H18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 6.75H20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M4 12H20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M4 17.25H20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M6 6L18 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
