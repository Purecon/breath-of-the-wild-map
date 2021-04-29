import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Marker,
  Popup
} from 'react-leaflet';

import icons from '../data/icons';

import './map-icons-container.css';
import locations from '../data/locations';
let first_click = true;

const iconText = (location, iconType) => {
  const instructions = icons[iconType].instructions;

  if (location.name) {
    return location.name;
  } else if (instructions) {
    return instructions[location.instructionType];
  }
}

const DisplayIcons = ({ activeIconTypes, locations }) => {
  const displayIcons = activeIconTypes.map((iconType) => {
    return locations[iconType].map((location) => {
      const icon = icons[iconType];
      const popupText = iconText(location, iconType);
      return (
        <Marker
          position={location.coordinates}
          className={icon.classNames}
          icon={icon.icon}
          title={location.name}
          key={location.name}
          //On click event
          onClick={(event) => handleClick(event,activeIconTypes,location)}
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
    console.log("Tipe icon: ",activeIconTypes);
    //semua lokasi
    //console.log("Lokasi: ",locations);
    let temp_arr = [];
    activeIconTypes.forEach(element => {
      //lokasi berdasarkan icon
      //console.log("Lokasi berdasarkan icon: ",locations[element]);
      temp_arr = temp_arr.concat(locations[element]);
    });
    console.log(temp_arr);
    //console.log(activeIconTypes, locations);
    return (
      <div>
        {activeIconTypes && locations &&
          <DisplayIcons { ...{ activeIconTypes, locations } } />
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

function handleFirstClick(){
  //swap first click
  first_click = !first_click;
  console.log("First click value",first_click);
}

function handleClick(event,activeIconTypes,location){
  handleFirstClick();
  console.log("Berhasil diklik",activeIconTypes,location.name,[event.latlng.lat, event.latlng.lng],"Array of active locations: ",getActiveLoc(activeIconTypes))
}

export default connect(mapStateToProps)(MapIconsContainer);
