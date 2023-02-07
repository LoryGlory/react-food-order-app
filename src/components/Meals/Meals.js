// component containing all necessary meal components, used in app.js
import React, {Fragment} from "react";
import MealsSummary from "./MealsSummary";
import AvailableMeals from "./AvailableMeals";


const Meals = () => {
  return (
      <Fragment>
        <MealsSummary/>
        <AvailableMeals/>
      </Fragment>
  );
};

export default Meals;