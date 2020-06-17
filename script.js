//const apiKey =  f5180b7ff477a50462294daf91c91915;

$(document).ready(function(){ 

  function currentCondition(cityId) {
      let queryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityId + "&APPID=f5180b7ff477a50462294daf91c91915&units=imperial";
      
      $.getJSON(queryURL, function(data){
          updateDOM(data);
      });
  }

  function UVdata(lat, lon) {
      let uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=f5180b7ff477a50462294daf91c91915&lat=" + lat+ "&lon=" + lon;

      $.getJSON(uvURL, function(UV_data){
          updateUV(UV_data);
      });
  }

  function updateDOM(data) {
      let cityName = data.city.name;
      let iconCode = data.list[0].weather[0].icon;
      let iconURL = "https://openweathermap.org/img/w/" + iconCode + '.png';
      let temp = Math.round(data.list[0].main.temp);
      let timeNow = data.list[0].dt_txt.substring(0);
      let showHumid = data.list[0].main.humidity;
      let showWind = data.list[0].wind.speed;

      $('#city').text(cityName + " (" + timeNow + ')');
      $('#wIcon').attr('src', iconURL);
      $('#temp').text("Temperature : " + temp + String.fromCharCode(176) + " F");
      $('#humid').text('Humidity: ' + showHumid +  "%");
      $('#wind').text('Wind Speed: ' + showWind + 'MPH');
  }

  function updateUV(UV_data) {
      let showUV = UV_data.value;
      $('#UV').text("UV Index: " + showUV);
  }

  currentCondition(3451190);
  UVdata(-22.906847, -43.172897);

  function fiveDayForecast(cityId) {
      let dayForecastURL = "https://api.openweathermap.org/data/2.5/forecast?appid=f5180b7ff477a50462294daf91c91915&id=" + cityId + "&count=10&units=imperial";

      $.getJSON(dayForecastURL, function(fiveDaydata){
          updateForecast(fiveDaydata);
      });
  }

  function updateData(fiveDayData, i, count) {
      let day = fiveDayData.list[i].dt_txt.substring(0);
      let dayIcon = fiveDayData.list[i].weather[0].icon;
      let iconURL = "https://openweathermap.org/img/w/" + dayIcon + '.png';
      let temp = Math.round(fiveDayData.list[i].main.temp);
      let humid = fiveDayData.list[i].main.humidity;

      $('#day'+count).text(day);
      $('#wIcon'+count).attr('src', iconURL);
      $('#temp'+count).text("Temp : " + temp + String.fromCharCode(176) + " F");
      $('#humid'+count).text('Humidity:' + humid +  "%");
  }

  function updateForecast(fiveDaydata) {
      let size = fiveDaydata.list.length;
      let count = 1;
      let currDay = fiveDaydata.list[1].dt_txt.substring(0);

      for (let i = 0 ; i < (size) ; i++) {
          let day = fiveDaydata.list[i].dt_txt.substring(0);
          if (currDay != day) {
              updateData(fiveDaydata, i, count);
              currDay = day;
              count++;
          } 
      }
  }

  fiveDayForecast(3451190);

  function listSearch() {

   $('#searchButton').on('click', function(event) {
    event.preventDefault();
    let quest = $("#runSearch").val().trim(); 
    cityHistory(quest, null);
   })
  }

  function cityHistory(cityName, store) {
      let searchURL = "https://api.openweathermap.org/data/2.5/forecast?APPID=f5180b7ff477a50462294daf91c91915&units=imperial&q=" + cityName;
    
      $.getJSON(searchURL, function(searchData){
          let cityId = searchData.city.id;
          let latitude = searchData.city.coord.lat;
          let longitude = searchData.city.coord.lon;

          currentCondition(cityId);
          UVdata(latitude, longitude);
          fiveDayForecast(cityId);
          saveToStorage(cityName, cityId, store);
          showData();
          
          }); 
  }

  listSearch();
  showData();

   function saveToStorage(cityName, cityId, store) {
      let len = localStorage.length;
      if (len >= 4 && store === null){
         localStorage.removeItem(localStorage.key(1));
      }
      len = localStorage.length;
      if(len < 4) {
          if(localStorage.getItem(cityName) === null) {
              localStorage.setItem(cityName, cityId);
          }
      }  

  }

  function showData() {

      for(let i = 1; i < localStorage.length; i++) {
          
          $('#city' + i).text(localStorage.key(i));
          $('#city' + i).on('click', function(event){
              console.log("City clicked : "+ localStorage.key(i));
              cityHistory(localStorage.key(i), true);
          })
      }
  }
});