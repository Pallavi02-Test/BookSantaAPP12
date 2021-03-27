import React, { Component } from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import SettingsScreen from '../screens/SettingsScreen';
import { AppTabNavigator } from './AppTabNavigator';
import CustomSideBarMenu from './CustomSideBarMenu';
import MyDonationsScreen from '../screens/MyDonationsScreen';
import NotificationScreen from '../screens/NotificationScreen';
import MyReceivedBooksScreen from '../screens/MyReceivedBooksScreen';
import {Icon} from 'react-native-elements';

export const AppDrawerNavigator = createDrawerNavigator(
    {
        Home: {
            screen: AppTabNavigator,
            navigationOptions:{
                drawerIcon:<Icon name="home" type="fontawesome5"/>,
            }
        },

        MyDonations: {
            screen: MyDonationsScreen,
            navigationOptions:{
                drawerIcon:<Icon name="gift" type="font-awesome"/>,
                drawerLabel:"My Donations"
            }
        },

        Notifications: {
            screen: NotificationScreen,
            navigationOptions:{
                drawerIcon:<Icon name="bell" type="font-awesome"/>,
                drawerLabel:"Notifications"
            }
        },
        MyReceivedBooks :{
            screen: MyReceivedBooksScreen,
            navigationOptions:{
                drawerIcon:<Icon name="gift" type="font-awesome"/>,
                drawerLabel:"My Received Books"
            }
        },
        Settings: {
            screen: SettingsScreen,
            navigationOptions:{
                drawerIcon:<Icon name="settings" type="fontawesome5"/>,
                drawerLabel:"Settings"
            }
        }
    },

    {
        contentComponent:  CustomSideBarMenu
    },

    {
        InitialRouteName: 'Home'
    }
);