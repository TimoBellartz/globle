import { Country } from "../lib/country";
import { today } from "./dates";
import Guesser from "../components/Guesser";

const countryData: Country[] = require("../data/country_data.json").features;

countryData.sort((a, b) => {
  return a.properties.FLAG[1].localeCompare(b.properties.FLAG[1]);
});

function generateKeyNew(list: any[], day: string) {
  const [year, month, date] = day.split("-");
  const dayCode = Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(date));
  const SHUFFLE_KEY = process.env.REACT_APP_SHUFFLE_KEY || "1";
  const key = Math.floor(dayCode / parseInt(SHUFFLE_KEY + "5")) % list.length;
  return key;
}

export function regenerateNewKey(){
  const countryData: Country[] = require("../data/country_data.json").features;
  const key = Math.floor(Math.random() * countryData.length);
  console.log(key);
  console.log(countryData[key].properties.NAME)
  return key;
}



export const answerCountry = countryData[regenerateNewKey()];
export const answerName = answerCountry.properties.NAME;
