import React, {useState} from "react";
import {SafeAreaView, ScrollView, Button, Keyboard, Platform, Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import * as SQLite from 'expo-sqlite';
import DateTimePicker from '@react-native-community/datetimepicker';

const db = SQLite.openDatabase('attendance_database.db');
// once per connection
db.exec(
    [{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], 
    false, 
    () =>   console.log('Foreign keys turned on') 
  );
const StudentRegistration = ({navigation}) => {

    const [state, setState] = useState({
        LRN: '',
        FirstName: '',
        MiddleName: '',
        LastName: '',
        BirthDate: '11-25-2000',
        Address: '',
        ContactNumber: '',
        Sex: '',
        Section: '',
    }); 
    const onChangeInputHandler = (name, value) => {
        setState(prevState => ({ ...prevState, [name]: value }));
    }

    //datetimepicker
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const toggleDatepicker = () => {
        setShowPicker(!showPicker);
    }
    const pickerOnChange = ({type}, selectedDate) => {
        if(type == "set"){
            const currentDate = selectedDate;
            setDate(currentDate);

            if(Platform.OS === "android"){
                toggleDatepicker();
                //setdateofbirth currentDate.toDateString()
                setState(prevState => ({ ...prevState, ['BirthDate']: currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }));
            }
        }else{
            toggleDatepicker();
        }
    }
    
    const submitPressed = () => {
        db.transaction(tx => {
          tx.executeSql(
            'INSERT INTO students (LRN, FirstName, MiddleName, LastName, BirthDate, Address, ContactNumber, Sex, Section) VALUES (?,?,?,?,?,?,?,?,?)',
            [state.LRN, state.FirstName, state.MiddleName, state.LastName, state.BirthDate, state.Address, state.ContactNumber, state.Sex, state.Section],
            () => {
                alert(state.FirstName + ' data inserted'); 
                setState({
                    LRN: '',
                    FirstName: '',
                    MiddleName: '',
                    LastName: '',
                    BirthDate: '11-25-2000',
                    Address: '',
                    ContactNumber: '',
                    Sex: '',
                    Section: '',
                
                    });
                },
            (tx, error) => {alert('Failed inserting data. Message: ' + error.message)}
          );
          
        })
        Keyboard.dismiss();
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.container}>

                    <Text style={styles.header}>Registration</Text>
                    <View style={styles.inputTextWrapper}>
                        <TextInput
                            placeholder="LRN"
                            style={styles.textInput}
                            value={state.LRN}
                            onChangeText={value => onChangeInputHandler('LRN',value)}
                            
                        />
                        
                    </View>


                    <View style={styles.inputTextWrapper}>
                        <TextInput
                            placeholder="First Name"
                            style={styles.textInput}
                            value={state.FirstName}
                            onChangeText={value => onChangeInputHandler('FirstName',value)}
                            
                        />
                        
                    </View>

                    <View style={styles.inputTextWrapper}>
                        <TextInput
                            placeholder="Middle Name"
                            style={styles.textInput}
                            value={state.MiddleName}
                            onChangeText={value => onChangeInputHandler('MiddleName',value)}
                            
                        />
                        
                    </View>

                    <View style={styles.inputTextWrapper}>
                        <TextInput
                            placeholder="Last Name"
                            style={styles.textInput}
                            value={state.LastName}
                            onChangeText={value => onChangeInputHandler('LastName',value)}
                            
                        />
                        
                    </View>

                    <View style={styles.inputTextWrapper}>
                        {showPicker && (
                            <DateTimePicker
                                mode="date"
                                display="spinner"
                                value={date}
                                onChange={pickerOnChange}
                            />
                        )}
                        <Pressable onPress={toggleDatepicker}>
                            <TextInput
                                placeholder="Birth Date"
                                style={styles.textInput}
                                value={state.BirthDate}
                                onChangeText={value=> onChangeInputHandler('BirthDate',value)}
                                editable={false}
                            />
                        </Pressable>
                        
                        
                    </View>

                    <View style={styles.inputTextWrapper}>
                        <TextInput
                            placeholder="Address"
                            style={styles.textInput}
                            value={state.Address}
                            onChangeText={value=> onChangeInputHandler('Address',value)}
                           
                        />
                        
                    </View>

                    <View style={styles.inputTextWrapper}>
                        <TextInput
                            placeholder="Contact Number"
                            style={styles.textInput}
                            value={state.ContactNumber}
                            onChangeText={value => onChangeInputHandler('ContactNumber',value)}
                            
                        />
                        
                    </View>

                    <View style={styles.inputTextWrapper}>
                        <TextInput
                            placeholder="Sex"
                            style={styles.textInput}
                            value={state.Sex}
                            onChangeText={value => onChangeInputHandler('Sex',value)}
                            
                        />
                        
                    </View>

                    <View style={styles.inputTextWrapper}>
                        <TextInput
                            placeholder="Section"
                            style={styles.textInput}
                            value={state.Section}
                            onChangeText={value => onChangeInputHandler('Section',value)}
                            
                        />
                        
                    </View>



                    <View style={styles.btnContainer}>
                    <Button title="Submit" onPress={submitPressed} />
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>

    );

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      paddingBottom: 100,
    },
    header: {
      fontSize: 36,
      padding: 24,
      margin: 12,
      textAlign: "center",
    },
    inputTextWrapper: {
      marginBottom: 24,
    },
    textInput: {
      height: 40,
      borderColor: "#000000",
      borderBottomWidth: 1,
      paddingRight: 30,
    },
    errorText: {
      color: 'red',
      fontSize: 10,
    },
    btnContainer: {
      backgroundColor: "white",
      marginTop:36,
    }
});

export default StudentRegistration;