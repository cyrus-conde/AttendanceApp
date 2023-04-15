import { StyleSheet, Text, View, Button, TouchableOpacity, BackHandler } from 'react-native';
import React, { useEffect, useState } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('attendance_database.db');
// once per connection
db.exec(
  [{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], 
  false, 
  () =>   console.log('Foreign keys turned on') 
);
const Attendance = ({navigation}) => {
  const [hasPermission, setHasPermission] = React.useState(false);
  const [scanData, setScanData] = React.useState();
  const [method, setMethod] = useState('Time In');
  

  const [stateExist, setStateExist] = useState({
    LRNexist: 0,
    studentExist: 0,
  }); 
  const { LRNExist, studentExist } = stateExist
  useEffect(() => {
    (async() => {
      const {status} = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Please grant camera permissions to app.</Text>
      </View>
    );
  }
  const handleMethod = (newMethod) => {
    setMethod(newMethod);
    
  }
  
  const handleBarCodeScanned = async ({type, data}) => {
    setScanData(data);
    const res = JSON.parse(data);
    /* check if in student list */
    
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM students WHERE LRN = ?',
        [res.LRN],
        (tx, result) => {
          if(result.rows.length > 0){
            // LRN exists in the students table, check if it's already timed in for today
            db.transaction(tx => {
              tx.executeSql(
                'SELECT * FROM attendance WHERE LRN = ? AND ClassDate = ?',
                [res.LRN, new Date().toLocaleDateString()],
                (tx, result) => {
                  if(method == "Time In"){
                    //Time In
                    if(result.rows.length > 0){
                      // LRN has already timed in for today, show error message
                      alert('Student has already timed in for today');
                    }else{
                      // LRN has not yet timed in for today, insert time in record
                      db.transaction(tx => {
                        tx.executeSql(
                          'INSERT INTO attendance (LRN, ClassDate, TimeIn) VALUES (?,?,?)',
                          [res.LRN, new Date().toLocaleDateString(), new Date().toLocaleTimeString()],
                          () => {alert('Time IN Inserted')},
                          (tx, error) => {alert('Not in student list')}
                        );
                        
                      })
                    }
                  }else{
                    //Time Out
                    db.transaction(tx => {
                      tx.executeSql(
                        'UPDATE attendance SET TimeOut = ? WHERE LRN = ? AND ClassDate = ?',
                        [new Date().toLocaleTimeString(), res.LRN, new Date().toLocaleDateString()],
                        () => {alert('Time Out Inserted')},
                        error => {alert('Failed inserting data. Message: ' + error)}
                      );
                      
                    })
                  }
                  
                }
                
              );
              
            })
          }else {
          // LRN does not exist in the students table, show error message
          alert('Data not found in student list');
        }
        }
      );
      
    })
    
    console.log(`Data: ${res.LRN}`);
    console.log(`Type: ${type}`);
  };

  

  
  return (
    <View style={styles.container}>
        
        
        
    
      <BarCodeScanner 
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={scanData ? undefined : handleBarCodeScanned}
        />
      {scanData && <Button title='Scan Again?' onPress={() => setScanData(undefined)} />}
      <View style={styles.topBar}>
            <View style={styles.col}>

            
                <View style={styles.row}>
                    <Text style={styles.topBarText}>{new Date().toLocaleTimeString()}</Text>
                    <Text style={styles.topBarText}>Method: {method}</Text>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.topBarButton} onPress={() => handleMethod('Time In')}>
                        <Text>TIME IN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.topBarButton} onPress={() => handleMethod('Time Out')}>
                        <Text>TIME OUT</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
        </View>
        
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: '#eee',
  },
  
  topBarText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  topBarButton: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    height: 50,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  col: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
});

export default Attendance;