import supertest from "supertest";

const BASE_URL_ALPHA_VANTAGE = process.env.BASE_URL_ALPHA_VANTAGE as string;
const DEFAULT_API_KEY = "demo";

class AlphaVantageService {
  async fetchCommodityData(
    functionName: string,
    interval: "monthly" | "quarterly" | "annual" = "monthly",
    apiKey: string = DEFAULT_API_KEY
  ): Promise<supertest.Response> {
    const response = await supertest(BASE_URL_ALPHA_VANTAGE)
      .get("/query")
      .query({
        function: functionName,
        interval,
        apikey: apiKey,
      });

    return response;
  }
}

export default new AlphaVantageService();
