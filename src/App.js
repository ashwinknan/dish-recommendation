import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DishCard from './components/DishCard';
import SelectionHistory from './components/SelectionHistory';
import axios from 'axios';

function App() {
    const [dishes, setDishes] = useState([]);
    const [recommendations, setRecommendations] = useState(null);
    const [ingredientsData, setIngredientsData] = useState({});
    const [selectedDishes, setSelectedDishes] = useState([]);

    useEffect(() => {
        fetch('/dish_database.xlsx')
            .then(response => response.arrayBuffer())
            .then(data => {
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                let dishesData = XLSX.utils.sheet_to_json(firstSheet);

                dishesData = transformDishes(dishesData);
                setDishes(dishesData);
            });
    }, []);

   function transformDishes(dishes) {
        const dishMap = new Map();

        dishes.forEach(dish => {
            if (!dishMap.has(dish.Name)) {
                dishMap.set(dish.Name, {
                    Name: dish.Name,
                    Type: dish.Type
                });
            }
        });

        return Array.from(dishMap.values());
    }

    const fetchIngredientsFromAPI = async (dishName) => {
        try {
            const response = await axios.post('https://blooming-gorge-97260-a53af4c12ad9.herokuapp.com/getIngredients', { dishName });
            const ingredients = response.data.ingredients;
            console.log("Ingredients received for", dishName, ":", ingredients);
            setIngredientsData(prevState => ({ ...prevState, [dishName]: ingredients }));
        } catch (error) {
            console.error("Failed to fetch ingredients:", error);
        }
    }

    const generateDishForToday = () => {
        const breakfasts = dishes.filter(d => d.Type === "breakfast");
        const salads = dishes.filter(d => d.Type === "salad");
        const lunchAndDinner = dishes.filter(d => d.Type === "lunch + dinner");
    
        const randomDish = (type) => {
            if (type && type.length > 0) {
                return type[Math.floor(Math.random() * type.length)];
            }
            return null;
        }
    
        const breakfastDish = randomDish(breakfasts);
        const saladDish = randomDish(salads);
        const lunchDinnerDish = randomDish(lunchAndDinner);
    
        if (breakfastDish && saladDish && lunchDinnerDish) {
            const todayRecommendations = {
                breakfast: breakfastDish,
                salad: saladDish,
                lunchDinner: lunchDinnerDish
            };
            
            setRecommendations(todayRecommendations);
    
            // Add the recommendations to the selectedDishes state.
            setSelectedDishes(prevDishes => [...prevDishes, todayRecommendations]);
    
            fetchIngredientsFromAPI(breakfastDish.Name);
            fetchIngredientsFromAPI(saladDish.Name);
            fetchIngredientsFromAPI(lunchDinnerDish.Name);
        } else {
            alert('One or more dish types have no entries. Please ensure there are dishes for each type in the Excel file.');
        }
    };

    const refreshDishForType = async (type) => {
        try {
            const dishArray = dishes.filter(d => d.Type === type.replace("lunchDinner", "lunch + dinner"));
            const randomDish = dishArray[Math.floor(Math.random() * dishArray.length)];

            if (randomDish) {
                setRecommendations(prevRecommendations => ({
                    ...prevRecommendations,
                    [type]: randomDish
                }));

                fetchIngredientsFromAPI(randomDish.Name);
            }
        } catch (error) {
            console.error("Error refreshing dish:", error);
        }
    };
    

    return (
        <div className="container mt-5">
            <div className="text-center mb-5">
                <h1>Ashwin's Dish Recommender System</h1>
                {!recommendations ? (
                    <button className="btn btn-primary mt-4" onClick={generateDishForToday}>Generate Dish for Today</button>
                ) : (
                    <div className="row mt-4">
                        {['breakfast', 'salad', 'lunchDinner'].map(type => (
                            <DishCard key={type} type={type} dish={recommendations[type]} ingredients={ingredientsData} onRefresh={refreshDishForType} />
                        ))}
                    </div>
                )}
                <SelectionHistory selectedDishes={selectedDishes} />
            </div>
        </div>
    );
}

export default App;

