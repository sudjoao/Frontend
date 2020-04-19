import React, { useState, useEffect, useContext } from "react";
import {
  View,
  KeyboardAvoidingView,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import UserService from "../../../services/User";
import Button from "../../../components/UI/button";
import { Icon } from "react-native-elements";

import styles from "./styles";
import { UserContext } from "../../../store/contexts/userContext";
import actions from "../../../store/actions";

export default function Login({ navigation }) {
  const { dispatch } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [keyboardShow, setKeyboardShow] = useState(false);

  useEffect(() => {
    if (email && password) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [email, password]);

  const emailHandler = (enteredEmail) => {
    setEmail(enteredEmail);
  };

  const passwordHandler = (enteredPassword) => {
    setPassword(enteredPassword);
  };

  const loginHandler = async () => {
    const data = { email, password };
    Keyboard.dismiss();
    setLoading(true);

    try {
      const user = await UserService.logIn(data);
      if (user) {
        setLoading(false);
        dispatch({ type: actions.user.storeUserInfo, data: user });
      }
    } catch (err) {
      Alert.alert(
        "Ooops..",
        err.error || "Algo deu errado, tente novamente mais tarde",
        [{ text: "OK", onPress: () => {} }],
        {
          cancelable: false,
        }
      );
      setLoading(false);
    }
  };
  
  const loginHandlerFacebook = async () => {
    try {
      await UserService.logInWithFacebook();
      // navigation.navigate("main");
    } catch (err) {
      Alert.alert("Erro", 
      err.error,
      [{ 
        text: "OK", 
        onPress: () => {} 
      }], 
      {
        cancelable: false,
      });
    }
  };

  const loginHandlerGoogle = async () => {
    try {
      await UserService.logInWithFacebook();
      // navigation.navigate("main");
    } catch (err) {
      Alert.alert("Erro", 
      'Erro ao logar com o facebook. Tente Novamente!',
       [{ text: "OK", onPress: () => {} }], 
      {
        cancelable: false,
      });
    }
  };


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 5 : 0}
    >
      <View style={styles.logo}>
        <Image
          style={{ flex: 1, resizeMode: "contain", marginTop: 30 }}
          source={require("../../../images/logo.png")}
        />
      </View>
      <View style={styles.input}>
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          autoCorrect={false}
          placeholderTextColor="#FFF"
          onChangeText={emailHandler}
          value={email}
        />

        <TextInput
          style={styles.textInput}
          secureTextEntry
          placeholderTextColor="#FFF"
          placeholder="Senha"
          autoCorrect={false}
          onChangeText={passwordHandler}
          value={password}
        />
        <View style={styles.forgotPassword}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("forgotPassword");
            }}
          >
            <Text style={styles.forgotPasswordtext}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ alignItems: "flex-end", width: "90%" }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("forgotPassword");
          }}
        >
          <Text style={styles.forgotPasswordtext}>Esqueceu a senha?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.viewLogin}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <Button
            style={styles.login}
            large
            type="white"
            title="ENTRAR"
            press={loginHandler}
            disabled={buttonDisabled}
          />
        )}

        <TouchableOpacity
          style={styles.signUP}
          onPress={() => {
            navigation.navigate("registrationData");
          }}
        >
          <Text style={styles.signupText}>Não tem uma conta?</Text>
        </TouchableOpacity>
        <View style={styles.quickLogin}>
          <View style={styles.viewGoogle}>
            <TouchableOpacity style={styles.btnGoogle} onPress={loginHandlerGoogle}>
              <Icon type="antdesign" name={"google"} color={"white"} />
            </TouchableOpacity>
          </View>
          <View style={styles.viewFacebook}>
            <TouchableOpacity style={styles.btnFacebook} onPress={loginHandlerFacebook}>
              <Icon type="font-awesome" name={"facebook"} color={"white"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
