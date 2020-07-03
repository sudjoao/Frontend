import React, { useState } from 'react';

import {
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import Input from '../../../components/UI/input';
import colors from '../../../../assets/styles/colorVariables';
import Button from '../../../components/UI/button';
import { Icon } from 'react-native-elements';
import styles from './styles';
import validationEmail from '../../../utils/emailValidation';
import firebaseService from '../../../services/Firebase';
import { alertSuccess, alertError } from '../../../utils/Alert';

export default function ForgotPassword({ navigation }) {
    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [requestLoading, setRequestLoading] = useState(false);

    const handlerSubmit = async () => {
        try {
            setRequestLoading(true);
            await firebaseService.resetUserPassword(email.trim().toLowerCase());
            navigation.goBack();
            alertSuccess(
                'Email enviado com sucesso! Por favor, verifique sua a caixa de entrada com as instruções de mudança de senha!',
            );
        } catch (err) {
            setRequestLoading(false);
            alertError(
                err,
                'Email não encontrado. Tente novamente!',
                'Ooops..',
            );
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}>
                <View style={styles.backIcon}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back" color="#000000" />
                    </TouchableOpacity>
                </View>
                {requestLoading ? (
                    <View style={styles.loading}>
                        <ActivityIndicator
                            color={colors.primary}
                            size="large"
                        />
                    </View>
                ) : (
                    <View style={styles.content}>
                        <View style={styles.contentText}>
                            <Icon
                                name="unlock"
                                size={80}
                                type="foundation"
                                color={colors.primary}
                            />
                            <Text style={styles.textTitle}>
                                Esqueceu sua senha?
                            </Text>
                            <Text style={styles.subtitle}>
                                Será enviado instruções de como redefinir sua
                                senha por e-mail.
                            </Text>
                            <View style={styles.inputWrapper}>
                                <Input
                                    placeholder="Digite seu email"
                                    value={email}
                                    change={(value) => {
                                        setIsEmailValid(validationEmail(value));
                                        setEmail(value);
                                    }}
                                    valid={isEmailValid}
                                />
                            </View>
                        </View>
                        <Button
                            large
                            press={handlerSubmit}
                            title="Enviar"
                            disabled={email === '' && isEmailValid}
                        />
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
