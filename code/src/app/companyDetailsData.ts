export interface companyDetailsData {[key: string]:
{

  "profile": {
      "ticker": string,
      "name": string,
      "exchange": string,
      "ipo": string,
      "finnhubIndustry": string,
      "logo": string,
      "weburl": string
  },
  "charts": {
      "title": string,
      "data": {
          "olhc": Array<Array<number>>,
          "volume": Array<Array<number>>,

      }
  },
  "news": Array<{
          "headline": string,
          "source": string,
          "datetime": string,
          "summary": string,
          "url": string,
          "image": string
      }>,
  "quote": {
      "c": number,
      "d": number,
      "dp": number,

      "h": number,
      "l": number,
      "o": number,
      "pc": number,
      "t": number,
      "marketStatus": string,
      "timestamp": string,
      "charts": [
          {
              "title": string,
              "data": Array<Array<number>>
          }
      ]
  },
  "insights": {
      "reddit": {
          "mention": number,
          "positiveMention": number,
          "negativeMention": number
      },
      "twitter": {
          "mention": number,
          "positiveMention": number,
          "negativeMention": number
      },
      "recommendation": {
          "categories": [],
          "series": []
      },
      "earnings": {
          "categories": [],
          "actual": [],
          "estimate": []
      },
      "name": string
  },
  "peers": Array<string>
}
}
