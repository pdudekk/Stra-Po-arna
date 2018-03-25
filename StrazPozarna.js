
//Dodanie bibliotegi vis.js

var script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

//Dodanie pliku css do biblioteki vis.js

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = 'https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min.css';
document.getElementsByTagName('head')[0].appendChild(style);

var input = document.createElement("INPUT");
   input.setAttribute("type", "file");
   input.setAttribute("id", "selectFile");
   document.body.appendChild(input);


function drawLegend(over_time, havent_firedep)
{
  var nodes_arr = [
    {id: 1, label: 'Miasto z jednostką straży', color: 'blue' },
    {id: 2, label: 'Miasto bez jednostki staży', color: havent_firedep},
    {id: 3, label: "A"},
    {id: 4, label: "B"},
    {id: 5, label: "C"},
    {id: 6, label: "D"}
  ];

  var edges_arr = [
    {from: 3, to: 4, label: 'Droga '},
    {from: 5, to: 6}
  ];
}

function onFire2(object, road, city, max_road){

  var city_name;
  var have_fire;
  var shortest_way = Number.MAX_SAFE_INTEGER;
    if(!city.ma_jednostke){
    loop1:
      for(var i=0 ; i < object.drogi.length ; i++){
      loop2:
        for(var j=0 ; j < object.drogi[i].miasta.length ; j++){
          if(city.nazwa == object.drogi[i].miasta[j]){
            for(var z=0 ; z < object.miasta.length ; z++){
              if(object.drogi[i].miasta[(j+1)%2] == object.miasta[z].nazwa){
                have_fire = object.miasta[z].ma_jednostke;
              }
            }
            if((object.drogi[i].czas_przejazdu <= max_road) && (have_fire == true)){
              city_name = object.drogi[i].miasta[(j+1)%2];
              shortest_way = object.drogi[i].czas_przejazdu;
              break loop1;
            }
          else if((object.drogi[i].czas_przejazdu < shortest_way)){
              city_name = object.drogi[i].miasta[(j+1)%2];
              shortest_way = object.drogi[i].czas_przejazdu;
            }
          }
        }
    }
        for(var i=0 ; i < object.miasta.length ; i++){

          if(city_name == object.miasta[i].nazwa){
            if(object.miasta[i].ma_jednostke && ((shortest_way + road) <= max_road)){
              return true;
            }
            else if(object.miasta[i].ma_jednostke && ((shortest_way + road) > max_road)){
              return false;
            }
            else if(!(object.miasta[i].ma_jednostke) && ((shortest_way + road) <= max_road)){
              return onFire2(object, shortest_way+road, object.miasta[i], max_road);
            }
            else if(!(object.miasta[i].ma_jednostke) && ((shortest_way + road) > max_road)){
              return false;
            }
          }
        }

    }
    else{
      return true;
    }

}


  (function(){

      function onChange(event) {
          var reader = new FileReader();
          reader.onload = onReaderLoad;
          reader.readAsText(event.target.files[0]);
      }

      function onReaderLoad(event){

          var obj = JSON.parse(event.target.result);
          showData(obj);
      }

      function showData(object){

        var nodes_arr = [];
        var edges_arr = [];
        var over_time = 'red';
        var have_firedep = ['box', 'green'];

        var nodes = new vis.DataSet(nodes_arr);
        var edges = new vis.DataSet(edges_arr);

        for(var i=0 ; i < object.miasta.length ; i++)
        {
          console.log(onFire2(object, 0, object.miasta[i], object.max_czas_przejazdu));

            var color = 'blue';

            if(!(onFire2(object, 0, object.miasta[i], object.max_czas_przejazdu))) {
              color = over_time;
            }

            if((object.miasta[i].ma_jednostke)){
              have_firedep[0] = 'ellipse';
              have_firedep[1] = 'green';
            }else if(!(object.miasta[i].ma_jednostke)){
               have_firedep[0] = 'box';
               have_firedep[1] = 'blue';
             }


             nodes.add({
               id: object.miasta[i].nazwa,
               label:  object.miasta[i].nazwa,
               color: have_firedep[1],
               value: 4,
               font: {size: 18, color: 'white', face: 'arial'},
               shape: have_firedep[0]

             });

        }

        for(var i=0 ; i < object.drogi.length ; i++)
        {
          var color = '#207EE9';

          edges.add({
            from:  object.drogi[i].miasta[0] ,
            to:  object.drogi[i].miasta[1],
            label: JSON.stringify(object.drogi[i].czas_przejazdu),
            value: 4,
            color: {color: color},
            font: {align: 'top', size:18, color: color, face: 'arial'},

          });

        }



        var mynetwork = document.createElement('div');
        mynetwork.id     = "container";
        mynetwork.style.width = "600px";
        mynetwork.style.height = "400px";
        mynetwork.style.border = "1px";
        document.body.appendChild(mynetwork);



        var container = document.getElementById("container");

        var data = {
          nodes: nodes,
          edges: edges
        };

        var options = {
          borderWidth: 2,
          shadow:true
        };

        var network = new vis.Network(container, data, options);

        var legend = document.createElement('div');
        legend.id = "legend";
        legend.style.width = "600px";
        legend.style.height = "200px";
        document.body.appendChild(legend);



      }



      document.getElementById('selectFile').addEventListener('change', onChange);

  }());
