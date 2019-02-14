/*
Init app
interact with DOM
interact with localstorage

 */

$(document).ready(function(){
  // this is where we jquery
  //var keyData = 'ourKey'; // going to need to make this dynamic?
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
// //instantiate chart
var drawWeightChart = function(nestedArr, valueData) {
  localStorage.getItem(valueData)
  var weightChart = c3.generate({
    bindto: "#chart-weight",
      data: {
          x: 'x',
         // xFormat: '%m%d&Y', // 'xFormat' can be used as custom format of 'x'
          columns: nestedArr,
  //         [
  //             ['x', dateArr[clickCount]], // dates, need to dynamically pull in from inputs],
  // //            ['x', '20130101', '20130102', '20130103', '20130104', '20130105', '20130106'],
  //             ['weight', weightArr[clickCount]] // pull weight in from input and storage array],
  //             // ['BMI'] // calculated from weight and height, optional]
  //         ]
          axes: {
            weight: 'y',
            BMI: 'y2'
          }, 
          types: {
            weight: 'line',
            BMI: 'bar'
          },
      },
      axis: {
          x: {
              type: 'timeseries',
              tick: {
                  format: '%m-%d'
              }
          },
          y: {
            min: valueData - 30,
            label: 'weight'
          },
          y2: {
            min: 15,
            show: true,
            label: 'BMI'
          }
      }
  }); 
}
    drawWeightChart(nestedArr);

var mapBMI = function(userArr) {
  var mappedBMIArr = [];
  var BMIArr2 = ['BMI'];
  for (var i = 0; i < userArr.length; i++) {
  var BMI = (703 * (userArr[i]['weight']) / ((userArr[i]['height']) * (userArr[i]['height'])))
  var BMIString = BMI.toFixed(2)
  BMIArr2.push(parseFloat(BMIString));
}
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
           show: false // to turn off the min/max labels.
       },
      min: 10, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
      max: 45, // 100 is default
//    units: ' %',
//    width: 39 // for adjusting arc thickness
    },
    color: {
        pattern: ['#FF0000', '#60B044', '#F6C600', '#F97600', '#FF0000'],
        threshold: {
           unit: 'value', // percentage is default
//            max: 200, // 100 is default
            values: [18.5, 25, 30, 40]
        }
    },
    size: {
        height: 180
    }
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
    userArr.push(weightObj);
    localStorage.setItem(keyData, JSON.stringify(userArr));
    var nestedArr = mapData(userArr);
    var nestedBMI = mapBMI(userArr);
    drawBMIChart(nestedBMI, valueData, heightData);
    drawWeightChart(nestedArr, valueData);
    // read from db
    // var displayText = keyData + ' | ' + localStorage.getItem(keyData);
    // this only displays the last one? might want to switch to html
    // and append a div
    // <div class="display-data-item" data-keyValue="keyData">valueData</div>
    // if you use backticks ` you can use ${templateLiterals}
    // TODO make this vars make sense across the app
    // $('.container-data').html('<div class="display-data-item" data-keyValue="'+ keyData +'">'+valueData+'</div>');
    // $('.input-key').val('');
    // $('.input-value').val('');
  });


  // update db
    // need to expand when  more than 1 item is added

  // delete item
  $('.container-data').on('click', '.display-data-item', function(e){
    console.log(e.currentTarget.dataset.keyvalue);
    var keyData = e.currentTarget.dataset.keyvalue;
    localStorage.removeItem(keyData);
    $('.container-data').text('');
  });
  // delete all?
  $('.btn-clear').click(function(){
    localStorage.clear();
    $('.container-data').text('');
    drawWeightChart(nestedArr);
    drawBMIChart(nestedArr);
    userArr = [];
  });

});