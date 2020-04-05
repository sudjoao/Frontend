import React, { useEffect, useState, useContext } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import styles from "./styles";
import MapView, { Marker, Circle } from "react-native-maps";
import HelpService from "../../services/Help";
import Avatar from "../../components/helpAvatar";
import { Icon } from "react-native-elements";
import mapStyle from "../../../assets/styles/mapstyle";
import getHelpDistance from "../../utils/helpDistance";
import actions from "../../store/actions";
import Button from "../../components/UI/button";

import {
  requestPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import { HelpContext } from "../../store/contexts/helpContext";

export default function Main() {
  const [currentRegion, setCurrentRegion] = useState(null);
  const { helpList, dispatch } = useContext(HelpContext);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    async function getLocation() {
      const { granted } = await requestPermissionsAsync();
      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true,
        });
        const { latitude, longitude } = coords;
        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
      }
    }
    getLocation();
  }, []);

  useEffect(() => {
    async function getHelpList() {
      if (currentRegion) {
        try {
          let helpListArray = await HelpService.getNearHelp(currentRegion);

          helpListArray = helpListArray.map((help) => {
            //insert help distance to the list
            const helpCoords = {
              latitude: help.user[0].location.coordinates[1],
              longitude: help.user[0].location.coordinates[0],
            };
            help.distance = getHelpDistance(currentRegion, helpCoords);

            return help;
          });

          dispatch({ type: actions.help.addHelp, help: helpListArray });
        } catch (error) {
          console.log(error);
        }
      }
    }
    getHelpList();
  }, [currentRegion]);

  useEffect(() => {
    //use effect to watch for regionChange and clear it
    setRegion(null);
  }, [region]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.recenter}
        onPress={() => {
          setRegion(currentRegion);
        }}
      >
        <Icon name="target-two" type="foundation" color="#fff" size={35} />
      </TouchableOpacity>

      <MapView
        initialRegion={currentRegion}
        style={styles.map}
        region={region}
        customMapStyle={mapStyle.day.map}
      >
        {currentRegion && (
          <>
            <Marker
              title="Este é você!"
              coordinate={{
                latitude: currentRegion.latitude,
                longitude: currentRegion.longitude,
              }}
            >
              <Image source={mapStyle.day.cat} style={styles.catAvatar} />
            </Marker>
            <Circle
              center={{
                latitude: currentRegion.latitude,
                longitude: currentRegion.longitude,
              }}
              radius={2000}
              strokeColor={mapStyle.day.radiusColor}
              fillColor={mapStyle.day.radiusColor}
            />
          </>
        )}
        {helpList &&
          helpList.map((help) => (
            <Marker
              title={help.distance}
              key={help._id}
              coordinate={{
                latitude: help.user[0].location.coordinates[1],
                longitude: help.user[0].location.coordinates[0],
              }}
            >
              <Avatar />
            </Marker>
          ))}
      </MapView>
      <TouchableOpacity style={styles.filter} onPress={() => {}}>
        <Icon name="filter" type="font-awesome" color="#000" size={20} />
      </TouchableOpacity>
      <View
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          zIndex: 5,
          elevation: 5,
        }}
      >
        <Button title="Pedir ajuda" press={() => {}} type="danger" large />
      </View>
    </View>
  );
}
