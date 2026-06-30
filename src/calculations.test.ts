import { describe, expect, it } from 'vitest'
import {
  calculateDeal,
  getDealRating,
  monthlyMortgagePayment,
  type DealInputs,
} from './calculations'

const sample: DealInputs = {
  purchasePrice: 200000,
  monthlyRent: 2100,
  downPaymentPercent: 20,
  mortgageRate: 7,
  loanTermYears: 30,
  helocRate: 8.5,
  managementPercent: 10,
  taxesInsurance: 300,
  maintenancePercent: 0,
  vacancyPercent: 0,
  maintenanceEnabled: false,
  vacancyEnabled: false,
}

describe('rental deal calculations', () => {
  it('matches the sample property acceptance figures', () => {
    const result = calculateDeal(sample)

    expect(result.mortgagePayment).toBeCloseTo(1064.48, 2)
    expect(result.helocInterest).toBeCloseTo(283.33, 2)
    expect(result.managementFee).toBe(210)
    expect(result.baselineExpenses).toBeCloseTo(1857.82, 2)
    expect(result.activeCashFlow).toBeCloseTo(242.18, 2)
  })

  it('applies only enabled reserves', () => {
    const result = calculateDeal({
      ...sample,
      maintenancePercent: 5,
      vacancyPercent: 4,
      maintenanceEnabled: true,
      vacancyEnabled: false,
    })

    expect(result.maintenanceReserve).toBe(105)
    expect(result.vacancyReserve).toBe(0)
    expect(result.activeCashFlow).toBeCloseTo(
      result.baselineCashFlow - 105,
      5,
    )
  })

  it('handles a zero-interest mortgage', () => {
    expect(monthlyMortgagePayment(120000, 0, 10)).toBe(1000)
  })

  it('uses exact rating boundaries', () => {
    expect(getDealRating(99.99)).toBe('red')
    expect(getDealRating(100)).toBe('yellow')
    expect(getDealRating(299.99)).toBe('yellow')
    expect(getDealRating(300)).toBe('green')
  })

  it('returns safe values for unusable numeric input', () => {
    const result = calculateDeal({
      ...sample,
      purchasePrice: Number.NaN,
      loanTermYears: 0,
      monthlyRent: Number.POSITIVE_INFINITY,
    })

    Object.values(result).forEach((value) =>
      expect(Number.isFinite(value)).toBe(true),
    )
  })
})
