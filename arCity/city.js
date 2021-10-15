AFRAME.registerComponent("createmodels",{

    init : async function(){
        // getting the model for the respective barcode with the getModels func
        var models = await this.getModels();

        /*
        *Object.keys() method returns an array of a given object's own enumerable property names
        *creating a var called barcodes which will have the model from the models variable  
        */

        var barcodes = Object.keys(models);
        barcodes.map(barcode => {
        var model = models[barcode];
        this.createModel(model);
    });
    },

    // collect the data from cityStuff.json file
    getModels: function(){
        return fetch("cityStuff.json")
        .then(res => res.json())
        .then(data => data);
    },


    createModels : function(model){
        var barcodeValue = model.barcode_value;
        var modelUrl = model.model_url;
        var modelName = model.model_name;

        var scene = document.querySelector("a-scene");

        var marker = document.createElement("a-marker");

        //set marker attribute for id,typr(barcode),name,value and markerhandler
        marker.setAttribute("id",`#${modelName}`);
        marker.setAttribute("type","barcode");
        marker.setAttribute("model_name",modelName);
        marker.setAttribute("value",barcodeValue);
        marker.setAttribute("markerhandler",{});

        scene.appendChild(marker);

        /*
        if the barcode value is 0 aka the base,
        * create the base of the model 
        * otherwise show the gltf model of the respective barcode
        */
        if(barcodeValue === 0) {
            var modelEl = document.createElement("a-entity");
            modelEl.setAttribute("id", `${modelName}`);
            modelEl.setAttribute("geometry", {
              primitive: "box",
              width: model.width,
              height: model.height
            });
            modelEl.setAttribute("position", model.position);
            modelEl.setAttribute("rotation", model.rotation);
            modelEl.setAttribute("material", {
              color: model.color
            });
            marker.appendChild(modelEl);
          } else {
            var modelEl = document.createElement("a-entity");
            modelEl.setAttribute("id", `${modelName}`);
            modelEl.setAttribute("gltf-model", `url(${modelUrl})`);
            modelEl.setAttribute("scale", model.scale);
            modelEl.setAttribute("position", model.position);
            modelEl.setAttribute("rotation", model.rotation);
            marker.appendChild(modelEl);
          }
        
        }
        
})