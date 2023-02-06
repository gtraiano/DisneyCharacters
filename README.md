# DisneyCharacters
Developed with [vite](https://vitejs.dev/).<br>
Written in [React](https://reactjs.org/) and [TypeScript](typescriptlang.org/).<br>
Uses [Redux](https://redux.js.org/) and [highcharts](https://www.highcharts.com/).

Powered by [Disney API](https://disneyapi.dev/).

Try [live demo](https://disney-characters.onrender.com/)

## Scripts
`npm install` to install dependencies

`npm run dev` to start the development server

`npm run build` to build (bundle) the source code

## User Stories
1. As a user I would like to be able to see and navigate through all Disney characters in a table.
    - Table columns
         - Character name
         - How many TV shows this character participates in.
         - How many Video Games this character participates in.
         - The names of the allies this character has.
         - The names of the enemies this character has. 
    - Table functionality
        -  The user should be able to select to display [10,20,50,100,200 and 500] characters per page.
        - The user should be able to navigate to the next or previous page.
        - Each page should display 50 characters initially.
        - The user should be able to search and find a desired character across all available characters.
        - The user should be able to find a character participating in a TV show.
        - The user should be able to sort the list of characters per page by name.

2. As a user I would like to see the details of a character by selecting a table row element, on a modal.
    - Inside the modal should be present
        - The character name
        - The character image
        - The list of TV shows and Video games this character participates in.
  
3. As a user I would like to be able to see on a PIE chart every table page character results.
    - Each portion of the chart should be the number of films each character participates in.
    - When hovering on a portion the percentage of the portion and the list of films should be displayed.
    - The user should be able to export the data of the chart in a xlsx file.
    - Each time the table view changes the chart should be updated accordingly.

## Implementation
The application follows these design patterns
1. [higher-order component](https://blog.logrocket.com/react-design-patterns/#higher-order-component-pattern)
2. [provider](https://blog.logrocket.com/react-design-patterns/#provider-pattern)
3. [event bus](https://betterprogramming.pub/how-to-use-event-bus-in-react-architecture-f90485477647) (simplified version of)

## Controllers
### **`DisneyAPI`**
Performs all requests to `Disney API`. Functionality includes fetching
* character data bundle (*page*) by page number (50 items per request)
* single character data by id
* characters page by query

## State Management
State management is performed via the `Redux Toolkit`.

The store state is defined as
```typescript
export interface StoreState {
    charactersPages: CharactersPagesState,  // Disney characters pages fetched from Disney API
    fetcherStatus: FetcherStatus,           // status of Disney API controller
    filter: FilterStatus                    // filter query
}
```

`charactersPages` essentially holds the pages of Disney characters fetched from the `Disney API`. A *"thunk"* action is used when performing such requests.

`fetcherStatus` holds the status of latest `DisneyAPI` controller request. In case of error, a message is stored.

`filter` holds a query for filtering purposes.

## Event Bus
The `window.document` object is used as an event bus to achieve communication between components. Listeners can be registered and removed for an event. Dispatch of an event may include a payload.

```typescript
type EventKey = string;
type EventHandler = (payload?: any) => void;

interface EventBus {
    on: (event: EventKey, callback: EventHandler) => void,      // add listener
    once: (event: EventKey, callback: EventHandler) => void,    // handler will be invoked only once
    emit: (event: EventKey, data?: any) => void,                // dispatch event
    off: (event: EventKey, callback: EventHandler) => void      // remove listener
};
```

### Events
#### **`showModal`**
Signals modal must be displayed. Character id is required as payload.
#### **`visibleCharacters`**
Signals change of the table view in `CharactersTable`. The dispatched event includes all viewable characters' id's as payload.

## Components
### **CharactersTable**
#### **`Table`**
Presents a table containing Disney characters information. Functionality includes column customization, sorting by multiple columns, filtering by multiple columns and pagination functionality.

The `Table`'s columns are defined in property `columns`, along with the items per page in property `perPage` (see following code block).

```typescript
export interface CharactersTableProps {
    columns: Array<{
        key: keyof DisneyCharacterData,                             // object property in DisneyCharacterData
        computedValue?: (item: DisneyCharacterData) => any,         // computed value to display (other than object[key])
        label: string,                                              // header label
        sortable?: boolean,                                         // is sortable field
        compareFn?: (a: any, b: any) => number                      // compare function to use in sorting
    }>,
    perPage: number                                                 // items per page
};
```

`key` defines the property name in a `DisneyCharacterData` object (fetched from the *Disney API*) to draw a table cell's value from. Should we need to display custom elements or compute a value from object properties, we may define the `computedValue` function. 

`label` provides the string to be displayed for the respective column header.

`sortable` signifies whether a column is sortable.

`compareFn` provides a compare function to use when sorting. In case it is not provided, the column values are compared as strings.

Sort and filter functionality is applied on a local copy of the array data (pulled from the store), leaving the source array untouched.

#### **`Pagination`**
A stateless component providing a UI for pagination controls. All operations are performed via callbacks.

```typescript
interface PaginationProps {
    itemsPerPage: number,                                   // items per page
    totalItems: number,                                     // total items
    currentPage: number,                                    // current page number
    onChangeItemsPerPage: (e: SyntheticEvent) => any,       // onChange handler when changing items per page
    onClickNextPage: (e: SyntheticEvent) => any,            // onClick handler for next page caret
    onClickPrevPage: (e: SyntheticEvent) => any,            // onClick handler for previous page caret
    onGoToPage: (e: SyntheticEvent) => any                  // onKeyDown handler for go to page input field
}
```

### **`Filter`**
UI component to change filter query. Dispatches actions to store `filter`.
### **`Modal`**
Modal displaying custom content. Toggling of the components visibility is controlled by the App, and initiated by a `showModal` custom event.
### **`PieChart`**
Reactive pie chart component showing table view characters film appearances.
The component performs lookup by characer id and gathers the required data when a `visibleCharacters` event is dispatched. By default, an empty pie chart is rendered.
### **`CharacterProfile`**
A simple character profile. Provided as content to `Modal`.

## Credits
All React components are custom, developed per the user stories requirements.

The application utilizes **Redux** for state management, and **highcharts** for plotting purposes.

Consulted external sources when developing the **Modal** component
1. How to Build a Good React Modal, https://www.copycat.dev/blog/react-modal/
2. Considerations for Styling a Modal, https://css-tricks.com/considerations-styling-modal/

CSS styling custom made, excluding [styles](https://css-tricks.com/considerations-styling-modal/) for the **Modal** component.

The idea to style the table body as a block element (and thus be able to set a minimum height) was inspired by
1. https://stackoverflow.com/questions/12441418/scrollable-fixed-height-table
2. https://stackoverflow.com/questions/34993813/css-fixed-height-on-tr-and-fixed-height-on-table

Typography provided by the [Roboto](https://fonts.google.com/specimen/Roboto) font.