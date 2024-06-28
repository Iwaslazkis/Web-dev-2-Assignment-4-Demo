/******w**************
    
    Assignment 4 Javascript
    Name: 
    Date: 
    Description: 

*********************/

// Remember: you can't use this example for your assignment!
// You have to query a different API in the Winnipeg Open Data
// Portal, or a different API altogether.

// Initialize a counter (see line 41)
let count = 0;

// Our custom logic for sending a fetch request for the form
// Notice the async keyword, which allows you to use await
// inside the function.
async function formHandler(event) {
  // Don't use the browser "submit", use our logic below
  event.preventDefault();
  
  // Clean out the current results from the container
  const container = document.getElementsByClassName("results")[0];
  container.innerHTML = "<em>Loading...</em>";
  

  // Get input form element
  const commonName = document.getElementById("commonName");
  
  // Exit function if input is empty
  if (commonName.value === "") {
    return
  }
  // If not empty, then continue...
  
  // Modify the SoQL Query based on the input data
  const apiUrl = 'https://data.winnipeg.ca/resource/d3jk-hb6j.json?' +
  `$where=common_name LIKE '%${commonName.value.toLowerCase()}%'` +
  '&$order=diameter_at_breast_height DESC' +
                '&$limit=100';
    
  // Ensure all we HTML Encode all special characters (whitespace, &, ', ", etc)
  const encodedURL = encodeURI(apiUrl);
    
  // Do some logging in the DevTools console
  // Open DevTools (Ctrl + Shift + C, or hit inspect element) to see this.
  console.groupCollapsed(`Fetch Request #${count++}`);
  console.log("Search Term:", commonName.value);
  console.log("Final URL:", encodedURL);
  
  /* Run the fetch request (AJAX request)
  *  Note the 'await' keyword; since a fetch may take a while,
  *  fetch returns a promise. This means that you need to put
  *  an await to tell the function to only run the next command
  *  once the promise resolves, otherwise you won't be to get the
  *  value of the promise (the return value of "fetch" will just
  *  be an object representing that the fetch request is still
  *  happening, but it has not finished yet. It only "promised"
  *  that it would eventually return a value.)
  *  See this video for more information on how promises work:
  *  https://www.youtube.com/watch?v=vn3tm0quoqE
  */
 const fetchResponse = await fetch(encodedURL);
 
 // Convert the string response into a JSON object
 const trees = await fetchResponse.json();
 
 console.log("Result:", trees);
 console.groupEnd();
 


 // Then, insert each item into the DOM...
  trees.forEach(item => {
    /* We use Object.entries to create an array of each
    *  property of 'item', then we use the reduce method to
    *  you combine all elements of the array. In this case,
    *  we're using it to create a string with an <li> element
    *  per property of the tree.
    *  If you haven't seen it before, read this:
    *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
    */
    listItems = Object.entries(item).reduce((itemEntry, currentProperty) => {
      // Use Object Destructuring to separate the
      // key and value of the property.
      const [key, value] = currentProperty;
      
      // Skip Common Name, since we style that differently (see the <h2> below)
      if (key === "common_name") {
        return itemEntry
      }
      // Also skip if value is not a string, or empty
      if (value === "" || typeof value !== "string") {
        return itemEntry
      }
      
      // Otherwise, do...
      return itemEntry += /* html */ `
        <li><strong>${key}:</strong> ${value}</li>
        `
    }, "")
    
    // Some templating around each entry
    const resultHTML = /* html */ `
      <div>
        <h2>${item.common_name}</h2>
        <ul>
          ${listItems}
        </ul>
      </div>
      `
    container.innerHTML = container.innerHTML + resultHTML;
  });
  // Now that we're done, remove the loading element
  document.querySelector(".results em").remove();
  
  // If empty results, then let the user know
  if (container.innerHTML === "") { 
    container.innerHTML = "<h3>Sorry, we didn't find any trees with that name!</h3>";
  }
};

// Wait for the HTML DOM to load before we attach our
// handler to the form. If we don't do this, line 76 may
// end up failing, because this script runs in the <head>
// element, before the HTML has fully parsed. 
document.addEventListener('DOMContentLoaded', () => {
  // Find the form element
  const form = document.getElementById("searchForm");
  form.addEventListener("submit", formHandler);
});