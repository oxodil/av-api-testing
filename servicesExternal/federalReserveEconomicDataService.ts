import supertest from 'supertest'

const BASE_URL_FRED = 'https://api.stlouisfed.org/fred'
const OBSERVATIONS_ENDPOINT = '/series/observations'
const FRED_API_KEY = process.env.FRED_API_KEY as string
const DEFAULT_LIMIT = 20

class FederalReserveEconomicDataService {
  private api_key: string = FRED_API_KEY

  async fetchObservationsForCommodity(
    series_id: string,
    limit: number = DEFAULT_LIMIT
  ): Promise<supertest.Response> {
    return await supertest(BASE_URL_FRED).get(OBSERVATIONS_ENDPOINT).query({
      series_id,
      api_key: this.api_key,
      file_type: 'json',
      frequency: 'm',
      limit,
      sort_order: 'desc',
    })
  }
}

export default new FederalReserveEconomicDataService()
