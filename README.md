# Rental Deal Calculator

A mobile-first rental property analyzer built with React, TypeScript, Vite, and
Tailwind CSS. It calculates investment mortgage payments, interest-only HELOC
cost, property management, optional reserves, monthly cash flow, deal rating,
and Joe Buy Box fit.

## Run locally

```bash
pnpm install
pnpm dev
```

## Verify

```bash
pnpm test
pnpm lint
pnpm build
```

## Calculation note

HELOC interest is calculated as:

```text
down payment × annual HELOC rate ÷ 12
```

For the included $200,000 sample with 20% down and an 8.5% HELOC rate, that is
$283.33 per month.
