import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CalculatorScreen() {
  const [display, setDisplay] = useState("0");
  const [previous, setPrevious] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForNumber, setWaitingForNumber] = useState(false);

  function inputNumber(number: string) {
    if (waitingForNumber) {
      setDisplay(number);
      setWaitingForNumber(false);
      return;
    }

    if (display === "0") {
      setDisplay(number);
    } else {
      setDisplay(display + number);
    }
  }

  function inputDecimal() {
    if (waitingForNumber) {
      setDisplay("0.");
      setWaitingForNumber(false);
      return;
    }

    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  }

  function clearCalculator() {
    setDisplay("0");
    setPrevious(null);
    setOperator(null);
    setWaitingForNumber(false);
  }

  function chooseOperator(nextOperator: string) {
    const currentValue = Number(display);

    if (previous !== null && operator && !waitingForNumber) {
      const result = calculate(previous, currentValue, operator);

      setDisplay(String(result));
      setPrevious(result);
    } else {
      setPrevious(currentValue);
    }

    setOperator(nextOperator);
    setWaitingForNumber(true);
  }

  function calculate(
    first: number,
    second: number,
    selectedOperator: string
  ) {
    switch (selectedOperator) {
      case "+":
        return first + second;

      case "-":
        return first - second;

      case "×":
        return first * second;

      case "÷":
        return second === 0 ? 0 : first / second;

      default:
        return second;
    }
  }

  function equals() {
    if (previous === null || operator === null) {
      return;
    }

    const currentValue = Number(display);
    const result = calculate(previous, currentValue, operator);

    setDisplay(String(result));
    setPrevious(null);
    setOperator(null);
    setWaitingForNumber(true);
  }

  function percent() {
    const value = Number(display);
    setDisplay(String(value / 100));
  }

  function toggleSign() {
    const value = Number(display);

    if (value === 0) return;

    setDisplay(String(value * -1));
  }

  const buttons = [
    ["C", "±", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ];

  function renderButton(value: string) {
    const isOperator =
      value === "+" ||
      value === "-" ||
      value === "×" ||
      value === "÷";

    const isAction =
      value === "C" ||
      value === "±" ||
      value === "%";

    const isEquals = value === "=";

    return (
      <TouchableOpacity
        key={value}
        activeOpacity={0.7}
        style={[
          styles.button,
          isOperator && styles.operatorButton,
          isAction && styles.actionButton,
          isEquals && styles.equalsButton,
          value === "0" && styles.zeroButton,
        ]}
        onPress={() => {
          if (value >= "0" && value <= "9") {
            inputNumber(value);
          } else if (value === ".") {
            inputDecimal();
          } else if (value === "C") {
            clearCalculator();
          } else if (value === "±") {
            toggleSign();
          } else if (value === "%") {
            percent();
          } else if (value === "=") {
            equals();
          } else {
            chooseOperator(value);
          }
        }}
      >
        <Text
          style={[
            styles.buttonText,
            (isOperator || isEquals) && styles.operatorText,
          ]}
        >
          {value}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>🧮 Calculator</Text>

      <Text style={styles.subtitle}>
        Quick calculations for your studies
      </Text>

      <View style={styles.calculator}>
        <View style={styles.displayBox}>
          <Text
            style={styles.display}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {display}
          </Text>
        </View>

        <View style={styles.buttonGrid}>
          {buttons.flat().map(renderButton)}
        </View>
      </View>

      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>💡 Study Tip</Text>

        <Text style={styles.tipText}>
          Use the calculator to check your answers while
          studying mathematics, physics, chemistry, and other
          subjects.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    color: "#38BDF8",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },

  subtitle: {
    color: "#94A3B8",
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 25,
  },

  calculator: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    backgroundColor: "#111827",
    borderRadius: 24,
    padding: 15,
  },

  displayBox: {
    backgroundColor: "#020617",
    borderRadius: 18,
    minHeight: 110,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 20,
    marginBottom: 15,
  },

  display: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
  },

  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  button: {
    width: "23%",
    aspectRatio: 1,
    backgroundColor: "#1E293B",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  zeroButton: {
    width: "48%",
    aspectRatio: 2.08,
  },

  buttonText: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
  },

  operatorButton: {
    backgroundColor: "#2563EB",
  },

  equalsButton: {
    backgroundColor: "#0EA5E9",
    width: "23%",
  },

  actionButton: {
    backgroundColor: "#334155",
  },

  operatorText: {
    color: "white",
  },

  tipCard: {
    backgroundColor: "#172554",
    borderRadius: 18,
    padding: 20,
    marginTop: 25,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },

  tipTitle: {
    color: "#38BDF8",
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 8,
  },

  tipText: {
    color: "#CBD5E1",
    fontSize: 15,
    lineHeight: 23,
  },
});