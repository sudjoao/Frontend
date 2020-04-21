import React from "react";
import { Icon } from "react-native-elements";
import { View, Image } from "react-native";
import styles from "./styles";
import colors from "../../../assets/styles/colorVariables";

export default function Avatar({ help }) {
  const isRiskGroup = !!help.user[0].riskGroup.length;
  const profilePhoto = help.user[0].photo;
  const riskColor = isRiskGroup ? colors.danger : colors.primary;

  return (
    <View style={[styles.container, { backgroundColor: riskColor }]}>
      <Image
        source={{ uri: profilePhoto }}
        style={{
          resizeMode: "stretch",
          width: 54,
          height: 54,
          borderRadius: 30,
        }}
      />
      {/* <View style={styles.iconPosition}>
        <Icon
          name="exclamation"
          type="font-awesome"
          color={riskColor}
          size={35}
        />
      </View> */}
    </View>
  );
}
