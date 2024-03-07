list.of.packages <- c("ghql", "jsonlite")
new.packages <- list.of.packages[!(list.of.packages %in% installed.packages()[,"Package"])]
if(length(new.packages)) install.packages(new.packages)
invisible(lapply(list.of.packages, require, character.only = TRUE))

library(ghql)
library(jsonlite)
link <- 'https://hub.snapshot.org/graphql'

# R6 class for constructing graphql queries
conn <- GraphqlClient$new(url = link)

## Define query
query <- '
  query listSpaces($skip: Int!){
    spaces(
        first: 1000,
        skip: $skip,
        orderBy: "created",
        orderDirection: asc
      ) {
        id
        votesCount
        categories
        about
      }
    }
'

## Create a query class first
listSpaces <- Query$new()$query('link', query)
listSpaces$link

variable <- list(
  skip = 0
) 

fullResult <- toJSON(result)
for (i in 1:29) {
  variable <- list(
    skip = i * 1000
  ) 
  result <- conn$exec(listSpaces$link, variables = variable)
  resultdf <- fromJSON(result, flatten = F) 
  resultspaces <- resultdf$data$spaces
  resulttoJson <- toJSON(resultspaces)
  test <- fromJSON(resulttoJson, flatten = F) 
  
  fullResult <- toJSON(rbind(fromJSON(fullResult), fromJSON(result)))
}

write(fullResult, 'listSpacesAsc.json')
