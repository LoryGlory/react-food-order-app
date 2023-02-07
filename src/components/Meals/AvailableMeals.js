// component containing database connection & fetch function to get available meals
import classes from './AvailableMeals.module.css';
import MealItem from "./MealItem/MealItem";
import Card from "../UI/Card";
import {useEffect, useState} from "react";


const AvailableMeals = () => {
  // states for meals, is loading when fetching data and error handling
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  // useEffect hook for fetch function
  useEffect(() => {
    // async function for loading meals from firebase database via http request
    const fetchMeals = async () => {
      const response = await fetch('https://react-food-app-11fa1-default-rtdb.firebaseio.com/meals.json');

      //   throw error if connection cannot be established
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      // parse Data from response
      const responseData = await response.json();

      // initializing empty array for meals
      const loadedMeals = [];

      // for loop for each ID in responseData array, using ID as key
      for (const key in responseData) {
        loadedMeals.push({
          id: key,
          name: responseData[key].name,
          description: responseData[key].description,
          price: responseData[key].price
        });
      }
      // add loadedMeals to setMeals, change setIsLoading to false
      setMeals(loadedMeals);
      setIsLoading(false);
    };

    // error handling, adding error message to setHttpError state
    fetchMeals().catch((error) => {
      setIsLoading(false);
      setHttpError(error.message)
    });
  }, []);

  // show Loading... paragraph while data fetching
  if (isLoading) {
    return (
        <section className={classes.MealsLoading}>
          <p>Loading...</p>
        </section>
    )
  }

  // show error if one exists
  if (httpError) {
    return (
        <section className={classes.MealsError}>
          <p>{httpError}</p>
        </section>
    )
  }

  // map meals from data as individual meal items
  const mealsList = meals.map(meal =>
      <MealItem
          id={meal.id}
          key={meal.id}
          name={meal.name}
          description={meal.description}
          price={meal.price}
      />
  );

  return (
      <section className={classes.meals}>
        <Card>
          <ul>
            {mealsList}
          </ul>
        </Card>
      </section>
  )
}

export default AvailableMeals;