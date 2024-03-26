"use server";
import { StockData } from "@/components/llm/chart";
import { restClient } from "@polygon.io/client-js";

import axios from "axios";
const rest = restClient(process.env.POLY_API_KEY);
const POLYGON_BASE_URL = "https://api.polygon.io/";

async function getFinancials(ticker: string) {
  const url = `${POLYGON_BASE_URL}vX/reference/financials?ticker=${ticker}&limit=2&apiKey=${process.env.POLY_API_KEY}`;
  const response = await axios.get(url);
  const data = response.data;

  const status = data.status;
  if (status !== "OK") {
    throw new Error(`API Error: ${JSON.stringify(data)}`);
  }

  return data.results;
}
async function getNews(ticker: string) {
  try {
    const data = await rest.reference.tickerNews({ ticker: ticker });
    const filteredData = data.results.map((item: any) => {
      const { amp_url, keywords, publisher, id, ...rest } = item;
      return rest;
    });

    return filteredData;
  } catch (e) {
    console.error("An error occurred while fetching the last quote:", e);
    throw e;
  }
}

async function getAggregates(ticker: string, from: string, to: string) {
  try {
    const url = `${POLYGON_BASE_URL}v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=25&apiKey=${process.env.POLY_API_KEY}`;
    const response = await axios.get<StockData>(url);
    const data = response.data;

    return data;
  } catch (e) {
    console.error("An error occurred while fetching the last quote:", e);
    throw e;
  }
}

export { getFinancials, getNews, getAggregates };
