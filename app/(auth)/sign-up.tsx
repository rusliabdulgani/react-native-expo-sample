import {
  View,
  Text,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { createUser } from "@/lib/appwrite";

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!form.username || !form.email || !form.password) {
      return Alert.alert("Error", "Please fill in all the fields!");
    }

    setIsSubmitting(true);

    try {
      const user = await createUser({
        username: form.username,
        email: form.email,
        password: form.password,
      });

      router.replace("/home");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error?.message);
      } else {
        Alert.alert("Error", "Unexpected error!");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
            Sign Up to Aora
          </Text>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            <FormField
              title="Username"
              value={form.username}
              handleChangeText={(e: any) =>
                setForm({
                  ...form,
                  username: e,
                })
              }
              otherStyles="mt-7"
              placeholder="Username"
            />
          </KeyboardAvoidingView>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e: any) =>
                setForm({
                  ...form,
                  email: e,
                })
              }
              otherStyles="mt-5"
              keyboardType="email-address"
              placeholder="Email address"
            />
          </KeyboardAvoidingView>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e: any) =>
                setForm({
                  ...form,
                  password: e,
                })
              }
              otherStyles="mt-5"
              placeholder="Password"
            />
          </KeyboardAvoidingView>
          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7 "
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href={"/sign-in"}
              className="text-lg font-psemibold text-secondary"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
