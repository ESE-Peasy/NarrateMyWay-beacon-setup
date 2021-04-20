import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    width: "85%",
    alignSelf: "center",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
    marginBottom: 20,
    justifyContent: "space-evenly",
  },
  logo: {
    alignSelf: "center",
    height: 150,
    width: 150,
  },
  titleText: {
    fontSize: 25,
    justifyContent: "center",
    textAlign: "center",
  },
  codeContainer: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  codeTitle: {
    fontSize: 18,
    alignSelf: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  codeTextContainer: {
    elevation: 8,
    padding: 10,
    backgroundColor: "#093f74",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    borderWidth: 1,
  },
  codeText: {
    fontSize: 48,
    color: "white",
  },
});
