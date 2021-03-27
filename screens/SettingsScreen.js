import React, { Component } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import MyHeader from '../components/MyHeader'
import db from '../config'
import firebase from 'firebase';
import { RFValue } from 'react-native-responsive-fontsize';


export default class SettingScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      emailId: '',
      firstName: '',
      lastName: '',
      address: '',
      contact: '',
      docId: ''
    }
  }
  getUserDetails = () => {
    var email = firebase.auth().currentUser.email;
    db.collection("Users").where('emailId', '==', email).get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          var data = doc.data()
          this.setState({
            emailId: data.emailId,
            firstName: data.firstname,
            lastName: data.surname,
            address: data.address,
            contact: data.contact,
            docId: doc.id
          })
        });
      })
  }
  componentDidMount() {
    this.getUserDetails()
  }
  updateUserDetails = () => {
    db.collection("Users").doc(this.state.docId)
      .update({
        "firstname": this.state.firstName,
        "surname": this.state.lastName,
        "address": this.state.address,
        "contact": this.state.contact,
      })

    alert("Profile Updated Successfully")

  }

  render() {
    return (
      
      <View style={styles.container} behavior="height" enabled >
        <MyHeader title="Settings" navigation={this.props.navigation} />
        <View style={styles.formContainer}>
        <Text style={styles.label}>First Name </Text>
          <TextInput
            style={styles.formTextInput}
            placeholder={"First Name"}
            maxLength={12}
            onChangeText={(text) => {
              this.setState({
                firstName: text
              })
            }}
            value={this.state.firstName}
          />
          <Text style={styles.label}>Last Name </Text>
          <TextInput
            style={styles.formTextInput}
            placeholder={"Last Name"}
            maxLength={12}
            onChangeText={(text) => {
              this.setState({
                lastName: text
              })
            }}
            value={this.state.lastName}
          />
          <Text style={styles.label}>Contact </Text>
          <TextInput
            style={styles.formTextInput}
            placeholder={"Contact"}
            maxLength={10}
            keyboardType={'numeric'}
            onChangeText={(text) => {
              this.setState({
                contact: text
              })
            }}
            value={this.state.contact}
          />
          <Text style={styles.label}>Address </Text>
          <TextInput
            style={styles.formTextInput}
            placeholder={"Address"}
            multiline={true}
            onChangeText={(text) => {
              this.setState({
                address: text
              })
            }}
            value={this.state.address}
          />
          <View style={styles.buttonView}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.updateUserDetails();
              }}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#6fc0b8"
  },
  formContainer: {
    flex: 0.88,
    justifyContent: 'center'
  },
  formTextInput: {
    width: RFValue(200),
    height: RFValue(50),
    padding: RFValue(10),
    borderWidth: 1,
    borderRadius: 2,
    borderColor: "black",
    marginBottom: RFValue(20),
    marginLeft: RFValue(20),
    justifyContent:'center'
  },
  button: {
    width: "75%",
    height: RFValue(60),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(50),
    backgroundColor: "#32867d",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: RFValue(20),
  },
  buttonView: {
    flex: 0.22,
    alignItems: "center",
    marginTop: RFValue(10)
  },
  buttonText: {
    fontSize: RFValue(23),
    fontWeight: "bold",
    color: "#fff",
  },
  label: {
    fontSize: RFValue(18),
    color: "black",
    fontWeight: 'bold',
    padding: RFValue(10),
    marginLeft: RFValue(20)
  },
})