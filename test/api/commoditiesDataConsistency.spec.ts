import { expect } from 'chai'
import federalReserveEconomicDataService from '../../servicesExternal/federalReserveEconomicDataService'
import alphaVantageService from '../../serviceAlphaVantage/alphaVantageService'

interface FREDObservation {
  date: string
  value: number
}

interface AlphaVantageResponse {
  status: number
  body: {
    data: {
      date: string
      value: number
    }[]
  }
}

interface FREDResponse {
  status: number
  body: {
    observations?: FREDObservation[]
    error_message?: string
  }
}

const LIMIT_NEWEST_ENTRIES = 20
const FRED_SERIES: Record<string, string> = {
  NATURAL_GAS: 'DHHNGSP',
  COPPER: 'PCOPPUSDM',
  ALUMINUM: 'PALUMUSDM',
  WHEAT: 'PWHEAMTUSDM',
  CORN: 'PMAIZMTUSDM',
  COTTON: 'PCOTTINDUSDM',
  SUGAR: 'PSUGAISAUSDM',
  COFFEE: 'PCOFFOTMUSDM',
}

describe('Commodities - verify data consistency between target and source', () => {
  before(async function () {
    //Before hook verifies if Federal Reserve Economic Data (FRED) API is available
    const fredResponse: FREDResponse =
      await federalReserveEconomicDataService.fetchObservationsForCommodity(
        'DHHNGSP'
      )

    expect(fredResponse.status).to.equal(200)
    expect(fredResponse.body).to.not.have.property('error_message')
  })

  Object.keys(FRED_SERIES).forEach((commodity) => {
    it(`should compare values between Alpha Vantage and FRED APIs for monthly interval of ${commodity} | AV-TC-014`, async function () {
      const alphaVantageResponse: AlphaVantageResponse =
        await alphaVantageService.fetchCommodityData(commodity)
      expect(alphaVantageResponse.status).to.equal(200)
      expect(alphaVantageResponse.body).to.not.have.property('Information')

      const alphaVantageData = alphaVantageResponse.body.data

      const fredSeriesId = FRED_SERIES[commodity]
      const fredResponse: FREDResponse =
        await federalReserveEconomicDataService.fetchObservationsForCommodity(
          fredSeriesId,
          LIMIT_NEWEST_ENTRIES
        )

      expect(fredResponse.status).to.equal(200)
      expect(fredResponse.body).to.not.have.property('error_message')

      const fredData = fredResponse.body.observations || []

      const fredMap = new Map<string, number>(
        fredData.map((entry) => [entry.date, entry.value])
      )

      alphaVantageData.slice(0, LIMIT_NEWEST_ENTRIES).forEach((alphaEntry) => {
        const { date, value: alphaValue } = alphaEntry
        const fredValue = fredMap.get(date)

        console.log(
          `Commodity: ${commodity}, Date: ${date}, Values AV: ${alphaValue}, FRED: ${fredValue}`
        )
        expect(alphaValue).to.equal(
          fredValue,
          `${commodity} [Alpha Vantage (target) vs FRED(source)] values for date ${date} do not match`
        )
      })
    })
  })
})
