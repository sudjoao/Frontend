import React, { useContext, useState, useContext } from "react";
import { View, Text, Image, Alert } from "react-native";
import styles from "./styles";
import Button from "../../../components/UI/button";
import moment from "moment";
import { UserContext } from "../../../store/contexts/userContext";
import HelpService from "../../../services/Help";
import ConfirmationModal from "./confirmationModal";
import ListHelpers from "./ListHelpers/index";

export default function HelpDescription({ route, navigation }) {
  const { user } = useContext(UserContext);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(
    false
  );

  const {
    helpDescription,
    categoryName,
    helpId,
    userName,
    birthday,
    city,
    profilePhoto,
    possibleHelpers,
    ownerId
  } = route.params;

  const currentYear = moment().format("YYYY");
  const birthYear = moment(birthday).format("YYYY");

  const age = currentYear - birthYear;

  async function chooseHelp() {
    try {
      await HelpService.chooseHelp(helpId, user._id);
      setConfirmationModalVisible(false);
      navigation.goBack();
      Alert.alert(
        "Sucesso",
        "Oferta enviada com sucesso e estará no aguardo para ser aceita",
        [{ title: "OK" }]
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <ConfirmationModal
        visible={confirmationModalVisible}
        setVisible={setConfirmationModalVisible}
        chooseHelp={chooseHelp}
      />
      <View style={styles.userInfo}>
        <Image
          source={{
            uri: profilePhoto,
          }}
          style={styles.profileImage}
        />
        <View style={styles.infoTextView}>
          <Text
            style={[styles.infoText, { fontFamily: "montserrat-semibold" }]}
          >
            {userName}
          </Text>
          <Text style={styles.infoText}>
            <Text style={{ fontFamily: "montserrat-semibold" }}>Idade: </Text>
            {age}
          </Text>
          <Text style={styles.infoText}>
            <Text style={{ fontFamily: "montserrat-semibold" }}>Cidade: </Text>
            {city}
          </Text>
        </View>
      </View>
      <View style={styles.helpInfo}>
        <View style={styles.helpInfoText}>
          <Text style={styles.infoText}>
            <Text style={{ fontFamily: "montserrat-semibold" }}>
              Categoria:{" "}
            </Text>
            {categoryName}
          </Text>
          <Text
            style={[
              styles.infoText,
              {
                fontFamily: "montserrat-semibold",
                marginTop: 20,
                marginBottom: 10,
              },
            ]}
          >
            Descrição:
          </Text>
          <Text style={styles.infoText}>
          {/* fsjdklfjdskljfskjdfkjsdkjfsdljfklsdjfkjs sfdjfdls dskfl sdl sdl ds kf sd fksd flk sdlkf ksld fdsklfsdkfsd fsd lkfsdk fksd lfkd s fdsdf ksd fkds fk sd fksd fk ds fkd s fsdkf sdk fsdkfkslfasfjksaf as fkasd fklsa fksla dfk askf dsfkla  dfsalk dfslaf ksa fdksa kfdl lakfdsk flkdsa fddslkfslk sdfdk sfksdf */}
            {helpDescription}
          </Text>
        </View>
      </View>
      <View style={styles.helpButtons}>
        {
          user.info._id !== ownerId ? (
            <Button
              title="Oferecer Ajuda"
              large
              press={() => setConfirmationModalVisible(true)}
            />
          ) : (
            <ListHelpers />
          )
        }
      </View>
    </View>
  );
}
