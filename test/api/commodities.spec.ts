import { expect } from "chai";

import federalReserveEconomicDataService from "../../servicesExternal/federalReserveEconomicDataService";
import alphaVantageService from "../../serviceAlphaVantage/alphaVantageService";

interface FREDObservation {
  date: string;
  value: number;
}

const LIMIT_NEWEST_ENTRIES = 20;
const FRED_SERIES: Record<string, string> = {
  NATURAL_GAS: "DHHNGSP",
  COPPER: "PCOPPUSDM",
  ALUMINUM: "PALUMUSDM",
  WHEAT: "PWHEAMTUSDM",
  CORN: "PMAIZMTUSDM",
  COTTON: "PCOTTINDUSDM",
  SUGAR: "PSUGAISAUSDM",
  COFFEE: "PCOFFOTMUSDM",
};

describe("Should return data consistent with the FRED (information source)", () => {
  before(async function () {
    //Before hook verifies if Federal Reserve Economic Data (FRED) API is available
    const fredResponseHealthCheck =
      await federalReserveEconomicDataService.fetchObservationsForCommodity(
        "DHHNGSP"
      );

    expect(fredResponseHealthCheck.status).to.equal(200);
    expect(fredResponseHealthCheck.body).to.not.have.property("error_message");
  });

  Object.keys(FRED_SERIES).forEach((commodity) => {
    it(`should compare values between Alpha Vantage and FRED APIs for monthly interval of ${commodity}`, async function () {
      const alphaVantageResponse = await alphaVantageService.fetchCommodityData(
        commodity
      );
      expect(alphaVantageResponse.status).to.equal(200);
      expect(alphaVantageResponse.body).to.not.have.property("Information");

      const alphaVantageData = alphaVantageResponse.body.data as {
        date: string;
        value: number;
      }[];

      const fredSeriesId = FRED_SERIES[commodity];
      const fredResponse =
        await federalReserveEconomicDataService.fetchObservationsForCommodity(
          fredSeriesId,
          LIMIT_NEWEST_ENTRIES
        );

      expect(fredResponse.status).to.equal(200);
      expect(fredResponse.body).to.not.have.property("error_message");

      const fredData = (fredResponse.body.observations ||
        []) as FREDObservation[];

      const fredMap = new Map<string, number>(
        fredData.map((entry) => [entry.date, entry.value])
      );

      alphaVantageData.slice(0, LIMIT_NEWEST_ENTRIES).forEach((alphaEntry) => {
        const { date, value: alphaValue } = alphaEntry;
        const fredValue = fredMap.get(date);

        console.log(
          `Commodity: ${commodity}, Date: ${date}, Values AV: ${alphaValue}, FRED: ${fredValue}`
        );
        expect(alphaValue).to.equal(
          fredValue,
          `${commodity} [Alpha Vantage (target) vs FRED(source)] values for date ${date} do not match`
        );
      });
    });
  });
});
