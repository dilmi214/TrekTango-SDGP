const axios = require('axios');
const apiKey = process.env.apiKey;

//Calculate distance between places return ordered list if the currentlocation is the starter point
const destinationOrderCurrLoc = async(req, res) => {
    try {
    
        const originLat = req.body.originLat; // Latitude of the origin place
        const originLng = req.body.originLng; // Longitude of the origin place
        var destinationPlaceIdList = req.body.destinationPlaceIdList; //List of Place IDs of destinations
        const numberOfDestinations = destinationPlaceIdList.length;
        var firstDestinationPlaceId = destinationPlaceIdList[0];
    
        for(let i = 1; i < numberOfDestinations; i++ ){
            let distanceOriginToFirstDestination = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=
                                                     ${originLat},${originLng}&destinations=place_id:${firstDestinationPlaceId}&key=${apiKey}`);
    
            let distanceOriginToOtherDestination = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=
                                                     ${originLat},${originLng}&destinations=place_id:${destinationPlaceIdList[i]}&key=${apiKey}`);
    
            if (distanceOriginToFirstDestination.data.rows[0].elements[0].distance.value > distanceOriginToOtherDestination.data.rows[0].elements[0].distance.value){
              firstDestinationPlaceId = destinationPlaceIdList[i];
            }
            
        }
        
      
        destinationPlaceIdList.splice((destinationPlaceIdList.indexOf(firstDestinationPlaceId)),1);
    
        
        
        for(let j = 0; j < destinationPlaceIdList.length; j++){
          for(let k = 1; k < destinationPlaceIdList.length; k++){
            let distanceFirstToDestination1 = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=place_id:${firstDestinationPlaceId}&destinations=place_id:${destinationPlaceIdList[j]}&key=${apiKey}`);
            
            let distanceFirstToDestination2 = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=place_id:${firstDestinationPlaceId}&destinations=place_id:${destinationPlaceIdList[k]}&key=${apiKey}`);  
                                                        
            if (distanceFirstToDestination1.data.rows[0].elements[0].distance.value > distanceFirstToDestination2.data.rows[0].elements[0].distance.value){
              let temp = destinationPlaceIdList[j];
              destinationPlaceIdList[j] = destinationPlaceIdList[k];
              destinationPlaceIdList[k] = temp;
            }
            
          }
                
        }
        destinationPlaceIdList.unshift(firstDestinationPlaceId);
        console.log("The places are ordered");
        res.json(destinationPlaceIdList);
        
    
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
      }
}

//Calculate distance between places return ordered list if a place from the list is the starter point
const destinationOrderListPlace = async(req, res) => {
    try {
    
        var destinationPlaceIdList = req.body.destinationPlaceIdList; //List of Place IDs of destinations
        const numberOfDestinations = destinationPlaceIdList.length;
        var firstDestinationPlaceId = destinationPlaceIdList[0];
    
      
      
        for(let j = 1; j < destinationPlaceIdList.length; j++){
          for(let k = 2; k < destinationPlaceIdList.length; k++){
            let distanceFirstToDestination1 = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=place_id:${firstDestinationPlaceId}&destinations=place_id:${destinationPlaceIdList[j]}&key=${apiKey}`);
            
            let distanceFirstToDestination2 = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=place_id:${firstDestinationPlaceId}&destinations=place_id:${destinationPlaceIdList[k]}&key=${apiKey}`);  
                                                        
            if (distanceFirstToDestination1.data.rows[0].elements[0].distance.value > distanceFirstToDestination2.data.rows[0].elements[0].distance.value){
              let temp = destinationPlaceIdList[j];
              destinationPlaceIdList[j] = destinationPlaceIdList[k];
              destinationPlaceIdList[k] = temp;
            }
            
          }
                
        }
        console.log("The places are ordered");
        res.json(destinationPlaceIdList);
        
    
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
      }
}

module.exports = {destinationOrderCurrLoc, destinationOrderListPlace};