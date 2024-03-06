const jsonfile = require('jsonfile');

const path = './data.json';

const data = [
  {
      "id": "dozatraffic.eth",
      "votesCount": 0,
      "categories": [
          "social"
      ],
      "about": ""
    }
]

export const savefile = () => {
  jsonfile.writeFile(path, JSON.stringify(data, null, 2), (error: any) => {
    if (error) {
      console.log('An error has occurred ', error);
      return;
    }
    console.log('Data written successfully to disk');
  });
} 
