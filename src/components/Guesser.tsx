import { FormEvent, useState } from "react";
import { Country } from "../lib/country";
import { answerCountry, answerName } from "../util/answer";
import { Message } from "./Message";
import { polygonDistance } from "../util/distance";
import smallCountries from "../small_countries.json";
import alternateNames from "../alternate_names.json";
const countryData: Country[] = require("../country_data.json").features;

type Props = {
  guesses: Country[];
  setGuesses: React.Dispatch<React.SetStateAction<Country[]>>;
  win: boolean;
  setWin: React.Dispatch<React.SetStateAction<boolean>>;
};

const smallNames = smallCountries.map((name) => name.toLowerCase());

export default function Guesser({ guesses, setGuesses, win, setWin }: Props) {
  const [guessName, setGuessName] = useState("");
  const [error, setError] = useState("");

  function findCountry(countryName: string) {
    let foundCountry = countryData.find((country) => {
      const { NAME, NAME_LONG, ABBREV, ADMIN } = country.properties;
      return (
        NAME.toLowerCase() === countryName.toLowerCase() ||
        NAME_LONG.toLowerCase() === countryName.toLowerCase() ||
        ADMIN.toLowerCase() === countryName.toLowerCase() ||
        ABBREV.toLowerCase() === countryName.toLowerCase() ||
        ABBREV.replaceAll(".", "").toLowerCase() === countryName.toLowerCase()
      );
    });
    return foundCountry;
  }

  function runChecks() {
    if (smallNames.includes(guessName.toLowerCase())) {
      const idx = smallNames.indexOf(guessName.toLowerCase());
      const smallName = smallCountries[idx];
      setError(`${smallName} is too small to appear on this map`);
      return;
    }
    const oldNamePair = alternateNames.find((pair) => {
      return pair.old === guessName;
    });
    const userGuess = oldNamePair ? oldNamePair.real : guessName;
    const guessCountry = findCountry(userGuess);
    if (
      guesses.find((c) => {
        return c.properties.NAME.toLowerCase() === guessName.toLowerCase();
      })
    ) {
      setError("Country already guessed");
      return;
    }
    if (!guessCountry) {
      setError("Invalid country name");
      return;
    }
    if (guessCountry.properties.NAME === answerName) {
      setWin(true);
    }
    return guessCountry;
  }

  function addGuess(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    let guessCountry = runChecks();
    if (guessCountry && answerCountry) {
      guessCountry["proximity"] = polygonDistance(guessCountry, answerCountry);
      setGuesses([...guesses, guessCountry]);
      setGuessName("");
    }
  }

  return (
    <div className="mt-10 mb-6 block mx-auto text-center">
      <form
        onSubmit={addGuess}
        className="w-80 flex space-x-4 mx-auto my-2 justify-center"
      >
        <input
          className="shadow px-2 py-1 md:py-0
          text-gray-700 dark:bg-slate-300 focus:outline-none focus:shadow-outline disabled:bg-slate-400
          border rounded disabled:border-slate-400
          w-full"
          type="text"
          name="guesser"
          id="guesser"
          value={guessName}
          onChange={(e) => setGuessName(e.currentTarget.value)}
          disabled={win}
          placeholder={guesses.length === 0 ? "Enter country name here" : ""}
        />
        <button
          className="bg-blue-700 dark:bg-purple-800 hover:bg-blue-900 dark:hover:bg-purple-900 disabled:bg-blue-900  text-white 
          font-bold py-1 md:py-2 px-4 rounded focus:shadow-outline "
          type="submit"
          disabled={win}
        >
          Enter
        </button>
      </form>
      <Message win={win} error={error} guesses={guesses.length} />
    </div>
  );
}
