import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

const Page = () => {
  const [name, setName] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [icon, setIcon] = React.useState('');
  const router = useRouter();
  const startGroup = useMutation(api.group.create);

  const onCreateGroup = async () => {
    await startGroup({
      name,
      description: desc,
      icon_url: icon,
    });
    router.back();
  };
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#F6F4EB', padding: 10 }}>
      <Text style={{ marginVertical: 10 }}>Name</Text>
      <TextInput
        style={{
          backgroundColor: '#fff',
          borderWidth: 0.5,
          borderRadius: 10,
          borderColor: 'black',
          minHeight: 40,
          paddingHorizontal: 10,
        }}
        value={name}
        onChangeText={setName}
      />
      <Text style={{ marginVertical: 10 }}>Description</Text>
      <TextInput
        style={{
          backgroundColor: '#fff',
          borderWidth: 0.5,
          borderRadius: 10,
          borderColor: 'black',
          minHeight: 40,
          paddingHorizontal: 10,
        }}
        value={desc}
        onChangeText={setDesc}
      />
      <Text style={{ marginVertical: 10 }}>Icon_url</Text>
      <TextInput
        style={{
          backgroundColor: '#fff',
          borderWidth: 0.5,
          borderRadius: 10,
          borderColor: 'black',
          minHeight: 40,
          paddingHorizontal: 10,
        }}
        value={icon}
        onChangeText={setIcon}
      />

      <TouchableOpacity
        style={{ backgroundColor: '#4682A9', marginTop: 10, borderRadius: 10 }}
        onPress={onCreateGroup}>
        <Text
          style={{
            color: 'white',
            padding: 10,
            fontSize: 16,
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          Create
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default Page;

const styles = StyleSheet.create({});
