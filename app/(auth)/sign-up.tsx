import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { createUser } from '@/lib/appwrite'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import { Text, View } from 'react-native'
import Toast from 'react-native-toast-message'

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  })

  const submit = async (): Promise<void> => {
    const { name, email, password } = form
    if (!name || !email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Please enter valid name, email address & password'
      })
      return
    }

    setIsSubmitting(true)

    try {
      await createUser({
        name,
        email,
        password
      })

      Toast.show({
        type: 'success',
        text1: 'User signed up successfully'
      })

      router.replace('/')
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.message
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">
      <CustomInput
        placeholder="John Doe"
        label="Full name"
        value={form.name}
        onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
      />
      <CustomInput
        placeholder="john@example.com"
        keyboardType="email-address"
        label="Email"
        value={form.email}
        onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
      />
      <CustomInput
        placeholder="your password"
        label="Password"
        secureTextEntry={true}
        value={form.password}
        onChangeText={(text) =>
          setForm((prev) => ({ ...prev, password: text }))
        }
      />
      <CustomButton
        title="Sign Up"
        isLoading={isSubmitting}
        onPress={submit}
      />

      <View className="flex justify-center flex-row gap-2 mt-3">
        <Text className="base-regular text-gray-100">
          {'Already have an account?'}
        </Text>
        <Link
          href="/sign-in"
          className="base-bold text-primary"
        >
          Sign in
        </Link>
      </View>
    </View>
  )
}

export default SignUp
