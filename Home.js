import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from "react-native";
import Task from "./components/Task";

export default function Home({ navigation }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputText, setInputText] = useState("");
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]); // Store completed tasks

  const backgroundColorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(backgroundColorAnim, {
      toValue: isDarkMode ? 1 : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const backgroundColor = backgroundColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#d9d9d9", "#000000"],
  });

  const textColor = backgroundColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#000000", "#ffffff"],
  });

  const addTask = () => {
    if (inputText.trim()) {
      setTasks([...tasks, inputText.trim()]);
      setInputText(""); // Clear input after adding task
    }
  };

  const handleTaskComplete = (index) => {
    const completedTask = tasks[index];
    setCompletedTasks([...completedTasks, completedTask]);
    setTasks(tasks.filter((_, taskIndex) => taskIndex !== index));
  };

  const handleDeleteTask = (index) => {
    setTasks(tasks.filter((_, taskIndex) => taskIndex !== index));
  };

  const handleUpdateTask = (index, updatedTaskText) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = updatedTaskText;
    setTasks(updatedTasks);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.keycontainer, { backgroundColor: "#000000" }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Animated.View style={[styles.container, { backgroundColor }]}>
        <View style={styles.headerContainer}>
          <Animated.Text style={[styles.titleFont, { color: textColor }]}>
            To do List
          </Animated.Text>

          <TouchableOpacity
            onPress={toggleDarkMode}
            style={styles.toggleContainer}
          >
            <Animated.Image
              source={
                isDarkMode
                  ? require("./assets/darkmode.png")
                  : require("./assets/lightmode.png")
              }
              style={styles.toggleImage}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.tasksWrapper}>
          <Animated.Text style={[styles.sectionTitle, { color: textColor }]}>
            📋 My Tasks
          </Animated.Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.taskitems}>
            {tasks.map((task, index) => (
              <Task
                key={index}
                taskText={task}
                isDarkMode={isDarkMode}
                onDelete={() => handleDeleteTask(index)}
                onUpdate={(updatedText) => handleUpdateTask(index, updatedText)} // Add an update handler
              />
            ))}
          </View>
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: isDarkMode ? "#303030" : "#FFFFFF",
                borderColor: isDarkMode ? "#303030" : "#FFFFFF",
                color: isDarkMode ? "#FFFFFF" : "#000000",
              },
            ]}
            placeholder="Write Something..."
            placeholderTextColor={isDarkMode ? "#b0b0b0" : "#898888"}
            value={inputText}
            onChangeText={setInputText}
            keyboardAppearance={isDarkMode ? "dark" : "light"}
          />

          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between", // Space between header and input field
    backgroundColor: "#d9d9d9", // Default background color (if needed)
  },
  keycontainer: {
    flex: 1,
    justifyContent: "space-between", // Space between header and input field
    backgroundColor: "#d9d9d9",
    paddingBottom: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 70,
    width: "100%",
    paddingHorizontal: 45,
  },
  titleFont: {
    fontSize: 38,
    fontWeight: "900",
    flex: 1,
  },
  toggleContainer: {
    marginLeft: 20,
  },
  toggleImage: {
    width: 45,
    height: 45,
    borderRadius: 60,
  },
  tasksWrapper: {
    marginTop: 20,
    width: "100%",
    paddingHorizontal: 45,
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: "800",
    textAlign: "left",
    flex: 1,
  },
  doneButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  doneTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  doneText: {
    fontSize: 23,
    fontWeight: "700",
    marginLeft: 5, // Space between emoji and text
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 42,
    paddingTop: 20,
    paddingBottom: 20,
  },
  textInput: {
    flex: 1, // Make it take up available space
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 30,
    padding: 25,
    color: "#000000",
    fontSize: 20,
  },
  addButton: {
    marginLeft: 10, // Space between text input and button
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#3770A4",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 50,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  popupContainer: {
    position: "absolute",
    bottom: 30, // Position the popup near the bottom of the screen
    left: 0,
    right: 0,
    alignItems: "center",
  },
  popupText: {
    backgroundColor: "#61acf1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
