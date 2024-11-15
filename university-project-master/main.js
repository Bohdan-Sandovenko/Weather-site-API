const input = document.querySelector('input');
const button = document.querySelector('button');
const errorMsg = document.querySelector('p.error');
const cityName = document.querySelector('h2.city_name');
const weatherImg = document.querySelector('img.weather_img');
const temp = document.querySelector('p.temp');
const description = document.querySelector('p.description');
const feelslike = document.querySelector('span.feels_like');
const pressure = document.querySelector('span.pressure');
const humidity = document.querySelector('span.humidity');
const windSpeed = document.querySelector('span.wind_speed');
const clouds = document.querySelector('span.clouds');
const visibility = document.querySelector('span.visibility');
const pollutionImg = document.querySelector('img.v');//img.pollution_img
const pm25 = document.querySelector('p.pollution_value');



const apiLink = 'https://api.openweathermap.org/data/2.5/weather?q=';
const apiKey = '&appid=3cd37e12532d1bf885b98ec813ebd71e';
const apiUnits = '&units=metric';
const apiLang = '&lang=pl';



function getWeatherInfo() {//Функция выполняюшая запрос к API
    const apiCity = input.value;//Данные из поискового поля
    if (!apiCity) { // Проверяем, пустое ли поле ввода
        errorMsg.textContent = "Пожалуйста, введите название города."; // Выводим сообщение об ошибке
        return; // Завершаем выполнение функции
    }//
    const apiURL = `${apiLink}${apiCity}${apiKey}${apiUnits}${apiLang}`;//формулируем полный URL для запроса
    //console.log(apiURL);
    axios.get(apiURL).then((response) => {//выодит URL на основе запроса
        console.log(response.data);
        errorMsg.textContent = '';

        cityName.textContent = `${response.data.name}, ${response.data.sys.country}`;
        weatherImg.src = `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`;
        temp.textContent = `${Math.floor(response.data.main.temp)}`;
        description.textContent = `${response.data.main.description}`;
        description.classList.add('description');
        feelslike.textContent = `${Math.floor(response.data.main.feels_like)} `;
        pressure.textContent = `${response.data.main.pressure}`;
        humidity.textContent = `${response.data.main.humidity} `;
        windSpeed.textContent = `${Math.floor(response.data.wind.speed * 3,6)}`;
        clouds.textContent = `${response.data.clouds.all}%`;
        visibility.textContent = `${response.data.visibility / 1000}`;
        errorMsg.textContent = '';

        //air pollution api 
        const airPollutionApi = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}${apiKey}`;//запрос для загрезнеия воздуха
        axios.get(airPollutionApi).then((res) => {
            console.log(res.data.list);
            pm25.textContent = `${res.data.list[0].components.pm2_5}`;
            const pm25Value = res.data.list[0].components.pm2_5;
            if (pm25Value < 10) {
                pollutionImg.style.backgroundColor = 'green';
            }
            else if (pm25Value >= 10 && pm25Value < 25) {
                pollutionImg.style.backgroundColor = 'yellowgreen';
            }
            else if (pm25Value >= 20 && pm25Value < 50) {
                pollutionImg.style.backgroundColor = 'yellow';
            }
            else if (pm25Value >= 50 && pm25Value < 75) {
                pollutionImg.style.backgroundColor = 'orange';
            }
            else {
                pollutionImg.style.backgroundColor = "red";
            }
            
        }) 
    }).catch((error) => {// обрабатывает ошибки, если запрос не удачен
        console.log(error.response);

        errorMsg.textContent = `${error.response.data.message}`;
        [cityName, temp, description, feelslike, pressure, humidity, windSpeed, clouds, visibility].forEach((element) => {
            element.textContent = '';
        })
        weatherImg.src = '';
        description.classList.remove('description_color');
    }).finally(() => {//зброс ввода
        input.value = '';
    })
}

const getWeatherInfoByEnter = (e) => {//Позволяет делать запрос по клавише Enter
    if (e.key === 'Enter') {
        getWeatherInfo();
    }
}
input.addEventListener('keydown', getWeatherInfoByEnter);
button.addEventListener('click', getWeatherInfo);