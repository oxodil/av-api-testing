import supertest from 'supertest'

const BASE_URL_ALPHA_VANTAGE = process.env.BASE_URL_ALPHA_VANTAGE as string
const DEFAULT_API_KEY = 'demo'

class AlphaVantageService {
  private async fetchData(
    queryParams: { [key: string]: string },
    apiKey: string
  ): Promise<supertest.Response> {
    queryParams.apikey = apiKey

    return await supertest(BASE_URL_ALPHA_VANTAGE)
      .get('/query')
      .query(queryParams)
  }

  async fetchTimeSeriesIntraday(
    symbol: string = 'IBM',
    interval: string = '5min',
    apiKey: string = DEFAULT_API_KEY
  ): Promise<supertest.Response> {
    const queryParams = {
      function: 'TIME_SERIES_INTRADAY',
      symbol: symbol,
      interval: interval,
    }

    return this.fetchData(queryParams, apiKey)
  }

  async fetchSymbolSearch(
    keywords: string,
    apiKey: string = DEFAULT_API_KEY
  ): Promise<supertest.Response> {
    const queryParams = {
      function: 'SYMBOL_SEARCH',
      keywords: keywords,
    }

    return this.fetchData(queryParams, apiKey)
  }

  async fetchCommodityData(
    functionName: string,
    interval: 'monthly' | 'quarterly' | 'annual' = 'monthly',
    apiKey: string = DEFAULT_API_KEY
  ): Promise<supertest.Response> {
    const queryParams = {
      function: functionName,
      interval: interval,
    }

    return this.fetchData(queryParams, apiKey)
  }
}

export default new AlphaVantageService()
