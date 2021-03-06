//container object map for searching and sorting
var cardmap =new Map();
var displaymap =new Map();

// fetching data from api
async function fetch(){

    await $.get("https://swapi.dev/api/people/", function(data, status){
    
        data.results.forEach(element => {
            var p = new person(element.name,element.birth_year,element.gender,element.species,element.homeworld,element.vehicles,element.starships); 
            cardmap.set(element.name.toLowerCase().trim(),p);
        });
    });

    //getting secondary json urls
     await cardmap.forEach(function(value, key) {

        
        axios.get(value.species)
            .then(function (data) {

                    var species = data.data.name;
                    value.species = data.data.name;

         
                   if(species==undefined){
                        species="unavailable";
                        value.species = "unavailable";
    
                    }
    
                
               
                
            
                axios.get(value.homeworld)
                     .then(function (datah) {

                        var homeworld = datah.data.name;
                        value.homeworld = datah.data.name;

                        //populating card grid
                        populate(value, species, homeworld);

                  })

                  //temp arrays for vehicle and starships
                  var st_ships =[];
                  var vehicle_temp =[];

                //get starships   
                 value.starships.forEach(element => {
                      

                    axios.get(element)
                     .then(function (starships) {

                       st_ships.push(starships.data.name); 

                  })

                });

                // get vechiles
                  value.vehicles.forEach(element => {
                      

                    axios.get(element)
                     .then(function (vehicles) {

                       vehicle_temp.push(vehicles.data.name); 

                  })

                });



                //Adding to person object and adding to map
                  value.starships = st_ships;
                  value.vehicles = vehicle_temp;

                    
                  
                
    
            })
                .catch(function (error) {
                  //error exception
                console.log(error);
                })
               
                .then(function () { 
                    
                    displaymap = cardmap;
                });
    
         })



}


// starting the fetch
$(document).ready(function(){
 fetch();

//  search enter button listner
 $('#search').keypress(function (e) {
    var key = e.which;

    if(key == 13) {
        if(this.value.toLowerCase().trim()==""){
            fetch();
        }
        search(this.value.toLowerCase());
    }

     
   });  

   

  });


  //creating a card
  function populate(value, species, homeworld){
        

    $(".card-grid").append(`<div class="card" id="${value.name}" onclick="selectCard(this.id)">
    <div class="card-head">
        <i><svg class="white-card" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12V9.5C10 9.10218 9.84196 8.72064 9.56066 8.43934C9.27936 8.15804 8.89782 8 8.5 8V8C8.10218 8 7.72064 8.15804 7.43934 8.43934C7.15804 8.72064 7 9.10218 7 9.5V13C7.05225 13.501 7.21362 13.9844 7.47277 14.4163C7.73192 14.8483 8.08255 15.2181 8.5 15.5H12L13.348 11.008C13.4473 10.6749 13.4587 10.3218 13.381 9.983L12.181 4.774C12.0663 4.27665 11.7658 3.84198 11.341 3.559L10.5 3" stroke="#ffff" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10.5 6.5V0.5H2.5V11.5H4.5" stroke="#ffff" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </i> 
        <br>
        <p class="card-name">${value.name}
        </p>
    </div>
    <div class="card-body">
        <div class="row card-row-1" style="padding-left:16px; padding-right:16px;"> 
            <div class="col gender" style="padding-left:0px;">
                <p class="card-text-1">  <i> <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.125 1.125H10.875V4.875" stroke="#3B3B3B" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10.875 1.125L6.88647 5.1135" stroke="#3B3B3B" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M4.5 10.875C6.36396 10.875 7.875 9.36396 7.875 7.5C7.875 5.63604 6.36396 4.125 4.5 4.125C2.63604 4.125 1.125 5.63604 1.125 7.5C1.125 9.36396 2.63604 10.875 4.5 10.875Z" stroke="#3B3B3B" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </i>19BBY</p>
              </div>
              <div class="col species" style="padding-right:0px;">
                <p class="card-text-1">${species}</p>
              </div>
              <div class="card-divider"></div>
        </div>

        <div class="card-row-2 home"> 
            <div class="card-col-2-lg info-label"> <p class="card-text-1" style="font-weight: 500;font-size: 10px;line-height: 10px;text-transform: uppercase; color: #757575;"><i><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 14.5C10.8137 14.5 13.5 11.8137 13.5 8.5C13.5 5.18629 10.8137 2.5 7.5 2.5C4.18629 2.5 1.5 5.18629 1.5 8.5C1.5 11.8137 4.18629 14.5 7.5 14.5Z" stroke="#444444" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15.0641 12C15.5611 13.343 15.5771 14.423 15.0001 15C13.6191 16.381 9.36612 14.366 5.50012 10.5C1.63412 6.634 -0.380884 2.381 1.00012 1C1.57712 0.423 2.65712 0.439 4.00012 0.936" stroke="#444444" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                </svg></i> Homeworld</p> </div>
            <div class="card-col-2 info-text"> <p class="card-text-1">${homeworld}</p></div>
        </div>

        <div class="card-row-2 vehicle"> 

            <div class="card-col-2-lg info-label"> <p class="card-text-1" style="font-weight: 500;font-size: 10px;line-height: 10px;text-transform: uppercase; color: #757575;"><i><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12.5H3.5V9C3.5 6.515 5.515 4.5 8 4.5C10.485 4.5 12.5 6.515 12.5 9V12.5H11" stroke="#444444" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3.5 2.5H6" stroke="#444444" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12.5 2.5H10" stroke="#444444" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5 12.5C5 11.672 5.672 11 6.5 11L9.5 11C10.328 11 11 11.672 11 12.5C11 13.328 10.328 14 9.5 14L6.5 14C5.672 14 5 13.328 5 12.5Z" stroke="#444444" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 4.5C9.10457 4.5 10 3.60457 10 2.5C10 1.39543 9.10457 0.5 8 0.5C6.89543 0.5 6 1.39543 6 2.5C6 3.60457 6.89543 4.5 8 4.5Z" stroke="#444444" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                </svg></i> Vehicles</p> </div>
            <div class="card-col-2 info-text"> <p class="card-text-1">${value.vehicles.length}</p></div>
        
        </div>

        <div class="card-row-2 star">
            
            <div class="card-col-2-lg info-label"> <p class="card-text-1" style="font-weight: 500;font-size: 10px;line-height: 10px;text-transform: uppercase; color: #757575;"><i> <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.084 1.841L14.143 5.9" stroke="#444444" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8.49188 2.72399C6.49788 1.86499 4.09688 2.24999 2.46788 3.87899C2.13388 4.21299 1.85888 4.58199 1.62988 4.96999L3.96988 7.30999" stroke="#444444" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.2659 7.47301C14.1459 9.47401 13.7609 11.893 12.1219 13.532C11.7879 13.866 11.4189 14.141 11.0299 14.371L8.67993 12.021" stroke="#444444" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.81193 13.049L2.95093 9.188C2.95093 9.188 6.24893 0.983 15.4999 0.5C14.9769 9.711 6.81193 13.049 6.81193 13.049Z" stroke="#444444" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <mask id="path-5-inside-1" fill="white">
                <path d="M3.914 14.914C3.133 15.695 0 16 0 16C0 16 0.305 12.867 1.086 12.086C1.867 11.305 3.133 11.305 3.914 12.086C4.695 12.867 4.695 14.133 3.914 14.914Z"/>
                </mask>
                <path d="M0 16L-0.995295 15.9031L-1.11309 17.1131L0.0968929 16.9953L0 16ZM3.20689 14.2069C3.20832 14.2055 3.17139 14.2401 3.06168 14.2969C2.95775 14.3508 2.81977 14.4085 2.6485 14.4673C2.3048 14.5852 1.88877 14.6862 1.47047 14.7688C1.05634 14.8505 0.661899 14.9099 0.369547 14.9489C0.223984 14.9683 0.105194 14.9825 0.0237216 14.9917C-0.0169829 14.9963 -0.0482793 14.9997 -0.0688432 15.0018C-0.0791225 15.0029 -0.0867112 15.0037 -0.0914436 15.0042C-0.0938095 15.0044 -0.0954605 15.0046 -0.0963759 15.0046C-0.0968336 15.0047 -0.0971072 15.0047 -0.0971943 15.0047C-0.0972378 15.0047 -0.0972347 15.0047 -0.0971845 15.0047C-0.0971596 15.0047 -0.0970865 15.0047 -0.0970741 15.0047C-0.0969894 15.0047 -0.0968929 15.0047 0 16C0.0968929 16.9953 0.0970133 16.9953 0.0971457 16.9953C0.0972058 16.9953 0.0973505 16.9952 0.0974707 16.9952C0.0977114 16.9952 0.0980001 16.9952 0.0983364 16.9951C0.099009 16.9951 0.0998722 16.995 0.100923 16.9949C0.103026 16.9947 0.10588 16.9944 0.109466 16.994C0.116637 16.9933 0.126736 16.9923 0.139595 16.9909C0.165306 16.9882 0.202082 16.9843 0.248571 16.979C0.341486 16.9685 0.473563 16.9527 0.633921 16.9314C0.953413 16.8888 1.39103 16.8231 1.85778 16.7309C2.32036 16.6396 2.83402 16.518 3.29741 16.3591C3.72365 16.2129 4.25418 15.988 4.62111 15.6211L3.20689 14.2069ZM0 16C0.995295 16.0969 0.995285 16.097 0.995277 16.0971C0.995276 16.0971 0.995269 16.0972 0.995266 16.0972C0.995261 16.0972 0.995261 16.0972 0.995265 16.0972C0.995274 16.0971 0.995301 16.0968 0.995346 16.0964C0.995437 16.0955 0.995602 16.0938 0.99584 16.0914C0.996318 16.0867 0.997093 16.0791 0.99817 16.0688C1.00033 16.0483 1.00369 16.017 1.00829 15.9763C1.01751 15.8948 1.03167 15.776 1.05108 15.6304C1.09007 15.3381 1.14945 14.9437 1.2312 14.5295C1.31376 14.1112 1.41483 13.6952 1.53273 13.3515C1.59148 13.1802 1.64924 13.0422 1.70307 12.9383C1.75989 12.8286 1.79453 12.7917 1.79311 12.7931L0.378893 11.3789C0.0119639 11.7458 -0.212866 12.2763 -0.359073 12.7026C-0.518022 13.166 -0.639637 13.6796 -0.730945 14.1422C-0.823076 14.609 -0.888759 15.0466 -0.931365 15.3661C-0.95275 15.5264 -0.968517 15.6585 -0.979029 15.7514C-0.984289 15.7979 -0.988244 15.8347 -0.990938 15.8604C-0.992286 15.8733 -0.993319 15.8834 -0.994043 15.8905C-0.994405 15.8941 -0.99469 15.897 -0.994898 15.8991C-0.995002 15.9001 -0.995088 15.901 -0.995154 15.9017C-0.995187 15.902 -0.995215 15.9023 -0.995238 15.9025C-0.99525 15.9026 -0.995264 15.9028 -0.99527 15.9028C-0.995283 15.903 -0.995295 15.9031 0 16ZM1.79311 12.7931C2.18358 12.4026 2.81642 12.4026 3.20689 12.7931L4.62111 11.3789C3.44958 10.2074 1.55042 10.2074 0.378893 11.3789L1.79311 12.7931ZM3.20689 12.7931C3.59737 13.1836 3.59737 13.8164 3.20689 14.2069L4.62111 15.6211C5.79263 14.4496 5.79263 12.5504 4.62111 11.3789L3.20689 12.7931Z" fill="#3B3B3B" mask="url(#path-5-inside-1)"/>
                <path d="M9 8C9.55228 8 10 7.55228 10 7C10 6.44772 9.55228 6 9 6C8.44772 6 8 6.44772 8 7C8 7.55228 8.44772 8 9 8Z" fill="#444444"/>
                </svg></i> Starships</p> </div>
            <div class="card-col-2 info-text"> <p class="card-text-1">${value.starships.length}</p></div>
        
        </div>

    </div>
</div>
`);
  }


  function createSelectedCard(value, species, homeworld){
        

   var card =`<div class="card-1">
    <div class="card-head">
        <i><svg class="white-card" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12V9.5C10 9.10218 9.84196 8.72064 9.56066 8.43934C9.27936 8.15804 8.89782 8 8.5 8V8C8.10218 8 7.72064 8.15804 7.43934 8.43934C7.15804 8.72064 7 9.10218 7 9.5V13C7.05225 13.501 7.21362 13.9844 7.47277 14.4163C7.73192 14.8483 8.08255 15.2181 8.5 15.5H12L13.348 11.008C13.4473 10.6749 13.4587 10.3218 13.381 9.983L12.181 4.774C12.0663 4.27665 11.7658 3.84198 11.341 3.559L10.5 3" stroke="#ffff" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10.5 6.5V0.5H2.5V11.5H4.5" stroke="#ffff" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </i> 
        <br>
        <p class="card-name">${value.name}
        </p>
    </div>
    <div class="card-body">
        <div class="row card-row-1" style="padding-left:16px; padding-right:16px;"> 
            <div class="col gender" style="padding-left:0px;">
                <p class="card-text-1">  <i> <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.125 1.125H10.875V4.875" stroke="#3B3B3B" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10.875 1.125L6.88647 5.1135" stroke="#3B3B3B" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M4.5 10.875C6.36396 10.875 7.875 9.36396 7.875 7.5C7.875 5.63604 6.36396 4.125 4.5 4.125C2.63604 4.125 1.125 5.63604 1.125 7.5C1.125 9.36396 2.63604 10.875 4.5 10.875Z" stroke="#3B3B3B" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </i>19BBY</p>
              </div>
              <div class="col species" style="padding-right:0px;">
                <p class="card-text-1">${species}</p>
              </div>
              <div class="card-divider"></div>
        </div>

        <div class="card-row-2 home"> 
            <div class="card-col-2-lg info-label"> <p class="card-text-1" style="font-weight: 500;font-size: 10px;line-height: 10px;text-transform: uppercase; color: #757575;"><i><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 14.5C10.8137 14.5 13.5 11.8137 13.5 8.5C13.5 5.18629 10.8137 2.5 7.5 2.5C4.18629 2.5 1.5 5.18629 1.5 8.5C1.5 11.8137 4.18629 14.5 7.5 14.5Z" stroke="#444444" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15.0641 12C15.5611 13.343 15.5771 14.423 15.0001 15C13.6191 16.381 9.36612 14.366 5.50012 10.5C1.63412 6.634 -0.380884 2.381 1.00012 1C1.57712 0.423 2.65712 0.439 4.00012 0.936" stroke="#444444" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                </svg></i> Homeworld</p> </div>
            <div class="card-col-2 info-text"> <p class="card-text-1">${homeworld}</p></div>
        </div>
`;


    value.vehicles.forEach(element => {
        
        card += `<div class="card-row-2 vehicle"> 

        <div class="card-col-2-lg info-label"> <p class="card-text-1" style="font-weight: 500;font-size: 10px;line-height: 10px;text-transform: uppercase; color: #757575;"><i><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12.5H3.5V9C3.5 6.515 5.515 4.5 8 4.5C10.485 4.5 12.5 6.515 12.5 9V12.5H11" stroke="#444444" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3.5 2.5H6" stroke="#444444" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12.5 2.5H10" stroke="#444444" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5 12.5C5 11.672 5.672 11 6.5 11L9.5 11C10.328 11 11 11.672 11 12.5C11 13.328 10.328 14 9.5 14L6.5 14C5.672 14 5 13.328 5 12.5Z" stroke="#444444" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 4.5C9.10457 4.5 10 3.60457 10 2.5C10 1.39543 9.10457 0.5 8 0.5C6.89543 0.5 6 1.39543 6 2.5C6 3.60457 6.89543 4.5 8 4.5Z" stroke="#444444" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg></i> Vehicles</p> </div>
        <div class="card-col-2 info-text"> <p class="card-text-1">${element}</p></div>
    
    </div>`; });

    value.starships.forEach(element => {

       card+= ` <div class="card-row-2 star">
            
            <div class="card-col-2-lg info-label"> <p class="card-text-1" style="font-weight: 500;font-size: 10px;line-height: 10px;text-transform: uppercase; color: #757575;"><i> <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.084 1.841L14.143 5.9" stroke="#444444" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8.49188 2.72399C6.49788 1.86499 4.09688 2.24999 2.46788 3.87899C2.13388 4.21299 1.85888 4.58199 1.62988 4.96999L3.96988 7.30999" stroke="#444444" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.2659 7.47301C14.1459 9.47401 13.7609 11.893 12.1219 13.532C11.7879 13.866 11.4189 14.141 11.0299 14.371L8.67993 12.021" stroke="#444444" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.81193 13.049L2.95093 9.188C2.95093 9.188 6.24893 0.983 15.4999 0.5C14.9769 9.711 6.81193 13.049 6.81193 13.049Z" stroke="#444444" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <mask id="path-5-inside-1" fill="white">
                <path d="M3.914 14.914C3.133 15.695 0 16 0 16C0 16 0.305 12.867 1.086 12.086C1.867 11.305 3.133 11.305 3.914 12.086C4.695 12.867 4.695 14.133 3.914 14.914Z"/>
                </mask>
                <path d="M0 16L-0.995295 15.9031L-1.11309 17.1131L0.0968929 16.9953L0 16ZM3.20689 14.2069C3.20832 14.2055 3.17139 14.2401 3.06168 14.2969C2.95775 14.3508 2.81977 14.4085 2.6485 14.4673C2.3048 14.5852 1.88877 14.6862 1.47047 14.7688C1.05634 14.8505 0.661899 14.9099 0.369547 14.9489C0.223984 14.9683 0.105194 14.9825 0.0237216 14.9917C-0.0169829 14.9963 -0.0482793 14.9997 -0.0688432 15.0018C-0.0791225 15.0029 -0.0867112 15.0037 -0.0914436 15.0042C-0.0938095 15.0044 -0.0954605 15.0046 -0.0963759 15.0046C-0.0968336 15.0047 -0.0971072 15.0047 -0.0971943 15.0047C-0.0972378 15.0047 -0.0972347 15.0047 -0.0971845 15.0047C-0.0971596 15.0047 -0.0970865 15.0047 -0.0970741 15.0047C-0.0969894 15.0047 -0.0968929 15.0047 0 16C0.0968929 16.9953 0.0970133 16.9953 0.0971457 16.9953C0.0972058 16.9953 0.0973505 16.9952 0.0974707 16.9952C0.0977114 16.9952 0.0980001 16.9952 0.0983364 16.9951C0.099009 16.9951 0.0998722 16.995 0.100923 16.9949C0.103026 16.9947 0.10588 16.9944 0.109466 16.994C0.116637 16.9933 0.126736 16.9923 0.139595 16.9909C0.165306 16.9882 0.202082 16.9843 0.248571 16.979C0.341486 16.9685 0.473563 16.9527 0.633921 16.9314C0.953413 16.8888 1.39103 16.8231 1.85778 16.7309C2.32036 16.6396 2.83402 16.518 3.29741 16.3591C3.72365 16.2129 4.25418 15.988 4.62111 15.6211L3.20689 14.2069ZM0 16C0.995295 16.0969 0.995285 16.097 0.995277 16.0971C0.995276 16.0971 0.995269 16.0972 0.995266 16.0972C0.995261 16.0972 0.995261 16.0972 0.995265 16.0972C0.995274 16.0971 0.995301 16.0968 0.995346 16.0964C0.995437 16.0955 0.995602 16.0938 0.99584 16.0914C0.996318 16.0867 0.997093 16.0791 0.99817 16.0688C1.00033 16.0483 1.00369 16.017 1.00829 15.9763C1.01751 15.8948 1.03167 15.776 1.05108 15.6304C1.09007 15.3381 1.14945 14.9437 1.2312 14.5295C1.31376 14.1112 1.41483 13.6952 1.53273 13.3515C1.59148 13.1802 1.64924 13.0422 1.70307 12.9383C1.75989 12.8286 1.79453 12.7917 1.79311 12.7931L0.378893 11.3789C0.0119639 11.7458 -0.212866 12.2763 -0.359073 12.7026C-0.518022 13.166 -0.639637 13.6796 -0.730945 14.1422C-0.823076 14.609 -0.888759 15.0466 -0.931365 15.3661C-0.95275 15.5264 -0.968517 15.6585 -0.979029 15.7514C-0.984289 15.7979 -0.988244 15.8347 -0.990938 15.8604C-0.992286 15.8733 -0.993319 15.8834 -0.994043 15.8905C-0.994405 15.8941 -0.99469 15.897 -0.994898 15.8991C-0.995002 15.9001 -0.995088 15.901 -0.995154 15.9017C-0.995187 15.902 -0.995215 15.9023 -0.995238 15.9025C-0.99525 15.9026 -0.995264 15.9028 -0.99527 15.9028C-0.995283 15.903 -0.995295 15.9031 0 16ZM1.79311 12.7931C2.18358 12.4026 2.81642 12.4026 3.20689 12.7931L4.62111 11.3789C3.44958 10.2074 1.55042 10.2074 0.378893 11.3789L1.79311 12.7931ZM3.20689 12.7931C3.59737 13.1836 3.59737 13.8164 3.20689 14.2069L4.62111 15.6211C5.79263 14.4496 5.79263 12.5504 4.62111 11.3789L3.20689 12.7931Z" fill="#3B3B3B" mask="url(#path-5-inside-1)"/>
                <path d="M9 8C9.55228 8 10 7.55228 10 7C10 6.44772 9.55228 6 9 6C8.44772 6 8 6.44772 8 7C8 7.55228 8.44772 8 9 8Z" fill="#444444"/>
                </svg></i> Starships</p> </div>
            <div class="card-col-2 info-text"> <p class="card-text-1">${element}</p></div>
        
        </div>`



    });

 var cardend = `</div></div>`;

 $(".card-grid").append(card+cardend);

 $(".active").text(`${value.name}`+" Details");

  }



  //search function
  function search(name){
    //   empty card grid container
      $(".card-grid").empty();

    //   getting card object
      var p = displaymap.get(name);
    //   creating card
      populate(p,p.species, p.homeworld);
      

  }


//select Card
  async function selectCard(name){
   var finalName = await name.toLowerCase().trim();
    console.log(finalName);
   await $(".card-grid").empty();
    var p = await displaymap.get(finalName);
    createSelectedCard(p, p.species, p.homeworld);

  }


  //sort
  function sort(option,order){ 
  
  var sortmap = new Map();
  var map;
  cardmap.forEach(function(value, key){
      if(option == 1){
      sortmap.set(value.homeworld+"_"+value.name,value);
    }else if(option ==2){
        sortmap.set(value.species+"_"+value.name,value);
    }else if(option ==3){
        sortmap.set(value.vehicles.length+"_"+value.name,value);
    }
    else if(option ==4){
        sortmap.set(value.starships.length+"_"+value.name,value);
    }
  })  


  if(order==1){

    map= new Map([...sortmap.entries()].sort((e1, e2) => e1[0] - e2[0]))
    console.log("asc");

    }else{
    
    map= new Map([...sortmap.entries()].sort((e1, e2) => e2[0] - e1[0]))
    console.log("des");

    }



  $(".card-grid").empty();
  map.forEach(function(value, key){

    populate(value,value.species, value.homeworld);

  });
  
  displaymap = map;
  }
     
  

  