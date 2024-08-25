import { expect } from "chai";
import alphaVantageService from "../../serviceAlphaVantage/alphaVantageService";

describe("Core API - Ticker search", () => {
  it("should return demo data for demo keyword with demo api keyword AV-TC-002", async () => {
    const DEMO_KEYWORDS = ["tesco", "tencent", "BA", "SAIC"];

    const fetchPromises = DEMO_KEYWORDS.map((keyword) =>
      alphaVantageService.fetchSymbolSearch(keyword).then((response) => {
        expect(response.status).to.equal(200);
      })
    );

    await Promise.all(fetchPromises);
  });

  it("should return error for demo keyword other than allowed keyword AV-TC-003", async function () {
    const RESTRAINED_KEYWORDS = ["british", "petrol", "bp", "tesco"];
    const fetchPromises = RESTRAINED_KEYWORDS.map(async (keyword) => {
      const restrictedKeywords = await alphaVantageService.fetchSymbolSearch(
        keyword
      );
      expect(restrictedKeywords.status).to.equal(200);
      expect(restrictedKeywords.body).to.have.property("Information");
    });

    await Promise.all(fetchPromises);
  });

  it("should return data for keyword 'micro' using valid free api key AV-TC-004", async () => {
    const SEARCH_KEYWORD = "micro";
    const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY as string;
    const restrictedKeywords = await alphaVantageService.fetchSymbolSearch(
      SEARCH_KEYWORD,
      ALPHA_VANTAGE_API_KEY
    );
    expect(restrictedKeywords.status).to.equal(200);

    const bestMatches = restrictedKeywords.body.bestMatches;

    bestMatches.forEach((match: any) => {
      expect(match["2. name"].toLowerCase()).to.include(
        SEARCH_KEYWORD.toLowerCase()
      );
    });

    for (let i = 0; i < bestMatches.length - 1; i++) {
      const comparedParam = "9. matchScore";
      const currentScore = parseFloat(bestMatches[i][comparedParam]);
      const nextScore = parseFloat(bestMatches[i + 1][comparedParam]);
      expect(currentScore).to.be.at.least(nextScore);
    }
  });
});
