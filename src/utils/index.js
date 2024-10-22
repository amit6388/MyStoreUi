// Function to store data in localStorage
export const setDataInLocalStorage = (key, value) => {
    try {
      const serializedValue = JSON.stringify(value); // Convert value to JSON string
      localStorage.setItem(key, serializedValue); 
    } catch (error) {
      console.error("Error saving data to localStorage", error);
    }
  };
  
  // Function to retrieve data from localStorage
  export const getDataFromLocalStorage = (key) => {
    try {
      const serializedValue = localStorage.getItem(key);  // Get the stored item
      if (serializedValue === null) return null;          // If no data found, return null
      return JSON.parse(serializedValue);                 // Convert JSON string back to object
    } catch (error) {
      console.error("Error retrieving data from localStorage", error);
      return null;
    }
  };
  