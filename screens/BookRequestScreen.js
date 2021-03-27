import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  FlatList
} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import { BookSearch } from 'react-native-google-books';
import { RFValue } from 'react-native-responsive-fontsize';
import {Input, Icon} from 'react-native-elements';

export default class BookRequestScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      bookName: "",
      reasonToRequest: "",
      requestedBookName: "",
      isBookRequestActive: "",
      bookStatus: "",
      requestId: "",
      userdocId: '',
      docId: '',
      dataSource: "",
      showFlatlist: false
    }
  }

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  addRequest = async (bookName, reasonToRequest) => {
    var userId = this.state.userId;
    var randomRequestId = this.createUniqueId();
    var books = await BookSearch.searchbook(bookName, 'AIzaSyCO4pIsVWOX8PzJY1mjctZ557RHS-2I120');
    db.collection('RequestedBooks').add({
      "userId": userId,
      "bookName": bookName,
      "reasonToRequest": reasonToRequest,
      "bookStatus": "requested",
      "requestId": randomRequestId,
      "date": firebase.firestore.FieldValue.serverTimestamp(),
      "image_link": books.data[0].volumeInfo.imageLinks.smallThumbnail
    })
    this.getBookRequest()
    db.collection('Users').where("emailId", "==", userId).get()
      .then()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection('Users').doc(doc.id).update({
            isBookRequestActive: true
          })
        })
      })
    this.setState({
      bookName: '',
      reasonToRequest: '',
      requestId: randomRequestId
    })

    return Alert.alert("Book Requested Successfully");
  }
  getBookRequest = () => {
    var bookRequest = db.collection('RequestedBooks')
      .where('userId', '==', this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().bookStatus !== "received") {
            this.setState({
              requestId: doc.data().requestId,
              requestedBookName: doc.data().bookName,
              bookStatus: doc.data().bookStatus,
              docId: doc.id
            })
          }
        })
      })
  }
  getBookRequestActive() {
    db.collection('Users')
      .where('emailId', '==', this.state.userId)
      .onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.setState({
            isBookRequestActive: doc.data().isBookRequestActive,
            userDocId: doc.id
          })
        })
      })
  }
  sendNotification = () => {
    //to get the first name and last name
    db.collection('Users').where('emailId', '==', this.state.userId).get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().first_name
          var lastName = doc.data().last_name

          // to get the donor id and book nam
          db.collection('AllNotifications').where('requestId', '==', this.state.requestId).get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var donorId = doc.data().donorId
                var bookName = doc.data().bookName

                //targert user id is the donor id to send notification to the user
                db.collection('AllNotifications').add({
                  "targetedUserId": donorId,
                  "message": firstName + " " + surName + " received the book " + bookName,
                  "notificationStatus": "unread",
                  "bookName": bookName
                })
              })
            })
        })
      })
  }
  updateBookRequestStatus = () => {
    //updating the book status after receiving the book
    db.collection('RequestedBooks').doc(this.state.docId)
      .update({
        bookStatus: 'received'
      })

    //getting the  doc id to update the users doc
    db.collection('Users').where('emailId', '==', this.state.userId).get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          //updating the doc
          db.collection('Users').doc(doc.id).update({
            isBookRequestActive: false
          })
        })
      })
  }
  async getBooksFromApi(bookName) {
    this.setState({ bookName: bookName })
    if (bookName.length > 2) {
      var books = await BookSearch.searchbook(bookName, 'AIzaSyCO4pIsVWOX8PzJY1mjctZ557RHS-2I120')
      this.setState({
        dataSource: books.data,
        showFlatlist: true
      })
      console.log('this.state 149: ', this.state)
    }
  }
  receivedBooks = (bookName) => {
    var userId = this.state.userId
    var requestId = this.state.requestId
    db.collection('ReceivedBooks').add({
      "userId": userId,
      "bookName": bookName,
      "requestId": requestId,
      "bookStatus": "received",

    })
  }
  //render Items  functionto render the books from api
  renderItem = ({ item, i }) => {
    let obj = {
      title: item.volumeInfo.title,
      selfLink: item.selfLink,
      buyLink: item.saleInfo.buyLink,
      imageLink: item.volumeInfo.imageLinks
    }
    return (
      <TouchableHighlight
        style={{
          alignItems: "center",
          backgroundColor: "#ADD8E6",
          padding: 10,
          width: '90%',
          borderWidth: 1,
          borderRadius: 10
        }}
        activeOpacity={0.6}
        underlayColor="#00008B"
        onPress={() => {
          this.setState({
            showFlatlist: false,
            bookName: item.volumeInfo.title,
          })
        }
        }
        bottomDivider>
        <Text> {item.volumeInfo.title} </Text>
      </TouchableHighlight>
    )
  }
  componentDidMount() {
    this.getBookRequest()
    this.getBookRequestActive()
    // var book =BookSearch.searchbook("rich ",'AIzaSyCO4pIsVWOX8PzJY1mjctZ557RHS-2I120')
  }
  //
  render() {
    if (this.state.isBookRequestActive === true) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={{ borderColor: "orange", borderWidth: 2, justifyContent: 'center', alignItems: 'center', padding: 10, margin: 10 }}>
            <Text>Book Name</Text>
            <Text>{this.state.requestedBookName}</Text>
          </View>
          <View style={{ borderColor: "orange", borderWidth: 2, justifyContent: 'center', alignItems: 'center', padding: 10, margin: 10 }}>
            <Text>Book Status</Text>
            <Text>{this.state.bookStatus}</Text>
          </View>
          <TouchableOpacity style={{ borderWidth: 1, borderColor: 'orange', backgroundColor: "orange", width: 300, alignSelf: 'center', alignItems: 'center', height: 30, marginTop: 30 }}
            onPress={() => {
              this.sendNotification();
              this.updateBookRequestStatus();
              this.receivedBooks(this.state.requestedBookName)
            }}>
            <Text>I received the book </Text>
          </TouchableOpacity>
        </View>
      )
    }
    else {
      return (
        // Form screen
        <View style={{ flex: 1 }}>
          <MyHeader title="Request Book" navigation={this.props.navigation} />

          <View>
            <TextInput
              style={styles.formTextInput}
              label={"Book Name"}
              placeholder={"enter book name"}
              containerStyle={{marginTop:RFValue(60)}}
              onChangeText={text => this.getBooksFromApi(text)}
              onClear={text => this.getBooksFromApi('')}
              value={this.state.bookName}
            />

            {this.state.showFlatlist ?
              (<FlatList
                data={this.state.dataSource}
                renderItem={this.renderItem}
                enableEmptySections={true}
                style={{ marginTop: 10, marginLeft: 20 }}
                keyExtractor={(item, index) => index.toString()}
              />)
              : (
                <View style={{ alignItems: 'center' }}>
                  <TextInput
                    style={[styles.formTextInput, { height: 300 }]}
                    containerStyle={{marginTop:RFValue(30)}}
                    multiline
                    numberOfLines={8}
                    label={"Reason"}
                    placeholder={"Why do you need the book"}
                    onChangeText={(text) => {
                      this.setState({
                        reasonToRequest: text
                      })
                    }}
                    value={this.state.reasonToRequest}
                  />
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      this.addRequest(this.state.bookName, this.state.reasonToRequest);
                    }}
                  >
                    <Text>Request</Text>
                  </TouchableOpacity>
                </View>
              )
            }
          </View>
        </View>
      )
    }
  }
}


const styles = StyleSheet.create({
  keyBoardStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  formTextInput: {
    width: "75%",
    height: 35,
    alignSelf: 'center',
    borderColor: '#ffab91',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  button: {
    width: "75%",
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: 20
  },
}
)