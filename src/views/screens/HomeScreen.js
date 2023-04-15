import React, {useEffect} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import * as SQLite from 'expo-sqlite'
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import XLSX from 'xlsx'
const db = SQLite.openDatabase('attendance_database.db');
// once per connection
db.exec(
  [{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], 
  false, 
  () =>   console.log('Foreign keys turned on') 
);
const HomeScreen = ({navigation}) => {

    useEffect(() => {
        
        db.transaction(tx => {
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS students (LRN TEXT PRIMARY KEY, FirstName TEXT, MiddleName TEXT, LastName TEXT, BirthDate DATE, Address TEXT, ContactNumber TEXT, Sex TEXT, Section TEXT)',
            [],
            () => {console.log('table created')},
            error => {console.log(error)}
          );
        });
    
        db.transaction(tx => {
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS attendance (id INTEGER PRIMARY KEY AUTOINCREMENT, LRN TEXT, ClassDate DATE, TimeIn TIME, TimeOut TIME, FOREIGN KEY(LRN) REFERENCES students(LRN))',
            [],
            () => {console.log('table created')},
            error => {console.log(error)}
          );
        });
    
        
    }, []);

    {/* export db */}
    const exportDatabase = async () => {
        db.transaction(tx => {
            tx.executeSql(
              'SELECT * FROM attendance LEFT JOIN students ON attendance.LRN = students.LRN',
              [],
              (tx, results) => {
                
                const rows = results.rows._array;
                console.log(rows);
                // Convert data to Excel format
                const header = ['LRN','First Name','Middle Name','Last Name', 'BirthDate', 'Address', 'ContactNumber', 'Sex', 'Section', 'ClassDate', 'TimeIn','TimeOut'];
                const data = rows.map((row) => [row.LRN, row.FirstName, row.MiddleName, row.LastName, row.BirthDate, row.Address, row.ContactNumber, row.Sex, row.Section, row.ClassDate, row.TimeIn, row.TimeOut]);
                
                const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
                const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
                // Save Excel file to device's document storage
                const fileName = 'mydata.xlsx';
                const path = `${FileSystem.documentDirectory}/${fileName}`;

                FileSystem.writeAsStringAsync(path, wbout , {
                    encoding: FileSystem.EncodingType.Base64
                  })
                .then(() => {console.log('File saved successfully at ' + path); Sharing.shareAsync(path);})
                .catch((error) => console.log(`Error saving file: ${error}`));
                
                
                
              },
              error => {console.log(error)}
            );
        });
        /*console.log('file::///storage/emulated/0/attendance_app_database/');
        const dest = `file::///storage/emulated/0/Documents/tests_db.db`
        await FileSystem.copyAsync({
        from: `${FileSystem.documentDirectory}SQLite/mydatabase.db`,
        to: dest
        }).then(() => {
        console.log(`Exported database to: ${dest}`);
        })
        .catch(error => {
        console.error(error);
        });*/
    
        
    };
    {/* end of exporting db */}
    return (
        <View>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Attendance')}>
                <Text>Attendance</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('StudentRegistration')}>
                <Text>Add Student</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={exportDatabase}>
                <Text>Export Database</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    
    button: {
      alignItems: 'center',
      backgroundColor: '#DDDDDD',
      padding: 10,
    },
  });
export default HomeScreen;