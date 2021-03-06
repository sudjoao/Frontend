import React, { useEffect, useContext, createContext, useState } from 'react';
import { UserContext } from './userContext';
import { CategoryContext } from './categoryContext';

import useService from '../../services/useService';
import HelpService from '../../services/Help';

export const HelpOfferContext = createContext();

export default function HelpOfferContextProvider({ children }) {
    const { user } = useContext(UserContext);
    const [helpOfferList, setHelpOfferList] = useState([]);
    const { selectedCategories } = useContext(CategoryContext);

    useEffect(() => {
        const isUserAuhtenticated = user._id;
        if (isUserAuhtenticated) {
            getHelpOfferList();
        }
    }, [user]);

    useEffect(() => {
        const isUserAuthenticated = user._id;
        if (isUserAuthenticated) {
            if (selectedCategories.length) {
                getHelpOfferListWithCategories();
            } else {
                getHelpOfferList();
            }
        }
    }, [selectedCategories]);

    async function getHelpOfferList() {
        const helpOfferListResponse = await useService(
            HelpService,
            'listHelpOffer',
            [user._id],
        );
        if (!helpOfferListResponse.error) {
            setHelpOfferList(helpOfferListResponse);
        }
    }

    async function getHelpOfferListWithCategories() {
        if (selectedCategories.length) {
            const helpOfferListResponse = await useService(
                HelpService,
                'listHelpOfferWithCategories',
                [user._id, selectedCategories],
            );
            if (!helpOfferListResponse.error) {
                setHelpOfferList(helpOfferListResponse);
            }
        }
    }

    return (
        <HelpOfferContext.Provider value={{ helpOfferList }}>
            {children}
        </HelpOfferContext.Provider>
    );
}
