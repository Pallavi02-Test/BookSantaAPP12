import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';
import { Icon } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';
import WelcomeScreen from '../screens/WelcomeScreen';
import { Avatar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { RFValue } from 'react-native-responsive-fontsize';

export default class CustomSideBarMenu extends React.Component {
    state = {
        userId: firebase.auth().currentUser.email,
        image: "#",
        name: "",
        docId: "",
    };

    selectPicture = async () => {
        const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        })

        if (!cancelled) {
            this.uploadImage(uri, this.state.userId);
        }
    }

    uploadImage = async (uri, imageName) => {
        var response = await fetch(uri);
        var blob = await response.blob();

        var ref = firebase
            .storage()
            .ref()
            .child("user_profiles/" + imageName);

        return ref.put(blob).then((response) => {
            this.fetchImage(imageName);
        });
    };

    fetchImage = (imageName) => {
        var storageRef = firebase
            .storage()
            .ref()
            .child("user_profiles/" + imageName);

        // Get the download URL
        storageRef
            .getDownloadURL()
            .then((url) => {
                console.log("url: ", url);
                this.setState({ image: url });
            })
            .catch((error) => {
                this.setState({ image: "#" });
            });
    };

    getUserProfile() {
        db.collection("Users")
            .where("emailId", "==", this.state.userId)
            .onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.data())
                    this.setState({
                        name: doc.data().firstname + " " + doc.data().surname,
                        docId: doc.id,
                        image: doc.data().image,
                        // image: this.state.image
                    });

                });
            });
    }

    componentDidMount() {
        console.log('in componentDidMount')
        this.fetchImage(this.state.userId);
        this.getUserProfile();
    }


    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{
                    flex: 0.5,
                    alignItems: 'center',
                    background: "orange"
                }}
                >
                    <Avatar
                        rounded
                        source={{
                            uri: this.state.image,
                        }}
                        size="xlarge"
                        onPress={() => this.selectPicture()}
                        containerStyle={styles.imageContainer}
                        showEditButton
                    />
                    <Text style={{ fontWeight: "100", fontSize: 20, padding: 10 }}>
                        {this.state.name}
                    </Text>
                </View>
                <View style={styles.drawerItemContainer}>
                    <DrawerItems
                        {...this.props} />
                </View>
                <View style={{ flex: 0.1 }}>
                    <TouchableOpacity
                        style={{
                            flexDirection: "row",
                            width: "100%",
                            height: "100%",
                        }}
                        onPress={() => {
                            this.props.navigation.navigate("WelcomeScreen");
                            firebase.auth().signOut();
                        }}>
                        <Icon
                            name="logout"
                            type="antdesign"
                            size={RFValue(20)}
                            iconStyle={{ paddingLeft: RFValue(10) }}
                        />
                        <Text
                            style={{
                                fontSize: RFValue(15),
                                fontWeight: "bold",
                                marginLeft: RFValue(30),
                            }}
                        >
                        Log Out
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    drawerItemsContainer: {
        flex: 0.8,
    },
    logOutContainer: {
        flex: 0.2,
        justifyContent: "flex-end",
        paddingBottom: 30,
    },
    logOutButton: {
        height: 30,
        width: "100%",
        justifyContent: "center",
        padding: 10,
    },
    imageContainer: {
        flex: 0.75,
        width: "40%",
        height: "20%",
        marginLeft: 20,
        marginTop: 30,
        borderRadius: 40,
    },
    logoutText: {
        fontSize: RFValue(15),
        fontWeight: "bold",
        marginLeft: RFValue(30)
    },
});