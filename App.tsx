import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { StyleSheet, Text, View, State } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Storage } from "./storage";

interface appstate {
  level1: String;
  level2: String;
  level3: String;
  level1Options: [];
  level2Options: [];
  level3Options: [];
}

class App extends React.Component<{}, appstate> {
  storage: Storage;

  constructor(props = {}) {
    super(props);
    this.storage = new Storage();
    this.storage.clearStorage();
    this.storage.createTable();

    this.state = {
      level1: "",
      level2: "",
      level3: "",
      level1Options: [],
      level2Options: [],
      level3Options: [],
    };

    this.storage.lookupCodesByDepth(1, "0-0-0", (values) =>
      this.populateLevel(
        (data) => this.setState({ level1Options: data }),
        values
      )
    );
  }

  populateLevel(setLevelxOptions: Function, values) {
    let results = [];
    for (let i in values._array) {
      let result = values.item(i);
      results.push({ value: result.id, label: result.description });
    }
    setLevelxOptions(results);
  }

  render() {
    let text: String = "";
    if (this.state.level3 != "") {
      text = this.state.level3;
    } else if (this.state.level2 != "") {
      text = this.state.level2;
    } else if (this.state.level1 != "") {
      text = this.state.level1;
    }
    return (
      <View style={styles.container}>
        <RNPickerSelect
          placeholder={{ value: "", label: "Select an item..." }}
          onValueChange={(value) => {
            this.setState({ level1: value });
            this.storage.lookupCodesByDepth(2, value, (values) =>
              this.populateLevel(
                (data) => this.setState({ level2Options: data }),
                values
              )
            );
          }}
          items={this.state.level1Options}
        />
        <RNPickerSelect
          onValueChange={(value) => {
            this.setState({ level2: value });
            this.storage.lookupCodesByDepth(3, value, (values) =>
              this.populateLevel(
                (data) => this.setState({ level3Options: data }),
                values
              )
            );
          }}
          items={this.state.level2Options}
          disabled={this.state.level1 == ""}
        />
        <RNPickerSelect
          onValueChange={(value) => {
            this.setState({ level3: value });
          }}
          items={this.state.level3Options}
          disabled={this.state.level2 == ""}
        />
        <Text>NMW code:{this.state.level3}</Text>
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
