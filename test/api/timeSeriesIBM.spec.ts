import request from "supertest";
import { expect } from "chai";

const BASE_URL = "https://www.alphavantage.co";

describe("Alpha Vantage API", () => {
  it("should return time series daily", async () => {
    const response = await request(BASE_URL).get("/query").query({
      function: "TIME_SERIES_DAILY",
      symbol: "IBM",
      apikey: "demo",
    });

    expect(response.status).to.equal(200);
  });
});
