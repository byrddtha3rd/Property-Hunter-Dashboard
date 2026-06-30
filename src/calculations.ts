export type DealInputs = {
  purchasePrice: number
  monthlyRent: number
  downPaymentPercent: number
  mortgageRate: number
  loanTermYears: number
  helocRate: number
  managementPercent: number
  taxesInsurance: number
  maintenancePercent: number
  vacancyPercent: number
  maintenanceEnabled: boolean
  vacancyEnabled: boolean
}

export type DealResults = {
  downPayment: number
  loanAmount: number
  mortgagePayment: number
  helocInterest: number
  managementFee: number
  maintenanceReserve: number
  vacancyReserve: number
  baselineExpenses: number
  totalExpenses: number
  baselineCashFlow: number
  activeCashFlow: number
}

const safe = (value: number) =>
  Number.isFinite(value) ? Math.max(0, value) : 0

export function monthlyMortgagePayment(
  principalValue: number,
  annualRateValue: number,
  termYearsValue: number,
) {
  const principal = safe(principalValue)
  const annualRate = safe(annualRateValue)
  const termYears = safe(termYearsValue)
  const payments = termYears * 12

  if (principal === 0 || payments === 0) return 0
  if (annualRate === 0) return principal / payments

  const monthlyRate = annualRate / 100 / 12
  const growth = Math.pow(1 + monthlyRate, payments)
  return principal * ((monthlyRate * growth) / (growth - 1))
}

export function calculateDeal(raw: DealInputs): DealResults {
  const purchasePrice = safe(raw.purchasePrice)
  const rent = safe(raw.monthlyRent)
  const downPaymentPercent = Math.min(safe(raw.downPaymentPercent), 100)
  const downPayment = purchasePrice * (downPaymentPercent / 100)
  const loanAmount = Math.max(0, purchasePrice - downPayment)
  const mortgagePayment = monthlyMortgagePayment(
    loanAmount,
    raw.mortgageRate,
    raw.loanTermYears,
  )
  const helocInterest = downPayment * (safe(raw.helocRate) / 100 / 12)
  const managementFee = rent * (safe(raw.managementPercent) / 100)
  const maintenanceReserve = raw.maintenanceEnabled
    ? rent * (safe(raw.maintenancePercent) / 100)
    : 0
  const vacancyReserve = raw.vacancyEnabled
    ? rent * (safe(raw.vacancyPercent) / 100)
    : 0
  const baselineExpenses =
    mortgagePayment +
    safe(raw.taxesInsurance) +
    helocInterest +
    managementFee
  const totalExpenses =
    baselineExpenses + maintenanceReserve + vacancyReserve

  return {
    downPayment,
    loanAmount,
    mortgagePayment,
    helocInterest,
    managementFee,
    maintenanceReserve,
    vacancyReserve,
    baselineExpenses,
    totalExpenses,
    baselineCashFlow: rent - baselineExpenses,
    activeCashFlow: rent - totalExpenses,
  }
}

export function getDealRating(cashFlow: number) {
  if (cashFlow >= 300) return 'green' as const
  if (cashFlow >= 100) return 'yellow' as const
  return 'red' as const
}
