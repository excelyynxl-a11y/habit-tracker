import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>("");
  const theme = useTheme();
  const router = useRouter();
  const { signIn, signUp } = useAuth(); // go see signIn() and signUp() in lib/auth-context

  const handleAuth = async () => {
    if (!email || !password) {
      console.log("auth.tsx > handleAuth(): Please fill in all field.");
      setError("Please fill in all field.");
      return;
    }

    if (password.length < 6) {
      console.log("auth.tsx > handleAuth(): Password must be at least 6 characters long.");
      setError("Password must be at least 6 characters long.");
      return;
    }

    // set error to null before we start authentication
    setError(null);

    if (isSignUp) {
      const error = await signUp(email, password);
      if (error) {
        console.log("auth.tsx > handleAuth() during signUp(): ", error);
        setError(error);
        return;
      }
    } else {
      const error = await signIn(email, password);
      if (error) {
        console.log("auth.tsx > handleAuth() during signIn(): ", error);
        setError(error);
        return;
      }

      router.replace("/");
    }
  };

  const handleSwitchMode = () => {
    setIsSignUp((prev) => !prev);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title} variant="headlineMedium">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </Text>
        <TextInput
          label="Email"
          autoCapitalize="none"
          placeholder="example@gmail.com"
          mode="outlined"
          style={styles.input}
          onChangeText={setEmail}
        />

        <TextInput
          label="Password"
          autoCapitalize="none"
          placeholder="your password"
          mode="outlined"
          secureTextEntry
          style={styles.input}
          onChangeText={setPassword}
        />

        {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}

        <Button mode="contained" style={styles.button} onPress={handleAuth}>
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>

        <Button
          mode="text"
          onPress={handleSwitchMode}
          style={styles.switchModeButton}
        >
          {isSignUp
            ? "Already have ann account? Sign In."
            : "Don't have an account? Sign Up."}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  switchModeButton: {
    marginTop: 16,
  },
});
