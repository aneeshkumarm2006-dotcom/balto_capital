'use client';
import { useState } from 'react';
import { Eyebrow } from './Eyebrow';
import { PlaceholderImg } from './SmartImage';
import { useTilt } from './useTilt';
import type { PortfolioEntry } from '@/lib/portfolio';

export function TransactionCard({ entry }: { entry: PortfolioEntry }) {
  const tiltRef = useTilt<HTMLDivElement>(3.5);
  const [imgErrored, setImgErrored] = useState(false);

  return (
    <div ref={tiltRef} className="transaction-card">
      <div className="image-wrap">
        {entry.image && !imgErrored ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={entry.image}
            alt={entry.titleLines.join(' ')}
            loading="lazy"
            onError={() => setImgErrored(true)}
          />
        ) : (
          <PlaceholderImg label={entry.titleLines.join(' ')} tone="deep">
            {entry.titleLines[0].charAt(0)}
          </PlaceholderImg>
        )}
      </div>

      <div style={{ paddingTop: 22 }}>
        <Eyebrow style={{ marginBottom: 12 }}>{entry.location}</Eyebrow>
        <h3
          className="serif"
          style={{
            fontSize: 'clamp(1.5rem, 2vw, 1.9rem)',
            fontWeight: 500,
            lineHeight: 1.05,
            margin: 0,
            marginBottom: 22,
            letterSpacing: '-0.005em',
          }}
        >
          {entry.titleLines[0]}
          <br />
          <span className="italic" style={{ color: 'var(--ink)' }}>
            {entry.titleLines[1]}
          </span>
        </h3>

        <div
          className="divider-gold"
          style={{ width: 44, marginBottom: 22 }}
        />

        <dl
          style={{
            margin: 0,
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 0,
          }}
        >
          {entry.facts.map((f, i) => (
            <div
              key={f.label}
              style={{
                display: 'grid',
                gridTemplateColumns: '110px 1fr',
                gap: 14,
                padding: '12px 0',
                borderTop: i === 0 ? '1px solid var(--hairline)' : 0,
                borderBottom: '1px solid var(--hairline)',
                alignItems: 'baseline',
              }}
            >
              <dt
                className="eyebrow"
                style={{
                  fontSize: 9.5,
                  letterSpacing: '0.18em',
                  margin: 0,
                }}
              >
                {f.label}
              </dt>
              <dd
                style={{
                  margin: 0,
                  fontSize: 13.5,
                  lineHeight: 1.55,
                  color: 'var(--ink)',
                }}
              >
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
