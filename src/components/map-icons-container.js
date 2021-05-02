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

const DisplayIcons = ({ activeIconTypes, locations, props }) => {
  const displayIcons = activeIconTypes.map((iconType) => {
    return locations[iconType].map((location) => {
      const icon = icons[iconType];
      let popupText = iconText(location, iconType);
      let activeLocs = getActiveLoc(activeIconTypes);
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

class MapIconsContainer extends Component {
  render() {
    const { activeIconTypes, locations } = this.props;
    var props = this.props;
    console.log("Tipe icon: ",activeIconTypes);
    //semua lokasi
    //console.log("Lokasi: ",locations);

    //lokasi active icons
    // let temp_arr = [];
    // activeIconTypes.forEach(element => {
    //   //lokasi berdasarkan icon
    //   //console.log("Lokasi berdasarkan icon: ",locations[element]);
    //   temp_arr = temp_arr.concat(locations[element]);
    // });
    // console.log(temp_arr);
    //console.log(activeIconTypes, locations);
    return (
      <div>
        {activeIconTypes && locations &&
          <DisplayIcons { ...{ activeIconTypes, locations, props} } />
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

//Kelas simpul
class Simpul {
  constructor(name, location) {
    this.nama = name;
    this.lokasi = location;
    this.tetangga = undefined;
  }
  setTetangga(neighbour){
    this.tetangga = neighbour;
  }
}

//first_click button
let first_click = true;
let newLatLngs = [];
let start_loc, end_loc;
let arr_simpul = [];
function handleFirstClick(location,popupText,props,activeLocs){
  if(first_click){
    popupText = "Titik mulai: \n" + popupText;
    console.log(popupText);
    newLatLngs = [location.coordinates];
    start_loc = location;
  }
  else{
    popupText = "Titik selesai: \n" + popupText;
    console.log(popupText);
    newLatLngs = newLatLngs.concat([location.coordinates]);
    end_loc = location;
    
    console.log("Lokasi aktif: ",activeLocs);
    console.log("Lokasi mulai: ",start_loc);
    console.log("Lokasi selesai", end_loc);

    //test simpul
    // let simpul_test = new Simpul(location.name,location.coordinates);
    // arr_simpul = arr_simpul.concat(simpul_test);
    // simpul_test.setTetangga(start_loc);

    console.log(arr_simpul);
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