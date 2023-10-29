import { View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAction, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Link, usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dialog from 'react-native-dialog';
import { action } from '@/convex/_generated/server';
// import { api } from '@/convex/_generated/api';

const index = () => {
  const groups = useQuery(api.group.get) || [];
  const [name, setName] = useState('');
  const [visible, setVisible] = useState(false);
  const [greeting, setGreating] = useState('');
  const peformGreeting = useAction(api.greeting.getGreeting);
  useEffect(() => {
    const loadUser = async () => {
      // AsyncStorage.clear();
      const user = await AsyncStorage.getItem('user');
      if (!user) {
        setTimeout(() => {
          setVisible(true);
        }, 100);
      } else {
        setName(user);
      }
    };
    loadUser();
  }, []);
  useEffect(() => {
    if (!name) return;
    const loadGreeting = async () => {
      const greeting = await peformGreeting({ name });
      setGreating(greeting);
    };
    loadGreeting();
  }, [name]);
  const setUser = async () => {
    let rand = (Math.random() + 1).toString(36).substring(7);
    if (name !== '') {
      const userName = `${name}`;
      await AsyncStorage.setItem('user', userName);
      setVisible(false);
    }
    const userName = `${rand}`;
    await AsyncStorage.setItem('user', userName);
    setVisible(false);
  };
  return (
    <>
      <ScrollView style={{ flex: 1, padding: 10, backgroundColor: '#F6F4EB' }}>
        {groups.map((group) => (
          <Link
            key={group._id}
            href={{ pathname: '/(chat)/[chatid]', params: { chatid: group._id } }}
            asChild>
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: 'row',
                gap: 5,
                alignItems: 'center',
                backgroundColor: '#fff',
                padding: 16,
                borderRadius: 10,
                marginBottom: 10,
              }}>
              <Image
                source={{ uri: group.icon_url }}
                style={{ width: 50, height: 50 }}
              />
              <View style={{ flex: 1 }}>
                <Text>{group.name}</Text>
                <Text style={{ color: 'gray', opacity: 0.5 }}>{group.description}</Text>
              </View>
            </TouchableOpacity>
          </Link>
        ))}
      </ScrollView>
      <Text style={{ textAlign: 'center', margin: 10 }}>{greeting}</Text>
      <Dialog.Container visible={visible}>
        <Dialog.Title>Username Required</Dialog.Title>
        <Dialog.Description>Please Insert name To Start Chating</Dialog.Description>
        <Dialog.Input onChangeText={setName}></Dialog.Input>
        <Dialog.Button
          onPress={setUser}
          label="Set Name"
        />
      </Dialog.Container>
    </>
  );
};

export default index;
