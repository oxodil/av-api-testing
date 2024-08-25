import { expect } from "chai";
import { before } from "mocha";
import alphaVantageService from "../serviceAlphaVantage/alphaVantageService";

before("Health check - AV ROOT API", async function () {
  const alphaVantageHealthCheck =
    await alphaVantageService.fetchTimeSeriesIntraday();

  expect(alphaVantageHealthCheck.status).to.equal(200);
  expect(alphaVantageHealthCheck.body).to.not.have.property("Information");
});
