/*
Init app
interact with DOM
interact with localstorage

 */

$(document).ready(function(){
  
  var userArr = [];
  var now = new Date();
  var month = (now.getMonth() + 1);               
  var day = now.getDate();
  if (month < 10) 
      month = "0" + month;
  if (day < 10) 
      day = "0" + day;
  var today = now.getFullYear() + '-' + month + '-' + day;
$('.input-date').val(today);

var mapData = function(userArr) {
var returnArr = [];
var xArr = ['x'];
var weightArr = ['weight'];
var heightArr = ['height'];
var BMIArr = ['BMI'];
for (var i = 0; i < userArr.length; i++) {
  xArr.push(userArr[i]['date']);
  weightArr.push(userArr[i]['weight']);
  heightArr.push(userArr[i]['height']);
  var BMI = (703 * (userArr[i]['weight']) / ((userArr[i]['height']) * (userArr[i]['height'])))
  var BMIString = BMI.toFixed(2)
  BMIArr.push(parseFloat(BMIString));
}
returnArr.push(xArr);
returnArr.push(weightArr);
returnArr.push(BMIArr);
return returnArr;
}

var nestedArr = mapData(userArr)
var drawWeightChart = function(nestedArr, valueData) {
  localStorage.getItem(valueData)
  var weightChart = c3.generate({
    bindto: "#chart-weight",
      data: {
          x: 'x',
          columns: nestedArr,
          axes: {
            weight: 'y',
            BMI: 'y2'
          }, 
          types: {
            weight: 'line',
            BMI: 'bar'
          },
          colors: {
            BMI: '#63C1E8',
            weight: '#8B80F9'
          }
      },
      axis: {
          x: {
              type: 'timeseries',
              tick: {
                  format: '%m-%d'
              }
          },
          y: {
            min: valueData - 20,
            label: 'weight'
          },
          y2: {
            min: 16,
            show: true,
            label: 'BMI'
          }
      },
  }); 
}
    drawWeightChart(nestedArr);

var mapBMI = function(userArr) {
  var mappedBMIArr = [];
  var BMIArr2 = ['BMI'];
  var BMI = (703 * (userArr[userArr.length-1]['weight']) / ((userArr[userArr.length-1]['height']) * (userArr[userArr.length-1]['height'])))
  var BMIString = BMI.toFixed(2)
  BMIArr2.push(parseFloat(BMIString));
  mappedBMIArr.push(BMIArr2)
  return mappedBMIArr;
  }


var drawBMIChart = function(nestedBMI) {
var chartBMI = c3.generate({
  bindto: "#chart-BMI",
    data: {
        columns: nestedBMI,
        type: 'gauge',
    },
    gauge: {
       label: {
           format: function(value, ratio) {
               return value;
           },
           show: false
       },
      min: 10,
      max: 45,
    },
    color: {
        pattern: ['#FF0000', '#60B044', '#F6C600', '#F97600', '#FF0000'],
        threshold: {
           unit: 'value',
            values: [18.5, 25, 30, 40]
        }
    },
    size: {
        height: 180
    }
});
chartBMI.load({
  unload: true,
  columns: nestedBMI,
});
}

  $('.btn-add').on('click', function(e){
    var keyData = $('.input-user').val();
    var valueData = $('.input-value').val();
    var dateValue = $('.input-date').val();
    var heightData = $('#dropdown-height').val();
    var localStorageItem = localStorage.getItem(keyData);
    var weightObj = {
      'date': dateValue,
      'height': heightData,
      'weight': valueData
    };
    var nestedArr = [[]];
    userArr.push(weightObj);
    localStorage.setItem(keyData, JSON.stringify(userArr));
    nestedArr = mapData(userArr);
    var nestedBMI = mapBMI(userArr);
    drawBMIChart(nestedBMI);
    drawWeightChart(nestedArr, valueData);
    // read from db
    var BMI = (703 * (userArr[userArr.length-1]['weight']) / ((userArr[userArr.length-1]['height']) * (userArr[userArr.length-1]['height'])))
    var BMIString = BMI.toFixed(2)
    if (parseFloat(BMIString) < 18.5) {
      var BMICategory = 'underweight';
    } else if (parseFloat(BMIString) >= 18.5 && parseFloat(BMIString) < 24.9) {
      BMICategory = 'normal';
    } else if (parseFloat(BMIString) >= 24.9 && parseFloat(BMIString) < 29.9) {
      BMICategory = 'overweight';
    } else if (parseFloat(BMIString) >= 29.9) {
      BMICategory = 'obese';
    }
    var BMIDisplay = 'Your BMI is ' + parseFloat(BMIString) + ', which is considered ' + BMICategory + '.'
    $("#text-BMI-category").text(BMIDisplay);
});
  $('.btn-clear').click(function(){
    localStorage.clear();
    $('.container-data').text('');
    drawWeightChart(nestedArr);
    drawBMIChart(nestedArr);
    userArr = [];
  });

});