var list = [];
var modelVar = null;

AFRAME.registerComponent("handlemarker",{
    init : async function() {
        /**
         When the marker is visible to the camera : 
         * Get the model name and the barcode value of the elements from the cityStuff.json file
         * push these values to the empty array called list which won't be empty after this
         * set the model visibility to true cause you would want people to see the models only after the camera spots the marker
        **/
        this.el.addEventListener('markerFound',()=>{
            var model = this.el.getAttribute("model_name");
            var barcodeVal = this.el.getAttribute("barcode_value");

            list.push({
                model : model,
                barcode : barcodeVal,
            });

            this.el.setAttribute("visible",true);

        });

        /*
         When the marker is NOT visible to the camera aka marker is lost:
         * getting the attribute of the modelname
         * creating a var called index(just because) to find the model from the list array whose marker has been lost
         * find the index of the marker and remove it aka splice
        */

         this.el.addEventListener('markerLost',()=>{
            var model = this.el.getAttribute("model_name");
            var index = list.findIndex(x => x.model_name === model);

            if (index > -1) {
                list.splice(index, 1);
            }
         });
    },
    /*******************************************************
          to get the distance between the markers
    *******************************************************/
   getDistance: function(elA, elB) {
      return elA.object3D.position.distanceTo(elB.object3D.position);
   },

   //finds out whether or not the model is present in the array
   isModelPresentInArray: function(arr,val) {
       for (var i of arr) {
           if (i.model_name === val){
               return true;
           }
           else{return false;}
       }
   },

   /*
   A tick function: 
   * o

   */
   tick: async function() {

   if (list.length > 1) {
    var isBaseModelPresent = this.isModelPresentInArray(modelList, "base");
    var messageText = document.querySelector("#message-text");

    if (!isBaseModelPresent) {
      messageText.setAttribute("visible", true);
    } else {
      if (modelVar === null) {
        modelVar = await this.getModels();
      }

      messageText.setAttribute("visible", false);
      this.placeTheModel("esb", modelVar);
      this.placeTheModel("burjKhalifa", modelVar);
      this.placeTheModel("bus", modelVar);
      this.placeTheModel("car", modelVar);
      this.placeTheModel("building", modelVar);
    }
  }
},

   getModels: function() {
    // fetching the data from the cityStuff.json file
    return fetch("cityStuff.json")
      .then(res => res.json())
      .then(data => data);
  },
  /*
  this function will find out the position,rotation,scale(size), and the proper model of the marker which will be scanned
  */
   getModelGeometry: function(model, modelVar) {
    var barcodes = Object.keys(modelVar);
    for (var barcode of barcodes) {
      if (modelVar[barcode].model_name === model) {
        return {
          position: modelVar[barcode]["placement_position"],
          rotation: modelVar[barcode]["placement_rotation"],
          scale: modelVar[barcode]["placement_scale"],
          model_url: modelVar[barcode]["model_url"]
        };
      }
    }
  },

   modelPlacement : function(model){

    var containsModel = this.isModelPresentInArray(model,list);

    /* if the model is IN the array, 
        * create two markers - one for the base and one for the model
        * find the distance between the two markers
        * if the dist is less than 1.25, the model will not be visible
    */

    if(containsModel){
        var dist = null;
        var marker1 = document.querySelector(`#marker-base`);
        var marker2 = document.querySelector(`#marker-${model}`);

        dist = getDistance(marker1, marker2);

        if (dist < 1.25) {
            // Changing Model Visibility
            var modelEl = document.querySelector(`#${model}`);
            modelEl.setAttribute("visible", false);

            var modelPlaced = document.createElement(`#${model}`);
            if (modelPlaced === null) {
                var el = document.createElement("a-entity");
                var modelGeometry = this.getModelGeometry(model,modelVar);

                el.setAttribute("id", `model-${model}`);
                el.setAttribute("gltf-model", `url(${modelGeometry.model_url})`);
                el.setAttribute("position", modelGeometry.position);
                el.setAttribute("rotation", modelGeometry.rotation);
                el.setAttribute("scale", modelGeometry.scale);

                marker1.appendChild(el);
            }
        }
    }
}




})