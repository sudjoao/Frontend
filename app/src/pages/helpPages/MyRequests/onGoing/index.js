import React, { useState, useContext, useCallback } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import HelpCard from '../../../../components/HelpCard';
import { UserContext } from '../../../../store/contexts/userContext';
import helpService from '../../../../services/Help';
import styles from '../styles';
import ConfirmationModal from '../../../../components/modals/confirmationModal';
import { useFocusEffect } from '@react-navigation/native';
import NoHelps from '../../../../components/NoHelps';
import colors from '../../../../../assets/styles/colorVariables';

export default function OnGoingHelps({ navigation }) {
    const [onGoingHelpList, setOnGoingHelpList] = useState([]);
    const [confirmationModalVisible, setConfirmationModalVisible] = useState(
        false,
    );
    const [selectedHelp] = useState(null);
    const [loadingHelps, setLoadingHelps] = useState(false);
    const [isLoadingModal, setIsLoadingModal] = useState(false);
    const { user } = useContext(UserContext);
    const { _id: userId } = user;

    useFocusEffect(
        useCallback(() => {
            loadOnGoingHelps();
        }, [navigation]),
    );

    async function loadOnGoingHelps() {
        setLoadingHelps(true);
        try {
            let filteredHelps = await helpService.getHelpMultipleStatus(
                userId,
                ['waiting', 'on_going', 'helper_finished'],
            );
            setOnGoingHelpList(filteredHelps);
            setLoadingHelps(false);
        } catch (err) {
            console.log(err);
        }
    }

    async function excludeHelp() {
        try {
            setIsLoadingModal(true);
            await helpService.deleteHelp(selectedHelp);
            setIsLoadingModal(false);
            const updatedArray = onGoingHelpList.filter((help) => {
                return help._id !== selectedHelp;
            });
            setOnGoingHelpList(updatedArray);
            setConfirmationModalVisible(false);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View>
            <ConfirmationModal
                attention={true}
                visible={confirmationModalVisible}
                setVisible={setConfirmationModalVisible}
                action={() => excludeHelp()}
                message={'Você deseja deletar esse pedido de ajuda?'}
                isLoading={isLoadingModal}
            />
            {loadingHelps ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : onGoingHelpList.length > 0 ? (
                <ScrollView>
                    <View style={styles.helpList}>
                        {onGoingHelpList.map((item) => (
                            <HelpCard key={item._id} help={item} showBadge />
                        ))}
                    </View>
                </ScrollView>
            ) : (
                <NoHelps title={'Você não possui ajudas em andamento'} />
            )}
        </View>
    );
}
