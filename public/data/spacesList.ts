import { Space } from "../../src/types" ;
import listSpacesAsc from "./listSpacesAsc.json"
import listSpacesDesc from "./listSpacesDesc.json"

const spacesAsc: Space[] = JSON.parse(JSON.stringify(listSpacesAsc))
const spacesDesc: Space[] = JSON.parse(JSON.stringify(listSpacesDesc))

export const spaces: Space[] = [...spacesAsc, ...spacesDesc]
