// These are the first 19998 (!) spaces list (ascending by creation date).
// build up further later on.  

import { Space } from "../../src/types" ;
import listSpacesAsc from "../../helper/listSpacesAsc.json"
import listSpacesDesc from "../../helper/listSpacesDesc.json"

const spacesAsc: Space[] = JSON.parse(JSON.stringify(listSpacesAsc))
const spacesDesc: Space[] = JSON.parse(JSON.stringify(listSpacesDesc))

export const spaces: Space[] = [...spacesAsc, ...spacesDesc]
