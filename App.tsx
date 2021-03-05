import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Storage } from "./storage";

interface appstate {
  level1: String;
  level2: String;
  level3: String;
  level1Options: [];
  level2Options: [];
  level3Options: [];
  nmwCode: String;
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
      nmwCode: "",
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
    const styling = {
      inputAndroid: { color: "black" },
      inputIOS: { color: "black" },
    };
    return (
      <View style={styles.container}>
        <RNPickerSelect
          placeholder={{ value: "", label: "Select an item..." }}
          onValueChange={(value) => {
            this.setState({ level1: value });
            if (value != "") {
              this.setState({ nmwCode: value });
            }
            this.storage.lookupCodesByDepth(2, value, (values) =>
              this.populateLevel(
                (data) => this.setState({ level2Options: data }),
                values
              )
            );
          }}
          items={this.state.level1Options}
          style={styling}
        />

        <RNPickerSelect
          placeholder={{ value: "", label: "Select an item..." }}
          onValueChange={(value) => {
            this.setState({ level2: value });
            if (value != "") {
              this.setState({ nmwCode: value });
            } else {
              this.setState({ nmwCode: this.state.level1 });
            }
            this.storage.lookupCodesByDepth(3, value, (values) =>
              this.populateLevel(
                (data) => this.setState({ level3Options: data }),
                values
              )
            );
          }}
          items={this.state.level2Options}
          disabled={this.state.level1 == ""}
          style={styling}
        />

        <RNPickerSelect
          placeholder={{ value: "", label: "Select an item..." }}
          onValueChange={(value) => {
            this.setState({ level3: value });
            if (value != "") {
              this.setState({ nmwCode: value });
            } else if (this.state.level2 != "") {
              this.setState({ nmwCode: this.state.level2 });
            }
          }}
          items={this.state.level3Options}
          disabled={this.state.level1 == "" || this.state.level2 == ""}
          style={styling}
        />
        <Text>NMW code:</Text>
        <Text
          selectable={true}
          style={{
            fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
            fontSize: 25,
            backgroundColor: "#e8e8e8",
          }}
        >
          {this.state.nmwCode == "" ? "-" : "nmw:" + this.state.nmwCode}
        </Text>
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
