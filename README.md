This is a [Next.js](https://nextjs.org/) dashboard of snapshot voting behavior in DAO spaces on the [snapshot](https://snapshot.org/) platform. 

## Getting Started
To run the dashboard locally, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## To Do 

This dashboard is under active development. 

Sorted on priority, issues to address 
- [x] Simplify page layout (take out some layout pages etc) 
- [ ] refactor ui saved searches + fix runtime bug (double keys)
- [ ] develop landing page + add FAQ
- [ ] make double selections impossible. 
- [ ] create & implement loading screens. 
- [x] drop items from search after selection. 
- [x] fix sizing layout issues 
- [ ] update time range selector that it includes blue between items. 
- [ ] fix all runtime errors
- [ ] create unit tests with cyprus 
- [ ] limit rerenders of dashboard - useMemo
- [ ] limit amount of selected spaces to N (30?) 
- [ ] fix ring colour spaces list
- [ ] fix consistency of colours between spaceslist, heatmap and network graph. 
- [ ] enable darkmode
- [ ] load dates in URL on start of app. 
- [ ] make network diagram interactive.
- [ ] When all these done: deploy on vercel.com
- [ ] write documentation, add / update comments in code.
- [ ] implement additional infro from single space. 
- [ ] go through code and clean up:
  - [ ] console.logs
  - [ ] run linter(?) standardise layout of code. 



## Learn More

To learn more about this app or snapshot: 
...
