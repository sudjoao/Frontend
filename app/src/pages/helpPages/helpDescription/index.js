import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    Linking,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { Icon } from 'react-native-elements';
import styles from './styles';
import Button from '../../../components/UI/button';
import moment from 'moment';
import { HelpContext } from '../../../store/contexts/helpContext';
import { UserContext } from '../../../store/contexts/userContext';
import HelpService from '../../../services/Help';
import ConfirmationModal from '../../../components/modals/confirmationModal';
import ListHelpers from './ListHelpers/index';
import actions from '../../../store/actions';
import { alertError, alertSuccess } from '../../../utils/Alert';

export default function HelpDescription({ route, navigation }) {
    const { user } = useContext(UserContext);
    const { helpList, dispatch } = useContext(HelpContext);
    const [confirmationModalVisible, setConfirmationModalVisible] = useState(
        false,
    );
    const [clickPossibleHelpers, setClickPossibleHelpers] = useState(false);
    const [modalAction, setModalAction] = useState(() => {});
    const [modalMessage, setModalMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // const {
    //         helpDescription,
    //         categoryName,
    //         helpId,
    //         userName,
    //         birthday,
    //         city,
    //         profilePhoto,
    //         ownerId,
    //         helperId,
    //         userPhone,
    //         userLocation,
    //         helpStatus,
    //         possibleHelpers,
    // } = route.params;

    const { help } = route.params;

    const possibleHelpersIds = help.possibleHelpers.map((helper) => helper._id);

    const today = new Date();
    const birthDate = new Date(help.user.birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    const userProfilephoto = help.user.photo || user.photo;

    async function chooseHelp() {
        try {
            await HelpService.chooseHelp(help._id, user._id);
            let helpListArray = helpList.filter((unfilterHelp) => {
                return unfilterHelp._id != help._id;
            });
            dispatch({ type: actions.help.storeList, helps: helpListArray });
            navigation.goBack();
            alertSuccess(
                'Oferta enviada com sucesso e estará no aguardo para ser aceita',
            );
        } catch (error) {
            navigation.goBack();
            alertError(error);
        }
    }

    async function finishHelp() {
        try {
            await HelpService.finishHelpByHelper(help._id, user._id);
            navigation.goBack();
            alertSuccess(
                'Você finalizou sua ajuda! Aguarde o dono do pedido finalizar para concluí-la',
            );
        } catch (error) {
            navigation.goBack();
            alertError(error);
        }
    }

    function openModal(action) {
        switch (action) {
            case 'finish':
                setModalAction(() => () => {
                    finishHelp();
                    setIsLoading(true);
                });
                setModalMessage(
                    'Você tem certeza que deseja finalizar essa ajuda?',
                );
                break;
            case 'offer':
                setModalAction(() => () => {
                    chooseHelp();
                    setIsLoading(true);
                });
                setModalMessage('Você deseja confirmar a sua ajuda?');
                break;
            default:
                return;
        }
        setConfirmationModalVisible(true);
    }

    function openMaps() {
        const scheme = Platform.select({
            ios: 'maps:0,0?q=',
            android: 'geo:0,0?q=',
        });
        const latitude = help.user.location.coordinates[1];
        const longitude = help.user.location.coordinates[0];

        const userAskingForHelpLocation = `${latitude},${longitude}`;
        const helpLabel = 'Pedido de Ajuda de ' + help.user.name;
        const url = Platform.select({
            ios: `${scheme}${helpLabel}@${userAskingForHelpLocation}`,
            android: `${scheme}${userAskingForHelpLocation}(${helpLabel})`,
        });
        Linking.openURL(url);
    }

    function openWhatsapp() {
        Linking.openURL(
            `whatsapp://send?phone=${
                help.user.phone
            }&text=${'Olá, precisa de ajuda?'}`,
        );
    }

    function calculateAge(birthday) {
        let age = moment().diff(moment(birthday), 'years');
        return age;
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
                <ConfirmationModal
                    visible={confirmationModalVisible}
                    setVisible={setConfirmationModalVisible}
                    action={modalAction}
                    message={modalMessage}
                    isLoading={isLoading}
                />
                {!clickPossibleHelpers && (
                    <>
                        <View style={styles.userInfo}>
                            <Image
                                source={{
                                    uri: `data:image/png;base64,${userProfilephoto}`,
                                }}
                                style={styles.profileImage}
                            />
                            <View style={styles.infoTextView}>
                                <Text
                                    style={[
                                        styles.infoText,
                                        styles.infoTextFont,
                                    ]}>
                                    {help.user.name || user.name}
                                </Text>
                                <Text style={styles.infoText}>
                                    <Text style={styles.infoTextFont}>
                                        Idade:{' '}
                                    </Text>
                                    {age || calculateAge(user.birthday)}
                                </Text>
                                <Text style={styles.infoText}>
                                    <Text style={styles.infoTextFont}>
                                        Cidade:{' '}
                                    </Text>
                                    {help.user.address.city ||
                                        user.address.city}
                                </Text>
                                {user._id == help._id && (
                                    <Text style={styles.infoText}>
                                        <Text style={styles.infoTextFont}>
                                            Telefone:
                                        </Text>
                                        {help.user.phone}
                                    </Text>
                                )}
                            </View>
                        </View>
                        <View style={styles.helpInfo}>
                            <View style={styles.helpInfoText}>
                                <Text style={styles.infoText}>
                                    <Text style={styles.infoTextFont}>
                                        Categoria:{' '}
                                    </Text>
                                    {help.category[0].name}
                                </Text>
                                <Text
                                    style={[
                                        styles.infoText,
                                        styles.infoTextDescription,
                                    ]}>
                                    Descrição:
                                </Text>
                                <Text
                                    style={[
                                        styles.infoText,
                                        styles.infoTextBottom,
                                    ]}>
                                    {help.description}
                                </Text>
                            </View>
                        </View>
                    </>
                )}

                {user._id == help._id && help.status != 'finished' && (
                    <View style={styles.ViewLink}>
                        <View style={styles.ViewLinkBox}>
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
                            press={() => openModal('finish')}
                        />
                    </View>
                )}
                <View style={styles.helpButtons}>
                    {user._id === help.ownerId ? (
                        <ListHelpers
                            stateAction={clickPossibleHelpers}
                            clickAction={setClickPossibleHelpers}
                            helpId={help._id}
                            navigation={navigation}
                        />
                    ) : user._id !== help._id &&
                      help.status != 'finished' &&
                      (!possibleHelpersIds ||
                          !possibleHelpersIds.includes(user._id)) ? (
                        <>
                            <Text>{help.status}</Text>
                            <Button
                                title="Oferecer Ajuda"
                                large
                                press={() => openModal('offer')}
                            />
                        </>
                    ) : help.status === 'waiting' ? (
                        <Text style={styles.waitingToBeAccepted}>
                            Aguarde o dono da ajuda escolher seu ajudante.
                        </Text>
                    ) : null}
                </View>
            </View>
        </ScrollView>
    );
}
