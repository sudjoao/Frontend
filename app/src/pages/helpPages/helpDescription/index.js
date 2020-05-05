import React, { useContext, useState } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";
import styles from "./styles";
import Button from "../../../components/UI/button";
import moment from "moment";
import { UserContext } from "../../../store/contexts/userContext";
import HelpService from "../../../services/Help";
import ConfirmationModal from "./confirmationModal";
import colors from "../../../../assets/styles/colorVariables";
export default function HelpDescription({ route, navigation }) {
  const { user } = useContext(UserContext);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(
    false
  );
  const [modalAction, setModalAction] = useState(() => {});
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    helpDescription,
    categoryName,
    helpId,
    userName,
    birthday,
    city,
    profilePhoto,
    helperId,
    userPhone,
    userLocation,
    helpStatus,
  } = route.params;

  var today = new Date();
  var birthDate = new Date(birthday);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  async function chooseHelp() {
    try {
      await HelpService.chooseHelp(helpId, user._id);
      setConfirmationModalVisible(false);
      navigation.goBack();
      helpAlert(
        "Oferta enviada com sucesso e estará no aguardo para ser aceita",
        "Sucesso"
      );
    } catch (error) {
      console.log(error);
      navigation.goBack();
      helpAlert("Erro ao processar sua oferta de ajuda", "Erro");
    }
  }

  async function finishHelp() {
    try {
      await HelpService.finishHelpByHelper(
        helpId,
        user._id,
        user.accessToken
      );
      setConfirmationModalVisible(false);
      navigation.goBack();
      helpAlert(
        "Você finalizou sua ajuda! Aguarde o dono do pedido finalizar para concluí-la",
        "Sucesso"
      );
    } catch (error) {
      console.log(error);
      navigation.goBack();
      helpAlert("Erro ao finalizar sua ajuda", "Erro");
    }
  }

  function helpAlert(message, type) {
    Alert.alert(type, message, [{ title: "OK" }]);
  }

  function openModal(action) {
    switch (action) {
      case "finish":
        setModalAction(() => () => {
          finishHelp();
          setIsLoading(true);
        });
        setModalMessage("Você tem certeza que deseja finalizar essa ajuda?");
        break;
      case "offer":
        setModalAction(() => () => {
          chooseHelp();
          setIsLoading(true);
        });
        setModalMessage("Você deseja confirmar a sua ajuda?");
        break;
      default:
        return;
    }
    setConfirmationModalVisible(true);
  }

  function openMaps() {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${userLocation[1]},${userLocation[0]}`;
    const label = "Pedido de Ajuda de " + userName;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    Linking.openURL(url);
  }

  function openWhatsapp() {
    Linking.openURL(
      `whatsapp://send?phone=${userPhone}&text=${"Olá, precisa de ajuda?"}`
    );
  }

  return (
    <View style={styles.container}>
      <ConfirmationModal
        visible={confirmationModalVisible}
        setVisible={setConfirmationModalVisible}
        action={modalAction}
        message={modalMessage}
        isLoading={isLoading}
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
          {user._id == helperId && (
            <Text style={styles.infoText}>
              <Text style={{ fontFamily: "montserrat-semibold" }}>
                Telefone:
              </Text>
              {userPhone}
            </Text>
          )}
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
          <Text style={[styles.infoText, { marginBottom: 50 }]}>
            {helpDescription}
          </Text>
        </View>
        {user._id == helperId && helpStatus!='finished' &&(
          <View style={styles.ViewLink}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
                marginBottom: 20,
              }}
            >
              <TouchableOpacity onPress={openWhatsapp}>
                <Icon
                  name="whatsapp"
                  type="font-awesome"
                  size={50}
                  color="#25d366"
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={openMaps}>
                <Icon
                  name="directions"
                  type="font-awesome-5"
                  size={50}
                  color="#4285F4"
                />
              </TouchableOpacity>
            </View>

            <Button
              title="Finalizar ajuda"
              large
              press={() => openModal("finish")}
            />
          </View>
        )}
        <View style={styles.helpButtons}>
          {user._id != helperId && (
            <Button
              title="Oferecer Ajuda"
              large
              press={() => openModal("offer")}
            />
          )}
        </View>
      </View>
    </View>
  );
}
