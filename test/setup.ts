import { expect } from "chai";
import { before } from "mocha";
import alphaVantageService from "../serviceAlphaVantage/alphaVantageService";

before(async function () {
  const commodity = "NATURAL_GAS";
  //Before hook verifies is Alpha Vantage API responds for publicly available endpoint with demo api key
  const alphaVantageHealthCheck = await alphaVantageService.fetchCommodityData(
    commodity
  );

  expect(alphaVantageHealthCheck.status).to.equal(200);
  expect(alphaVantageHealthCheck.body).to.not.have.property("Information");
});
