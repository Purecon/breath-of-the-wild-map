import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Marker,
  Popup
} from 'react-leaflet';

import icons from '../data/icons';

import './map-icons-container.css';
import locations from '../data/locations';

const iconText = (location, iconType) => {
  const instructions = icons[iconType].instructions;

  if (location.name) {
    return location.name;
  } else if (instructions) {
    return instructions[location.instructionType];
  }
}

const DisplayIcons = ({ activeIconTypes, locations, props, activeLocs}) => {
  const displayIcons = activeIconTypes.map((iconType) => {
    return locations[iconType].map((location) => {
      const icon = icons[iconType];
      let popupText = iconText(location, iconType);
      return (
        <Marker
          position={location.coordinates}
          className={icon.classNames}
          icon={icon.icon}
          title={location.name}
          key={location.name}
          //On click event
          onClick={(event) => handleClick(event,activeIconTypes,location,popupText,props,activeLocs)}
          //onClick={(event) => console.log("Berhasil diklik",activeIconTypes,location.name,[event.latlng.lat, event.latlng.lng],"Array of active locations: ",getActiveLoc(activeIconTypes))}
        >
          <Popup>
            <span>{popupText}</span>
          </Popup>
        </Marker>
      )
    });
  });

  return (
    <div>{displayIcons}</div>
  )
};

//source,dest lokasi dengan latitude longitude
function euclideanDistance(source,dest) {
  var a = dest[0] - source[0];
  var b = dest[1] - source[1];

  return Math.sqrt(a*a + b*b);
}

//Kelas simpul
class Simpul {
  constructor(name, location) {
    this.nama = name;
    this.lokasi = location;
    //array
    this.tetangga = undefined;
  }
  setTetangga(neighbour){
    this.tetangga = neighbour;
  }
}
let arr_simpul = [];

//MapIconsContainer
class MapIconsContainer extends Component {
  render() {
    const { activeIconTypes, locations } = this.props;
    var props = this.props;
    console.log("Tipe icon: ",activeIconTypes);
    //lokasi active icons
    let activeLocs = getActiveLoc(activeIconTypes);
    //Bangun graf
    activeLocs.forEach(element => {
      let simpul = new Simpul(element.name,element.coordinates);
      arr_simpul = arr_simpul.concat(simpul);
    });
    //Hitung euclidean tiap simpul
    arr_simpul.forEach(element => {
      let other_simpul = {};
      arr_simpul.forEach(element2 => {
        if(element.nama !== element2.nama)
        {
          let eucRes = euclideanDistance(element.lokasi,element2.lokasi);
          //debug
          //console.log("Simpul 1:",element.nama," Simpul 2:",element2.nama," Jarak:",eucRes);
          //other_simpul = other_simpul.concat([element2.nama,eucRes]);
          other_simpul[element2.nama] = eucRes;
        }
      });
      let simpul_sorted = Object.keys(other_simpul).sort(function(a,b){return other_simpul[a]-other_simpul[b]})
      //debug
      //console.log("Simpul 1:",element.nama," Simpul lain:",simpul_sorted);
      //console.log("Simpul 1:",element.nama," Simpul lain 1:",simpul_sorted[0]);
      //console.log("Simpul 1:",element.nama," Simpul lain 2:",simpul_sorted[1]);
      //console.log("Simpul 1:",element.nama," Simpul lain 3:",simpul_sorted[2]);
      let simpul_tetangga = [];
      for(let i = 0; i<3; i++)
      {
        simpul_tetangga = simpul_tetangga.concat(simpul_sorted[i]);
      }
      element.setTetangga(simpul_tetangga);
    });

    return (
      <div>
        {activeIconTypes && locations &&
          <DisplayIcons { ...{ activeIconTypes, locations, props, activeLocs} } />
        }
      </div>
    )
  }
};

const mapStateToProps = (state) => {
  const activeIconTypes = state.activeIconTypes;

  return {
    activeIconTypes,
    locations: state.locations
  }
};

function getActiveLoc(activeIconTypes){
  let temp_arr = [];
  activeIconTypes.forEach(element => {
    temp_arr = temp_arr.concat(locations[element]);
  });
  return temp_arr;
}

// Actions untuk mengubah lokasi untuk path
export const setTargetLoc = (newLatLngs) => {
  return {
      targets: newLatLngs,
      type: 'SET_NEW_TARGET_LOC'
  }
};

//first_click button
let first_click = true;
let newLatLngs = [];
let start_loc, end_loc;
function handleFirstClick(location,popupText,props,activeLocs){
  if(first_click){
    popupText = "Titik mulai: \n" + popupText;
    console.log(popupText);
    //test newLatLngs
    newLatLngs = [location.coordinates];
    start_loc = location;
  }
  else{
    popupText = "Titik selesai: \n" + popupText;
    console.log(popupText);
    //test newLatLngs
    newLatLngs = newLatLngs.concat([location.coordinates]);
    end_loc = location;
    
    console.log("Lokasi aktif: ",activeLocs);
    console.log("Lokasi mulai: ",start_loc);
    console.log("Lokasi selesai:", end_loc);
    //testing euclidean
    //console.log("Euclidean dist:",euclideanDistance(start_loc.coordinates,end_loc.coordinates));
    console.log(arr_simpul);

    //test simpul
    // let simpul_test = new Simpul(location.name,location.coordinates);
    // arr_simpul = arr_simpul.concat(simpul_test);
    // simpul_test.setTetangga(start_loc);

    //update state targetLoc
    //newLatLngs for line in map
    props.dispatch(setTargetLoc(newLatLngs));
  }

  //swap first click
  first_click = !first_click;
  //console.log("First click value",first_click);
}




function handleClick(event,activeIconTypes,location,popupText,props,activeLocs){
  //Log after clicked
  console.log("Berhasil diklik",activeIconTypes,location.name,[event.latlng.lat, event.latlng.lng]);
  handleFirstClick(location,popupText,props,activeLocs);
  //console.log("Berhasil diklik",activeIconTypes,location.name,[event.latlng.lat, event.latlng.lng],"Array of active locations: ",getActiveLoc(activeIconTypes))
}

export default connect(mapStateToProps)(MapIconsContainer);