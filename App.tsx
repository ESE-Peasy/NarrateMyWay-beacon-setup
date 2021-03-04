import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { StyleSheet, Text, View, State } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Storage } from "./storage";

export default function App() {
  const storage = new Storage();
  storage.clearStorage();
  storage.createTable();

  const [level1, setLevel1] = React.useState();
  const [level2, setLevel2] = React.useState();
  const [level3, setLevel3] = React.useState();
  const [level1Options, setLevel1Options] = React.useState([]);
  const [level2Options, setLevel2Options] = React.useState([]);
  const [level3Options, setLevel3Options] = React.useState([]);

  function populateLevel(setLevelxOptions: Function, values) {
    let results = [];
    for (let i in values._array) {
      let result = values.item(i);
      results.push({ value: result.id, label: result.description });
    }
    setLevelxOptions(results);
  }

  storage.lookupCodesByDepth(1, "0-0-0", (values) =>
    populateLevel(setLevel1Options, values)
  );

  return (
    <View style={styles.container}>
      <RNPickerSelect
        onValueChange={(value) => {
          setLevel1(value);
          storage.lookupCodesByDepth(2, level1, (values) =>
            populateLevel(setLevel2Options, values)
          )
          console.log("changed after 1", level1, value);
        }}
        items={level1Options}
      />
      <RNPickerSelect
        onValueChange={(value) => {
          setLevel2(value);
        }}
        items={level2Options}
        disabled={level1 == null}
      />
      <Text>TEST</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
