import { useMemo, useState } from 'react'
import {
  Calculator,
  Check,
  ChevronRight,
  CircleDollarSign,
  Home,
  Info,
  RefreshCcw,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from 'lucide-react'
import {
  calculateDeal,
  getDealRating,
  type DealInputs,
} from './calculations'

type FormState = {
  purchasePrice: string
  monthlyRent: string
  downPaymentPercent: string
  mortgageRate: string
  loanTermYears: string
  helocRate: string
  managementPercent: string
  taxesInsurance: string
  maintenancePercent: string
  vacancyPercent: string
  maintenanceEnabled: boolean
  vacancyEnabled: boolean
}

const defaultForm: FormState = {
  purchasePrice: '',
  monthlyRent: '',
  downPaymentPercent: '20',
  mortgageRate: '7',
  loanTermYears: '30',
  helocRate: '8.5',
  managementPercent: '10',
  taxesInsurance: '300',
  maintenancePercent: '0',
  vacancyPercent: '0',
  maintenanceEnabled: false,
  vacancyEnabled: false,
}

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const wholeMoney = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const numberFrom = (value: string) => {
  const parsed = Number(value)
  return value.trim() === '' || !Number.isFinite(parsed) ? 0 : parsed
}

type FieldProps = {
  id: keyof FormState
  label: string
  value: string
  onChange: (id: keyof FormState, value: string) => void
  prefix?: string
  suffix?: string
  step?: string
  min?: string
  max?: string
  placeholder?: string
}

function NumberField({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 'any',
  min = '0',
  max,
  placeholder = '0',
}: FieldProps) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      <span className="relative block">
        {prefix && (
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-base font-semibold text-slate-400">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(id, event.target.value)}
          className={`focus-ring h-14 w-full rounded-2xl border bg-slate-50 text-base font-semibold text-slate-900 placeholder:text-slate-300 ${
            prefix ? 'pl-9' : 'pl-4'
          } ${suffix ? 'pr-12' : 'pr-4'}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-slate-400">
            {suffix}
          </span>
        )}
      </span>
    </label>
  )
}

type ToggleProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description: string
}

function ReserveToggle({
  checked,
  onChange,
  label,
  description,
}: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl text-left"
    >
      <span>
        <span className="block text-sm font-semibold text-slate-800">
          {label}
        </span>
        <span className="mt-0.5 block text-xs text-slate-500">
          {description}
        </span>
      </span>
      <span
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          checked ? 'bg-emerald-500' : 'bg-slate-200 group-hover:bg-slate-300'
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            checked ? 'left-6' : 'left-1'
          }`}
        />
      </span>
    </button>
  )
}

function App() {
  const [form, setForm] = useState<FormState>(defaultForm)

  const values = useMemo<DealInputs>(
    () => ({
      purchasePrice: numberFrom(form.purchasePrice),
      monthlyRent: numberFrom(form.monthlyRent),
      downPaymentPercent: numberFrom(form.downPaymentPercent),
      mortgageRate: numberFrom(form.mortgageRate),
      loanTermYears: numberFrom(form.loanTermYears),
      helocRate: numberFrom(form.helocRate),
      managementPercent: numberFrom(form.managementPercent),
      taxesInsurance: numberFrom(form.taxesInsurance),
      maintenancePercent: numberFrom(form.maintenancePercent),
      vacancyPercent: numberFrom(form.vacancyPercent),
      maintenanceEnabled: form.maintenanceEnabled,
      vacancyEnabled: form.vacancyEnabled,
    }),
    [form],
  )

  const results = useMemo(() => calculateDeal(values), [values])
  const rating = getDealRating(results.activeCashFlow)
  const hasProperty = values.purchasePrice > 0 || values.monthlyRent > 0

  const ratingStyles = {
    green: {
      label: 'Strong deal',
      text: 'text-emerald-700',
      pill: 'bg-emerald-100 text-emerald-700',
      panel:
        'border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50',
      dot: 'bg-emerald-500',
    },
    yellow: {
      label: 'Worth a closer look',
      text: 'text-amber-700',
      pill: 'bg-amber-100 text-amber-800',
      panel: 'border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50',
      dot: 'bg-amber-500',
    },
    red: {
      label: hasProperty ? 'Does not meet target' : 'Ready to analyze',
      text: hasProperty ? 'text-rose-700' : 'text-slate-700',
      pill: hasProperty
        ? 'bg-rose-100 text-rose-700'
        : 'bg-slate-200 text-slate-700',
      panel: hasProperty
        ? 'border-rose-200 bg-gradient-to-br from-rose-50 to-orange-50'
        : 'border-slate-200 bg-gradient-to-br from-white to-slate-50',
      dot: hasProperty ? 'bg-rose-500' : 'bg-slate-400',
    },
  }[rating]

  const updateField = (id: keyof FormState, value: string | boolean) => {
    setForm((current) => ({ ...current, [id]: value }))
  }

  const loadSample = () => {
    setForm((current) => ({
      ...current,
      purchasePrice: '200000',
      monthlyRent: '2100',
    }))
  }

  const expenseRows: Array<readonly [string, number]> = [
    ['Investment mortgage', results.mortgagePayment],
    ['Taxes & insurance', Math.max(0, values.taxesInsurance)],
    ['HELOC interest', results.helocInterest],
    ['Property management', results.managementFee],
    ...(form.maintenanceEnabled
      ? [['Maintenance reserve', results.maintenanceReserve] as const]
      : []),
    ...(form.vacancyEnabled
      ? [['Vacancy reserve', results.vacancyReserve] as const]
      : []),
  ]

  const buyBoxChecks = [
    {
      label: 'Purchase price',
      target: '$170k – $220k',
      value: wholeMoney.format(values.purchasePrice),
      passed: values.purchasePrice >= 170000 && values.purchasePrice <= 220000,
      pending: values.purchasePrice === 0,
    },
    {
      label: 'Monthly rent',
      target: '$1,900 – $2,300',
      value: wholeMoney.format(values.monthlyRent),
      passed: values.monthlyRent >= 1900 && values.monthlyRent <= 2300,
      pending: values.monthlyRent === 0,
    },
    {
      label: 'Cash flow',
      target: 'Must be positive',
      value: money.format(results.activeCashFlow),
      passed: results.activeCashFlow > 0,
      pending: !hasProperty,
    },
  ]

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-emerald-600">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                <Home size={17} strokeWidth={2.5} />
              </span>
              Joe's deal desk
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Rental deal calculator
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Run the numbers—including HELOC interest—and know where a
              property stands in seconds.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadSample}
              className="focus-ring inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 sm:flex-none"
            >
              <Sparkles size={16} />
              Sample property
            </button>
            <button
              type="button"
              onClick={() => setForm(defaultForm)}
              className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-xl border bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <RefreshCcw size={16} />
              Reset
            </button>
          </div>
        </header>

        <section
          className={`mb-6 overflow-hidden rounded-3xl border p-6 shadow-card sm:p-8 ${ratingStyles.panel}`}
          aria-live="polite"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${ratingStyles.dot}`} />
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${ratingStyles.pill}`}
                >
                  {ratingStyles.label}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-500">
                Monthly cash flow
              </p>
              <p
                className={`mt-1 text-5xl font-extrabold tracking-tight sm:text-6xl ${ratingStyles.text}`}
              >
                {money.format(results.activeCashFlow)}
              </p>
              <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
                <Info size={15} />
                Includes HELOC and all active reserves
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:min-w-[340px]">
              <div className="rounded-2xl border border-white/70 bg-white/70 p-4 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Without reserves
                </p>
                <p className="mt-2 text-xl font-bold text-slate-800">
                  {money.format(results.baselineCashFlow)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/70 p-4 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Total expenses
                </p>
                <p className="mt-2 text-xl font-bold text-slate-800">
                  {money.format(results.totalExpenses)}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.8fr)]">
          <div className="space-y-6">
            <section className="card p-5 sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <CircleDollarSign size={20} />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Property details
                  </h2>
                  <p className="text-sm text-slate-500">
                    Start with the two numbers that matter most.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberField
                  id="purchasePrice"
                  label="Purchase price"
                  value={form.purchasePrice}
                  onChange={updateField}
                  prefix="$"
                  placeholder="200,000"
                />
                <NumberField
                  id="monthlyRent"
                  label="Estimated monthly rent"
                  value={form.monthlyRent}
                  onChange={updateField}
                  prefix="$"
                  placeholder="2,100"
                />
              </div>
            </section>

            <section className="card p-5 sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                  <Calculator size={20} />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Financing
                  </h2>
                  <p className="text-sm text-slate-500">
                    Investment loan and HELOC assumptions.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberField
                  id="downPaymentPercent"
                  label="Down payment"
                  value={form.downPaymentPercent}
                  onChange={updateField}
                  suffix="%"
                  max="100"
                />
                <NumberField
                  id="mortgageRate"
                  label="Mortgage interest rate"
                  value={form.mortgageRate}
                  onChange={updateField}
                  suffix="%"
                />
                <NumberField
                  id="loanTermYears"
                  label="Loan term"
                  value={form.loanTermYears}
                  onChange={updateField}
                  suffix="years"
                  step="1"
                />
                <NumberField
                  id="helocRate"
                  label="HELOC interest rate"
                  value={form.helocRate}
                  onChange={updateField}
                  suffix="%"
                />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Down payment
                  </p>
                  <p className="mt-1 font-bold text-slate-800">
                    {money.format(results.downPayment)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Investment loan
                  </p>
                  <p className="mt-1 font-bold text-slate-800">
                    {money.format(results.loanAmount)}
                  </p>
                </div>
              </div>
            </section>

            <section className="card p-5 sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-50 text-violet-600">
                  <TrendingUp size={20} />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Operating costs
                  </h2>
                  <p className="text-sm text-slate-500">
                    Monthly costs and optional safety buffers.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberField
                  id="managementPercent"
                  label="Property management"
                  value={form.managementPercent}
                  onChange={updateField}
                  suffix="%"
                />
                <NumberField
                  id="taxesInsurance"
                  label="Taxes & insurance"
                  value={form.taxesInsurance}
                  onChange={updateField}
                  prefix="$"
                />
              </div>
              <div className="mt-6 grid gap-4 border-t pt-6 sm:grid-cols-2">
                <div className="rounded-2xl border bg-slate-50 p-4">
                  <ReserveToggle
                    checked={form.maintenanceEnabled}
                    onChange={(checked) =>
                      updateField('maintenanceEnabled', checked)
                    }
                    label="Maintenance reserve"
                    description="Set aside a percentage of rent"
                  />
                  <div className="mt-3">
                    <NumberField
                      id="maintenancePercent"
                      label="Reserve rate"
                      value={form.maintenancePercent}
                      onChange={updateField}
                      suffix="%"
                    />
                  </div>
                </div>
                <div className="rounded-2xl border bg-slate-50 p-4">
                  <ReserveToggle
                    checked={form.vacancyEnabled}
                    onChange={(checked) =>
                      updateField('vacancyEnabled', checked)
                    }
                    label="Vacancy reserve"
                    description="Plan for time between tenants"
                  />
                  <div className="mt-3">
                    <NumberField
                      id="vacancyPercent"
                      label="Reserve rate"
                      value={form.vacancyPercent}
                      onChange={updateField}
                      suffix="%"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <section className="card p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Monthly breakdown
                  </h2>
                  <p className="text-sm text-slate-500">
                    Where the rent goes
                  </p>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-600">
                  <Calculator size={19} />
                </span>
              </div>
              <div className="space-y-1">
                {expenseRows.map(([label, amount]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4 border-b py-3 last:border-0"
                  >
                    <span className="text-sm text-slate-600">{label}</span>
                    <span className="text-sm font-semibold text-slate-900">
                      {money.format(amount)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-slate-900 p-4 text-white">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-slate-300">
                    Total monthly payment
                  </span>
                  <span className="text-lg font-bold">
                    {money.format(results.totalExpenses)}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-4 border-t border-white/10 pt-3">
                  <span className="text-sm font-medium text-slate-300">
                    Monthly rent
                  </span>
                  <span className="text-lg font-bold">
                    {money.format(values.monthlyRent)}
                  </span>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-3xl bg-emerald-950 text-white shadow-card">
              <div className="border-b border-white/10 p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                    <Target size={20} />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold">Joe Buy Box</h2>
                    <p className="text-sm text-emerald-100/60">
                      Your deal criteria, checked live
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3">
                {buyBoxChecks.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-2xl p-3 transition hover:bg-white/5"
                  >
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                        item.pending
                          ? 'bg-white/10 text-white/40'
                          : item.passed
                            ? 'bg-emerald-400 text-emerald-950'
                            : 'bg-rose-400/20 text-rose-300'
                      }`}
                    >
                      {item.pending ? (
                        <ChevronRight size={16} />
                      ) : item.passed ? (
                        <Check size={16} strokeWidth={3} />
                      ) : (
                        <X size={16} strokeWidth={3} />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">
                        {item.label}
                      </span>
                      <span className="block text-xs text-emerald-100/55">
                        {item.target}
                      </span>
                    </span>
                    <span className="text-right text-sm font-bold text-emerald-50">
                      {item.pending ? '—' : item.value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mx-5 mb-5 rounded-2xl bg-white/5 p-4 text-xs leading-5 text-emerald-100/70">
                A deal must cash flow after HELOC interest and property
                management. Active reserves are included.
              </div>
            </section>
          </aside>
        </div>

        <footer className="py-8 text-center text-xs text-slate-400">
          Estimates are for quick deal screening and are not financial advice.
        </footer>
      </div>
    </main>
  )
}

export default App
