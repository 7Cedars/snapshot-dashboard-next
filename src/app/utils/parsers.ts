import { Space, StartDate, EndDate, SelectedSpaces} from "../../types";
import spaces from "../../../public/data/spacesList";

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isNumber = (number: unknown): number is number => {
  return typeof number === 'number' || number instanceof Number;
};

const isArray = (array: unknown): array is Array<string> => {
  // array.find(item => !isString(item)) 
  return typeof array === 'string' || array instanceof Array;
};

const parseId = (id: unknown): string => {
  if (!isString(id)) {
    throw new Error(`Incorrect or missing id: ${id}`);
  }
  return id;
};

const parseVotesCount = (votesCount: unknown): number => {
  if (!isNumber(votesCount)) {
    throw new Error(`Incorrect or missing id: ${votesCount}`);
  }
  return votesCount;
};

const parseCategories = (categories: unknown): Array<string> => {
  if (!isArray(categories)) {
    throw new Error(`Incorrect or missing categories: ${categories}`);
  }
  return [] as Array<string>;
};

export const toSpaceEntry = (object: unknown): Space => { 
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if ('id' in object && 
      'votesCount' in object && 
      'categories' in object
      )  
  {
    const entry: Space = {
      id: parseId(object.id),
      votesCount: parseVotesCount(object.votesCount),
      categories: parseCategories(object.categories), 
    };

    return entry;  
  } 
  throw new Error('Incorrect data: some fields are missing');
}; 

// NB: still need to add parsers for Proposal and Vote inputs. 
// Never ever trust anything you receive from an outside source... 

// NB: still WIP: see below.

export const parseStartDate = (value: string): StartDate => {
  if (!isString(value)) {
    throw new Error(`Incorrect or missing dataUrl at Parser: ${value}`);
  }

  if (!isNumber(parseInt(value))) {
    throw new Error(`Data is not stringefied number: ${value}`);
  }

  return parseInt(value); 
}

export const parseEndDate = (value: string): EndDate => {
  if (!isString(value)) {
    throw new Error(`Incorrect or missing dataUrl at Parser: ${value}`);
  }

  if (!isNumber(parseInt(value))) {
    throw new Error(`Data is not stringefied number: ${value}`);
  }

  return parseInt(value); 
}

export const parseSelectedSpaces = (spaces: string[]): SelectedSpaces => {
  if (spaces.find(space => !isString(space))) {
    throw new Error(`Incorrect or missing dataUrl at selectedSpaces: ${spaces}`);
  }

  const selectedSpaces = spaces //.split(';')
  // TODO
  // Here should be checked against ids of spacelist. 
  // But should not be created everysingle time... 
  // should save this list in redux store at startup. 

  return selectedSpaces; 
}


// // To be depricated 
// export const parseUrlInput = (object: unknown): UrlInput => { 
//   console.log("parseInputEntries is called.")
//   if (!isString(object)) {
//     throw new Error(`Incorrect or missing dataUrl at Parser: ${object}`);
//   }

//   if (
//     object.indexOf('sps:') === -1 || 
//     object.indexOf('&&sd:') === -1 || 
//     object.indexOf('&&ed:') === -1 
//     ) {
//       throw new Error(`Incorrect data in dataUrl: ${object}`);
    
//     } else {
//       const splitUrl = object.split('&&')
//       // const modal: 'about' | 'settings' | 'savedSearches' | 'none' = 'none'
//       // const stopFetching = false
//       // const settings: {darkMode: boolean; developerMode: boolean } = {
//       //   darkMode: false, developerMode: false } 

//       // NB: These still need to be properly checked. 

//       const inputState  = {
//         //urlData: object, 
//         selectedSpaces: splitUrl[0].replace('sps:', '').split(';'),
//         startDate: parseInt(splitUrl[1].replace('sd:', '')), 
//         endDate: parseInt(splitUrl[2].replace('ed:', '')), 
//         // modal: modal,
//         // stopFetching: stopFetching, 
//         // settings: settings
//       }

//       return inputState
//     }
// }; 

export default { toSpaceEntry }; 