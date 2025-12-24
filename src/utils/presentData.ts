import JonPrize1 from "../assets/presents/sangboka.jpg";
import JonPrize2 from "../assets/presents/gin.jpg";
import EliseEliasPrize from "../assets/presents/kjottkvern.jpg";
import HelgePrize from "../assets/presents/skydive.jpg";

export interface Prize {
  image: string;
  prizeText: string;
  webLink?: string;
}

export interface PlayerContent {
  title: string;
  description: string;
  prizes: Prize[];
}

export const presentData: Record<string, PlayerContent> = {
  elias: {
    title: "Til Elias & Elise",
    description: "Bla gjennom deres velfortjente julegaver!",
    prizes: [
      {
        image: EliseEliasPrize,
        prizeText: "Kraftig kjøttkvern til din Kenwood-maskin!",
      },
    ],
  },
  elise: {
    title: "Til Elias & Elise",
    description: "Bla gjennom deres velfortjente julegaver!",
    prizes: [
      {
        image: EliseEliasPrize,
        prizeText: "Kraftig kjøttkvern til din Kenwood-maskin!",
      },
    ],
  },
  jon: {
    title: "Til Jon",
    description: "Takk for god innsats i spillet!",
    prizes: [
      {
        image: JonPrize1,
        prizeText: "Den Store Sangboka",
      },
      {
        image: JonPrize2,
        prizeText: "Ginsmaking med destilleriomvisning",
        webLink: "https://ywi.sh/lznwW",
      },
    ],
  },
  helge: {
    title: "Til Helge",
    description: "God Jul!",
    prizes: [
      {
        image: HelgePrize,
        prizeText: "Indoor Skydiving",
        webLink: "https://ywi.sh/2iFCw",
      },
    ],
  },
};
